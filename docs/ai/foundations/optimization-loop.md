---
title: 损失、梯度与最小优化循环
date: 2026-09-04
updated: 2026-09-04
type: lesson
status: learnable
track: ai
prerequisites: [函数, 导数的变化率直觉, 矩阵乘法]
outcomes: [解释损失和梯度, 手算一次梯度下降, 识别训练循环顺序错误]
estimated: 30 分钟
description: 用一个标量线性模型连接前向计算、损失、梯度和参数更新。
---

# 损失、梯度与最小优化循环

## 问题与最小例子

模型为什么会“学”？先不用神经网络，只拟合一个样本 `x=2, y=6`，模型为 $\hat y=wx$，初始 $w=1$，平方损失：

$$L=(\hat y-y)^2=(wx-y)^2$$

目标不是让模型神秘地变聪明，而是找到让指定损失更小的参数。

## 一次完整更新

前向：$\hat y=1\times2=2$，所以 $L=(2-6)^2=16$。

链式法则：

$$
\frac{\partial L}{\partial w}
=2(wx-y)\cdot x
=2(2-6)\cdot2=-16
$$

学习率 $\eta=0.1$ 时：

$$w' = w-\eta\frac{\partial L}{\partial w}=1-0.1(-16)=2.6$$

新预测是 `5.2`，新损失是 `0.64`。负梯度意味着增大 `w` 会降低当前损失，所以减去负数使参数增大。

## 训练循环的五个状态

```text
参数 w → 前向预测 → 损失 L → 梯度 dL/dw → 更新后的参数 w'
   ↑                                                   │
   └──────────────────── 下一批次 ─────────────────────┘
```

框架中的典型顺序是：清梯度、前向、算 loss、反向、更新。梯度默认累加，因此忘记清零会改变优化算法；在反向之前更新，会使用旧或不存在的梯度。

## 数值检查

可以用有限差分检查解析梯度：

<ClientOnly>
  <PythonPlayground
    title="用有限差分检查解析梯度"
    :code="`x, y, w, eps = 2.0, 6.0, 1.0, 1e-5\nloss = lambda value: (value * x - y) ** 2\nnumeric = (loss(w + eps) - loss(w - eps)) / (2 * eps)\nanalytic = 2 * (w * x - y) * x\nassert abs(numeric - analytic) < 1e-6\nprint('数值梯度:', numeric)\nprint('解析梯度:', analytic)`"
  />
</ClientOnly>

有限差分慢且有舍入误差，不用于正式训练，但很适合检查手写梯度。

## 常见误解与边界

- loss 下降只说明优化目标变小，不说明未知数据、业务价值或安全性改善。
- 梯度给出局部最陡上升方向；一步走多远由学习率和优化器决定。
- mini-batch 梯度是总体梯度的带噪估计。
- 自动微分负责应用链式法则，不负责判断目标函数和数据是否正确。

## 小结与自测

请用 `x=3,y=9,w=2,η=0.05` 手算一次更新。若学习率改为 1，新的 loss 是否一定更小？为什么不能只看训练 loss 判断模型有效？

下一步：[基础计算实验](/ai/foundations/lab)。
