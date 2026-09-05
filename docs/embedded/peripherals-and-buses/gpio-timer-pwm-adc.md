---
title: GPIO、定时器、PWM 与 ADC 怎样连接物理世界
date: 2026-09-05
updated: 2026-09-05
type: lesson
status: learnable
track: embedded
chapter: peripherals-and-buses
prerequisites: [/embedded/mcu-bare-metal/startup-linking-and-gpio]
outcomes:
  - 能区分 GPIO 电气配置、定时事件、PWM 占空比和 ADC 触发
  - 能设计从定时触发到采样缓冲区的数据路径
estimated: 50min
categories: [嵌入式]
tags: [GPIO, Timer, PWM, ADC]
description: 用周期采样案例解释数字引脚、计数器、PWM 输出和 ADC 转换的职责与连接。
---

# GPIO、定时器、PWM 与 ADC 怎样连接物理世界

## 四种外设回答四类问题

| 外设 | 核心问题 | 关键配置 |
| --- | --- | --- |
| GPIO | 当前电平是什么，或要驱动什么电平 | 输入/输出/复用、上下拉、推挽/开漏 |
| Timer | 经过多少时钟、何时产生事件 | 时钟源、预分频、周期、比较值 |
| PWM | 一个周期内高电平占多少时间 | 频率、占空比、极性、输出通道 |
| ADC | 某时刻输入电压量化成什么码 | Vref、通道、采样时间、分辨率、触发源 |

固定数据路径：

```text
时钟 → Timer 每 1 ms 更新事件 → 触发 ADC
→ ADC 完成转换 → 结果进入数据寄存器/缓冲区
```

这比在 `while` 循环中“差不多每隔一会儿读一次”更可控，因为采样时刻由硬件计数器决定。

## PWM 不是模拟电压

PWM 引脚仍在 LOW/HIGH 之间切换。占空比 `D=t_high/T` 表示高电平时间比例；负载或低通滤波可能对其做时间平均。`50%` 占空比不保证所有负载得到“半功率”，电机、电感、LED 和滤波器的响应各不相同。

## ADC 的源阻抗与采样时间

ADC 内部采样电容需要通过信号源充电。源阻抗太高、采样时间太短时，电容无法充分稳定，码值即使很平稳也可能有系统偏差。切换通道后首个样本异常也可能来自残留电荷。

## GPIO 的电气语义

开漏输出只能主动拉低，需要外部或内部上拉产生高电平；I²C 正是利用多设备都能安全拉低一根线。推挽输出可主动驱动高低，两个推挽输出相反驱动同一网络会产生争用电流。

## 常见误解

- 只配置 GPIO 数据位，忘记时钟、复用或输出类型；
- 把 PWM 频率和占空比互换；
- 认为 ADC 转换结束时间等于触发时间；
- 只看 ADC 码，不记录 Vref、采样时间和前端范围；
- 用内部弱上拉驱动负载。

下一步：[UART、I²C 与 SPI](/embedded/peripherals-and-buses/uart-i2c-spi)。
