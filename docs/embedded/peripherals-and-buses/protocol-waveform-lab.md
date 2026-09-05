---
title: 外设与协议波形实验
date: 2026-09-05
updated: 2026-09-05
type: lab
status: learnable
track: embedded
chapter: peripherals-and-buses
prerequisites: [/embedded/peripherals-and-buses/uart-i2c-spi]
outcomes:
  - 能从固定波形标记事务边界和采样时刻
  - 能把协议错误归因到配置、电气层或上层数据
estimated: 50min
categories: [嵌入式]
tags: [Lab, Protocol, Waveform]
description: 使用 UART I2C SPI 固定波形完成帧解析、配置对照和故障定位。
---

# 外设与协议波形实验

## 目标与环境

使用上一页的三组 WaveDrom 确定性波形，不需要硬件。验证“寄存器返回成功”与“线上的帧正确”是两层不同证据。

## 步骤

1. UART：标出空闲、起始、8 个数据位和停止；写出接收器在哪些时刻采样；
2. I²C：标出 START、设备地址、方向位、ACK、数据和 STOP；
3. SPI：标出 CS 有效区、发送和接收方向；说明 CPOL/CPHA 不匹配会怎样；
4. 为每条总线分别列出一个配置错误、一个电气错误、一个上层协议错误；
5. 设计真实测量：记录仪器阈值、采样率、探头参考地和触发条件。

## 预期与实际解释

波形应能在不看驱动源码时给出事务边界，但不能单独证明传输内容符合业务语义。UART 错帧先核对双方格式与时钟；I²C NACK 先区分地址、供电、上拉和设备状态；SPI 返回全 `0/1` 先检查片选、方向、模式和线路连接。

浏览器波形已验证可构建和显示；真实边沿、过冲、上拉时间和串扰必须用示波器测量，逻辑分析仪只提供阈值化视图。

下一步：[速查](/embedded/peripherals-and-buses/reference)和[验收](/embedded/peripherals-and-buses/review)。
