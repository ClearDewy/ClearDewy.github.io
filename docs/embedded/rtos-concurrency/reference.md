---
title: RTOS、并发与资源管理速查
date: 2026-09-05
updated: 2026-09-05
type: reference
status: verified
track: embedded
chapter: rtos-concurrency
categories: [嵌入式]
tags: [Reference, RTOS, Synchronization]
description: 汇总任务状态、调度条件、同步原语、优先级反转和内存检查项。
---

# RTOS、并发与资源管理速查

状态：RUNNING 正在执行；READY 可运行但未获 CPU；BLOCKED 等待事件/时间；SUSPENDED 被显式挂起。单核任一时刻最多一个 RUNNING。

选择：传数据用队列；通知事件用信号量/通知；保护有所有者的共享资源用 mutex；组合条件用 event flags。ISR 使用明确的 ISR-safe API，不能进行阻塞等待。

必查：任务周期/截止期/优先级、WCET、阻塞来源、栈高水位、队列深度与溢出、锁顺序、优先级继承、heap 峰值和重启恢复。

关联：[任务与调度](/embedded/rtos-concurrency/tasks-and-scheduler) · [同步与内存](/embedded/rtos-concurrency/synchronization-memory) · [实验](/embedded/rtos-concurrency/rtos-scheduling-lab)。具体语义以所选 RTOS 版本文档为准。
