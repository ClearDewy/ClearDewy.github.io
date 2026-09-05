---
title: 工具调用为什么是一份协议
date: 2026-09-05
updated: 2026-09-05
type: lesson
status: learnable
track: ai
chapter: agents-and-systems
prerequisites: [/ai/agents-and-systems/retrieval-evaluation]
outcomes:
  - 能定义工具名称、参数、返回、错误、副作用与权限
  - 能区分模型提出调用、Harness 校验和工具执行
  - 能用幂等键、超时与结构化错误处理重试
estimated: 45min
categories: [智能算法]
tags: [Tool Calling, Schema, Protocol]
description: 将模型工具调用拆成候选动作、确定性校验、隔离执行和结构化 observation。
---

# 工具调用为什么是一份协议

模型输出 `create_event(...)` 只是文本形式的候选动作，不是授权，也不是已经执行。

## 工具契约

```text
name: calendar.create_event
input schema: title, starts_at, timezone
output: event_id, normalized_time
errors: INVALID_ARGUMENT | FORBIDDEN | TIMEOUT | CONFLICT
side effect: creates calendar event
idempotency: required
permission: calendar.write
```

描述必须让模型知道何时用，也让软件能确定性校验。自由文本参数应尽量转换为枚举、时间戳、对象 ID 和范围受限字段。

## 三方责任

| 角色 | 负责 |
| --- | --- |
| 模型 | 根据上下文提出工具与参数 |
| Harness | schema、权限、审批、预算、幂等、超时 |
| Tool | 执行明确操作并返回结构化结果/错误 |

工具返回是 observation，可能不可信、过期或包含注入文本，不能升级为系统指令。

## 错误语义

超时不等于未执行；网络断开前服务可能已完成写入。因此写操作重试需要幂等键或先查询结果。`FORBIDDEN` 通常不应自动重试，`INVALID_ARGUMENT` 应让模型修正参数，暂时性错误才进入有限退避。

## 结果进入上下文

保留 tool_call_id、tool 名、参数摘要、状态、返回 schema、开始/结束时间和错误分类。敏感字段先脱敏；大结果保存外部引用，Prompt 中只放必要摘要。

## 常见错误

- 工具描述隐藏副作用；
- 模型生成的用户 ID 未做对象级权限校验；
- 所有错误都变成一段自然语言；
- 写操作无幂等键自动重试；
- 工具返回中的指令覆盖系统规则；
- 成功返回没有稳定结果 ID。

## 自测

<KnowledgeQuiz storage-key="tool-protocol-v1" :questions="[
 {id:'tp-1',type:'boolean',prompt:'模型生成合法 JSON 就表示工具已获授权。',answer:false,explanation:'schema 合法和权限允许是两件事。'},
 {id:'tp-2',type:'single',prompt:'写操作超时后安全重试最需要什么？',options:['更高 temperature','幂等键或结果查询','更长 Prompt'],answer:'幂等键或结果查询',explanation:'超时不代表服务端未执行。'},
 {id:'tp-3',type:'open',prompt:'定义一个只读政策搜索工具。',rubric:['name/description','query 与过滤 schema','权限范围','结构化结果和来源','错误码/超时','无副作用声明'],reference:'契约同时服务模型选择与软件校验。'}
]" />

打印版答案：1. 错；2. 幂等键或结果查询；3. 输入、输出、权限、错误和副作用。

来源：[Toolformer](https://arxiv.org/abs/2302.04761)。

## 下一步

工具协议明确后，进入[Agent Loop 状态机](/ai/agents-and-systems/agent-state-machine)。
