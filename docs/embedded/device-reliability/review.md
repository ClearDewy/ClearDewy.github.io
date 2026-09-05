---
title: 第 7 章与嵌入式主线验收
date: 2026-09-05
updated: 2026-09-05
type: review
status: learnable
track: embedded
chapter: device-reliability
prerequisites: [/embedded/device-reliability/fault-recovery-lab]
outcomes:
  - 能设计可归因、可恢复的嵌入式设备
  - 能贯通电源、CPU、固件、外设、RTOS、PCB 与现场证据
estimated: 90min
categories: [嵌入式]
tags: [Review, Reliability, Capstone]
description: 通过升级状态机和跨层故障案例验收整个嵌入式主线。
---

# 第 7 章与嵌入式主线验收

<KnowledgeQuiz storage-key="embedded-reliability-review-v1" :questions="[
 {id:'f1',type:'boolean',prompt:'任意高频任务持续喂狗就能证明系统健康。',answer:false,explanation:'喂狗者必须确认所有关键子系统进度。'},
 {id:'f2',type:'single',prompt:'CRC 最直接证明什么？',options:['数据完整性','发布者身份','绝对不会回滚'],answer:'数据完整性',explanation:'身份认证需要签名等机制。'},
 {id:'f3',type:'boolean',prompt:'候选固件第一次启动后应立即擦除旧稳定映像。',answer:false,explanation:'候选确认前必须保留可回滚版本。'},
 {id:'f4',type:'single',prompt:'连续启动失败达到上限后，合理终态是什么？',options:['无限重启','受限安全/恢复模式','忽略计数'],answer:'受限安全/恢复模式',explanation:'终止失败循环并保留恢复入口。'},
 {id:'f5',type:'open',prompt:'设备现场偶发重启，请设计跨层取证和复现方案。',rubric:['硬件/固件身份','供电与复位波形','复位原因','Fault 上下文','任务/中断/栈证据','外设与总线错误','环境和负载边界','故障注入与回归'],reference:'不能预先假定是软件或电源；应让每层提供可关联时间和身份的证据。'}
]" />

## 全链路任务

为“电池供电、周期采样、通过总线上报、支持远程升级”的设备提交：电源树与预算、CPU/存储图、采样时间线、任务与队列、协议波形、PCB 关键回流、Watchdog 健康条件、升级状态机和测试矩阵。

评分：每层一分，跨层身份与时间关联一分，故障安全终态一分；达到 8/10 且无危险电气或无限恢复路径，视为主线通过。之后可选择嵌入式 Linux、机器人、电机控制或边缘智能专题。
