---
title: UART、I²C 与 SPI 怎样传输数据
date: 2026-09-05
updated: 2026-09-05
type: lesson
status: learnable
track: embedded
chapter: peripherals-and-buses
prerequisites: [/embedded/peripherals-and-buses/gpio-timer-pwm-adc]
outcomes:
  - 能从波形识别 UART 帧和 I2C SPI 事务阶段
  - 能根据拓扑、速率、电气层与错误检测选择接口
estimated: 60min
categories: [嵌入式]
tags: [UART, I2C, SPI, Waveform]
description: 用三组确定性波形解释异步串行、共享开漏总线和同步全双工接口的差异。
---

# UART、I²C 与 SPI 怎样传输数据

## UART：双方约定时间，没有共享时钟线

空闲通常为高，发送端先给起始位，再按约定波特率发送数据位，最后给停止位。双方若波特率、数据位、校验或停止位不一致，字节会错帧。

<ClientOnly><WaveformDiagram title="UART：起始位、8 个数据位与停止位" :source="{signal:[{name:'TX',wave:'1.0.101010101.',node:'..a........b.'}],edge:['a<->b 一帧'],config:{hscale:1.15}}" /></ClientOnly>

## I²C：共享时钟与数据线，用地址选择设备

SCL、SDA 通常为开漏并依靠上拉。SCL 为高时 SDA 的下降沿表示 START，上升沿表示 STOP；每 8 位数据后由接收方在第 9 个时钟给 ACK/NACK。地址不是“传感器寄存器地址”，设备地址与设备内部寄存器地址属于不同层。

<ClientOnly><WaveformDiagram title="I²C：START、地址/写、ACK 与数据" :source="{signal:[{name:'SCL',wave:'1.p.............1'},{name:'SDA',wave:'10.3.......0.4..1',data:'ADDR+W DATA'}],config:{hscale:1.1}}" /></ClientOnly>

## SPI：控制器提供时钟和片选

常见四线为 SCLK、CS、MOSI、MISO。每个时钟边沿同时移出一位、采入一位；CPOL/CPHA 决定空闲电平与采样边沿。SPI 没有统一的帧、地址和错误处理语义，必须以器件协议定义为准。

<ClientOnly><WaveformDiagram title="SPI：片选包围一次全双工传输" :source="{signal:[{name:'CS',wave:'10........1'},{name:'SCLK',wave:'0.p.......0'},{name:'MOSI',wave:'x3.......x',data:'COMMAND'},{name:'MISO',wave:'x4.......x',data:'RESPONSE'}],config:{hscale:1.2}}" /></ClientOnly>

## 选择不是速度排行榜

| 维度 | UART | I²C | SPI |
| --- | --- | --- | --- |
| 时钟 | 双方约定 | 共享 SCL | 控制器 SCLK |
| 典型线数 | TX/RX | SDA/SCL | SCLK/CS/MOSI/MISO |
| 多设备 | 额外拓扑 | 总线地址 | 多片选或级联 |
| 电气层 | 常为推挽逻辑电平 | 开漏 + 上拉 | 常为推挽 |
| 标准错误信号 | 帧/奇偶错误 | ACK/NACK、仲裁 | 通常由上层协议定义 |

接口名称不等于完整兼容性。还要核对电压域、逻辑阈值、线长、上拉、负载、电磁环境、帧格式和器件时序。

下一步：[外设与协议波形实验](/embedded/peripherals-and-buses/protocol-waveform-lab)。
