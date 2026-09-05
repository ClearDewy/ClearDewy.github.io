---
title: 日志、Fault 与 Watchdog 怎样形成恢复链
date: 2026-09-05
updated: 2026-09-05
type: lesson
status: learnable
track: embedded
chapter: device-reliability
prerequisites: [/embedded/hardware-design/review]
outcomes:
  - 能设计断电后仍可归因的崩溃记录
  - 能把 Watchdog 纳入健康检查和安全恢复状态机
estimated: 60min
categories: [嵌入式]
tags: [Observability, Fault, Watchdog]
description: 用一次任务卡死追踪断言、故障寄存器、重启原因、持久记录和受控恢复。
---

# 日志、Fault 与 Watchdog 怎样形成恢复链

## 先记录身份，再记录现象

现场日志至少关联硬件版本、固件版本/哈希、启动计数、复位原因、单调时间、关键状态和错误计数。只有字符串“系统异常”无法比较批次，也无法知道日志来自重启前还是重启后。

## Fault handler 保存最小崩溃上下文

典型异常记录包括 PC/LR、栈指针、Fault 状态/地址寄存器、当前任务、中断嵌套和少量关键状态。记录过程必须避免再次分配内存、获取已损坏的锁或无限打印；写 Flash 还要考虑掉电与擦写寿命。

## Watchdog 不是定时重启器

正确链路：

```text
各关键子系统报告进度 → 健康监督者检查完整条件
→ 仅健康时喂狗 → 超时复位
→ 启动读取复位原因与崩溃记录
→ 进入正常、降级、恢复或安全模式
```

如果任意高频任务无条件喂狗，被监控任务即使已经死锁，设备也不会复位。反过来，Watchdog 窗口太短会在合法长操作时误复位。

<ClientOnly><FirmwareRecoveryDemo /></ClientOnly>

逐步选择正常启动、任务超时或连续失败，观察系统为何需要启动确认、重试上限和安全模式。

## 无限重启不是恢复

必须持久记录连续失败次数和上一次失败阶段，达到阈值后停止重复高风险动作，转入有限功能、等待维护或回滚版本。安全状态取决于设备：电机关闭、阀门保持还是通信继续，必须由系统风险分析定义。

## 常见误解

- 日志越多越可调试；高频日志可能改变时序、耗尽带宽和覆盖关键证据；
- 断言只用于开发版；关键不变量在发布版也需要受控处理；
- Watchdog 能修复所有死锁；它只提供检测和复位动作；
- 每次启动都清空错误计数，导致设备永远无法识别启动循环。

下一步：[升级、测试与量产](/embedded/device-reliability/update-test-production)。
