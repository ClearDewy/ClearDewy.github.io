---
title: 定时器、DMA 与实时预算怎样协作
date: 2026-09-05
updated: 2026-09-05
type: lesson
status: learnable
track: embedded
chapter: interrupts-and-realtime
prerequisites: [/embedded/interrupts-and-realtime/polling-interrupt-priority]
outcomes:
  - 能画出定时触发 ADC 再由 DMA 搬运的数据路径
  - 能用最坏执行、阻塞与干扰检查截止期
estimated: 55min
categories: [嵌入式]
tags: [Timer, DMA, Deadline, Jitter]
description: 用 1 kHz 采样链解释硬件触发、DMA 缓冲、完成事件和最坏响应预算。
---

# 定时器、DMA 与实时预算怎样协作

## 把“采样一次”拆成硬件事件链

```text
Timer 比较事件 → ADC 开始采样/转换 → DMA 请求
→ DMA 搬到缓冲区 → 半满/全满事件 → CPU 处理一批数据
```

这样采样时刻不依赖 CPU 何时轮询，CPU 也不必为每个样本执行一次搬运。但 DMA 与 CPU 仍共享总线和内存，缓冲区所有权也必须明确。

## 双缓冲的所有权

当 DMA 写 A 区时 CPU 处理 B 区；交换时必须有一个明确事件。CPU 不能读取 DMA 正在改写的半区，也不能在缓存未同步的平台假设内存自动一致。

## 最坏响应预算

简化检查：

$$R = B + C + I$$

- `B`：被不可抢占临界区阻塞的最坏时间；
- `C`：本路径最坏执行时间；
- `I`：更高优先级工作造成的最坏干扰。

必须满足 `R ≤ D`（截止期）。平均执行 100 μs 并不能排除偶发 1.5 ms；测量应覆盖最坏输入、并发和较长运行时间，并为无法穷尽的路径保留分析余量。

## 丢事件与背压

如果生产速度长期高于处理速度，增大缓冲区只能推迟溢出。系统必须定义：覆盖旧数据、丢新数据、降低采样、阻塞上游还是进入故障状态，并记录计数器而不是静默丢失。

## 常见误解

- DMA 完全不占系统资源；它会占用总线并产生完成事件；
- 缓冲越大实时性越好；它增加可吸收突发，也增加延迟和内存；
- 任务按时开始等于按时完成；截止期通常约束可用结果；
- 用 GPIO 翻转测到一次很快，就证明所有路径都满足截止期。

下一步：[中断与截止期实验](/embedded/interrupts-and-realtime/interrupt-timing-lab)。
