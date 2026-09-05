---
title: 单工具 Agent 状态机实验
date: 2026-09-05
updated: 2026-09-05
type: lab
status: verified
track: ai
chapter: agents-and-systems
prerequisites: [/ai/agents-and-systems/reliability-and-multi-agent]
outcomes:
  - 能运行成功、一次超时重试和写入审批三条路径
  - 能用断言保证循环上限、终止状态和审批条件
  - 能扩展取消和永久失败而不产生开放状态
estimated: 50min
categories: [智能算法]
tags: [Agent, State Machine, Python]
description: 用标准库实现单工具状态机，并以断言验证成功、重试和审批路径全部闭环。
---

# 单工具 Agent 状态机实验

## 命题

模型可替换，但 Harness 的状态、审批、重试和终止不变量必须由确定性代码保证。实验使用 mock 场景，不访问外部系统、不产生副作用。

<ClientOnly><AgentLoopLabPlayground /></ClientOnly>

预期三条路径都以 `COMPLETED` 结束；timeout 恰好执行两次；write 必须经过 `WAITING_APPROVAL`。

## 反事实任务

1. 增加 `FORBIDDEN`，应直接进入 `FAILED` 且 attempts 为 0；
2. 增加 `CANCELLED` 事件，任何非终止状态都可安全关闭；
3. 删除循环上限，解释工具持续失败时的风险；
4. 为每次工具 attempt 增加唯一 ID 与共享幂等键；
5. 故意让重复完成事件到达，保证不会二次转移。

## 记录与通过条件

保存状态图、事件序列、断言结果和失败注入。所有路径必须进入 terminal state；审批前不得进入写工具；重试次数和总步数有上限。

## 常见失败

- while 循环只有成功出口；
- approval 是布尔变量但未持久化；
- 重试创建新的业务幂等身份；
- terminal state 仍接受工具结果；
- 事件日志没有 run/call/attempt 身份。

## 下一步

查阅[系统速查](/ai/agents-and-systems/reference)，完成[章节验收](/ai/agents-and-systems/review)。
