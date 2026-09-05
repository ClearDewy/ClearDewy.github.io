---
title: 怎样设计可信的模型与系统评测
date: 2026-09-05
updated: 2026-09-05
type: lesson
status: learnable
track: ai
chapter: inference-evaluation-safety
prerequisites: [/ai/inference-evaluation-safety/performance-metrics]
outcomes:
  - 能从用户任务定义评测样本、rubric、指标与基线
  - 能区分模型离线、系统离线、在线和监控证据
  - 能报告样本不确定性和未覆盖范围
estimated: 45min
categories: [智能算法]
tags: [Evaluation, Benchmark, Rubric]
description: 将产品目标拆成分层评测、版本化数据、评分规则和可比较基线。
---

# 怎样设计可信的模型与系统评测

评测不是找一个热门榜单分数，而是把“这个系统对这类用户任务是否足够好”变成可重复判断。

## 五层证据

<ClientOnly><EvaluationEvidenceDemo /></ClientOnly>

任何一层都有“能证明”和“不能单独证明”的边界。单元测试通过不代表回答正确，离线高分也不代表线上分布和副作用稳定。

## 从决策开始

先写评测要支持的决策：是否上线、选择 A/B、是否回滚、哪个错误优先修。再定义目标人群、输入分布、成功条件、不可接受失败和成本限制。

固定案例“政策日期问答”至少需要：答案日期正确、引用直接支持、过期文档不覆盖新文档、无证据时拒答、延迟满足 SLO。

## 样本与 rubric

每条样本保存 input、期望证据、可接受答案、错误标签和来源版本。开放生成使用分项 rubric，而不是“感觉不错”：正确性、证据支持、完整性、格式与安全分别评分。

## 指标与基线

报告均值前先保留逐样本结果。分类用准确率/F1 等，检索和生成有各自指标；自动评分器必须验证与人工判断的一致性。基线可以是旧模型、简单规则或无检索版本。

## 不确定性

小样本分数有波动。至少报告样本数和置信区间或 bootstrap 区间；多次随机生成应固定/记录 seed 并重复运行。差 1 分不一定是真实改善。

## 污染与版本

保存 dataset version、Prompt/template、模型、采样、工具/索引和评分器版本。公开题可能进入训练数据，必须标记污染风险并增加私有或时间外样本。

## 常见错误

- 先看结果再改 rubric；
- 只报告总体平均，掩盖关键子群；
- 自动 judge 没有人类校准；
- A/B 使用不同 Prompt 或检索索引；
- 评测集被开发反复调参后仍称“测试集”。

## 自测

<KnowledgeQuiz storage-key="evaluation-design-v1" :questions="[
 {id:'ed-1',type:'boolean',prompt:'单元测试全部通过足以证明真实用户任务成功。',answer:false,explanation:'它只验证局部不变量。'},
 {id:'ed-2',type:'single',prompt:'开放回答最适合先建立什么？',options:['分项 rubric','更高 temperature','更长模型名'],answer:'分项 rubric',explanation:'评分标准必须在看结果前定义。'},
 {id:'ed-3',type:'open',prompt:'为政策日期问答定义四项评测。',rubric:['日期正确','引用支持','时效/冲突处理','无证据拒答','延迟或成本'],reference:'同时测答案、证据、时效、拒答和运行指标。'}
]" />

打印版答案：1. 错；2. 分项 rubric；3. 覆盖答案、证据、边界和运行。

来源：[HELM](https://arxiv.org/abs/2211.09110)、[Model Cards](https://arxiv.org/abs/1810.03993)。

## 下一步

评测发现失败后，进入[错误分类与归因](/ai/inference-evaluation-safety/error-analysis)。
