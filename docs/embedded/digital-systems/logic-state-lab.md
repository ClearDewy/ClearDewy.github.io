---
title: 数字逻辑与寄存状态实验
date: 2026-09-05
updated: 2026-09-05
type: lab
status: learnable
track: embedded
chapter: digital-systems
prerequisites: [/embedded/digital-systems/state-clock-cpu-memory]
outcomes:
  - 能用真值表验证半加器
  - 能区分输入变化和时钟提交的状态变化
estimated: 35min
categories: [嵌入式]
tags: [Lab, Logic, Register]
description: 通过可操作半加器和一位寄存器验证组合输出与时序状态的边界。
---

# 数字逻辑与寄存状态实验

## 命题与环境

在现代浏览器中使用确定性布尔模型，无需硬件。待验证：组合结果随输入立即变化；寄存状态只在时钟动作发生时更新；复位优先把状态恢复为 0。

<ClientOnly><DigitalLogicDemo /></ClientOnly>

## 步骤与预期

1. 遍历 `00、01、10、11`，填写 SUM/CARRY，必须与真值表一致；
2. 在 `01` 时按“时钟沿”，寄存器 Q 应保存 1；
3. 把输入改为 `11`，SUM 立即变 0，但 Q 仍保持 1；
4. 再按时钟，Q 变 0；
5. 按复位，Q 为 0，时钟计数清零。

实际基线已复核：四种输入依次产生 `00、01、01、10`（按 `CARRY SUM` 排列），状态只由“时钟沿”和“复位”动作改变。

## 失败解释

若只看 LED 颜色而不读标签，容易把 SUM 和 CARRY 颠倒；若修改输入后期待 Q 同步变化，则混淆了 D 与 Q。浏览器模型不包含传播延迟、按键抖动和亚稳态，不能证明真实电路时序安全。

完成后进入[速查](/embedded/digital-systems/reference)和[验收](/embedded/digital-systems/review)。
