---
title: 怎样分类错误并归因改进
date: 2026-09-05
updated: 2026-09-05
type: lesson
status: learnable
track: ai
chapter: inference-evaluation-safety
prerequisites: [/ai/inference-evaluation-safety/evaluation-design]
outcomes:
  - 能把端到端失败分解为输入、模型、检索、工具、控制和评分错误
  - 能用最小对照定位责任层而非同时修改多个变量
  - 能建立互斥优先的错误标签与修复闭环
estimated: 40min
categories: [智能算法]
tags: [Error Analysis, Attribution, Debugging]
description: 用分层错误分类和受控消融定位系统失败，决定该改数据、模型、检索、工具还是控制流程。
---

# 怎样分类错误并归因改进

“回答错了”不是可执行诊断。同一句错误可能因为文档未召回、模型忽略证据、工具超时、Prompt 截断或评分器判错。

## 责任链

```text
输入/任务定义 → 上下文构造 → 模型决策 → 工具/检索执行
→ 输出校验 → 评分器
```

为每条失败先标一个主因，再允许次因：输入歧义、知识缺失、推理/计算、检索召回、重排/上下文、工具、权限、格式、超时、评分错误。

## 最小对照

政策日期回答错误时依次问：

1. 正确文档是否在语料？
2. 给定 query，是否进入候选集合？
3. 是否排到可见上下文？
4. 模型是否引用并遵循它？
5. 输出解析/评分是否正确？

可以做 oracle 对照：手工把正确文档放入上下文。若仍错误，更可能是生成/指令问题；若变正确，更可能是检索链路。

## 修复必须对应层

检索没召回不应首先调 temperature；工具权限错误不应重训模型；评分器错误不应污染训练数据。一次实验只改变一个主要因素并回归其他类别。

## 错误分类表

保存 sample_id、主因/次因、证据位置、严重度、可复现条件、修复 owner、相关变更和回归测试。每次版本比较看错误迁移，而非只看总体分数。

## 常见错误

- 标签含义重叠，评审者无法一致选择；
- 只看成功样本，没有抽查假阳性；
- 看到最终回答就猜原因，不检查 trace；
- 修复一个类别导致另一类别回归却没报告；
- 把 judge 输出当事实而不复核争议样本。

## 自测

<KnowledgeQuiz storage-key="error-analysis-v1" :questions="[
 {id:'ea-1',type:'single',prompt:'正确文档未进入 top-k，首先应归入哪层？',options:['检索召回','采样温度','模型参数存储'],answer:'检索召回',explanation:'生成模型尚未看到证据。'},
 {id:'ea-2',type:'boolean',prompt:'为了更快定位问题，可以同时更换模型、Prompt 和索引。',answer:false,explanation:'多变量同时变化会破坏归因。'},
 {id:'ea-3',type:'open',prompt:'解释 oracle context 对照怎样定位 RAG 错误。',rubric:['手工提供正确证据','保持模型和 Prompt 不变','比较原检索上下文','结果改善指向检索','仍失败指向生成/任务定义'],reference:'只替换上下文为正确证据，观察答案变化。'}
]" />

打印版答案：1. 检索召回；2. 错；3. 固定其他条件替换为 oracle 证据。

## 下一步

错误分类还不能阻止伤害，下一课学习[模型之外的安全控制](/ai/inference-evaluation-safety/safety-controls)。
