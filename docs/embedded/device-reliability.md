---
title: 7. 调试、升级与设备可靠性
date: 2026-09-05
updated: 2026-09-05
type: overview
status: learnable
track: embedded
categories: [嵌入式]
tags: [Debug, Watchdog, Bootloader, Production]
description: 从可观察性和故障记录进入 Watchdog、故障恢复、安全升级、硬件在环与量产测试。
---

# 7. 调试、升级与设备可靠性

实验台上运行一次只是开始。设备还要面对掉电、总线卡死、栈溢出、Flash 损坏、升级中断、温度变化和无法连接调试器的现场。本章回答：**失败怎样被检测、保留证据、恢复到安全状态并避免无限重启？**

| 顺序 | 页面 | 完成证据 |
| ---: | --- | --- |
| 1 | [日志、断言、Fault 与 Watchdog 怎样形成恢复链](/embedded/device-reliability/observability-fault-watchdog) | 能从复位原因和崩溃记录定位故障 |
| 2 | [Bootloader、升级、测试与量产怎样闭环](/embedded/device-reliability/update-test-production) | 能设计断电安全升级和可追溯生产测试 |
| 3 | [故障注入与恢复实验](/embedded/device-reliability/fault-recovery-lab) | 验证正常、超时、坏映像和回滚路径 |
| 4 | [设备可靠性速查](/embedded/device-reliability/reference) | 查询状态、证据和发布门禁 |
| 5 | [全专栏复习与验收](/embedded/device-reliability/review) | 完成从电源到恢复的系统诊断 |

过关标准不是“加了 Watchdog”，而是任意复位、升级或故障都有明确原因、状态转换、持久证据、责任边界和安全终态。
