---
title: 4. 中断、DMA 与实时性
date: 2026-09-05
updated: 2026-09-05
type: overview
status: learnable
track: embedded
categories: [嵌入式]
tags: [Interrupt, DMA, Realtime, Timing]
description: 从轮询和中断响应进入优先级、临界区、定时器、DMA 与最坏响应时间分析。
---

# 4. 中断、DMA 与实时性

“平均很快”不等于“每次都按时”。本章用 1 kHz 传感器采样案例回答：事件什么时候发生、CPU 什么时候开始处理、何时完成、超期后系统怎样发现？

| 顺序 | 页面 | 完成证据 |
| ---: | --- | --- |
| 1 | [轮询、中断与优先级怎样影响响应](/embedded/interrupts-and-realtime/polling-interrupt-priority) | 能画出事件、延迟、ISR 与抢占时间线 |
| 2 | [定时器、DMA 与实时预算怎样协作](/embedded/interrupts-and-realtime/timer-dma-deadline) | 能拆分采样路径并计算最坏预算 |
| 3 | [中断与截止期实验](/embedded/interrupts-and-realtime/interrupt-timing-lab) | 修改执行时间并识别丢事件与超期 |
| 4 | [实时性速查](/embedded/interrupts-and-realtime/reference) | 查询延迟、抖动、临界区和 DMA 边界 |
| 5 | [复习与验收](/embedded/interrupts-and-realtime/review) | 完成时间线和并发故障诊断 |

本章讨论单核 MCU 的基础时间模型，不展开形式化调度理论。完成后进入[RTOS](/embedded/rtos-concurrency)。
