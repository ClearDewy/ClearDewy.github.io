---
title: 轮询、中断与优先级怎样影响响应时间
date: 2026-09-05
updated: 2026-09-05
type: lesson
status: learnable
track: embedded
chapter: interrupts-and-realtime
prerequisites: [/embedded/peripherals-and-buses/gpio-timer-pwm-adc]
outcomes:
  - 能区分事件发生、检测、开始处理和完成时刻
  - 能解释中断优先级、嵌套与临界区的延迟来源
estimated: 50min
categories: [嵌入式]
tags: [Polling, Interrupt, Priority, ISR]
description: 用周期采样事件比较轮询和中断时间线，并解释优先级不等于任务重要性的简单排序。
---

# 轮询、中断与优先级怎样影响响应时间

## 四个时刻必须分开

```text
t_event  外设产生事件
t_detect 软件/中断控制器识别事件
t_start  处理函数真正开始
t_done   必要处理完成
```

响应延迟是 `t_start-t_event`，完成时间还包含执行和抢占。轮询的最坏检测延迟受循环周期影响；中断减少主动轮询，但仍有屏蔽窗口、高优先级中断、指令边界和现场保存开销。

<ClientOnly><InterruptTimelineDemo /></ClientOnly>

修改低优先级 ISR、高优先级 ISR 和临界区时间，观察 1 ms 截止期是否仍满足。不要只看平均值，要寻找最坏叠加。

## ISR 应做多少工作

ISR 需要确认来源、获取必要快照、清除/确认事件并把后续工作移交主循环或任务。过长 ISR 会阻塞同级/低级事件；过早清标志可能丢上下文，过晚清除可能重复进入。确切顺序取决于外设手册。

## 共享数据不是加 `volatile` 就结束

主循环与 ISR 并发访问多字节状态时，可能在更新一半时被抢占。需要根据对象选择：原子访问、短临界区、单生产者环形缓冲、消息队列或版本化快照。临界区虽然保护一致性，也会增加中断延迟。

## 常见误解

- 中断一定比轮询快；高频简单事件可能让中断开销更大；
- 优先级越高越安全；错误高优先级会饿死关键路径；
- ISR 里不能调用任何函数；真正约束是可重入性、阻塞、栈和最坏执行时间；
- 清除中断标志只是一行模板；不同外设可能读清、写一清零或要求特定顺序。

下一步：[定时器、DMA 与截止期](/embedded/interrupts-and-realtime/timer-dma-deadline)。
