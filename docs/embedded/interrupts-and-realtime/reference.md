---
title: 中断、DMA 与实时性速查
date: 2026-09-05
updated: 2026-09-05
type: reference
status: verified
track: embedded
chapter: interrupts-and-realtime
categories: [嵌入式]
tags: [Reference, Interrupt, DMA, Realtime]
description: 汇总事件时间点、中断规则、DMA 缓冲所有权和截止期检查字段。
---

# 中断、DMA 与实时性速查

`响应延迟=t_start-t_event`；`完成延迟=t_done-t_event`；`抖动=max(period)-min(period)`；简化预算 `R=B+C+I≤D`。

ISR 检查：来源、确认/清标志顺序、最坏执行时间、是否阻塞、共享数据、栈、嵌套与优先级。DMA 检查：源/目的、宽度、计数、触发、半/全完成、缓冲所有权、缓存一致性、错误和溢出策略。

“实时”表示在规定时间边界内产生正确结果，不等于高吞吐或高主频。`volatile` 不提供原子性；禁中断临界区必须纳入阻塞时间。

关联：[中断与优先级](/embedded/interrupts-and-realtime/polling-interrupt-priority) · [DMA 与预算](/embedded/interrupts-and-realtime/timer-dma-deadline) · [实验](/embedded/interrupts-and-realtime/interrupt-timing-lab)。
