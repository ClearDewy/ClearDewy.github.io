---
title: 第 5 章复习与验收
date: 2026-09-05
updated: 2026-09-05
type: review
status: learnable
track: embedded
chapter: rtos-concurrency
prerequisites: [/embedded/rtos-concurrency/rtos-scheduling-lab]
outcomes:
  - 能设计任务、队列和共享资源边界
  - 能诊断饿死、反转、死锁、溢出与背压
estimated: 60min
categories: [嵌入式]
tags: [Review, RTOS, Concurrency]
description: 通过状态追踪、原语选择和并发故障分析验收 RTOS 基础。
---

# 第 5 章复习与验收

<KnowledgeQuiz storage-key="embedded-rtos-review-v1" :questions="[
 {id:'r1',type:'boolean',prompt:'单核 MCU 上多个任务会在同一时刻真正并行执行。',answer:false,explanation:'调度器在任务间切换，任一时刻只有一个任务运行。'},
 {id:'r2',type:'single',prompt:'传递带内容的传感器样本优先使用什么？',options:['队列','mutex','禁用全部中断'],answer:'队列',explanation:'队列同时表达消息和缓冲。'},
 {id:'r3',type:'boolean',prompt:'BLOCKED 表示任务优先级最低。',answer:false,explanation:'它表示当前不具备运行条件。'},
 {id:'r4',type:'single',prompt:'低任务持锁、高任务等待、中任务持续抢占是什么？',options:['优先级反转','量化误差','UART 错帧'],answer:'优先级反转',explanation:'中任务延迟了低任务释放高任务所需资源。'},
 {id:'r5',type:'open',prompt:'设计采样、处理、通信三任务的状态与数据所有权。',rubric:['任务释放条件','明确优先级依据','队列传递样本','无数据时阻塞','队列满策略','截止期和运行时间','栈与故障证据'],reference:'重点是事件、所有权和失败策略，不是把每个函数都变成任务。'}
]" />

实作：给出一次高优先级任务超期的 trace，并从锁、队列、ISR、栈和调度五类原因逐一排除。达到 8/10 后进入[硬件设计](/embedded/hardware-design)。
