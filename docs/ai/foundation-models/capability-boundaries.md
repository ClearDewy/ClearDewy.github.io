---
title: 模型回答中的能力来自哪里
date: 2026-09-05
updated: 2026-09-05
type: lesson
status: learnable
track: ai
chapter: foundation-models
prerequisites:
  - /ai/foundation-models/multimodal-and-diffusion
outcomes:
  - 能区分参数、上下文、检索和工具提供的信息
  - 能说明 Prompt 与训练更新的根本差异
  - 能为能力归因设计最小对照实验
estimated: 35 分钟
categories: [智能算法]
tags: [Capability, Context, Retrieval, Evaluation]
description: 区分模型参数、当前上下文、外部检索和工具执行对最终回答的不同贡献。
---

# 模型回答中的能力来自哪里

Next-token 模型只根据当前可见条件生成分布。一个回答看起来正确，不足以证明正确事实来自模型参数；它也可能来自 Prompt、检索文档、工具返回或偶然采样。

## 四类来源

| 来源 | 在哪里 | 是否修改参数 | 怎样验证 |
| --- | --- | --- | --- |
| 参数学习 | 模型权重 | 训练时修改 | 移除上下文后在多种表述上测试 |
| 当前上下文 | Prompt、对话、few-shot 示例 | 否 | 删除或替换相关片段做对照 |
| 外部检索 | 召回并放入上下文的文档 | 否 | 检查召回、引用和无文档基线 |
| 工具结果 | 计算器、数据库、API 的执行输出 | 否 | 核对调用参数、原始结果与答案转换 |

最终文本通常是这些来源共同作用的结果，不能只归功于“模型知道”。

## Prompt 为什么不是训练

Prompt 会改变条件输入：

$$p(next\ token\mid context)$$

但常规推理不会执行反向传播或优化器更新。关闭会话、删除上下文后，Prompt 中的新事实通常不会永久进入参数。

Few-shot 示例可以让模型在上下文中模仿格式或任务模式，这称为上下文学习；它与使用训练数据更新参数仍是不同机制。

## 流畅性不是证据

Next-token 目标奖励在训练分布中产生合适后续，并不直接保证：

- 陈述与现实一致；
- 推理过程忠实；
- 引用确实支持结论；
- 面对分布外输入仍可靠；
- 工具调用权限和结果使用正确。

因此“语言自然”“解释很长”“置信语气强”都不能替代任务评测和来源核对。

## 最小归因实验

要判断答案来自哪里，至少比较：

1. 无额外上下文的模型基线；
2. 加入正确文档；
3. 加入冲突或无关文档；
4. 禁用工具与启用工具；
5. 固定采样设置并重复多条等价提问。

只有结果随某个受控来源稳定变化，才能把改进归因到该来源。一次回答无法完成可靠归因。

## 常见误解

- Prompt 教过一次，模型以后就永久记住：通常错误。
- RAG 改进了答案，所以参数已经学会文档：错误，检索内容通常只进入当前上下文。
- 工具返回正确，模型推理也必然正确：还要检查参数、调用和结果转换。
- 模型能复述训练文本，所以理解了概念：复述与迁移需要分别验证。

## 本节自测

<ClientOnly>
  <KnowledgeQuiz title="能力来源自测" storage-key="ai-foundation-models-capability" :questions="[
    { id:'cap-prompt', type:'boolean', prompt:'在普通对话中加入一段 Prompt，通常会直接执行反向传播并永久更新模型参数。', answer:false, explanation:'Prompt 改变当前上下文，常规推理不运行优化器。' },
    { id:'cap-source', type:'single', prompt:'回答中的实时天气数字最可能需要哪类来源？', options:['仅靠 token ID','外部检索或工具结果','提高 temperature','增大 hidden size'], answer:'外部检索或工具结果', explanation:'实时状态需要当前外部证据。' },
    { id:'cap-test', type:'open', prompt:'设计一个对照，判断回答改善是否来自检索文档。', rubric:['固定模型与采样设置','比较无文档和有文档','加入无关或冲突文档','检查引用是否支持结论','使用多条样本而非单次回答'], reference:'固定其他条件，比较无检索、正确文档、无关文档三个条件，并核对答案与引用随文档内容的变化。' }
  ]" />
</ClientOnly>

<details><summary>静态答案与检查点</summary>

1. 错误。2. 外部检索或工具。3. 对照中只能改变检索证据，其他条件保持一致。

</details>

## 小结与下一步

模型输出由参数与当前条件共同产生，外部证据还可能来自检索和工具。下一步使用[语言模型速查](/ai/foundation-models/reference)整理公式，再完成[章节复习](/ai/foundation-models/review)。
