---
title: 复位、启动、链接与 GPIO 怎样形成闭环
date: 2026-09-05
updated: 2026-09-05
type: lesson
status: learnable
track: embedded
chapter: mcu-bare-metal
prerequisites: [/embedded/mcu-bare-metal/mcu-map-and-datasheet]
outcomes:
  - 能追踪从复位向量到 main 的启动路径
  - 能解释链接布局、寄存器配置和引脚电压的关系
estimated: 55min
categories: [嵌入式]
tags: [Reset, Startup, Linker, GPIO]
description: 逐步追踪 MCU 从上电复位、初始化内存到配置 GPIO 并产生真实引脚电压的过程。
---

# 复位、启动、链接与 GPIO 怎样形成闭环

## `main` 不是第一步

典型 MCU 复位后从向量表取得初始栈指针和复位处理函数地址，然后启动代码完成运行环境初始化：

```text
上电/复位 → 取向量 → 设置栈 → Reset_Handler
→ 复制 .data：Flash 初值到 SRAM
→ 清零 .bss
→ 配置必要运行时 → main
```

链接脚本决定代码、常量、已初始化数据、零初始化数据、堆和栈放在哪个地址区。若布局超过 Flash/SRAM、入口或向量地址错误，程序可能在进入 `main` 前失败。

## 一次 GPIO 输出的必要步骤

厂商无关伪代码：

```c
CLOCK_ENABLE |= GPIO_PORT;
GPIO_MODE = (GPIO_MODE & ~PIN_MASK) | OUTPUT_MODE;
GPIO_OUTPUT_SET = LED_PIN;
```

三行分别属于时钟控制、配置状态和输出数据。真实芯片可能要求同步等待、原子 set/clear 寄存器或不同复位值，不能复制伪代码地址。

<ClientOnly><McuStartupDemo /></ClientOnly>

组件固定显示同一条链。逐步前进时检查：每一步产生什么新状态；哪些状态仍未证明；最终为何还要测量引脚，而不能只看程序计数器。

## `volatile` 解决什么、不解决什么

内存映射寄存器通常通过 `volatile` 告诉编译器每次访问都可能有外部可见效果，不应随意删除或缓存。它不保证原子性、互斥、时序顺序在所有体系结构都正确，也不能修复错误地址和硬件接线。

## 读改写陷阱

`REG |= mask` 会先读、再修改、再写。在中断并发、W1C 状态位或硬件同时更新寄存器时可能丢失事件。优先使用芯片提供的原子 set/clear 寄存器；否则明确临界区和字段语义。

## 常见失败定位

| 停在哪里 | 证据 | 优先检查 |
| --- | --- | --- |
| 无法连接调试器 | 探针日志、复位脚 | 供电、SWD/JTAG、读保护 |
| 进不了 Reset_Handler | PC、向量表 | 启动模式、映像地址、栈顶 |
| 进不了 main | 反汇编、Fault 状态 | `.data/.bss`、时钟、运行库 |
| 寄存器写了但引脚不变 | 寄存器读回、示波器 | 时钟、复用、输出类型、外部负载 |
| 引脚变化但 LED 不亮 | 引脚与 LED 两端电压 | 极性、原理图、限流和器件 |

下一步：[裸机固件证据实验](/embedded/mcu-bare-metal/firmware-evidence-lab)。
