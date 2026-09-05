---
title: 1. 数字逻辑与计算机组成
date: 2026-09-05
updated: 2026-09-05
type: overview
status: learnable
track: embedded
categories: [嵌入式]
tags: [Digital Logic, CPU, Memory]
description: 从电压阈值进入比特、组合逻辑、时钟状态、CPU、存储器和总线，解释 MCU 运行代码前的数字系统基础。
---

# 1. 数字逻辑与计算机组成

第 0 章把真实电压转换成 LOW、HIGH 和 ADC 码。本章继续追问：**大量 0/1 怎样组成计算、记住状态，并执行一条程序指令？**

固定案例是一盏由按钮控制的 LED：组合逻辑决定“当前输入产生什么输出”，寄存器决定“系统记住什么”，CPU 则按取指—译码—执行循环更新寄存器和外设。

## 学习顺序

| 顺序 | 页面 | 完成证据 |
| ---: | --- | --- |
| 1 | [比特与组合逻辑怎样产生输出](/embedded/digital-systems/bits-and-combinational-logic) | 能从真值表推导门电路与最小加法器 |
| 2 | [状态、时钟、CPU 与存储器怎样协作](/embedded/digital-systems/state-clock-cpu-memory) | 能追踪一个时钟沿和一条指令的数据路径 |
| 3 | [数字状态机实验](/embedded/digital-systems/logic-state-lab) | 修改输入并逐时钟验证状态 |
| 4 | [数字系统速查](/embedded/digital-systems/reference) | 查询编码、逻辑、状态和总线对象 |
| 5 | [复习与验收](/embedded/digital-systems/review) | 完成逻辑、时序和 CPU 路径诊断 |

## 边界与过关标准

本章不要求设计晶体管级门电路，也不展开缓存一致性和流水线优化。通过标准是：能严格区分电平、比特、数值、组合输出和时序状态，并能解释 CPU、存储器与外设通过地址和总线交换什么。

完成后进入[MCU、启动与裸机固件](/embedded/mcu-bare-metal)。
