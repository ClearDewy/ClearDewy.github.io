---
title: 3. 序列、注意力与 Transformer
date: 2026-09-04
updated: 2026-09-05
type: overview
status: learnable
track: ai
categories: [智能算法]
tags: [Attention, Transformer, Sequence]
description: 从两个 token 的软检索开始，逐步建立 QKV、缩放点积注意力、多头 shape 和 Transformer Block 的完整心智模型。
---

# 3. 序列、注意力与 Transformer

本章只围绕一个核心问题展开：**序列中的每个位置，怎样根据当前需要，从允许访问的其他位置读取信息？**

Transformer 的回答不是“把所有 token 平均一下”，而是为每个当前位置生成 Query，与所有候选 Key 计算匹配程度，再按权重汇总对应的 Value。训练会调整这些投影，使检索方式对任务有用。

本章使用一个贯穿主线的教学序列“红色 苹果”：第一行表示“红色”，第二行表示“苹果”。目标不是训练语言模型，而是观察第二个位置怎样在保留自身信息的同时读取第一个位置携带的颜色信息。

## 本章在整条学习链中的位置

上一章的 MLP 对每个输入独立变换，却没有解决 token 之间怎样通信。本章先解释文本怎样成为矩阵中的行，再建立单头通信闭环，最后扩展到多头和完整 Block：

```text
文本 → token id → embedding，并让位置机制参与表示 → token 表示 X
→ Q/K/V 投影
→ token 两两打分
→ scale + mask + softmax
→ 加权汇总 V
→ 单头代码与反事实验证
→ 多头合并与输出投影
→ residual + normalization
→ 逐 token FFN
→ 下一层表示
```

attention 负责**跨位置通信**；FFN 负责**每个位置内部的非线性变换**。residual 和 normalization 让深层堆叠更可训练，位置编码让顺序进入计算。

## 前置知识

开始前应能完成：

- 用“一行乘一列”解释[矩阵乘法](/ai/foundations/matrix-multiplication)；
- 区分 shape 中各轴，并理解 reshape 与 transpose 的差异；
- 说明[MLP](/ai/deep-learning/mlp-representation)的线性投影和隐藏表示；
- 知道 softmax 把一组分数归一化为和为 1 的非负权重。

若这些概念仍模糊，注意力公式很容易退化为符号记忆。

## 文本怎样成为矩阵 X

教学中把入口压缩为：

```text
“红色 苹果”
→ 两个教学 token
→ 各自的 token id
→ 查 embedding 表，并让位置机制参与表示
→ X ∈ ℝ²ˣ²
```

因此 `X` 的每一行对应一个 token 位置，每一列对应一个特征。真实 tokenizer 可能把文本切成不同片段，真实 embedding 也远不止二维；这里的 `X=I` 是人为构造的可手算坐标，不是声称模型会自然生成单位矩阵。Tokenizer 训练和具体位置编码实现不在本章展开。

## 全章统一的最小例子

核心课程统一使用单个样本、两个 token、每头维度 `D=2`：

$$
Q=K=\begin{bmatrix}1&0\\0&1\end{bmatrix},
\qquad
V=\begin{bmatrix}2&0\\0&4\end{bmatrix}
$$

这组数字满足：

- 两个 Q/K 向量互相正交，点积为 0；
- 每个位置与自身的点积为 1；
- 两个 Value 明显不同，便于观察“匹配权重”和“取回内容”的区别；
- 加上 causal mask 后，第一个 token 只能读取自己，第二个 token 可以读取两个位置。

上述两行分别沿用“红色”和“苹果”两个教学位置。多头 shape 课程在单头闭环完成之后，再单独使用 `B=2,T=4,C=8,H=2,D=4` 研究轴变化，不与数值推导混在一起。

## 阅读过程中会依次得到的对象

这张表只用于定位名称，不要求在第一遍进入课程前背诵。对象会在 QKV、完整流水线和 Block 课程中按计算顺序出现。

| 对象 | 回答的问题 | 是否由训练直接更新 |
| --- | --- | --- |
| 输入 `X` | 每个 token 当前表示是什么 | 否，由上一层或 embedding 产生 |
| `WQ/WK/WV` | 怎样生成检索角色 | 是 |
| Query `Q` | 当前 token 想找什么 | 否，是激活 |
| Key `K` | 候选 token 怎样接受匹配 | 否，是激活 |
| Value `V` | 候选被选中后提供什么 | 否，是激活 |
| scores | 每个 query 与每个 key 多匹配 | 否，是中间值 |
| weights | 每个 query 向合法 key 分配多少读取比例 | 否，是 softmax 结果 |
| output `O` | 每个 query 最终取回了什么 | 否，是新的 token 表示 |

Q、K、V 和注意力权重都是当前输入经过当前参数产生的激活，不是模型永久保存的知识表。真正由优化器更新的是投影权重等参数。

## 推荐学习顺序

| 顺序 | 类型 | 页面 | 预计 | 完成证据 |
| ---: | --- | --- | ---: | --- |
| 1 | lesson | [QKV 是一次可学习检索](/ai/transformers/qkv-retrieval) | 35 分钟 | 能从 X 产生 Q/K/V，并区分匹配依据与取回内容 |
| 2 | lesson | [完整注意力流水线](/ai/transformers/attention-pipeline) | 50 分钟 | 用同一组输入手算 scale、mask、softmax 与 weighted V |
| 3 | lab | [从零实现单头因果注意力](/ai/transformers/attention-lab) | 50 分钟 | 运行实现并通过 shape、mask、归一化断言 |
| 4 | lesson | [多头注意力的 shape](/ai/transformers/multi-head-shapes) | 45 分钟 | 从 `[B,T,C]` 推导到 `[B,H,T,T]` 再返回 |
| 5 | lesson | [一个 Decoder Block 如何更新 token 表示](/ai/transformers/decoder-block) | 45 分钟 | 能区分跨 token attention 与逐 token FFN |
| 6 | reference | [注意力符号与 shape 速查](/ai/transformers/reference) | 查询用 | 能快速确认轴语义、广播和复杂度 |
| 7 | review | [第 3 章复习与验收](/ai/transformers/review) | 35 分钟 | 完整推导并诊断一次未来信息泄漏 |

学习时先完成前三步，确认自己能解释单头中的每一个轴和数字，再增加 head 轴。MQA、GQA、KV Cache 属于查询和工程扩展，不进入本章零基础过关主线。

## Attention 放回 Transformer Block

以常见的 pre-norm Decoder Block 为例；完整分步解释见[Decoder Block 课程](/ai/transformers/decoder-block)：

```text
x
├─ residual ───────────────────────────────┐
└─ norm → causal self-attention → dropout ─┴→ x₁
   x₁
   ├─ residual ────────────────────────────┐
   └─ norm → FFN / MLP → dropout ─────────┴→ x₂
```

- causal self-attention 只允许读取当前位置及过去位置；
- residual 保留原信息并提供短路径；
- normalization 调整进入子层的特征尺度；
- FFN 对每个 token 独立使用相同参数；
- 多层 Block 重复“通信 + 逐位置变换”，逐步形成上下文化表示。

Encoder、Decoder 和不同模型实现会调整 mask、norm 位置、激活函数、位置编码与 FFN 结构，但注意力的核心计算不变。

## 本章不覆盖什么

本章建立注意力的最小正确模型，不展开：

- 大规模预训练目标、数据清洗和分布式训练；
- FlashAttention 等具体 kernel 的实现细节；
- RoPE、ALiBi 等位置编码的完整推导；
- beam search、采样策略和服务调度；
- 具体模型版本的全部工程差异。

这些主题只有在 QKV、mask 和 shape 的基础不再混淆后才值得展开。

## 过关标准

不查资料应能完成：

1. 把一个教学 token 对应到 `X` 的一行，并说明 Query、Key、Value 的职责；
2. 手算两 token 的单头注意力，解释 scores 的行列、mask 时机和 Softmax 轴；
3. 用断言验证未来权重为 0、合法权重行和为 1、输出保留 query 轴；
4. 从 `[B,T,C]` 推导多头的投影、拆头、打分、汇总和合并 shape；
5. 区分 Block 中的跨 token attention 与逐 token FFN；
6. 区分数学闭环正确、实现通过固定样例和真实模型能力有效三件事。

完成[复习与验收](/ai/transformers/review)后，再进入[基础模型与生成模型](/ai/foundation-models)。
