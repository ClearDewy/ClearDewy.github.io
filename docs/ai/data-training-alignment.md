---
title: 5. 数据、训练与对齐
date: 2026-09-05
updated: 2026-09-05
type: overview
status: learnable
track: ai
categories: [智能算法]
tags: [Data, Pretraining, SFT, Alignment]
description: 从数据谱系和切分出发，完成预训练、监督微调、LoRA 与偏好优化的可审计训练闭环。
---

# 5. 数据、训练与对齐

第 4 章说明了模型怎样学习 next-token。本章回答更现实的问题：**哪些 token 进入训练、哪些位置产生 loss、不同训练阶段到底在改变什么行为？**

```text
原始来源 → 许可与数据谱系 → 清洗/去重/切分 → 样本与目标
→ 预训练基线 → SFT → LoRA/全参适配 → 偏好优化
→ 固定评测、回归检查与模型卡
```

## 固定案例

全章使用“整数加法助手”作为最小任务：

```text
用户：2 + 3 等于多少？
助手：5
```

它很小，但能暴露数据重复、模板错误、Prompt 是否计入 loss、偏好标签反转和训练/评测污染。真实对话能力远比这个任务复杂，本例只用于验证训练契约。

## 唯一学习顺序

| 顺序 | 页面 | 完成证据 |
| ---: | --- | --- |
| 1 | [数据谱系、去重与切分](/ai/data-training-alignment/data-lineage-and-splits) | 能追踪一条样本来源并识别泄漏 |
| 2 | [预训练运行怎样建立证据](/ai/data-training-alignment/pretraining-evidence) | 能从单批次过拟合推进到可恢复基线 |
| 3 | [SFT 与 Chat Template 怎样定义监督目标](/ai/data-training-alignment/sft-and-chat-template) | 能逐 token 标出上下文和 loss 位置 |
| 4 | [LoRA 怎样进行参数高效适配](/ai/data-training-alignment/lora-adaptation) | 能解释低秩增量、冻结参数和合并边界 |
| 5 | [偏好数据与 DPO 怎样改变相对概率](/ai/data-training-alignment/preference-alignment) | 能构造 chosen/rejected 并识别标签风险 |
| 6 | [训练目标与数据审计实验](/ai/data-training-alignment/training-evidence-lab) | 运行固定样本审计并通过断言 |
| 7 | [训练与对齐速查](/ai/data-training-alignment/reference) | 查询阶段、记录字段和失败模式 |
| 8 | [第 5 章复习与验收](/ai/data-training-alignment/review) | 完成数据、目标、训练和偏好诊断 |

## 三个训练阶段不要混淆

| 阶段 | 数据形式 | 主要目标 | 不能直接证明 |
| --- | --- | --- | --- |
| 预训练 | 大规模连续 token | 学习通用条件分布 | 会遵循用户意图 |
| SFT | Prompt—理想回答 | 模仿示范行为 | 偏好在所有分布都成立 |
| 偏好优化 | 同 Prompt 的相对选择 | 提高 chosen 相对概率 | 奖励代表真实价值 |

训练阶段变化时，数据 schema、loss mask、基线模型和评测都必须同步记录。

## 本章边界

本章不详细展开分布式并行内核、在线服务调度和高风险动作控制；它们分别属于工程实现、第 6 章和第 7 章。这里的“对齐”指可测量的训练目标与期望行为更一致，不宣称解决价值对齐的全部问题。

## 过关标准

不查资料能够：

1. 为任意训练样本给出来源、许可、处理版本与切分归属；
2. 区分精确重复、近重复和语义相关样本；
3. 从 chat template 写出 token 与 loss mask；
4. 解释预训练、SFT、LoRA 和 DPO 分别更新什么；
5. 运行单批次过拟合、验证 loss 和 checkpoint 恢复检查；
6. 用固定评测证明改善，并列出没有被证明的部分。

完成[章节验收](/ai/data-training-alignment/review)后进入[推理、评测与安全](/ai/inference-evaluation-safety)。
