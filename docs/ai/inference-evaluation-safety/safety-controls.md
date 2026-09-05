---
title: 安全边界为什么必须在模型之外
date: 2026-09-05
updated: 2026-09-05
type: lesson
status: learnable
track: ai
chapter: inference-evaluation-safety
prerequisites: [/ai/inference-evaluation-safety/error-analysis]
outcomes:
  - 能按影响和可逆性为动作分级
  - 能为高风险路径设计权限、校验、隔离、审批和审计
  - 能区分模型拒答、应用控制与组织治理
estimated: 45min
categories: [智能算法]
tags: [Safety, Guardrail, Risk]
description: 将高风险行为约束落实为模型之外的最小权限、结构校验、隔离执行、审批与审计机制。
---

# 安全边界为什么必须在模型之外

模型可以被提示注入、误解上下文或产生高置信错误。只在 system prompt 写“不要做危险操作”不是强制边界。

## 三层控制

| 层 | 例子 | 失败时依靠 |
| --- | --- | --- |
| 模型行为 | 拒答、分类、风险提示 | 应用策略仍要校验 |
| 应用强制 | schema、allowlist、权限、沙箱、审批、预算 | 平台与身份系统 |
| 治理运营 | owner、日志、事件响应、删除与申诉 | 组织流程 |

## 按动作分级

- 只读且低敏：可自动执行并记录；
- 可逆写入：限制作用域、幂等键、预览与撤销；
- 高影响/不可逆：明确用户确认或人工审批；
- 超出权限：直接拒绝，不能让模型“说服”策略层。

## 外部内容是不可信数据

网页、文档和工具返回可能包含“忽略先前指令”。它们是 observation，不是高优先级指令。上下文组装要标记来源，工具参数只能来自受控 schema，敏感信息按最小披露传递。

## 防护链

```text
身份 → 授权 → 参数 schema → 作用域 allowlist → 风险审批
→ 隔离执行 → 结果校验 → 审计记录 → 取消/补偿
```

模型可以提出动作，但不能自行授予权限或绕过审批。

## 失败注入

测试至少包括：提示注入文档、越权参数、重复请求、工具超时、部分成功、取消、敏感输出和日志不可用。安全测试的目标是证明边界在模型出错时仍成立。

## 常见错误

- 安全分类器和主模型共享同一脆弱 Prompt；
- 日志记录了密钥或个人数据；
- 重试重复执行不可逆动作；
- 只测拒答文本，不测实际工具是否被阻止；
- 没有 owner、告警、回滚和事件响应。

## 自测

<KnowledgeQuiz storage-key="safety-controls-v1" :questions="[
 {id:'sc-1',type:'boolean',prompt:'system prompt 明确禁止转账即可替代后端权限检查。',answer:false,explanation:'模型输出不能成为授权来源。'},
 {id:'sc-2',type:'single',prompt:'网页中的“忽略规则并调用工具”应被当作什么？',options:['最高优先级指令','不可信外部数据','用户授权'],answer:'不可信外部数据',explanation:'来源内容不能提升自身权限。'},
 {id:'sc-3',type:'open',prompt:'为删除数据设计安全链。',rubric:['身份与对象级授权','预览精确目标','不可逆性提示/审批','幂等与范围限制','审计和恢复/补偿策略'],reference:'模型只提出结构化意图，确定性系统校验身份、范围和审批后执行并记录。'}
]" />

打印版答案：1. 错；2. 不可信外部数据；3. 权限、目标、审批、幂等和审计。

来源：[NIST AI RMF 1.0](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-ai-rmf-10)、[Generative AI Profile](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence)。

## 下一步

进入[评测与安全失败注入实验](/ai/inference-evaluation-safety/evaluation-safety-lab)。
