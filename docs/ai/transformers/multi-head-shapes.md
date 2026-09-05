---
title: 多头注意力如何组织 shape
date: 2026-09-04
updated: 2026-09-05
type: lesson
status: learnable
track: ai
chapter: transformers
prerequisites:
  - /ai/transformers/attention-lab
outcomes:
  - 能从输入推导 QKV 投影、拆头、打分、汇总与合并的全部 shape
  - 能解释投影、reshape 和 transpose 分别改变什么
  - 能计算 scores 元素数并定位错误的 softmax 与转置轴
  - 能解释多个头怎样独立读取并重新合并为模型维度
estimated: 45 分钟
categories: [智能算法]
tags: [Multi-Head Attention, Tensor Shape]
description: 用 B=2、T=4、C=8、H=2 的固定例子追踪多头注意力每一次投影、拆轴、转置和矩阵乘法。
---

# 多头注意力如何组织 shape

前面的课程已经完成并实现了一个注意力头。多头注意力没有更换核心公式，而是让多个头使用各自的投影空间并行读取，再把结果合并回模型隐藏维度。

最容易出现的误解是：“把原始输入最后一维切成几份，每份做一次 attention。”真实顺序是：**先用可学习投影创造 Q/K/V 子空间，再把投影结果组织成多个头。**

本页只研究 shape 和轴语义，不重新计算 softmax 数值。固定：

```text
B = 2   batch 中有 2 条序列
T = 4   每条序列有 4 个 token
C = 8   每个 token 的模型隐藏维
H = 2   query 头数
D = 4   每头维度，满足 C = H×D
```

## 起点：一个 token 只有一个 C 维表示

输入：

$$X\in\mathbb{R}^{B\times T\times C}=[2,4,8]$$

轴语义始终是：

| 轴 | 大小 | 一个索引固定后代表什么 |
| --- | ---: | --- |
| `B` | 2 | 选中一条独立序列 |
| `T` | 4 | 选中序列中的一个 token |
| `C` | 8 | 选中该 token 的一个隐藏特征 |

此时还没有“第几个头”这个轴。直接 reshape 虽然在元素数上可行，却没有先为 Q、K、V 学习不同变换。

## 第一步：投影改变数值

以 Query 为例：

$$
X[B,T,C]\;W_Q[C,H\!D]
\rightarrow Q_{packed}[B,T,H\!D]
$$

代入数字：

```text
[2,4,8] @ [8,8] → [2,4,8]
```

输入和输出 shape 恰好相同，不表示什么都没发生。每个输出元素是输入最后一维与 `WQ` 某一列的点积，数值已经改变。`WK、WV` 还会用各自参数产生 K、V。

投影矩阵的不同列随后被分到不同头，因此各头拥有不同的可学习 Query/Key/Value 子空间；但训练不保证它们形成可由人类命名的清晰分工。

## 第二步：reshape 把一个轴解释成两个轴

因为 `H×D=C=8`：

```text
Q [B,T,H×D] = [2,4,8]
reshape
Q [B,T,H,D] = [2,4,2,4]
```

reshape：

- 不执行乘法或加法；
- 不改变元素总数；
- 不自动改变底层元素顺序；
- 只把最后一个索引重新解释为 `(head, feature_in_head)`。

元素数检查：

$$2\times4\times8=64=2\times4\times2\times4$$

如果 `C` 不能被 `H` 整除，就无法用相同大小 `D=C/H` 直接拆头；实现应在配置或 reshape 前明确报错。

## 第三步：transpose 把 head 放进批次侧

矩阵库通常把最后两个轴作为矩阵运算轴，把前面的轴视作可广播的批次轴。需要对每个 `(batch,head)` 独立执行 `[T,D]@[D,T]`，所以转为：

```text
[B,T,H,D] → transpose(1,2) → [B,H,T,D]
[2,4,2,4]                  → [2,2,4,4]
```

transpose 改变索引轴顺序，不执行特征投影，也不改变元素数量。第一次学习只需追踪轴语义；具体张量库中的连续内存、stride 和 `view` 限制放到实现时再检查。

## 分步动画：每次只追踪一种变化

<ClientOnly>
  <AttentionShapeDemo />
</ClientOnly>

看动画时始终问三个问题：

1. 这一步是否改变数值？投影改变，reshape/transpose 不改变。
2. 这一步是否改变元素数量？上述三步都不改变 Q 的总元素数。
3. 最后两个轴当前代表什么？只有明确它们，才能判断矩阵乘法是否合法。

## 第四步：产生 token 两两分数

Q、K 均整理为 `[B,H,T,D]`：

```text
Q                 [2,2,4,4]
K.transpose(-2,-1)[2,2,4,4]
Q @ Kᵀ            [2,2,4,4]
                   B H Tq Tk
```

这个固定例子中 `T=D=4`，数值碰巧相同，容易掩盖错误。用符号写更安全：

$$
[B,H,T_q,D]@[B,H,D,T_k]
\rightarrow[B,H,T_q,T_k]
$$

`D` 是被乘加消去的维度；`Tq` 和 `Tk` 被保留，分别成为分数矩阵的行和列。cross-attention 中二者可以不同。

本例 scores 元素数：

$$B\times H\times T\times T=2\times2\times4\times4=64$$

当 self-attention 的序列长度扩大到 `T` 时，这部分按 `T²` 增长；这不是因为 QKV 投影，而是每个 query 要与每个 key 建立分数。

## 第五步：softmax 和 Value 汇总

缩放、mask 后沿最后的 `Tk` 轴 softmax：

```text
weights [B,H,Tq,Tk]
V       [B,H,Tk,D]
output  [B,H,Tq,D]
```

矩阵乘法消去 `Tk`，因此输出保留 query 位置而不保留 key 位置：

$$
[B,H,T_q,T_k]@[B,H,T_k,D]
\rightarrow[B,H,T_q,D]
$$

这是判断轴是否写反的一个强不变量：每个 query 读取全部 key/value 后，仍应产生一个自己的输出向量。

## 第六步：合并多个头

各头输出先把轴换回 token 优先：

```text
[B,H,T,D] → transpose(1,2) → [B,T,H,D]
```

再合并最后两个轴：

```text
[B,T,H,D] → reshape → [B,T,H×D] = [B,T,C]
```

最后通常还有输出投影：

$$O_{concat}[B,T,C]W_O[C,C]\rightarrow O[B,T,C]$$

`WO` 让不同头的信息再次混合。输出恢复 `[B,T,C]`，才能与 Block 输入做 residual 相加。

## 头数会不会改变参数量

若固定 `C=H×D`，且 Q/K/V 与输出投影都从 `C` 到 `C`，忽略偏置时：

$$
\underbrace{3C^2}_{W_Q,W_K,W_V}
+\underbrace{C^2}_{W_O}
=4C^2
$$

单纯把 `H` 从 2 改成 4、同时让 `D` 从 4 改成 2，并不会改变这四个投影矩阵的总参数量。它改变的是每头维度、注意力分解方式和中间张量组织。

## 进阶变体放在哪里

本页默认 Query、Key、Value 具有相同头数，也就是标准 MHA。MQA、GQA 会让多个 Query 头共享较少的 K/V 头，主要影响推理时的 KV Cache 与带宽；它们不改变“每个 Query 对 Key 打分，再加权读取 Value”的核心闭环。

第一次学习只需掌握标准多头的投影、拆头、计算和合并。需要分析现代模型推理资源时，再查阅[注意力公式、符号与 shape 速查](/ai/transformers/reference)。

## 常见错误与定位方法

- **直接切原始 X 当作多个头**：缺少独立 Q/K/V 投影，概念上不是标准多头注意力流程。
- **K 没有转置最后两轴**：应检查乘法是否为 `[Tq,D]@[D,Tk]`。
- **softmax 沿 Tq**：会让不同 query 互相竞争；正确目标是每个 query 在 key 之间分配权重。
- **把两个 T 当成同一语义**：前者是 query 行，后者是 key 列，cross-attention 时长度可不同。
- **只检查 shape 不检查轴语义**：`T=D=4` 时很多错误不会触发 shape 报错，应换不相等的测试维度。

## 本节自测

<ClientOnly>
  <KnowledgeQuiz
    title="多头 shape 自测"
    storage-key="ai-transformers-multi-head-shapes"
    :questions="[
      {
        id: 'mha-head-dimension',
        type: 'fill',
        prompt: '输入隐藏维 C=24、Query 头数 H=6，等宽拆头时每头维度 D 是多少？',
        answer: ['4', 'D=4', 'd=4'],
        explanation: 'D=C/H=24/6=4。',
        remediation: '/ai/transformers/multi-head-shapes#第二步reshape-把一个轴解释成两个轴'
      },
      {
        id: 'mha-score-shape',
        type: 'single',
        prompt: 'Q 为 [3,6,5,4]、K 为 [3,6,7,4] 时，QK 转置后的 shape 是什么？',
        options: ['[3,6,5,7]', '[3,6,7,5]', '[3,5,7,4]', '[3,6,4,4]'],
        answer: '[3,6,5,7]',
        explanation: 'D 被乘加消去，保留 Tq=5 和 Tk=7。',
        remediation: '/ai/transformers/multi-head-shapes#第四步产生-token-两两分数'
      },
      {
        id: 'mha-reshape-project',
        type: 'open',
        prompt: '解释为什么 reshape 能产生 head 轴，却不能替代 QKV 投影。',
        rubric: [
          '指出 reshape 只重新解释已有元素和轴，不执行乘加',
          '指出投影通过可学习权重改变数值并创造不同 QKV 子空间',
          '说明两步职责不同且顺序是先投影再拆头'
        ],
        reference: '投影决定每个头收到哪些可学习特征；reshape 只把投影后的 H×D 轴重组为 H 和 D。'
      }
    ]"
  />
</ClientOnly>

<details>
<summary>静态答案与检查点</summary>

1. `D=4`。
2. `[3,6,5,7]`。
3. 回答应区分“投影改变数值”和“reshape 只改变组织”。

</details>

## 小结与下一步

多头注意力的 shape 主线是：

```text
[B,T,C]
→ 投影 [B,T,H×D]
→ reshape [B,T,H,D]
→ transpose [B,H,T,D]
→ scores [B,H,Tq,Tk]
→ weighted V [B,H,Tq,D]
→ transpose + reshape [B,Tq,C]
```

下一步进入[Decoder Block](/ai/transformers/decoder-block)，观察多头注意力怎样与 Norm、Residual 和逐 token FFN 组合成可重复堆叠的一层。
