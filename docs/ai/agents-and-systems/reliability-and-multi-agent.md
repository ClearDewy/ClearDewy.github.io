---
title: 重试、审批与多 Agent 怎样保持可控
date: 2026-09-05
updated: 2026-09-05
type: lesson
status: learnable
track: ai
chapter: agents-and-systems
prerequisites: [/ai/agents-and-systems/memory-and-context]
outcomes:
  - 能为工具调用设计超时、重试、幂等、取消与补偿
  - 能判断动作何时需要用户审批
  - 能定义多 Agent 的任务、产物、共享状态和合并责任
estimated: 45min
categories: [智能算法]
tags: [Reliability, Approval, Multi-Agent]
description: 用有限重试、幂等、审批、预算和明确任务边界控制 Agent 及多 Agent 执行。
---

# 重试、审批与多 Agent 怎样保持可控

Agent 可靠性不是“多试几次”。每次重试都可能消耗预算、重复副作用或让旧结果覆盖新状态。

## 重试矩阵

| 错误 | 默认动作 |
| --- | --- |
| INVALID_ARGUMENT | 修正参数，有限次数 |
| FORBIDDEN | 不重试，报告权限 |
| TIMEOUT（只读） | 退避后有限重试 |
| TIMEOUT（写入） | 先按幂等键查询结果 |
| RATE_LIMITED | 尊重 retry-after 和总截止时间 |
| CANCELLED | 停止后续动作并清理 |

## 审批

高影响或不可逆动作在执行前展示精确目标、参数、预计影响和可撤销性。批准绑定到这次动作摘要；模型修改参数后应重新审批。

## 恢复

在外部调用前持久化 intent/call identity，完成后持久化 result。崩溃恢复时先查询调用状态，不盲目重复。补偿动作不是数据库回滚保证，必须单独测试。

## 什么时候使用多 Agent

只有任务可独立分解、并行收益高于通信成本、产物可验证且有明确合并 owner 时。为每个子任务定义输入、禁止范围、交付物、验收、预算和截止时间。

共享同一 Prompt 不等于共享一致状态。多 Agent 需要版本化事实、冲突检测和最终责任方；增加角色可能只增加重复劳动与上下文成本。

## 评测

报告任务成功、步骤数、工具错误、重试、人工介入、副作用、成本和恢复成功率。只评最终文字会漏掉越权尝试和不必要调用。

## 自测

<KnowledgeQuiz storage-key="agent-reliability-v1" :questions="[
 {id:'ar-1',type:'single',prompt:'写操作超时后首先应做什么？',options:['无条件重试','按幂等身份查询是否已执行','换模型'],answer:'按幂等身份查询是否已执行',explanation:'超时不代表未执行。'},
 {id:'ar-2',type:'boolean',prompt:'模型改变已批准动作参数后，原审批仍自动有效。',answer:false,explanation:'审批应绑定精确动作。'},
 {id:'ar-3',type:'open',prompt:'委派一个子 Agent 的任务卡必须包含什么？',rubric:['明确输入和目标','作用域/禁止项','交付物','验收证据','预算/截止','合并 owner'],reference:'可独立执行且可验证，并明确谁负责最终整合。'}
]" />

打印版答案：1. 查询状态；2. 错；3. 输入、边界、交付、验收、预算和 owner。

来源：[AgentBench](https://arxiv.org/abs/2308.03688)。

## 下一步

进入[单工具 Agent 状态机实验](/ai/agents-and-systems/agent-loop-lab)。
