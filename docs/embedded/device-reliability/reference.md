---
title: 调试、升级与设备可靠性速查
date: 2026-09-05
updated: 2026-09-05
type: reference
status: verified
track: embedded
chapter: device-reliability
categories: [嵌入式]
tags: [Reference, Reliability, Update]
description: 汇总现场诊断、Watchdog、升级状态、故障注入、HIL 和量产追溯字段。
---

# 调试、升级与设备可靠性速查

现场身份：硬件/固件/Bootloader 版本与哈希、序列号、启动计数、复位原因、单调时间、配置版本。崩溃证据：PC/LR/SP、Fault 状态与地址、任务/中断、栈水位、关键事件环形日志。

Watchdog：健康条件、唯一喂狗 owner、窗口、长操作策略、复位后记录、连续失败上限和安全状态。升级：目标兼容、版本策略、完整性、签名、非活动槽、原子元数据、试运行确认、回滚和恢复入口。

测试矩阵至少覆盖正常、边界、超时、断线、掉电、坏数据、资源耗尽、连续复位和旧版本迁移。每次测试记录环境、仪器、脚本、固件和原始结果。

关联：[观察与 Watchdog](/embedded/device-reliability/observability-fault-watchdog) · [升级与测试](/embedded/device-reliability/update-test-production) · [故障实验](/embedded/device-reliability/fault-recovery-lab)。
