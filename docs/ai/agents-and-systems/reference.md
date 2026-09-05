---
title: 检索与 Agent 系统速查
date: 2026-09-05
updated: 2026-09-05
type: reference
status: verified
track: ai
chapter: agents-and-systems
categories: [智能算法]
tags: [RAG, Agent, Tools, Reference]
description: 查询 RAG 层级、工具契约、Agent 状态、记忆字段、重试审批和可观测性不变量。
---

# 检索与 Agent 系统速查

## RAG

索引：解析 → 切块 → Embedding → 索引 + 来源/版本/ACL。查询：召回 → 重排 → 权限过滤 → 上下文 → 回答 → 引用。

评测分层：corpus coverage、recall@k/MRR、context quality、answer correctness/citation support。

## 工具契约

name、description、input schema、output schema、error codes、side effect、permission、timeout、idempotency。

模型提出动作；Harness 校验并持有状态；Tool 执行并产生 observation。

## 状态

`READY/DECIDING/VALIDATING/RUNNING/OBSERVING/WAITING_*/RETRY_WAIT/COMPLETED/FAILED/CANCELLED`。每个非终止状态必须有事件驱动出口。

身份：run_id、tool_call/invocation_id、attempt、idempotency_key、event_id。

## 记忆

subject、value、source、created_at、valid_from/to、confidence、scope、sensitivity、version、deletion key。

上下文、任务状态、长期记忆和外部知识分开存储与授权。

## 可靠性

- 写超时先查状态，不盲目重试；
- FORBIDDEN 不自动重试；
- 审批绑定精确动作摘要；
- 预算、轮次、截止时间由 Harness 强制；
- 取消传播到工具并释放资源；
- 多 Agent 有明确输入、边界、交付、验收和合并 owner。

## Trace

记录模型/Prompt、检索候选与最终上下文、工具参数/返回、状态事件、审批、token/延迟/成本、最终结果与副作用。敏感数据按最小披露和保留策略处理。

来源：[RAG](https://arxiv.org/abs/2005.11401)、[ReAct](https://arxiv.org/abs/2210.03629)、[Toolformer](https://arxiv.org/abs/2302.04761)、[AgentBench](https://arxiv.org/abs/2308.03688)。
