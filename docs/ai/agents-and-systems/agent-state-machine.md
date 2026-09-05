---
title: Agent Loop 怎样成为显式状态机
date: 2026-09-05
updated: 2026-09-05
type: lesson
status: learnable
track: ai
chapter: agents-and-systems
prerequisites: [/ai/agents-and-systems/tool-protocol]
outcomes:
  - 能定义 Agent 的状态、事件、动作与终止条件
  - 能追踪成功、超时和等待审批三条路径
  - 能区分模型决策与 Harness 状态所有权
estimated: 45min
categories: [智能算法]
tags: [Agent Loop, State Machine, Harness]
description: 把模型—工具循环表示为显式状态机，确保成功、失败、等待、取消和恢复路径闭环。
---

# Agent Loop 怎样成为显式状态机

“让模型循环直到完成”缺少终止、失败和责任定义。状态机把每一步写成可观察契约。

<ClientOnly><AgentLoopDemo /></ClientOnly>

切换三个场景，观察模型只拥有“提出候选动作”，Harness 才拥有任务状态与执行许可。

## 四个元素

- state：当前完整状态，如 `WAITING_APPROVAL`；
- event：已发生事实，如 `TOOL_TIMED_OUT`；
- transition：给定状态与事件转到哪里；
- action/effect：转移时启动的外部工作。

状态不是日志文案。每个终止分支至少进入 `COMPLETED/FAILED/CANCELLED`，等待用户则进入可持久化 `WAITING_*`。

## 一轮循环

```text
读取目标与状态 → 构造模型上下文 → 模型提出 answer/tool/wait
→ 验证动作 → 执行/审批 → observation → 持久化状态
→ 检查完成、预算、取消 → 下一轮
```

轮次上限、token/成本预算和截止时间由 Harness 强制；模型说“继续”不能突破。

## 事件身份

一次工具调用应有稳定 invocation_id/tool_call_id；一次顶层任务有 run_id。重试沿用幂等身份但生成新的 attempt 记录。这样才能判断结果属于哪次调用并避免旧结果写入新状态。

## 常见错误

- `RUNNING` 同时表示模型、工具和整个任务；
- 等待审批只存在内存，重启后丢失；
- 工具完成事件重复到达导致二次转移；
- 取消只停止前端动画，没有传播到工具；
- 模型输出“完成”但没有验收条件；
- 失败后无限重试。

## 自测

<KnowledgeQuiz storage-key="agent-state-v1" :questions="[
 {id:'as-1',type:'boolean',prompt:'模型输出 finished 即可直接把任务标记成功。',answer:false,explanation:'Harness 还需验证完成条件和输出。'},
 {id:'as-2',type:'single',prompt:'等待用户批准时应进入什么？',options:['可持久化等待状态','无限模型循环','完成状态'],answer:'可持久化等待状态',explanation:'任务要能跨进程恢复。'},
 {id:'as-3',type:'open',prompt:'工具结果重复到达怎样保持状态正确？',rubric:['稳定调用身份','记录已处理 event/attempt','幂等转移','拒绝旧状态结果','审计重复事件'],reference:'Harness 用调用身份和当前状态只接受一次合法完成事件。'}
]" />

打印版答案：1. 错；2. 可持久化等待状态；3. 身份、幂等和当前状态校验。

来源：[ReAct](https://arxiv.org/abs/2210.03629)。

## 下一步

状态机需要持有事实，进入[上下文、会话状态与长期记忆](/ai/agents-and-systems/memory-and-context)。
