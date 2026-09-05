---
title: 中断响应与截止期实验
date: 2026-09-05
updated: 2026-09-05
type: lab
status: learnable
track: embedded
chapter: interrupts-and-realtime
prerequisites: [/embedded/interrupts-and-realtime/timer-dma-deadline]
outcomes:
  - 能修改阻塞、执行与干扰时间并判断截止期
  - 能为丢事件、缓冲溢出和长临界区设计证据
estimated: 45min
categories: [嵌入式]
tags: [Lab, Interrupt, Realtime]
description: 在可修改时间线中验证响应预算，并把浏览器结果迁移为示波器或 trace 测量方案。
---

# 中断响应与截止期实验

## 固定命题

截止期 1000 μs，检查 `R=B+C+I`。浏览器模型使用确定性单次最坏叠加，不包含复杂抢占恢复和总线抖动。

<ClientOnly><InterruptTimelineDemo /></ClientOnly>

## 步骤

1. 基线 `B=80、C=240、I=180 μs`，预测余量；
2. 把临界区增加到 650 μs，判断是否超期；
3. 恢复基线，只提高高优先级干扰，找出刚好超期的边界；
4. 写出三处 GPIO 翻转或 trace 时间戳：事件入口、ISR 开始、结果完成；
5. 为 DMA 半缓冲增加生产/消费计数器，定义溢出策略。

基线实际结果 `R=500 μs`、余量 `500 μs`。浏览器只验证预算算术；真实系统还需测量 WCET、嵌套、中断屏蔽、缓存/总线和时钟误差。

下一步：[速查](/embedded/interrupts-and-realtime/reference)与[验收](/embedded/interrupts-and-realtime/review)。
