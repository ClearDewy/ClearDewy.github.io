---
title: 文本怎样变成 next-token 训练样本
date: 2026-09-05
updated: 2026-09-05
type: lesson
status: learnable
track: ai
chapter: foundation-models
prerequisites:
  - /ai/transformers/decoder-block
outcomes:
  - 能区分 token、token ID、embedding 与位置表示
  - 能把一段 token 序列右移成 input 与 labels
  - 能说明 BOS、EOS 和 padding 是否参与 loss
estimated: 35 分钟
categories: [智能算法]
tags: [Tokenizer, Embedding, Training Sample]
description: 从固定短句构造 token ID、连续表示、右移标签和有效 loss 位置。
---

# 文本怎样变成 next-token 训练样本

语言模型不能直接对字符串做矩阵乘法。进入 Transformer 之前，必须先回答：文本被切成什么单位、每个单位如何编号、模型在每个位置要预测什么。

## 一条对象链

```text
文本 → token → token ID → embedding → 带位置信息的表示 X
```

| 对象 | 示例 | 身份 |
| --- | --- | --- |
| 文本 | `我喜欢猫` | 原始字符序列 |
| token | `<BOS>、我、喜欢、猫、<EOS>` | tokenizer 定义的离散单位 |
| token ID | `0、7、12、25、1` | token 在词表中的索引 |
| embedding | 每个 ID 对应一行 C 维参数 | 可学习连续向量 |
| 位置表示 | 第 1、2、3…个位置 | 让相同 token 在不同位置可区分 |

ID 的数值大小没有距离含义；ID 25 不表示“猫”比 ID 7 的“我”更大。真正参与模型计算的是 embedding 向量。

## Token 不一定等于词

Tokenizer 可能按字符、子词、字节或混合规则切分。同一个字符串在不同 tokenizer 下可能得到不同 token，因此：

- token 数决定模型实际看到的序列长度；
- 词表 ID 只能交给与该词表匹配的 embedding；
- 不能把界面中看到的“词”直接当成一个模型 token；
- 本章把“喜欢”当成一个教学 token，只为保持例子可读。

## 右移一位产生监督信号

```text
完整 : <BOS>  我    喜欢  猫  <EOS>
input: <BOS>  我    喜欢  猫
label: 我     喜欢  猫    <EOS>
```

位置 `t` 的隐藏表示只能读取 `input[0:t]`，却要提高 `label[t]` 的概率。训练数据本身由同一序列右移得到，不需要人工为每个位置填写类别。

## BOS、EOS 与 Padding

- `<BOS>` 给第一个真实 token 一个可见起点；并非所有模型都显式使用。
- `<EOS>` 告诉模型序列可以结束；生成时选中它通常意味着停止。
- `<PAD>` 用于把不同长度样本整理成 batch；padding 位置通常不计入 loss，也不能作为有效内容读取。

必须分别检查 attention mask 和 loss mask。前者决定哪些输入可见，后者决定哪些位置参与评分；它们解决的问题不同。

## Shape

若 batch 大小为 `B`、训练长度为 `T`、隐藏维为 `C`：

```text
token_ids [B,T] → embedding lookup → X [B,T,C]
```

Embedding lookup 是按 ID 取参数表中的行，不是把 ID 当连续数值乘进去。位置机制可能直接加入表示，也可能像 RoPE 一样在后续改变 Q/K；具体结构不同，但模型必须获得顺序信息。

## 常见错误

- 输入和 labels 没右移，模型只学会复制当前位置。
- 使用了另一个 tokenizer 的 ID，词表与 embedding 不匹配。
- padding 位置参与 loss，模型花大量能力预测 `<PAD>`。
- 把 token 数当字符数，导致长度与成本估算错误。
- 忘记 EOS，生成只能依赖外部长度上限停止。

## 本节自测

<ClientOnly>
  <KnowledgeQuiz title="Token 与训练样本自测" storage-key="ai-foundation-models-tokenization" :questions="[
    { id:'tok-id', type:'boolean', prompt:'token ID 的大小可以直接表示两个 token 的语义距离。', answer:false, explanation:'ID 只是词表索引；语义关系由学习到的连续表示和上下文计算产生。' },
    { id:'tok-shift', type:'fill', prompt:'序列 [BOS,我,喜欢,猫,EOS] 的第三个训练位置应预测哪个 token？', answer:['猫'], explanation:'输入到“喜欢”为止，标签是紧随其后的“猫”。' },
    { id:'tok-masks', type:'open', prompt:'说明 attention mask 与 loss mask 为什么不能当成同一个概念。', rubric:['attention mask 约束输入可见性','loss mask 决定哪些位置计入目标','能举出 padding 或 causal 的例子'], reference:'attention mask 控制某个 query 可以读取哪些 key；loss mask 控制某个输出位置是否参与损失。' }
  ]" />
</ClientOnly>

<details><summary>静态答案与检查点</summary>

1. 错误。2. `猫`。3. 回答必须区分“能否读取”和“是否计分”。

</details>

## 小结与下一步

Tokenizer 定义离散单位和 ID，Embedding 把 ID 变成连续表示；右移一位把原文本变成每个位置的 next-token 标签。下一步学习[训练文本怎样变成批次与因果遮罩](/ai/foundation-models/data-batches-and-causal-mask)。
