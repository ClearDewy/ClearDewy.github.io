---
title: 上下文、会话状态与长期记忆怎样区分
date: 2026-09-05
updated: 2026-09-05
type: lesson
status: learnable
track: ai
chapter: agents-and-systems
prerequisites: [/ai/agents-and-systems/agent-state-machine]
outcomes:
  - 能区分模型上下文、任务状态、长期记忆和外部知识
  - 能为持久事实定义来源、置信、过期、冲突与删除
  - 能设计上下文压缩而不丢失关键任务状态
estimated: 40min
categories: [智能算法]
tags: [Memory, Context, State]
description: 将本次推理上下文、任务状态、长期用户记忆和外部知识分开管理。
---

# 上下文、会话状态与长期记忆怎样区分

把全部历史塞进 Prompt 不是记忆系统。它缺少事实身份、冲突、过期、权限和删除。

| 对象 | 生命周期 | 事实来源 |
| --- | --- | --- |
| 模型上下文 | 一次推理 | 本轮组装的 token |
| 任务状态 | 一次任务/可恢复 | 状态机事件与工具结果 |
| 长期记忆 | 跨任务 | 经选择并获准保存的事实 |
| 外部知识 | 独立数据源 | 文档、数据库、API |

## 一条记忆记录

至少包含 subject、value、source、created_at、valid_from/to、confidence、scope、sensitivity、version 和 deletion key。模型推断应标成推断，不能伪装成用户明确提供。

## 冲突与过期

“用户所在城市”可能随时间变化。新值不应静默覆盖旧值；保存事件和生效时间，读取时按任务时间与来源优先级解析。无法判定时询问用户。

## 上下文压缩

压缩历史时保留：用户目标、已确认约束、已执行副作用、未决审批、关键工具结果、错误/重试预算。摘要是派生视图，原始审计事件仍需可追溯。

## 隐私边界

默认不把敏感信息长期保存。用户应能查看、更正和删除；记忆检索遵守当前身份与任务作用域，不能跨用户泄漏。

## 自测

<KnowledgeQuiz storage-key="memory-context-v1" :questions="[
 {id:'mc-1',type:'boolean',prompt:'模型上下文中的一句话会自动成为长期记忆。',answer:false,explanation:'持久化需要选择、权限与记录。'},
 {id:'mc-2',type:'single',prompt:'工具已经创建的日历事件应首先保存在哪里？',options:['显式任务状态/事件','模型参数','随机摘要'],answer:'显式任务状态/事件',explanation:'副作用必须可恢复与审计。'},
 {id:'mc-3',type:'open',prompt:'长期记忆冲突时如何处理？',rubric:['保留来源和版本','比较有效时间与作用域','不静默覆盖','无法确定时询问','支持更正删除'],reference:'把记忆当版本化事实，不当无来源字符串。'}
]" />

打印版答案：1. 错；2. 显式任务状态/事件；3. 来源、时间、冲突和用户控制。

## 下一步

进入[重试、审批与多 Agent](/ai/agents-and-systems/reliability-and-multi-agent)。
