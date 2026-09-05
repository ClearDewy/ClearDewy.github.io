---
title: MCU、启动与裸机固件速查
date: 2026-09-05
updated: 2026-09-05
type: reference
status: verified
track: embedded
chapter: mcu-bare-metal
categories: [嵌入式]
tags: [Reference, MCU, Startup]
description: 汇总 MCU 文档来源、启动段、固件产物、GPIO 配置顺序和调试证据。
---

# MCU、启动与裸机固件速查

| 对象 | 作用 | 常见证据 |
| --- | --- | --- |
| 向量表 | 初始栈与异常入口 | ELF/map、内存查看 |
| `.text/.rodata` | 代码与只读常量 | Flash 映像 |
| `.data` | 有初值可写数据 | Flash 装载值 + SRAM 运行值 |
| `.bss` | 启动时清零数据 | 启动代码、SRAM |
| 栈 | 调用帧、中断现场、局部变量 | SP、水位、Fault |
| 外设寄存器 | 控制/状态/数据 | 手册、读回、总线事务 |

GPIO 基本顺序：确认原理图和极性 → 供电/时钟 → 引脚复用 → 模式/类型/速度/上下拉 → 原子写输出 → 物理测量。构建产物至少保存 ELF、BIN/HEX、map、编译器版本和提交身份。

`volatile` 管理编译器可见性，不等于原子、互斥或内存屏障。寄存器保留位、W1C、只读和自清零语义必须逐项核对。

关联：[文档与资源地图](/embedded/mcu-bare-metal/mcu-map-and-datasheet) · [启动和 GPIO](/embedded/mcu-bare-metal/startup-linking-and-gpio) · [实验](/embedded/mcu-bare-metal/firmware-evidence-lab)。
