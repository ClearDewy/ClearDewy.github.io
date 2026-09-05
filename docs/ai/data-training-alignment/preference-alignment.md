---
title: 偏好数据与 DPO 怎样改变相对概率
date: 2026-09-05
updated: 2026-09-05
type: lesson
status: learnable
track: ai
chapter: data-training-alignment
prerequisites: [/ai/data-training-alignment/lora-adaptation]
outcomes:
  - 能构造同 Prompt 下的 chosen/rejected 偏好样本
  - 能解释 DPO 优化相对 log-prob 且受参考策略约束
  - 能识别标签噪声、长度偏好和 reward hacking 风险
estimated: 45min
categories: [智能算法]
tags: [Preference, DPO, RLHF]
description: 从成对偏好样本出发理解 DPO 的相对概率目标、参考模型和对齐评测边界。
---

# 偏好数据与 DPO 怎样改变相对概率

SFT 告诉模型“模仿这份回答”。偏好数据则给同一个 Prompt 的两个回答，告诉模型哪一个相对更好。

```text
prompt: 2+3 等于多少？
chosen: 5
rejected: 6
```

## 数据 schema

chosen/rejected 必须共享完全相同的 Prompt 与模板。标签应依据明确 rubric，例如正确性、相关性、风格或安全；如果把多个标准混成“整体更好”，后续很难解释改善来源。

## DPO 的直觉

策略模型对整段响应的 log-prob 是响应 token log-prob 之和。DPO 希望策略相对参考模型更偏向 chosen，而不是无限提高所有 chosen 概率：

$$
\Delta_\pi=\log\pi(y_w|x)-\log\pi(y_l|x)
$$

再与参考策略的差值比较并进入 logistic loss。`β` 控制偏好强度与偏离参考模型的权衡。初学者要抓住：它优化**相对优势**，参考模型提供锚点。

## 为什么不能只看训练准确率

偏好准确率 100% 可能只是记住模板、长度或标注者习惯。必须在独立 Prompt 上评估正确性、帮助性、安全、长度、格式和通用能力回归。

## 数据风险

- chosen/rejected 写反；
- rejected 明显更短，模型学到长度偏好；
- 两者差异包含格式噪声而非目标属性；
- 同一回答对出现在训练与评测；
- 标注者对 rubric 理解不一致；
- 单一自动评分器被模型利用。

RLHF 的奖励模型 + PPO 路线会显式学习奖励并在线采样优化策略；DPO 直接使用离线偏好对。二者流程不同，但都不能超越偏好数据和评测定义本身。

## 最小对照

保持基座、SFT checkpoint、数据和评测固定，比较无偏好优化与 DPO。报告总体偏好胜率，同时按正确性、长度、安全类别分层，并检查通用任务回归。

## 自测

<KnowledgeQuiz storage-key="dpo-v1" :questions="[
 {id:'dpo-1',type:'boolean',prompt:'偏好样本中的 chosen 与 rejected 可以使用不同 Prompt。',answer:false,explanation:'成对比较必须共享条件，否则差异不可归因。'},
 {id:'dpo-2',type:'single',prompt:'DPO 的参考模型主要提供什么？',options:['随机标签','限制策略偏离的锚点','新的 tokenizer'],answer:'限制策略偏离的锚点',explanation:'目标比较策略与参考策略的相对偏好变化。'},
 {id:'dpo-3',type:'open',prompt:'偏好胜率提高后还要检查哪些回归？',rubric:['正确性/事实性','长度与格式偏置','安全类别','通用任务能力','独立数据与人工一致性'],reference:'分维度评测并检查是否只迎合评分器或长度，而非真实改善。'}
]" />

打印版答案：1. 错；2. 限制策略偏离的锚点；3. 分解质量维度与通用回归。

来源：[Direct Preference Optimization](https://arxiv.org/abs/2305.18290)、[Training language models to follow instructions with human feedback](https://arxiv.org/abs/2203.02155)。

## 下一步

进入[训练目标与数据审计实验](/ai/data-training-alignment/training-evidence-lab)，把数据身份、loss mask 和偏好对检查写成断言。
