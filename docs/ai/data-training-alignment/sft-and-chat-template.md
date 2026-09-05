---
title: SFT 与 Chat Template 怎样定义监督目标
date: 2026-09-05
updated: 2026-09-05
type: lesson
status: learnable
track: ai
chapter: data-training-alignment
prerequisites: [/ai/data-training-alignment/pretraining-evidence]
outcomes:
  - 能把多轮消息序列化为 token 并标出 loss mask
  - 能解释 SFT 与预训练目标的共同点和差异
  - 能诊断模板、角色边界与截断造成的静默错误
estimated: 45min
categories: [智能算法]
tags: [SFT, Chat Template, Loss Mask]
description: 将结构化对话通过 Chat Template 变成自回归训练序列，并明确哪些 token 被监督。
---

# SFT 与 Chat Template 怎样定义监督目标

SFT（监督微调）没有把语言模型换成另一种网络。它仍然做 next-token 交叉熵，但数据从普通连续文本变成“输入—理想回答”，并常用 loss mask 只训练 Assistant 段。

## 同一任务的三种目标

<ClientOnly><TrainingObjectiveDemo /></ClientOnly>

观察重点不是颜色，而是同一 token 在三个阶段的职责：Prompt 可以影响回答，却不一定计入 loss；偏好阶段比较整段响应的相对分数。

## Chat Template 是协议

结构化消息：

```json
[{"role":"user","content":"2+3?"},{"role":"assistant","content":"5"}]
```

可能被序列化为：

```text
<user> 2+3? </user> <assistant> 5 </assistant>
```

角色 token、换行、结束 token 和是否添加 generation prompt 都属于模型协议。训练和推理模板不一致时，即使文字看起来相同，token 序列也可能不同。

## Loss mask 怎样构造

| token 段 | 可被回答读取 | 常见是否计分 |
| --- | --- | --- |
| system/user | 是 | 否 |
| assistant 起始标记 | 是 | 依实现约定 |
| assistant 内容 | 是 | 是 |
| padding | 否/被遮罩 | 否 |

只训练回答并非唯一合法方案，但必须显式声明。多轮对话还要决定是否训练所有历史 Assistant 回答，或只训练最后一轮。

## 截断最危险的地方

超过最大长度时，若从右侧截断，可能删掉目标回答；若从左侧截断，可能丢失 system 或问题。每个 batch 应统计有效回答 token 数，拒绝“全零 loss mask”样本。

## SFT 学到什么

它提高训练分布中理想回答的概率，常用于格式、角色、任务和风格。它不能自动保证事实正确、未见任务泛化或安全边界；这些需要独立数据与评测。

## 最小检查

随机抽一条样本，同时打印原始 messages、渲染文本、token、labels 和 loss mask。逐 token 验证：被计分位置的标签确实属于目标 Assistant 回答。

## 常见错误

- 训练与推理使用不同 template；
- user 内容也计入 loss，却没有记录此选择；
- EOS 丢失导致模型不会结束；
- 多轮拼接后角色边界错位；
- 长样本截断后没有任何目标 token；
- 把模板字符串当成 tokenizer 自动理解的特殊 token。

## 自测

<KnowledgeQuiz storage-key="sft-template-v1" :questions="[
 {id:'sft-1',type:'boolean',prompt:'SFT 必须使用一种不同于 next-token 的模型结构。',answer:false,explanation:'常见 SFT 仍使用自回归交叉熵，只改变数据和计分位置。'},
 {id:'sft-2',type:'single',prompt:'训练和推理 Chat Template 不一致最可能导致什么？',options:['参数量自动增加','模型看到不同 token 协议','KV Cache 消失'],answer:'模型看到不同 token 协议',explanation:'角色和边界 token 会改变输入。'},
 {id:'sft-3',type:'open',prompt:'一条样本渲染后如何证明 loss mask 正确？',rubric:['展示原始 messages','展示 token/labels/mask 对齐','确认 Prompt 可见但目标位置符合约定','确认 EOS 与截断','确认至少一个有效目标 token'],reference:'逐 token 打印并回译，核对每个 mask=1 的标签都属于目标 Assistant 段。'}
]" />

打印版答案：1. 错；2. 模型看到不同 token 协议；3. 逐 token 审计。

## 下一步

目标定义清楚后，学习[LoRA 怎样进行参数高效适配](/ai/data-training-alignment/lora-adaptation)。
