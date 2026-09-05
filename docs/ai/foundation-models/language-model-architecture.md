---
title: 完整 Decoder 语言模型怎样组装
date: 2026-09-05
updated: 2026-09-05
type: lesson
status: learnable
track: ai
chapter: foundation-models
prerequisites:
  - /ai/foundation-models/data-batches-and-causal-mask
  - /ai/transformers/decoder-block
outcomes:
  - 能从 input_ids 逐层说出 Decoder-only 语言模型的全部主要模块与 shape
  - 能区分参数、激活、logits 和标签
  - 能解释残差为何允许多层 Block 保持相同外部 shape
estimated: 45min
categories: [智能算法]
tags: [Decoder-only, Language Model, Architecture]
description: 把 Embedding、位置表示、多个 Decoder Block、最终归一化和词表头组装成完整自回归语言模型。
---

# 完整 Decoder 语言模型怎样组装

上一章已经拆开过一个 Decoder Block，本章前两课又准备好了 `input_ids [B,T]`。现在要回答：一个 Block 前后还需要什么，多个 Block 怎样连接，最终为什么会得到整个词表的 logits？

本页采用常见的 **Pre-Norm Decoder-only** 教学结构。不同模型可能使用 RoPE、RMSNorm、不同激活函数、并行残差或共享词表权重，但主干数据流一致。

## 先看完整路径

观察组件时先盯住 shape：进入 Block 前是 `[B,T,C]`，离开每一个 Block 后仍然是 `[B,T,C]`，只有词表头把最后一维改成 `V`。

<ClientOnly>
  <LanguageModelArchitectureDemo />
</ClientOnly>

## 固定符号

继续使用：

```text
<BOS> 我 喜欢 猫
```

并设：

| 符号 | 本例 | 含义 |
| --- | ---: | --- |
| `B` | 1 | batch 中的序列数 |
| `T` | 4 | 每条序列的位置数 |
| `C` | 4 | 每个位置的隐藏宽度，真实模型通常更大 |
| `L` | 2 | Decoder Block 层数 |
| `V` | 4 | 教学候选词表大小 |

`C=4` 和 `V=4` 只是为了便于画图；二者含义不同，数值相同不代表可以混用。

## 第一步：ID 通过 Embedding 查表

输入：

$$
\text{input\_ids}\in\mathbb{N}^{B\times T}
$$

词嵌入参数：

$$
E\in\mathbb{R}^{V\times C}
$$

每个整数 ID 选择 `E` 的一行：

$$
X_{b,t}=E[\text{input\_ids}_{b,t}]\in\mathbb{R}^{C}
$$

所以输出是 `X [B,T,C]`。这一步是查表，不是拿 token ID 本身参与乘法。Embedding 是会被反向传播更新的参数。

### 位置信息放在哪里

若只使用 token embedding，“我 喜欢 猫”和“猫 喜欢 我”包含相同 token，模型无法仅凭集合知道顺序。常见做法包括：

- 将可学习或固定的位置向量加到 token embedding；
- 在注意力的 Q/K 上应用旋转位置编码（RoPE）；
- 使用相对位置偏置。

第一遍只需记住：进入注意力前，表示必须携带顺序信息。具体位置编码是架构变体，不改变 `[B,T,C]` 主线。

## 第二步：一个 Block 做两次残差更新

Pre-Norm 形式可写为：

$$
U=X+\operatorname{CausalAttention}(\operatorname{Norm}(X))
$$

$$
Y=U+\operatorname{MLP}(\operatorname{Norm}(U))
$$

注意力负责跨位置读取，MLP 负责每个位置内部的通道变换。两条支路输出都必须回到 `C` 维，才能与残差主路相加。

因此：

```text
[B,T,C] → Decoder Block → [B,T,C]
```

shape 不变不代表数值不变。每层都在更新“每个位置现在知道什么”。

## 第三步：堆叠 L 个 Block

第 $ell$ 层输出是下一层输入：

$$
X^{(\ell+1)}=\operatorname{Block}_{\ell}(X^{(\ell)})
$$

每一层有自己的注意力和 MLP 参数。堆叠让表示经过多轮“读取上下文—重组特征”，而不是把序列长度变长。

常见误解是“第 12 层对应第 12 个 token”。错误：层数 `L` 是纵向计算深度，位置数 `T` 是横向序列长度，它们是两条不同的轴。

## 第四步：最终归一化与词表头

最后一个 Block 给出隐藏状态：

$$
H\in\mathbb{R}^{B\times T\times C}
$$

经过最终 Norm 后，用词表头：

$$
W_{vocab}\in\mathbb{R}^{C\times V}
$$

$$
Z=HW_{vocab}\in\mathbb{R}^{B\times T\times V}
$$

`Z[b,t,v]` 表示第 `b` 条序列的第 `t` 个位置，对候选 token `v` 的 logit。

有些模型令 `W_vocab = E^T`，称为输入/输出 embedding 权重共享。它减少参数，并让输入 token 空间与输出词表空间建立直接联系；也有实现不共享，不能从“都是词表”推断必然相等。

## 四类对象必须分清

| 对象 | 例子 | 是否训练更新 | 生命周期 |
| --- | --- | --- | --- |
| 参数 | `E`、QKV/O 投影、MLP 权重、Norm 参数、`W_vocab` | 是 | 跨 batch 保存 |
| 激活 | `X`、每层 `U/Y`、最终 `H` | 否，反向时用来求梯度 | 每次前向重新产生 |
| logits | `Z [B,T,V]` | 否，是输出激活 | 进入 loss 或采样 |
| 标签 | 右移后的 token ID | 否，来自数据 | 用于监督训练 |

优化器更新参数，不会把某一次激活保存成模型知识。上下文产生的激活也不是一次训练后的永久记忆。

## 一次手动 shape 追踪

本例 `B=1,T=4,C=4,V=4,L=2`：

```text
input_ids                   [1,4]
embedding lookup            [1,4,4]
block 1                     [1,4,4]
block 2                     [1,4,4]
final norm                  [1,4,4]
language-model head         [1,4,4]
```

最后 shape 看似仍是 `[1,4,4]`，只是因为教学例子碰巧 `C=V=4`。若真实词表 `V=32000`，最后一步是 `[1,4,C] → [1,4,32000]`。

## 反事实：增加层数会改变什么

在组件中把层数从 2 改为 4：

- 会增加两组独立 Block 参数；
- 会增加前向和反向计算；
- 会增加中间激活和训练显存；
- 不会改变输入的 `T`；
- 不会自动改变输出词表 `V`；
- 每层外部 shape 仍是 `[B,T,C]`。

## 常见错误与边界

- **把 token ID 当连续数值**：ID 42 不比 ID 41“语义更大”；必须先查 embedding。
- **残差两边 shape 不同**：MLP 或注意力没有投影回 `C`，无法相加。
- **忘记最终 Norm**：某些具体实现不同，但复现模型时必须按其配置，而不是凭习惯删改。
- **把所有位置 logits 都用于生成**：标准增量生成只从当前最后有效位置选择下一个 token。
- **认为堆更多层必然更好**：模型能力还受数据、优化、宽度、训练计算与评测目标影响。

本页没有展开每个 Block 内部的 QKV 数值计算；需要回顾时返回[Decoder Block](/ai/transformers/decoder-block)和[注意力流水线](/ai/transformers/attention-pipeline)。

## 本节自测

<KnowledgeQuiz
  storage-key="foundation-lm-architecture-v1"
  :questions="[
    { id:'arch-1', type:'fill', prompt:'输入 ID 的 shape 是 [B,T]，查 embedding 后的 shape 是什么？', answer:['[B,T,C]','[B, T, C]','B×T×C','BxTxC'], explanation:'每个离散位置增加一个 C 维连续表示。' },
    { id:'arch-2', type:'boolean', prompt:'连续通过 12 个 Decoder Block 会把序列长度 T 变成 12T。', answer:false, explanation:'Block 通常保持 [B,T,C] 外部 shape，12 表示计算深度。' },
    { id:'arch-3', type:'single', prompt:'哪个模块把隐藏宽度 C 改成词表大小 V？', options:['Token Embedding','Causal Attention','Language Model Head'], answer:'Language Model Head', explanation:'词表头使用 [C,V] 权重，为每个位置产生 V 个 logits。' },
    { id:'arch-4', type:'open', prompt:'用自己的话区分参数、激活和 logits。', rubric:['参数跨样本保存并由优化器更新','激活由当前输入和参数在前向过程中产生','logits 是输出端尚未归一化的词表分数'], reference:'参数是模型长期保存和学习的权重；激活是一次前向的中间状态；logits 是最终投影产生的候选 token 分数。' }
  ]"
/>

打印版答案：1. `[B,T,C]`；2. 错；3. Language Model Head；4. 按“是否持久、从哪里来、做什么”区分三者。

## 小结与下一步

完整语言模型已经组装完毕。下一课[Decoder 怎样预测下一个 token](/ai/foundation-models/next-token-prediction)会聚焦最后一个位置，实际计算 logits、概率与交叉熵。
