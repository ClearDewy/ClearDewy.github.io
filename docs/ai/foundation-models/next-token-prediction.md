---
title: Decoder 怎样预测下一个 token
date: 2026-09-05
updated: 2026-09-05
type: lesson
status: learnable
track: ai
chapter: foundation-models
prerequisites:
  - /ai/foundation-models/language-model-architecture
outcomes:
  - 能从 token ID 追踪到词表 logits 与概率
  - 能计算一个位置的 next-token 交叉熵
  - 能解释 logits、概率、预测结果和训练损失的区别
estimated: 45 分钟
categories: [智能算法]
tags: [Next Token, Logits, Cross Entropy]
description: 追踪一个训练位置经过 embedding、Decoder、词表头、Softmax 和交叉熵的完整前向路径。
---

# Decoder 怎样预测下一个 token

Transformer Block 输出的仍是一组 C 维表示。要预测 token，必须再把每个位置投影到整个词表，使每个候选得到一个 logit。

## 完整前向路径

<ClientOnly>
  <NextTokenPredictionDemo />
</ClientOnly>

动画聚焦上下文 `<BOS> 我 喜欢`，正确标签是 `猫`。候选格中的 logits 可以直接修改；观察概率、贪心结果与交叉熵是否同时按预期变化。

## 从隐藏维到词表维

设 Decoder 最终表示为 $H\in\mathbb{R}^{B\times T\times C}$，词表大小为 `V`，输出矩阵为 $W_{vocab}\in\mathbb{R}^{C\times V}$：

$$logits=HW_{vocab}\in\mathbb{R}^{B\times T\times V}$$

`logits[b,t,v]` 表示样本 `b` 的位置 `t` 对词表 token `v` 的未归一化分数。矩阵乘法消去隐藏维 `C`，把最后一维换成词表维 `V`。

## Logit 不是概率

Logit 可以为负，不要求位于 0 到 1，也不要求总和为 1。Softmax 才产生条件概率：

$$p_v=\frac{e^{z_v}}{\sum_j e^{z_j}}$$

实现时先减去最大 logit 再计算指数，避免溢出。所有 logits 同时加上相同常数不会改变概率。

## 交叉熵只读取正确标签

若正确标签是 `猫`：

$$L_t=-\log p(猫\mid <BOS>,我,喜欢)$$

模型不是被直接要求“让其他概率为 0”，而是通过提高正确标签概率降低损失。完整训练损失通常对所有有效位置求和或平均：

$$L=\frac{1}{N}\sum_{t\in valid}-\log p(y_t\mid x_{\le t})$$

padding 或被忽略的位置不应进入 `valid`。

## 为什么一条序列产生多个训练信号

一次前向得到 `[B,T,V]`，每个有效位置都有一份 next-token 分类问题。长度为 4 的输入通常产生 4 个位置损失，而不是只训练最后一个位置。

这就是自监督信号的来源：原文本中的每个后继 token 都可以成为其前缀的训练答案。

## 参数怎样被更新

```text
loss → logits → W_vocab 与 H
→ Decoder Blocks
→ QKV、FFN、Norm、Embedding 等参数
```

“模型学会下一个 token”不是把答案写进一个静态表；梯度会共同调整整条前向路径，使相似上下文逐渐产生更合适的条件分布。

## 常见误解

- 概率最高就等于概率 1：错误，贪心只选择最大项。
- loss 下降证明事实正确：错误，它只证明指定数据上的训练目标改善。
- Softmax 会被训练：Softmax 本身没有可学习参数，梯度通过它流向 logits 来源。
- 只看 argmax 就能检查训练：argmax 不变时，概率和 loss 仍可能明显变化。

## 本节自测

<ClientOnly>
  <KnowledgeQuiz title="Next-token 前向自测" storage-key="ai-foundation-models-next-token" :questions="[
    { id:'nt-shape', type:'single', prompt:'H 为 [2,5,8]，词表头 W 为 [8,20]，logits shape 是什么？', options:['[2,5,20]','[2,20,8]','[5,8,20]','[2,5,8]'], answer:'[2,5,20]', explanation:'C=8 被乘法消去，V=20 成为输出最后一维。' },
    { id:'nt-logit', type:'boolean', prompt:'Logit 必须在 0 到 1 之间并且总和为 1。', answer:false, explanation:'这是概率的约束，不是 logit 的约束。' },
    { id:'nt-loss', type:'open', prompt:'正确标签概率从 0.2 变成 0.8 时，交叉熵和 argmax 可能怎样变化？', rubric:['交叉熵一定下降','argmax 取决于其他候选，未必变化','区分连续概率与离散选择'], reference:'-log(p) 随 p 增大而下降；argmax 只看谁最大，因此可能改变，也可能前后都是同一候选。' }
  ]" />
</ClientOnly>

<details><summary>静态答案与检查点</summary>

1. `[2,5,20]`。2. 错误。3. loss 一定下降，argmax 是否变化取决于其他候选。

</details>

## 小结与下一步

Decoder 输出经词表头得到 logits，Softmax 得到条件概率，正确标签概率的负对数形成训练损失。下一步把它放进[语言模型的一次训练 step](/ai/foundation-models/training-loop)。
