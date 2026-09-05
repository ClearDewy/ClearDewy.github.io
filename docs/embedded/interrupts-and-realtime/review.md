---
title: 第 4 章复习与验收
date: 2026-09-05
updated: 2026-09-05
type: review
status: learnable
track: embedded
chapter: interrupts-and-realtime
prerequisites: [/embedded/interrupts-and-realtime/interrupt-timing-lab]
outcomes:
  - 能计算响应预算并解释延迟来源
  - 能设计中断与 DMA 的所有权和溢出边界
estimated: 60min
categories: [嵌入式]
tags: [Review, Realtime, DMA]
description: 通过时间线、预算和缓冲所有权验收中断、DMA 与实时性知识。
---

# 第 4 章复习与验收

<KnowledgeQuiz storage-key="embedded-realtime-review-v1" :questions="[
 {id:'i1',type:'boolean',prompt:'使用中断就能保证事件立即得到处理。',answer:false,explanation:'仍存在屏蔽、优先级干扰、指令边界和现场保存。'},
 {id:'i2',type:'fill',prompt:'B=80、C=240、I=180 μs 时，简化最坏响应 R 是多少 μs？',answer:['500'],explanation:'R=B+C+I。'},
 {id:'i3',type:'boolean',prompt:'DMA 搬运数据时完全不占总线资源。',answer:false,explanation:'DMA 仍参与总线仲裁。'},
 {id:'i4',type:'single',prompt:'生产长期快于消费时，单纯扩大缓冲区会怎样？',options:['永久解决','推迟溢出','提高 ADC 精度'],answer:'推迟溢出',explanation:'还必须定义背压或丢弃策略。'},
 {id:'i5',type:'open',prompt:'设计 1 kHz ADC DMA 双缓冲的状态与证据。',rubric:['定时触发','DMA 写入半区','半满/全满事件','CPU 与 DMA 所有权分离','处理截止期','溢出计数和策略','GPIO/trace 测量点'],reference:'必须说明每个半区何时由 DMA 或 CPU 拥有，以及超期怎样被检测。'}
]" />

实作：为一次偶发 1.4 ms 延迟画出 `B/C/I` 来源树并设计复现实验。达到 8/10 后进入[RTOS](/embedded/rtos-concurrency)。
