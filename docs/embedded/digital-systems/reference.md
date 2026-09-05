---
title: 数字逻辑与计算机组成速查
date: 2026-09-05
updated: 2026-09-05
type: reference
status: verified
track: embedded
chapter: digital-systems
categories: [嵌入式]
tags: [Reference, Logic, CPU]
description: 汇总比特编码、组合逻辑、时序状态、CPU、存储器和总线的最小定义与不变量。
---

# 数字逻辑与计算机组成速查

| 对象 | 由什么决定 | 是否保存历史 |
| --- | --- | --- |
| 电平 | 引脚真实电压与输入阈值 | 否 |
| 比特 | 对电平的逻辑解释 | 否 |
| 组合输出 | 当前输入 | 否 |
| 寄存器 Q | 上一个有效边沿采样值 | 是 |
| PC | 下一条指令地址 | 是 |
| ALU 输出 | 操作数与操作码 | 否 |
| Flash | 程序与只读数据 | 断电保持 |
| SRAM | 运行时数据 | 断电丢失 |

最小半加器：`SUM=A XOR B`，`CARRY=A AND B`。时序约束：数据应在时钟边沿前后满足建立与保持时间。CPU 最小循环：取指、译码、执行、访存/写回。

常见错误：混淆地址与数据；把外设寄存器当普通内存；改写保留位；将逻辑分析结果当作模拟电气质量；把时钟频率直接等同于指令吞吐。

关联：[组合逻辑](/embedded/digital-systems/bits-and-combinational-logic) · [状态与 CPU](/embedded/digital-systems/state-clock-cpu-memory) · [实验](/embedded/digital-systems/logic-state-lab)。具体指令集、地址空间和寄存器行为以目标芯片体系结构文档与参考手册为准。
