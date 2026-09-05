---
title: 3. 外设、采样与串行通信
date: 2026-09-05
updated: 2026-09-05
type: overview
status: learnable
track: embedded
categories: [嵌入式]
tags: [GPIO, ADC, PWM, UART, I2C, SPI]
description: 从 GPIO、定时器、PWM 和 ADC 进入 UART、I2C、SPI，建立寄存器、引脚与波形的统一观察方法。
---

# 3. 外设、采样与串行通信

CPU 不直接“看见按钮”或“把字节发到传感器”。外设状态机在引脚与总线协议之间转换，CPU 通过寄存器、FIFO、事件和 DMA 与它们协作。

固定系统：周期采样一个模拟传感器，经 UART 输出，同时通过 I²C 读取配置、用 SPI 访问高速设备。

| 顺序 | 页面 | 完成证据 |
| ---: | --- | --- |
| 1 | [GPIO、定时器、PWM 与 ADC 怎样连接物理世界](/embedded/peripherals-and-buses/gpio-timer-pwm-adc) | 能从引脚模式追踪到采样码或 PWM 波形 |
| 2 | [UART、I²C 与 SPI 怎样传输数据](/embedded/peripherals-and-buses/uart-i2c-spi) | 能读出帧、时钟、寻址和线方向 |
| 3 | [外设与协议波形实验](/embedded/peripherals-and-buses/protocol-waveform-lab) | 能从波形定位配置和协议错误 |
| 4 | [外设与总线速查](/embedded/peripherals-and-buses/reference) | 查询对象、边界和选择依据 |
| 5 | [复习与验收](/embedded/peripherals-and-buses/review) | 完成采样与通信故障归因 |

过关不是背诵“哪个协议更快”，而是能从需求推导线数、方向、时钟、帧、速率、电气层和错误证据。完成后进入[中断、DMA 与实时性](/embedded/interrupts-and-realtime)。
