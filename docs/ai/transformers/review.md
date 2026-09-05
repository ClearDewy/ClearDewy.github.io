---
title: 第 3 章复习与验收
date: 2026-09-04
updated: 2026-09-05
type: review
status: learnable
track: ai
chapter: transformers
prerequisites:
  - /ai/transformers/qkv-retrieval
  - /ai/transformers/attention-pipeline
  - /ai/transformers/attention-lab
  - /ai/transformers/multi-head-shapes
  - /ai/transformers/decoder-block
outcomes:
  - 能完整解释并推导一次多头因果注意力
  - 能诊断 mask、softmax 轴、transpose 和 residual 对齐错误
  - 能区分数学不变量、实现验证和模型能力结论
estimated: 35 分钟
categories: [智能算法]
tags: [Attention, Review, Debugging]
description: 通过角色解释、shape 推导、数值计算、实现断言和故障诊断验收 Transformer 注意力基础。
---

# 第 3 章复习与验收

## 覆盖范围与完成方式

本页验收文本表示到 X、QKV、缩放点积注意力、causal mask、单头实现、多头 shape 和 Decoder Block。暂不考查 MQA、GQA、KV Cache、RoPE、FlashAttention、大模型训练或采样策略。

建议：

1. 不查资料完成交互题和推导任务；
2. 对照答案标记具体薄弱点；
3. 回到对应 lesson 补学，而不是只背答案；
4. 重新运行实验并保存断言结果；
5. 1 天后重画一次完整数据流，7 天后再做数值题。

## 交互自测

<ClientOnly>
  <KnowledgeQuiz
    storage-key="ai-transformers-review-v2"
    title="第 3 章交互自测"
    :questions="[
      {
        id: 'tr-mask-order',
        type: 'boolean',
        prompt: 'causal mask 可以在 softmax 之后把未来权重乘 0，且无需重新归一化。',
        answer: false,
        explanation: 'mask 应在 softmax 前排除非法位置，使未来权重为 0 且合法权重重新归一化。',
        remediation: '/ai/transformers/attention-pipeline#第三步causal-mask-编码访问边界'
      },
      {
        id: 'tr-softmax-axis',
        type: 'single',
        prompt: 'scores [B,H,Tq,Tk] 的 softmax 通常沿哪个轴？',
        options: ['B', 'H', 'Tq', 'Tk'],
        answer: 'Tk',
        explanation: '每个 query 要在全部合法 key 中分配和为 1 的读取比例。',
        remediation: '/ai/transformers/attention-pipeline#第四步softmax-沿-key-轴归一化'
      },
      {
        id: 'tr-head-dimension',
        type: 'fill',
        prompt: '输入 C=12、Query 头数 H=3，等宽拆头时每头维度 D 是多少？',
        answer: ['4', 'D=4', 'd=4'],
        explanation: 'C=H×D，所以 D=12÷3=4。',
        remediation: '/ai/transformers/multi-head-shapes#第二步reshape-把一个轴解释成两个轴'
      },
      {
        id: 'tr-score-shape',
        type: 'single',
        prompt: 'Q 为 [2,3,6,4]、K 为 [2,3,5,4] 时，QK 转置的 shape 是什么？',
        options: ['[2,3,6,5]', '[2,3,5,6]', '[2,6,5,4]', '[2,3,4,4]'],
        answer: '[2,3,6,5]',
        explanation: 'D 被乘加消去，保留 Tq=6 和 Tk=5。',
        remediation: '/ai/transformers/multi-head-shapes#第四步产生-token-两两分数'
      },
      {
        id: 'tr-value-change',
        type: 'boolean',
        prompt: 'Q 和 K 不变、只交换两行 V 时，attention 分数和权重保持不变。',
        answer: true,
        explanation: '分数和权重由 Q、K、scale、mask 决定；V 只影响最终加权输出。',
        remediation: '/ai/transformers/qkv-retrieval#为什么不能省略-value'
      },
      {
        id: 'tr-leak-debug',
        type: 'open',
        prompt: '训练 loss 异常低，但逐 token 推理崩溃。说明你会如何验证是否存在未来信息泄漏。',
        rubric: [
          '检查 label shift 与输入目标的时间关系',
          '检查 causal mask 的方向、对角线和广播轴',
          '用两三个 token 的固定输入打印 softmax 前分数和权重',
          '断言所有 j 大于 i 的权重为 0',
          '比较训练位置可见信息与逐步推理可见信息'
        ],
        reference: '先固定极小序列，对齐输入和标签，再检查每个 query 行的 mask 与权重；未来列必须为 0，训练时可见上下文不能超过逐步推理。',
        remediation: '/ai/transformers/attention-lab'
      }
    ]"
  />
</ClientOnly>

## 任务一：不查资料口答

每题要求说明因果关系，不能只给术语。

1. 为什么 Query、Key、Value 使用不同投影？
2. 投影、reshape、transpose 分别改变什么？
3. scores 的两个 token 轴分别代表什么？
4. 为什么除以 `√D`？它改变 shape 吗？
5. causal mask 为什么必须在 softmax 前作用？
6. weighted V 后为什么保留 Tq、消去 Tk？
7. attention 与 FFN 在 Transformer Block 中分别负责什么？
8. 为什么必须先完成单头注意力，再把表示拆成多个头？

<details>
<summary>口答检查点</summary>

- Q/K 决定匹配，V 提供内容，不同投影允许任务学习角色分工。
- 投影改变数值；reshape 重新解释轴；transpose 改变轴顺序。
- scores 行是 query，列是 key。
- `√D` 控制点积随维度增长的尺度，不改变 shape。
- mask 在 softmax 前排除非法位置并让合法权重重新归一化。
- 每个 query 对 Tk 个 Value 加权求和，因此 Tk 被消去，Tq 保留。
- attention 跨 token 通信；FFN 对每个 token 独立做非线性变换。
- 多头复用单头的匹配与读取闭环，只增加独立投影空间、head 轴和合并步骤；若单头尚未理解，多出的轴只会掩盖错误。

</details>

## 任务二：完整 shape 推导

给定：

```text
B=2, Tq=6, Tk=5, C=12, H=3, D=4
```

写出：

1. 输入经过 Q 投影后的 packed shape；
2. reshape 与 transpose 后的 Q；
3. K 转置最后两轴后的 shape；
4. scores 与 weights；
5. weighted V；
6. 合并多个头后的输出；
7. scores 元素总数。

<details>
<summary>Shape 答案</summary>

```text
Q packed       [2,6,12]
Q reshape      [2,6,3,4]
Q transposed   [2,3,6,4]
K transposed   [2,3,4,5]
scores/weights [2,3,6,5]
weighted V     [2,3,6,4]
merge heads    [2,6,12]
scores elements=2×3×6×5=180
```

</details>

## 任务三：两 token 数值推导

使用本章固定输入：

$$
Q=K=\begin{bmatrix}1&0\\0&1\end{bmatrix},
\quad V=\begin{bmatrix}2&0\\0&4\end{bmatrix},
\quad D=2
$$

要求：

- 算出 `QKᵀ`、缩放分数和 causal mask 后分数；
- 算出 weights 与 output；
- 去掉 mask 后，重新计算第一行 weights 与 output；
- 说明这个反事实证明了什么。

<details>
<summary>数值答案</summary>

```text
QKᵀ    = [[1,0],[0,1]]
scaled = [[0.7071,0],[0,0.7071]]
masked = [[0.7071,-∞],[0,0.7071]]
weights≈ [[1,0],[0.3302,0.6698]]
output ≈ [[2,0],[0.6605,2.6790]]

无 mask 第一行：
weights[0]≈[0.6698,0.3302]
output[0] ≈[1.3395,1.3209]
```

去掉 mask 后，第一个 query 混入未来位置的 Value，证明因果访问约束被破坏。

</details>

## 任务四：故障诊断

| 现象 | 至少检查三项 |
| --- | --- |
| matmul shape 报错 | Q/K 最后一维；K 是否转置；Tq/Tk 是否混淆；head 轴位置 |
| 权重行和不为 1 | softmax 轴；mask 时机；全遮罩行；数值溢出 |
| loss 极低但逐步生成失败 | label shift；future mask；训练与推理可见上下文 |
| residual 相加失败 | 子层是否投回 C；batch/token 轴是否保留；是否误用拼接 |
| 输出 shape 对但语义异常 | 轴顺序；Value 汇总方向；输出投影；residual 对齐 |

诊断回答必须包含一个最小固定输入、一个要打印的中间量和一个断言，不能只写“检查代码”。

## 任务五：实现验收

完成[单头因果注意力实验](/ai/transformers/attention-lab)，并保留以下证据：

- 基线 weights 和 output；
- 未来权重为 0 的断言；
- 每行权重和为 1 的断言；
- 去掉 mask 后第一行输出改变；
- 大 logits 下稳定 softmax 不溢出。

## 评分与补学

| 部分 | 分值 | 合格要求 |
| --- | ---: | --- |
| 交互客观题 | 3 | 至少 4/5 正确后完成补学 |
| 开放诊断题 | 2 | 覆盖 rubric 中至少 4 项 |
| 口答 | 2 | 8 题至少 6 题完整 |
| shape 与数值推导 | 2 | 结果和轴语义都正确 |
| 实现实验 | 1 | 基线和消融证据齐全 |

总分 8 分以上且实验通过，视为本章合格。

- QKV 角色混淆：[回看 QKV 检索](/ai/transformers/qkv-retrieval)
- shape 或轴错误：[回看多头 shape](/ai/transformers/multi-head-shapes)
- 数值、mask 或 softmax 错误：[回看完整流水线](/ai/transformers/attention-pipeline)
- 实现断言不足：[回看单头实验](/ai/transformers/attention-lab)
- 需要快速查约束：[使用注意力速查](/ai/transformers/reference)

完成后进入[基础模型与生成模型](/ai/foundation-models)。需要分析现代模型的共享 K/V 与推理资源时，再使用[注意力速查](/ai/transformers/reference)中的 MQA、GQA 和 KV Cache 部分。
