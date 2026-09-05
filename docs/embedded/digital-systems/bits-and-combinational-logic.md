---
title: 比特与组合逻辑怎样产生输出
date: 2026-09-05
updated: 2026-09-05
type: lesson
status: learnable
track: embedded
chapter: digital-systems
prerequisites: [/embedded/electronics-foundations/analog-digital-and-sampling]
outcomes:
  - 能区分物理电平、逻辑值、位模式和数值解释
  - 能从真值表推导 AND XOR 与半加器
estimated: 40min
categories: [嵌入式]
tags: [Bits, Boolean, Logic Gates]
description: 用两个按钮和一个半加器解释比特编码、真值表与无记忆的组合逻辑。
---

# 比特与组合逻辑怎样产生输出

## 一根线只有电压，含义来自约定

接收器先把电压判为逻辑 0 或 1；多根线形成位模式；位模式再由协议解释成无符号数、有符号数、字符或控制字段。`01000001` 可以表示十进制 65，也可以表示字符 `A`，电路本身不会替你决定语义。

固定例子使用两个按钮 `A、B`。每个按钮产生一个比特，用逻辑门生成 LED 输出。

## 组合逻辑没有历史

组合逻辑的输出只由当前输入决定。AND 只有两个输入都为 1 才输出 1；XOR 在输入不同时输出 1。

| A | B | AND | XOR |
| -: | -: | -: | -: |
| 0 | 0 | 0 | 0 |
| 0 | 1 | 0 | 1 |
| 1 | 0 | 0 | 1 |
| 1 | 1 | 1 | 0 |

它们恰好组成一位半加器：`XOR` 是和 `SUM`，`AND` 是进位 `CARRY`。

```text
A + B → SUM（一位结果）+ CARRY（更高位进位）
```

当 `A=B=1` 时，二进制结果是 `10₂`：SUM 为 0，CARRY 为 1。这里不是“1+1=0”，而是低位写 0、高位产生进位。

## 原位操作

<ClientOnly><DigitalLogicDemo /></ClientOnly>

先切换 A、B，验证真值表；再按时钟把当前 SUM 写入寄存器。观察：改变输入会立即改变组合输出，但不会改变已经存储的状态。

## 从门到更大计算

全加器还接收低位进位；多个全加器级联可以处理多位数。比较器、译码器、多路选择器和算术逻辑单元也都可以由组合逻辑构成。规模增大不会取消两个约束：

- 信号传播需要时间，输出不会真正瞬时稳定；
- 输入在规定时间窗口内必须满足电平与时序要求。

## 常见误解

- 十进制数、二进制文本和位模式混为一谈；
- 认为 XOR 就是“加法”，忽略进位；
- 认为数字电路没有模拟边界；真实门仍受电压、延迟、噪声和负载约束；
- 用代码执行顺序理解并行门电路；组合逻辑各路径同时传播，只是延迟不同。

## 自测

输入 `A=1、B=1` 时，半加器输出为何是 `CARRY=1、SUM=0`？如果把两位按 `CARRY SUM` 排列，十进制是多少？

<details><summary>答案</summary>`10₂=2`。XOR 产生低位 0，AND 产生高位进位 1。</details>

下一步：[状态、时钟、CPU 与存储器](/embedded/digital-systems/state-clock-cpu-memory)。
