---
title: 0. 电、信号与测量
date: 2026-09-05
updated: 2026-09-05
type: overview
status: learnable
track: embedded
categories: [嵌入式]
tags: [Voltage, Current, Signal, Measurement]
description: 用一个 LED 支路建立电压、电流、参考地、功率、数字电平和仪表接法的首个硬件闭环。
---

# 0. 电、信号与测量

程序出错时可以重新运行，硬件接错却可能发热或损坏。进入 MCU 之前，先学会回答三个问题：**电压相对谁测量、电流沿哪条闭合路径流动、仪表接入后是否改变了原电路？**

## 固定案例

全章只使用一个 3.3 V 电源、一个电阻和一个 LED：

```text
3.3 V ── 电阻 R ── LED ── GND
```

教学基线把 LED 正向压降近似为 `2.0 V`，电阻取 `330 Ω`。它不是所有 LED 的永久参数，真实值需要查数据手册并测量。

## 前置与目标

不要求电子基础，只需要会四则运算。完成本章后能够：

1. 区分节点电压、电压差、电流方向和参考地；
2. 用欧姆定律计算串联限流电阻，并检查功率；
3. 区分连续模拟量、数字逻辑值和真实电平；
4. 解释 ADC 的采样、量化和参考电压；
5. 正确选择电压表、电流表、示波器或逻辑分析仪；
6. 面对读数异常时，按供电—参考地—连接—量程—负载顺序排查。

## 唯一学习顺序

| 顺序 | 页面 | 完成证据 |
| ---: | --- | --- |
| 1 | [电压、电流与参考地](/embedded/electronics-foundations/voltage-current-and-ground) | 能画出闭合回路并选择电压/电流测法 |
| 2 | [电阻、功率与发热](/embedded/electronics-foundations/resistance-power-and-heat) | 能计算 LED 限流电阻和最坏功耗 |
| 3 | [模拟信号、数字电平与采样](/embedded/electronics-foundations/analog-digital-and-sampling) | 能把真实电压转换成逻辑值和 ADC 码 |
| 4 | [虚拟万用表与采样实验](/embedded/electronics-foundations/measurement-lab) | 修改原位参数并验证四条断言 |
| 5 | [电路与测量速查](/embedded/electronics-foundations/reference) | 查询单位、公式、接法和安全边界 |
| 6 | [第 0 章复习与验收](/embedded/electronics-foundations/review) | 完成手算、接线判断和故障诊断 |

## 本章不解决什么

暂不讲晶体管内部物理、交流阻抗、滤波器、布线寄生参数或具体 MCU 寄存器。本章只建立直流最小回路和信号观察方法；复杂电路都必须保留这几个基本问题。

## 安全边界

本章实验默认低压、限流的虚拟环境。不要把教学接法直接用于市电、电池包、大电容、电机或未知设备。真实硬件上电前必须确认电压范围、极性、限流和公共参考地。

完成[章节验收](/embedded/electronics-foundations/review)后，下一章将进入数字逻辑与计算机组成。
