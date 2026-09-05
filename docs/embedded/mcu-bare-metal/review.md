---
title: 第 2 章复习与验收
date: 2026-09-05
updated: 2026-09-05
type: review
status: learnable
track: embedded
chapter: mcu-bare-metal
prerequisites: [/embedded/mcu-bare-metal/firmware-evidence-lab]
outcomes:
  - 能追踪 MCU 复位到 GPIO 的完整路径
  - 能分层诊断构建、烧录、启动、配置与物理故障
estimated: 60min
categories: [嵌入式]
tags: [Review, MCU, Firmware]
description: 通过文档定位、启动追踪和 GPIO 故障树验收裸机固件知识。
---

# 第 2 章复习与验收

<KnowledgeQuiz storage-key="embedded-mcu-review-v1" :questions="[
 {id:'m1',type:'single',prompt:'板载 LED 连接到哪个 MCU 引脚，首先查什么？',options:['板卡原理图','CPU 指令集','C 标准'],answer:'板卡原理图',explanation:'板级连接由原理图定义。'},
 {id:'m2',type:'boolean',prompt:'MCU 复位后通常直接从 C 的 main 第一行开始。',answer:false,explanation:'向量和启动代码先建立运行环境。'},
 {id:'m3',type:'single',prompt:'.bss 的典型启动动作是什么？',options:['从 Flash 复制','清零 SRAM 区域','写入 GPIO'],answer:'清零 SRAM 区域',explanation:'未显式初始化的静态存储期对象需要零初始化。'},
 {id:'m4',type:'boolean',prompt:'volatile 能保证两个上下文的读改写原子。',answer:false,explanation:'它主要约束编译器优化，不提供互斥。'},
 {id:'m5',type:'open',prompt:'寄存器显示 LED 输出已置位，但 LED 不亮。给出分层诊断。',rubric:['确认固件和硬件身份','核对原理图与点亮极性','检查端口时钟','检查复用和模式','测量引脚电压','检查限流和 LED 极性','区分寄存器与物理证据'],reference:'从身份和配置读回到引脚、电阻、LED 逐层推进，不应只重复写寄存器。'}
]" />

实作：画出 `复位 → main → GPIO 寄存器 → 输出驱动 → 引脚 → LED`；为每条箭头写一种证据。覆盖全部七层且无危险接法视为通过。

下一步：[外设与串行通信](/embedded/peripherals-and-buses)。
