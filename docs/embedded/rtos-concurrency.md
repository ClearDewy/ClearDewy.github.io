---
title: 5. RTOS、并发与资源管理
date: 2026-09-05
updated: 2026-09-05
type: overview
status: learnable
track: embedded
categories: [嵌入式]
tags: [RTOS, Scheduler, Synchronization]
description: 从可运行、就绪和阻塞状态进入优先级调度、队列、互斥、事件、栈与实时并发故障。
---

# 5. RTOS、并发与资源管理

RTOS 不会让单核 CPU 同时执行多个任务；它在明确事件上保存一个任务现场、恢复另一个任务，并提供同步对象。本章用采样、处理、通信三个任务解释“谁在何时拥有 CPU 和数据”。

| 顺序 | 页面 | 完成证据 |
| ---: | --- | --- |
| 1 | [任务状态与调度器怎样选择运行者](/embedded/rtos-concurrency/tasks-and-scheduler) | 能追踪 READY/RUNNING/BLOCKED 与抢占 |
| 2 | [队列、互斥、事件与栈怎样管理资源](/embedded/rtos-concurrency/synchronization-memory) | 能为数据和资源选择同步原语 |
| 3 | [RTOS 调度与阻塞实验](/embedded/rtos-concurrency/rtos-scheduling-lab) | 修改任务执行与阻塞，识别饿死和反转 |
| 4 | [RTOS 速查](/embedded/rtos-concurrency/reference) | 查询状态、原语和失败模式 |
| 5 | [复习与验收](/embedded/rtos-concurrency/review) | 完成并发架构与故障诊断 |

只有任务确实需要独立生命周期、阻塞等待或优先级时才引入 RTOS。固定顺序的简单设备可以继续使用主循环状态机。完成后进入[原理图、PCB 与硬件设计](/embedded/hardware-design)。
