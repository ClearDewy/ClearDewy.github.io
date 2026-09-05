---
title: 6. 原理图、PCB 与硬件边界
date: 2026-09-05
updated: 2026-09-05
type: overview
status: learnable
track: embedded
categories: [嵌入式]
tags: [Schematic, Power, PCB, EMC]
description: 从需求和数据手册进入电源、复位、时钟、接口保护、PCB 回流、EMC 与热预算。
---

# 6. 原理图、PCB 与硬件边界

固件正确不代表硬件可靠。本章把按钮、传感器、MCU 和通信接口放回真实供电、连接器、回流路径、温升和外部故障中。

| 顺序 | 页面 | 完成证据 |
| ---: | --- | --- |
| 1 | [原理图、电源、复位与时钟怎样形成可启动硬件](/embedded/hardware-design/schematic-power-reset-clock) | 能从负载预算追到每个关键网络 |
| 2 | [接口保护、PCB、EMC 与热怎样约束布局](/embedded/hardware-design/interfaces-pcb-emc-thermal) | 能解释信号路径和返回路径及保护器件位置 |
| 3 | [硬件设计审查实验](/embedded/hardware-design/design-review-lab) | 能用预算与检查表发现设计缺口 |
| 4 | [硬件设计速查](/embedded/hardware-design/reference) | 查询网络、边界和审查证据 |
| 5 | [复习与验收](/embedded/hardware-design/review) | 完成上电前设计审查 |

本章不是 PCB 软件操作教程，也不替代安规、EMC 实验室和资深硬件评审。完成后进入[调试、升级与可靠性](/embedded/device-reliability)。
