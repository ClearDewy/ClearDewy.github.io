---
title: 缩放点积注意力如何完成一次读取
date: 2026-09-04
updated: 2026-09-05
type: lesson
status: learnable
track: ai
chapter: transformers
prerequisites:
  - /ai/transformers/qkv-retrieval
outcomes:
  - 能手算 QK 转置、缩放、因果遮罩、softmax 和 weighted V
  - 能说明分数矩阵两个 token 轴和 softmax 轴的语义
  - 能解释 mask 与 scale 为什么在 softmax 前作用
  - 能用反事实修改判断哪一步影响权重、哪一步只影响输出内容
estimated: 50 分钟
categories: [智能算法]
tags: [Scaled Dot-Product Attention, Causal Mask, Softmax]
description: 用两个 token 的固定数值逐步走完缩放点积注意力，并验证每个中间矩阵的来源与不变量。
---

# 缩放点积注意力如何完成一次读取

上一课已经回答“X 怎样生成 Q、K、V，以及谁负责匹配、谁负责内容”。现在保持同一组输入不变，第一次完整走通一个注意力头：

$$
O=\operatorname{softmax}\left(\frac{QK^\top}{\sqrt D}+M\right)V
$$

本页不允许跳到最终结果。每一步都要回答：输入是什么、改变了什么、保持了什么、怎样验证。

## 固定输入与目标

单个样本、单头、两个 token、每头维度 `D=2`：

$$
Q=K=\begin{bmatrix}1&0\\0&1\end{bmatrix},
\qquad
V=\begin{bmatrix}2&0\\0&4\end{bmatrix}
$$

目标是为每个 query 生成一个二维输出。由于使用 causal mask：

- query 1 只能读取 key/value 1；
- query 2 可以读取 key/value 1 和 2。

## 分步动画

<ClientOnly>
  <QkvRetrievalDemo />
</ClientOnly>

动画始终使用同一组输入，也保留上一课的三组投影作为起点。建议先点“下一步”逐项验证，再直接修改 `X、WQ、WK、WV`，比较分数、权重和输出分别怎样变化。

## 第一步：QK 转置产生匹配分数

先转置 K：

$$
K^\top=\begin{bmatrix}1&0\\0&1\end{bmatrix}
$$

执行矩阵乘法：

$$
S=QK^\top
=\begin{bmatrix}
1\times1+0\times0 & 1\times0+0\times1\\
0\times1+1\times0 & 0\times0+1\times1
\end{bmatrix}
=\begin{bmatrix}1&0\\0&1\end{bmatrix}
$$

分数矩阵必须按下面方式阅读：

| | key 1 | key 2 |
| --- | ---: | ---: |
| query 1 | `q1·k1=1` | `q1·k2=0` |
| query 2 | `q2·k1=0` | `q2·k2=1` |

行固定一个 query，列遍历所有 key。不要把右下角的 1 解释成“token 2 的第二个特征”，它表示 query 2 与 key 2 的整体点积。

shape 同时验证：

$$[T_q,D]@[D,T_k]\rightarrow[T_q,T_k]$$

## 第二步：除以根号 D 控制分数尺度

缩放后：

$$
\frac{S}{\sqrt2}
\approx\begin{bmatrix}0.707&0\\0&0.707\end{bmatrix}
$$

为什么不是随便除一个常数？若 Q、K 每个维度近似独立、均值为 0、方差相近，D 个乘积相加会让点积方差随 D 增长。除以 `√D` 将其拉回更稳定的数量级，避免仅因维度增大就让 softmax 过早接近 one-hot、梯度变小。

缩放：

- 改变分数数值；
- 不改变 `[Tq,Tk]` shape；
- 不作用于 V；
- 不保证所有训练过程都绝对稳定。

## 第三步：causal mask 编码访问边界

自回归训练时整段 token 可以并行输入，但位置 `i` 不能读取未来位置 `j>i`。两个 token 的加性 mask 为：

$$
M=\begin{bmatrix}0&-\infty\\0&0\end{bmatrix}
$$

加到缩放分数：

$$
S_{masked}
=\begin{bmatrix}0.707&-\infty\\0&0.707\end{bmatrix}
$$

mask 必须在 softmax 前生效。因为：

$$e^{-\infty}=0$$

非法位置进入 softmax 后权重严格为 0，合法位置会在剩余集合中重新归一化。若先 softmax 再把未来权重乘 0，剩余权重通常不再和为 1；若忘记 mask，训练位置可能偷看目标后面的信息。

实际实现常用 dtype 可表示的极小有限值代替负无穷。无论表示方式如何，都要检查全遮罩行、低精度溢出和广播轴。

## 第四步：softmax 沿 Key 轴归一化

对每一行单独计算：

$$
p_{ij}=\frac{e^{s_{ij}}}{\sum_{j'}e^{s_{ij'}}}
$$

第一行：

$$softmax([0.707,-\infty])=[1,0]$$

第二行：

$$
softmax([0,0.707])
\approx[0.3302,0.6698]
$$

因此权重矩阵：

$$
P\approx\begin{bmatrix}1&0\\0.3302&0.6698\end{bmatrix}
$$

必须验证的不变量：

- 每个非全遮罩行的元素非负；
- 每行沿 `Tk` 求和约等于 1；
- 所有未来位置 `j>i` 的权重为 0；
- shape 仍为 `[Tq,Tk]`。

稳定实现会先对每行减去最大合法分数再 `exp`。减去同一个常数不改变 softmax，却能减少指数溢出。

## 第五步：权重乘 V 才真正取回信息

$$
O=PV
$$

第一行：

$$o_1=1[2,0]+0[0,4]=[2,0]$$

第二行：

$$
o_2
=0.3302[2,0]+0.6698[0,4]
\approx[0.6605,2.6790]
$$

最终：

$$
O\approx\begin{bmatrix}2&0\\0.6605&2.6790\end{bmatrix}
$$

shape：

$$[T_q,T_k]@[T_k,D]\rightarrow[T_q,D]$$

`Tk` 被加权求和消去，输出保留 query 轴。每个 query 得到一个新的 D 维表示。

## 一张表看清每一步职责

| 步骤 | 输入 | 输出 | 改变什么 | 不改变什么 |
| --- | --- | --- | --- | --- |
| 点积 | Q、K | scores | 产生两两匹配值 | 不读取 V |
| scale | scores、D | scaled scores | 数值尺度 | 行列语义与 shape |
| mask | scores、访问规则 | masked scores | 合法候选集合 | V 内容 |
| softmax | masked scores | weights | 变成读取比例 | `[Tq,Tk]` shape |
| weighted V | weights、V | output | 汇总内容 | query 数量 |

## 三个反事实实验

### 去掉 causal mask

第一行不再是 `[0.707,-∞]`，而是 `[0.707,0]`：

$$weights_1\approx[0.6698,0.3302]$$

输出变为：

$$o_1\approx[1.3395,1.3209]$$

第一个位置已经混入未来位置 2 的 Value。这正是未来信息泄漏。

### 只交换两行 Value

Q、K、scores 和 weights 全部不变；输出改变。这个实验再次验证 Key 决定匹配，Value 决定内容。

### 错沿 Query 轴 softmax

每一列而不是每一行和为 1，语义变成“多个 query 对一个 key 竞争”，不再是“每个 query 在所有 key 中分配读取比例”。shape 仍然正确，所以必须检查轴语义和行和断言。

## 训练与推理中的 mask

训练时可一次处理完整目标序列，通过上三角 mask 阻止未来读取。自回归推理时未来 token 尚不存在，但仍需正确处理 padding、KV cache 长度和当前位置边界。

如果训练 loss 异常低而逐 token 生成崩溃，优先检查：

1. label 是否正确右移；
2. causal mask 方向和对角线是否正确；
3. mask 是否广播到 `[B,H,Tq,Tk]` 的目标轴；
4. 训练看到的信息是否严格不多于逐步推理。

## 常见误解与边界

- mask 约束访问权限，不是告诉模型某个 token “不重要”。
- scale 控制 logits 尺度，不是把 Value 变小。
- softmax 每行独立，注意力不是对整个矩阵一次归一化。
- attention 权重描述前向加权路径，不自动构成因果或人类可解释证据。
- 即使权重行和、shape、mask 都正确，QKV 投影、位置编码或训练目标仍可能有错误。
- 普通注意力显式 scores 随 `Tq×Tk` 增长；优化 kernel 可以降低中间存储，但不改变数学结果。

## 本节自测

<ClientOnly>
  <KnowledgeQuiz
    title="完整注意力流水线自测"
    storage-key="ai-transformers-attention-pipeline"
    :questions="[
      {
        id: 'pipeline-score',
        type: 'single',
        prompt: '本页 Q=K=单位矩阵时，QK 转置等于什么？',
        options: ['[[1,0],[0,1]]', '[[1,1],[0,1]]', '[[0,1],[1,0]]', '[[2,0],[0,2]]'],
        answer: '[[1,0],[0,1]]',
        explanation: '相同基向量点积为 1，两个正交基向量点积为 0。',
        remediation: '/ai/transformers/attention-pipeline#第一步qk-转置产生匹配分数'
      },
      {
        id: 'pipeline-mask-order',
        type: 'boolean',
        prompt: '可以先做 softmax，再把未来位置权重乘 0，并且无需重新归一化。',
        answer: false,
        explanation: '后乘 0 会破坏合法权重行和为 1；mask 应在 softmax 前排除非法位置。',
        remediation: '/ai/transformers/attention-pipeline#第三步causal-mask-编码访问边界'
      },
      {
        id: 'pipeline-axis',
        type: 'open',
        prompt: '说明为什么 scores 的 softmax 要沿 Tk 轴，并给出一个可执行的不变量。',
        rubric: [
          '指出每一行固定一个 query',
          '指出该 query 要在全部合法 key 中分配读取比例',
          '给出每个非全遮罩行权重和约等于 1 的断言'
        ],
        reference: '固定 B、H、Tq 后沿 Tk 归一化，使每个 query 对合法 key 的权重和为 1。'
      }
    ]"
  />
</ClientOnly>

<details>
<summary>静态答案与检查点</summary>

1. `[[1,0],[0,1]]`。
2. 错误；mask 应在 softmax 前应用。
3. 每行固定 query、列遍历 key；断言 `sum(weights[row])≈1`。

</details>

## 小结与下一步

完整路径是：

```text
QKᵀ 产生匹配分数
→ ÷√D 稳定尺度
→ +mask 排除非法读取
→ softmax(Tk) 形成每行读取比例
→ @V 汇总真正内容
```

下一步在[从零实现单头因果注意力](/ai/transformers/attention-lab)中亲手写出每一步，并用断言抓住 mask、轴和数值稳定性错误。
