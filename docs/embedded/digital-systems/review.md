---
title: 第 1 章复习与验收
date: 2026-09-05
updated: 2026-09-05
type: review
status: learnable
track: embedded
chapter: digital-systems
prerequisites: [/embedded/digital-systems/logic-state-lab]
outcomes:
  - 能推导组合逻辑并追踪时钟状态
  - 能解释 CPU、存储器、地址与外设寄存器的关系
estimated: 55min
categories: [嵌入式]
tags: [Review, Digital Logic, CPU]
description: 通过逻辑推导、状态追踪与 CPU 数据路径验收数字系统基础。
---

# 第 1 章复习与验收

<KnowledgeQuiz storage-key="embedded-digital-review-v1" :questions="[
 {id:'d1',type:'boolean',prompt:'位模式 01000001 永远只表示字符 A。',answer:false,explanation:'位模式的语义取决于编码和使用上下文。'},
 {id:'d2',type:'fill',prompt:'半加器输入 A=1、B=1，按 CARRY SUM 写两位输出。',answer:['10'],explanation:'AND=1，XOR=0。'},
 {id:'d3',type:'boolean',prompt:'D 寄存器输入改变后，Q 必须立刻跟随。',answer:false,explanation:'边沿触发寄存器只在有效边沿采样。'},
 {id:'d4',type:'single',prompt:'CPU 想控制 GPIO，通常向什么对象发起访问？',options:['内存映射外设寄存器','LED 的颜色','源码文件名'],answer:'内存映射外设寄存器',explanation:'地址译码把总线事务路由到外设。'},
 {id:'d5',type:'open',prompt:'从 C 语言写 GPIO 到引脚电压变化，列出完整对象链。',rubric:['编译后的 load/store','CPU 寄存器或立即数','外设地址','片上总线与地址译码','GPIO 控制寄存器','输出驱动器','引脚电压与负载','指出需要物理测量'],reference:'软件写操作经 CPU 和总线到达 GPIO 寄存器，再由输出驱动器改变引脚；调试器和示波器提供不同证据。'}
]" />

实作：完成四行半加器真值表；画出 `PC → 指令存储器 → 译码 → 寄存器 → ALU → 写回`；解释异步按钮为何需要同步。客观题正确且开放题覆盖 6 个以上对象，视为通过。

下一步：[MCU、启动与裸机固件](/embedded/mcu-bare-metal)。
