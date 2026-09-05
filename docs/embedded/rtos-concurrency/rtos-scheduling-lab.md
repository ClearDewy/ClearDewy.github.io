---
title: RTOS 调度与阻塞实验
date: 2026-09-05
updated: 2026-09-05
type: lab
status: learnable
track: embedded
chapter: rtos-concurrency
prerequisites: [/embedded/rtos-concurrency/synchronization-memory]
outcomes:
  - 能逐 tick 解释任务状态和运行选择
  - 能识别忙等待、优先级反转与队列背压
estimated: 45min
categories: [嵌入式]
tags: [Lab, RTOS, Scheduling]
description: 操作三任务调度模型，观察事件唤醒、抢占、阻塞和数据队列状态。
---

# RTOS 调度与阻塞实验

## 环境与命题

浏览器使用固定三任务、单核、抢占式优先级模型。它验证状态转换，不模拟具体 RTOS 的全部 API、临界区和时钟开销。

<ClientOnly><RtosSchedulerDemo /></ClientOnly>

## 步骤

1. 重置后逐 tick，记录 RUNNING 任务和队列长度；
2. 触发“新样本”，确认处理任务从 BLOCKED 到 READY，并抢占较低优先级任务；
3. 暂停处理任务，连续产生样本，观察队列积压；
4. 恢复处理任务，确认积压只能在消费速度足够时下降；
5. 为真实系统补充 trace 字段：tick、task、from/to state、reason、queue depth、runtime。

预期：没有数据时处理/通信任务阻塞；事件到达只使任务就绪，调度器再选择运行者；队列容量不能替代背压策略。

下一步：[速查](/embedded/rtos-concurrency/reference)和[验收](/embedded/rtos-concurrency/review)。
