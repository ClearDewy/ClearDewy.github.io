---
title: 队列、互斥、事件与栈怎样管理资源
date: 2026-09-05
updated: 2026-09-05
type: lesson
status: learnable
track: embedded
chapter: rtos-concurrency
prerequisites: [/embedded/rtos-concurrency/tasks-and-scheduler]
outcomes:
  - 能根据数据流和资源所有权选择队列、信号量或互斥锁
  - 能解释优先级反转、死锁和任务栈溢出
estimated: 60min
categories: [嵌入式]
tags: [Queue, Mutex, Semaphore, Stack]
description: 用采样流水线区分消息传递、事件同步、资源互斥和每任务栈边界。
---

# 队列、互斥、事件与栈怎样管理资源

## 先问传递数据还是保护资源

| 原语 | 表达什么 | 不适合替代什么 |
| --- | --- | --- |
| Queue | 带所有权/副本的数据消息 | 长时间共享可变对象 |
| Binary semaphore | 某事件已经发生 | 需要所有者语义的互斥 |
| Counting semaphore | 可用资源或累计事件数量 | 携带完整消息内容 |
| Mutex | 同一时刻一个任务拥有资源 | ISR 通知、跨任务释放 |
| Event flags | 一组条件位 | 排队保存每次数据 |

固定流水线优先用队列把 `sample` 从采样任务交给处理任务，再把结果交给通信任务。这样数据所有权跟消息移动，不需要三个任务同时改一个全局结构。

## 优先级反转

低优先级任务持有 mutex，高优先级任务等待该 mutex，中优先级任务又持续抢占低任务，高任务就被间接阻塞。优先级继承可以临时提升锁持有者，缩短反转；它不能修复长临界区、锁循环或错误资源边界。

## 死锁需要四个条件

互斥、持有并等待、不可抢占、循环等待同时存在时可能死锁。工程上常用全局锁顺序、单 owner 任务、超时与失败恢复降低风险，但超时不是自动恢复：资源状态可能仍需要回滚。

## 每个任务都有栈预算

任务栈容纳调用帧、局部变量和保存现场。深调用、大型局部数组、格式化函数和异常路径都可能增加峰值。高水位只能说明已运行路径，应配合静态分析、边界填充、MPU/保护和故障注入。

## 常见误解

- 用 mutex 从 ISR 发送事件；ISR 通常不能阻塞且不具备任务所有权；
- 看到队列满就无限阻塞生产者，导致更高层截止期失守；
- 认为 heap 分配成功一次就长期安全；碎片、并发和峰值仍需检查；
- 把共享变量加 `volatile` 作为同步方案。

下一步：[RTOS 调度与阻塞实验](/embedded/rtos-concurrency/rtos-scheduling-lab)。
