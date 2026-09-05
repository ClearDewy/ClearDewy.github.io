---
title: 第 5 章复习与验收
date: 2026-09-05
updated: 2026-09-05
type: review
status: learnable
track: ai
chapter: data-training-alignment
prerequisites: [/ai/data-training-alignment/training-evidence-lab]
outcomes:
  - 能审计数据谱系、切分、SFT mask、LoRA 和偏好对
  - 能设计可恢复、可比较的训练运行
estimated: 75min
categories: [智能算法]
tags: [Review, Training, Alignment]
description: 通过数据泄漏、目标构造、适配参数和偏好评测任务验收训练与对齐知识。
---

# 第 5 章复习与验收

## 综合自测

<KnowledgeQuiz storage-key="data-training-review-v1" :questions="[
 {id:'r5-1',type:'boolean',prompt:'先随机切分、再在每个 split 内去重可以保证同簇不跨集合。',answer:false,explanation:'应先建立全局重复簇，再按簇切分。',remediation:'/ai/data-training-alignment/data-lineage-and-splits'},
 {id:'r5-2',type:'single',prompt:'哪一步真正更新模型参数？',options:['backward','optimizer.step','zero_grad'],answer:'optimizer.step',explanation:'backward 只产生梯度。'},
 {id:'r5-3',type:'boolean',prompt:'SFT 中 Prompt 不计 loss 就表示模型看不到 Prompt。',answer:false,explanation:'可见性和计分位置是两件事。',remediation:'/ai/data-training-alignment/sft-and-chat-template'},
 {id:'r5-4',type:'fill',prompt:'1024×1024 层使用 rank=8 的 LoRA，A/B 共多少参数？',answer:['16384','16,384'],explanation:'8×1024+1024×8。'},
 {id:'r5-5',type:'single',prompt:'合法偏好对首先必须共享什么？',options:['相同 Prompt','相同回答','不同 tokenizer'],answer:'相同 Prompt',explanation:'否则无法把相对差异归因于响应。'},
 {id:'r5-6',type:'open',prompt:'如何证明一个新 SFT checkpoint 比基线更好？',rubric:['固定数据/模型身份','独立任务评测','模板和采样一致','按错误类型报告','检查通用与安全回归','记录不确定性和未证明部分'],reference:'在版本化评测集上与父 checkpoint 做受控比较，并保留逐样本错误和回归结果。'}
]" />

## 实作任务

给定 1000 条对话和 200 条偏好对：

1. 设计 manifest 与按来源/题目簇切分；
2. 画出一条 messages 经 template 到 token/labels/mask；
3. 设计单 batch 过拟合与 checkpoint 恢复测试；
4. 比较全参 SFT 与 rank-8 LoRA 的可训练状态；
5. 为偏好数据写 rubric、标签一致性与长度分层；
6. 运行[审计实验](/ai/data-training-alignment/training-evidence-lab)并提交三项修改结果。

## 评分

| 项目 | 分值 |
| --- | ---: |
| 数据谱系与无泄漏切分 | 2 |
| token/模板/loss mask | 2 |
| 训练与恢复证据 | 2 |
| LoRA 参数边界 | 2 |
| 偏好目标与回归评测 | 2 |
| 实验断言 | 2 |

总分 10/12 以上且实验通过视为合格。薄弱项返回[速查页](/ai/data-training-alignment/reference)定位课程。完成后进入[推理、评测与安全](/ai/inference-evaluation-safety)。
