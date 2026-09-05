---
title: 故障注入与恢复实验
date: 2026-09-05
updated: 2026-09-05
type: lab
status: learnable
track: embedded
chapter: device-reliability
prerequisites: [/embedded/device-reliability/update-test-production]
outcomes:
  - 能验证启动确认、Watchdog、重试上限和回滚路径
  - 能为真实设备设计断电与通信故障注入矩阵
estimated: 60min
categories: [嵌入式]
tags: [Lab, Fault Injection, Recovery]
description: 在确定性恢复状态机中注入超时、坏映像和连续启动失败，验证系统进入安全终态。
---

# 故障注入与恢复实验

## 环境与命题

浏览器状态机包含稳定映像 A、候选映像 B、启动确认、Watchdog、失败计数、回滚和安全模式。它验证状态闭环，不模拟 Flash 物理损坏和密码学实现。

<ClientOnly><FirmwareRecoveryDemo /></ClientOnly>

## 步骤

1. 选择“正常候选”，确认 B 自检后提交；
2. 选择“候选校验失败”，确认不启动 B；
3. 选择“启动后超时”，确认 Watchdog 记录原因并回滚 A；
4. 连续触发三次启动失败，确认进入安全模式而非无限循环；
5. 为真实板卡设计断电点：擦除前、写一半、验证后、切换标志时、首次启动未确认时。

## 通过条件

每条路径都有终态；旧稳定映像在候选确认前不被破坏；失败原因和映像身份可在重启后读取；重试有上限；安全模式提供受限恢复入口。

真实测试还必须记录电源跌落波形、Flash 擦写边界、Bootloader 版本、密钥/签名策略和 HIL 脚本提交。清理时恢复稳定槽位并导出故障日志。

下一步：[速查](/embedded/device-reliability/reference)与[全专栏验收](/embedded/device-reliability/review)。
