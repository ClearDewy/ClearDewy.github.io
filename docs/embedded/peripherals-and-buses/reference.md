---
title: 外设与串行总线速查
date: 2026-09-05
updated: 2026-09-05
type: reference
status: verified
track: embedded
chapter: peripherals-and-buses
categories: [嵌入式]
tags: [Reference, Peripheral, Bus]
description: 汇总 GPIO 定时器 PWM ADC UART I2C SPI 的核心对象、配置与失效边界。
---

# 外设与串行总线速查

```text
Timer 更新频率 = TimerClock / ((PSC+1)(ARR+1))
PWM 占空比（常见向上计数模型）≈ CCR / (ARR+1)
UART 位时间 = 1 / baud
ADC 理想码 = round(Vin/Vref × (2^N-1))
```

| 接口 | 必记对象 | 首要外部证据 |
| --- | --- | --- |
| GPIO | 复用、方向、类型、上下拉、速度 | 引脚电压 |
| Timer/PWM | 时钟、预分频、周期、比较、极性 | 周期与占空比 |
| ADC | 通道、Vref、采样时间、触发、校准 | 输入电压与原始码 |
| UART | baud、数据位、校验、停止位 | 帧时长与错误标志 |
| I²C | 开漏上拉、地址、方向、ACK | START/STOP、ACK、上升时间 |
| SPI | CS、CPOL/CPHA、位序、字长 | 采样边沿与全双工数据 |

不要跨协议套用语义：I²C 有 ACK 不代表应用命令成功；SPI 收到字节不代表存在统一校验；UART 逻辑电平也不等于 RS-232 电气层。

关联：[GPIO/Timer/PWM/ADC](/embedded/peripherals-and-buses/gpio-timer-pwm-adc) · [串行协议](/embedded/peripherals-and-buses/uart-i2c-spi) · [波形实验](/embedded/peripherals-and-buses/protocol-waveform-lab)。
