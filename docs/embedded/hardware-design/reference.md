---
title: 原理图、PCB 与硬件设计速查
date: 2026-09-05
updated: 2026-09-05
type: reference
status: verified
track: embedded
chapter: hardware-design
categories: [嵌入式]
tags: [Reference, Schematic, PCB]
description: 汇总电源树、最小系统、接口保护、PCB 回流、EMC 与热设计检查项。
---

# 原理图、PCB 与硬件设计速查

电源：输入范围、反接/浪涌、持续/峰值电流、压差、效率、瞬态、稳定电容、耗散、结温、降额。最小系统：全部电源脚、去耦、模拟参考、复位、启动脚、时钟、调试/恢复、未用引脚。

接口：连接器定义、电压域、方向、上拉/终端、ESD/过压、异常电流路径、共模范围、屏蔽与机壳地。PCB：连续参考平面、短去耦回路、开关节点、高速与模拟隔离、差分/阻抗、测试点、载流与散热、DFM。

粗略线性稳压耗散 `P≈(Vin-Vout)I`；粗略结温 `Tj≈Ta+PθJA`，两式都必须在数据手册适用条件下使用。

关联：[电源与最小系统](/embedded/hardware-design/schematic-power-reset-clock) · [接口与 PCB](/embedded/hardware-design/interfaces-pcb-emc-thermal) · [审查实验](/embedded/hardware-design/design-review-lab)。
