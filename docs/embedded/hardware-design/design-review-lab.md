---
title: 硬件设计审查实验
date: 2026-09-05
updated: 2026-09-05
type: lab
status: learnable
track: embedded
chapter: hardware-design
prerequisites: [/embedded/hardware-design/interfaces-pcb-emc-thermal]
outcomes:
  - 能完成电源峰值、耗散和余量检查
  - 能按网络和故障路径审查最小 MCU 板
estimated: 60min
categories: [嵌入式]
tags: [Lab, Design Review, Power]
description: 用可修改功耗预算和上电前检查表审查最小 MCU 传感器板。
---

# 硬件设计审查实验

## 环境与固定设计

输入 5 V，经线性稳压器产生 3.3 V，负载包括 MCU、传感器、通信模块和 LED。默认负载峰值只是教学数据，不代表具体物料。

<ClientOnly><PowerBudgetDemo /></ClientOnly>

## 步骤

1. 记录默认总峰值、额定余量和稳压器近似耗散；
2. 把通信峰值提高到 300 mA，判断电流和热是否都满足；
3. 把输入从 5 V 提高到 12 V，保持负载不变，解释线性稳压器为何危险；
4. 为电源、复位、时钟、调试口、每个连接器和关键负载填写“来源—边界—失效—证据”；
5. 在 PCB 上画出电源电流、信号和返回路径，不只检查飞线是否消失。

## 判断与边界

预算必须留正余量且耗散在封装和 PCB 热条件内；所有外部接口有电压域和异常能量路径；首次上电具有限流和可测节点。浏览器计算不包含稳压器压差、效率曲线、瞬态和热降额，真实设计必须查器件曲线并实测。

下一步：[速查](/embedded/hardware-design/reference)与[验收](/embedded/hardware-design/review)。
