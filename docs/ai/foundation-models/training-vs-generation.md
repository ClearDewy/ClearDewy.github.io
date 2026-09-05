---
title: 训练与生成为什么不是同一个过程
date: 2026-09-05
updated: 2026-09-05
type: lesson
status: learnable
track: ai
chapter: foundation-models
prerequisites:
  - /ai/foundation-models/parameters-memory-compute
outcomes:
  - 能解释训练并行和生成串行为什么不矛盾
  - 能区分真实前缀与模型自己生成的前缀
  - 能定位 label shift、causal mask 和停止条件错误
estimated: 35 分钟
categories: [智能算法]
tags: [Training, Autoregressive Generation, Teacher Forcing]
description: 对照同一条序列在训练和生成阶段的可见输入、目标、执行顺序与失败方式。
---

# 训练与生成为什么不是同一个过程

同一个 Decoder、同一组参数，在训练和生成阶段的执行方式不同。关键差别不是“是否使用 Transformer”，而是**下一位置的真实 token 是否已经存在于输入数据中**。

## 训练：答案已在数据里，但不能被当前位置读取

```text
input : <BOS>  我    喜欢  猫
label : 我     喜欢  猫    <EOS>
```

GPU 可以并行计算四个位置，但 causal mask 保证位置 `t` 的隐藏表示不能读取更晚的 input。并行指计算调度，因果指信息边界，两者不冲突。

## 生成：未来 token 尚不存在

给定 Prompt `<BOS> 我 喜欢`：

```text
第 1 轮：<BOS> 我 喜欢        → 选出 猫
第 2 轮：<BOS> 我 喜欢 猫     → 选出 <EOS>
```

每轮选出的 token 必须接到上下文末尾，才能计算下一轮分布。不同生成轮次存在真实数据依赖，不能一次知道所有未来 token。

## 对照表

| 问题 | 训练 | 生成 |
| --- | --- | --- |
| 后续真实 token 是否在数据中 | 是 | 否 |
| 一次处理多少目标位置 | 通常全部有效位置 | 通常当前最后位置 |
| 前缀来自哪里 | 数据中的真实 token | Prompt + 模型已生成 token |
| 输出之后做什么 | 计算 loss、反向传播、更新参数 | 选 token、追加上下文、继续前向 |
| 是否更新参数 | 是 | 通常否 |
| 何时停止 | 一个 batch 完成 | EOS、长度上限或外部停止规则 |

## Teacher Forcing 指什么

训练时，每个位置看到的前缀来自真实训练序列，而不是模型上一位置刚生成的结果。这常被称为 teacher forcing。它提高训练并行度和稳定性，但意味着训练前缀分布与自由生成时可能不同。

这不等于模型在训练中偷看未来。是否泄漏由 label 对齐和 causal mask 决定，而不是由“整段是否同时放进 GPU”决定。

## KV Cache 只优化重复计算

生成时可以缓存历史层的 K/V，避免每轮重新计算所有历史 token 的 K/V 投影。它不改变新 token 必须依赖上一轮选择，也不把生成变成训练。具体缓存布局和性能留到推理章节。

## 常见故障

- labels 没右移：模型学习复制当前 token。
- causal mask 方向错误：训练 loss 异常好，逐步生成崩溃。
- 生成时每轮仍读取真实后续文本：评测发生答案泄漏。
- 忘记把新 token 接回上下文：每轮重复同一个分布。
- 没有 EOS 或长度上限：生成无法可靠终止。

## 本节自测

<ClientOnly>
  <KnowledgeQuiz title="训练与生成自测" storage-key="ai-foundation-models-train-generate" :questions="[
    { id:'tg-parallel', type:'boolean', prompt:'训练时能并行计算全部位置，说明早期位置可以读取未来答案。', answer:false, explanation:'并行是计算方式；causal mask 仍限制每个位置的信息范围。' },
    { id:'tg-update', type:'single', prompt:'常规生成一轮结束后，最直接的下一步是什么？', options:['反向传播更新参数','把选中的 token 追加到上下文','重新训练 tokenizer','删除历史 token'], answer:'把选中的 token 追加到上下文', explanation:'新上下文决定下一轮条件分布。' },
    { id:'tg-debug', type:'open', prompt:'训练 loss 很低但自由生成很差时，列出三个首先检查的对象。', rubric:['label shift','causal mask 方向与广播','生成前缀是否来自模型输出','训练与评测数据泄漏','停止条件'], reference:'用极小序列打印 inputs、labels、mask 和每轮实际上下文，确认训练没有未来信息，生成确实把自己的输出接回输入。' }
  ]" />
</ClientOnly>

<details><summary>静态答案与检查点</summary>

1. 错误。2. 追加 token。3. 至少覆盖 label、mask 和实际生成上下文。

</details>

## 小结与下一步

训练使用真实序列右移后的密集目标并更新参数；生成使用自己的输出扩展上下文，通常不更新参数。下一步学习[Prefill、Decode 与 KV Cache](/ai/foundation-models/prefill-kv-cache)，观察真实增量推理怎样避免重复计算。
