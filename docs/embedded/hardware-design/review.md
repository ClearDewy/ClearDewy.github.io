---
title: 第 6 章复习与验收
date: 2026-09-05
updated: 2026-09-05
type: review
status: learnable
track: embedded
chapter: hardware-design
prerequisites: [/embedded/hardware-design/design-review-lab]
outcomes:
  - 能执行最小 MCU 板上电前审查
  - 能追踪电源、信号、返回、故障与热路径
estimated: 70min
categories: [嵌入式]
tags: [Review, Hardware Design]
description: 通过功耗预算、网络追踪和故障路径验收原理图与 PCB 基础。
---

# 第 6 章复习与验收

<KnowledgeQuiz storage-key="embedded-hardware-review-v1" :questions="[
 {id:'h1',type:'boolean',prompt:'把所有负载典型电流相加就得到完整电源预算。',answer:false,explanation:'还要检查峰值、时序、容差、瞬态和降额。'},
 {id:'h2',type:'single',prompt:'高速信号跨越参考平面分割最直接破坏什么？',options:['返回路径','源代码编码','ADC 位数'],answer:'返回路径',explanation:'回流绕行会增大环路与干扰。'},
 {id:'h3',type:'boolean',prompt:'ESD 保护器件离连接器越远越容易先泄放异常能量。',answer:false,explanation:'通常应靠近威胁入口并缩短泄放路径。'},
 {id:'h4',type:'fill',prompt:'12 V 输入、3.3 V 输出、0.1 A 的理想线性稳压器约耗散多少 W？',answer:['0.87'],explanation:'(12-3.3)×0.1=0.87 W。'},
 {id:'h5',type:'open',prompt:'给最小 MCU 传感器板写一份首次上电前审查。',rubric:['输入与限流','电源树和峰值','去耦与回流','复位启动时钟','调试恢复','接口电压与保护','热和测量点','物料/板卡版本'],reference:'审查必须能追到原理图网络、PCB 位置、数据手册边界和测量证据。'}
]" />

实作：选择一个外部连接器，画出正常信号路径、返回路径、ESD 路径和过压失效路径。达到 8/10 后进入[设备可靠性](/embedded/device-reliability)。
