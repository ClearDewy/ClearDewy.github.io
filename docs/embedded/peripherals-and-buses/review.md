---
title: 第 3 章复习与验收
date: 2026-09-05
updated: 2026-09-05
type: review
status: learnable
track: embedded
chapter: peripherals-and-buses
prerequisites: [/embedded/peripherals-and-buses/protocol-waveform-lab]
outcomes:
  - 能设计定时采样与 PWM 输出路径
  - 能读 UART I2C SPI 波形并分类故障
estimated: 60min
categories: [嵌入式]
tags: [Review, Peripheral, Protocol]
description: 通过采样链设计、波形判读与故障归因验收 MCU 外设和串行总线知识。
---

# 第 3 章复习与验收

<KnowledgeQuiz storage-key="embedded-bus-review-v1" :questions="[
 {id:'p1',type:'boolean',prompt:'50% PWM 对所有负载都等价于一半功率。',answer:false,explanation:'负载动态和驱动拓扑决定实际响应。'},
 {id:'p2',type:'single',prompt:'I2C 高电平通常由什么产生？',options:['上拉电阻','所有设备推挽拉高','UART 停止位'],answer:'上拉电阻',explanation:'设备使用开漏方式主动拉低。'},
 {id:'p3',type:'single',prompt:'SPI 的 CPOL/CPHA 主要决定什么？',options:['时钟空闲电平和采样边沿','设备 I2C 地址','ADC 参考电压'],answer:'时钟空闲电平和采样边沿',explanation:'两端模式必须匹配。'},
 {id:'p4',type:'boolean',prompt:'逻辑分析仪显示正确字节就足以证明信号完整性。',answer:false,explanation:'模拟幅度、边沿和过冲需要示波器。'},
 {id:'p5',type:'open',prompt:'I2C 设备持续 NACK，写出分层排查顺序。',rubric:['供电与公共地','SDA/SCL 电压和上拉','设备地址与方向位','引脚复用和时钟','START/时钟/ACK 波形','设备复位和时序要求','上层寄存器协议'],reference:'先电气和波形，再配置与设备状态，最后解释上层命令。'}
]" />

实作：为“1 kHz 定时触发 ADC，采样结果经 UART 发送”画出事件与数据路径，并写出至少四个可测量时间点。达到 8/10 后进入[中断、DMA 与实时性](/embedded/interrupts-and-realtime)。
