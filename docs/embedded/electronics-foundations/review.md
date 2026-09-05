---
title: 第 0 章复习与验收
date: 2026-09-05
updated: 2026-09-05
type: review
status: learnable
track: embedded
chapter: electronics-foundations
prerequisites: [/embedded/electronics-foundations/measurement-lab]
outcomes:
  - 能手算 LED 回路与 ADC 码并选择测量方式
  - 能从异常读数追查参考地、接法、范围和模型边界
estimated: 60min
categories: [嵌入式]
tags: [Review, Circuit, Measurement]
description: 通过计算、接法判断、开放诊断和虚拟实验验收电路、信号与测量基础。
---

# 第 0 章复习与验收

## 交互自测

<KnowledgeQuiz storage-key="embedded-electronics-review-v1" :questions="[
 {id:'e0-1',type:'boolean',prompt:'电压是单个节点自身携带的绝对数值。',answer:false,explanation:'电压是两个点之间的电势差，节点电压隐含了参考点。',remediation:'/embedded/electronics-foundations/voltage-current-and-ground'},
 {id:'e0-2',type:'single',prompt:'测量一条 LED 支路的电流，万用表应怎样接入？',options:['跨接在电源两端','串入目标支路','只连接红表笔'],answer:'串入目标支路',explanation:'电流表需要让目标支路电流通过仪表。'},
 {id:'e0-3',type:'fill',prompt:'3.3 V 电源、2.0 V LED、330 Ω 电阻的理想电流约为多少 mA？只填两位小数。',answer:['3.94'],explanation:'(3.3-2.0)/330×1000=3.94 mA。'},
 {id:'e0-4',type:'boolean',prompt:'把 10 位 ADC 改成 12 位，会自动提高时间采样率。',answer:false,explanation:'位数控制量化网格；采样率控制时间间隔。',remediation:'/embedded/electronics-foundations/analog-digital-and-sampling'},
 {id:'e0-5',type:'single',prompt:'逻辑分析仪显示 HIGH 最直接证明了什么？',options:['电压精确为 3.3 V','输入在分析仪阈值上方','信号没有过冲'],answer:'输入在分析仪阈值上方',explanation:'幅度、噪声与边沿质量仍需示波器。'},
 {id:'e0-6',type:'open',prompt:'LED 不亮但软件显示 GPIO 已置 1。请写出有顺序的排查方案。',rubric:['确认供电电压和限流','确认公共参考地','测量 GPIO 真实电压','检查 LED 极性与串联路径','检查引脚模式和复用','区分软件状态与物理证据','说明安全断电条件'],reference:'从供电和参考地开始，依次检查物理连接、引脚实测、电流路径，再检查配置与器件；每一步都写预期读数。'}
]" />

## 可打印题目

1. 为什么电压表并联而电流表串联？交换电压表表笔会发生什么？
2. `5 V → 470 Ω → 2.1 V LED → GND` 的电流和电阻功率是多少？
3. 电源、LED 压降和电阻容差分别怎样组合才产生最大电流？
4. 解释模拟电压、数字电平和 ADC 码的区别。
5. 为什么 1.4 V 在某个 3.3 V 数字输入上可能既不能保证 LOW，也不能保证 HIGH？
6. 8 位 ADC、Vref 2.5 V、Vin 1.0 V 的理想码是多少？
7. 示波器、逻辑分析仪和调试器分别能证明什么，不能证明什么？

<details><summary>静态答案与评分点</summary>

1. 电压表比较两点且高内阻，电流表必须承载支路电流且低内阻；交换电压表极性改变符号。
2. `I=(5-2.1)/470≈6.17 mA`，`P≈2.9×0.00617≈17.9 mW`。
3. 最高电源、最低 LED 压降、最低实际阻值。
4. 连续物理量、阈值分类、离散数值三个层级必须分开。
5. 它落在输入规范的未定义区，器件与噪声可能改变判定。
6. `round(1/2.5×255)=102`。
7. 示波器看模拟波形，逻辑分析仪看阈值化时序，调试器看处理器状态；任何一个都不能单独证明完整系统正确。
</details>

## 实作验收

回到[虚拟实验](/embedded/electronics-foundations/measurement-lab)，自行选择一组非基线参数并提交：

- 修改前预测；
- 公式与单位；
- 组件实际读数；
- 若不一致，按顺序排查的记录；
- 这次虚拟实验不能证明的真实硬件属性。

## 评分与补学

客观题、手算和实作各占三分，故障诊断一分；达到 8/10 且没有危险接法视为通过。

- 电压和接法错误：[电压、电流与参考地](/embedded/electronics-foundations/voltage-current-and-ground)
- 电阻或功率错误：[电阻、功率与发热](/embedded/electronics-foundations/resistance-power-and-heat)
- 电平或 ADC 错误：[模拟信号与采样](/embedded/electronics-foundations/analog-digital-and-sampling)

建议在 7 天后不看答案重做第 2、6、7 题。通过后进入下一章“数字逻辑与计算机组成”（建设中）。
