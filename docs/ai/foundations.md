---
title: 数学、张量与优化基础
date: 2026-09-04
categories:
  - 智能算法
tags:
  - Mathematics
  - PyTorch
  - Tensor
  - Optimization
description: 用模型计算所需的最小数学体系连接张量、线性代数、微积分、概率、数值计算与优化。
---

# 数学、张量与优化基础

本章不是按数学学科重新读一遍教材，而是建立阅读模型时反复使用的语言：**对象是什么、怎样变换、误差怎样度量、参数怎样更新**。

## 1. 数字怎样承载语义

张量是规则排列的数字，shape 描述各个轴的长度；真正重要的是每个轴代表什么。

| 对象 | 常见 shape | 在模型中的例子 |
| --- | --- | --- |
| 标量 | `[]` | 一个 loss 或学习率 |
| 向量 | `[C]` | 一个 token 的特征 |
| 矩阵 | `[T,C]` | 一条序列的所有 token 表示 |
| 三维张量 | `[B,T,C]` | 一批序列 |
| 四维张量 | `[B,H,T,D]` | 多头注意力中的 Q、K、V |

常用符号：`B` 是 batch，`T` 是序列长度，`C` 是隐藏维度，`H` 是注意力头数，`D` 是每头维度。shape 不是单纯的尺寸记录，而是数据结构的类型信息。

### Embedding 为什么会多出一个轴

若 token ID 的 shape 为 `[B,T]`，Embedding 表为 `[V,C]`，查表就是为每个 ID 取一个长度为 `C` 的向量：

```text
token_ids [B,T] + embedding_table [V,C] → hidden_states [B,T,C]
```

这里没有做矩阵乘法；输出中共有 `B×T` 个 token 向量，每个向量长度为 `C`。

<ClientOnly>
  <PythonPlayground
    title="Embedding 查表：语义轴怎样出现"
    :packages="['numpy']"
    :code="`import numpy as np\n\nV, C = 10, 3\ntoken_ids = np.array([[2, 5, 1, 0], [4, 4, 7, 3]])\ntable = np.arange(V * C).reshape(V, C)\nhidden = table[token_ids]\n\nprint('token ids:', token_ids.shape)\nprint('embedding table:', table.shape)\nprint('hidden states:', hidden.shape)\nassert hidden.shape == (2, 4, 3)`"
  />
</ClientOnly>

## 2. 线性代数：把矩阵看作变换

向量既可以表示空间中的方向，也可以表示一个对象的特征。矩阵则可以看作一个函数：它接收旧坐标，混合输入特征，产生新坐标。

$$
y = xW + b
$$

如果 `x` 有 `C_in` 个特征，希望输出 `C_out` 个特征，那么 `W` 必须是 `[C_in,C_out]`：

```text
[B,T,C_in] @ [C_in,C_out] → [B,T,C_out]
```

相邻的 `C_in` 是乘加发生的维度；`B,T` 是批次维度，同一个变换会独立应用于每条样本的每个 token。

### 逐元素乘法和矩阵乘法

- `x * y`：对应位置相乘，回答“每个位置缩放多少”；
- `x @ W`：输入特征相互混合，回答“怎样生成一组新特征”。

矩阵乘法的输出不是“形状规则游戏”。其中每个输出特征都是所有输入特征的加权和：

$$
y_j = \sum_i x_i W_{ij}
$$

## 3. 轴操作为什么存在

模型把多个独立维度装进一个张量，以便硬件批量计算。轴操作的目的，是让数据布局符合下一步运算的语义。

### reshape

`reshape` 改变观察方式，不改变元素和它们的线性顺序。例如在 `C=H×D` 时：

```text
[B,T,C] → [B,T,H,D]
```

这表示把一个长度为 `C` 的特征轴解释成 `H` 组、每组 `D` 个特征。元素总数是不变量：

$$
BTC = BTHD
$$

### transpose

`transpose` 交换两个轴。它不删除数据，也不完成矩阵乘法，只改变“哪个维度排在哪里”。例如：

```text
[B,T,H,D] → [B,H,T,D]
```

这样做的原因来自批量矩阵乘法：多数张量库把最后两个轴当作矩阵，把前面的轴当作互相独立的批次。把 `B,H` 放在前面后，就能对每条样本的每个头分别执行 `[T,D] @ [D,T]`。

### broadcast

广播让长度为 1 或缺失的轴在计算中被逻辑复制。例如给 `[B,T,C]` 加一个 `[C]` bias，会把同一 bias 应用于所有样本和 token。广播节省存储，但也可能让本应报错的语义错误悄悄运行，因此必须先写出轴含义。

## 4. 微积分与自动微分

训练要回答：参数改变一点，loss 会怎样变化？一维情况下是导数，多维参数对应梯度：

$$
\nabla_\theta L =
\left[
\frac{\partial L}{\partial \theta_1},
\ldots,
\frac{\partial L}{\partial \theta_n}
\right]
$$

神经网络是许多函数的复合。链式法则把最终 loss 的变化逐层传回参数：

$$
\frac{\partial L}{\partial x}
= \frac{\partial L}{\partial y}
  \frac{\partial y}{\partial x}
$$

PyTorch 的 autograd 会在前向传播时记录计算图，在 `loss.backward()` 时按反方向应用局部导数。它省去手工推导，但不能替我们判断 loss 是否正确、图是否意外断开、梯度是否稳定。

## 5. 概率与信息

模型通常输出 logits，它们是任意实数，还不是概率。softmax 把它们变为总和为 1 的分布：

$$
p_i = \frac{e^{z_i}}{\sum_j e^{z_j}}
$$

指数放大差异，因此实现时会先减去最大 logit，避免溢出。交叉熵衡量目标分布与预测分布的差异；单标签分类时可写为：

$$
L = -\log p_y
$$

模型给正确答案的概率越低，惩罚越大。最大似然、负对数似然、交叉熵在很多训练任务中是同一件事的不同视角。

还需要逐步建立这些概念：条件概率、期望与方差、熵、KL 散度、采样、估计误差和置信区间。它们分别连接数据分布、生成、蒸馏、偏好优化和评测。

## 6. 优化不是沿梯度走一步这么简单

最基本的梯度下降为：

$$
\theta_{t+1} = \theta_t - \eta \nabla_\theta L
$$

其中学习率 $\eta$ 决定步长。真实训练还需要理解：

- mini-batch 梯度是总体梯度的带噪估计；
- momentum 平滑方向，Adam 按历史一阶/二阶矩调整每个参数的步长；
- AdamW 把 weight decay 与梯度更新解耦；
- warmup、衰减、梯度裁剪、累积和混合精度都在控制稳定性与资源；
- 训练 loss 下降只说明优化目标被改善，不自动说明泛化和任务价值。

## 7. 数值与计算成本

同一个数学公式可能有完全不同的计算表现。学习中始终记录：

- **shape 与元素数**：决定激活内存；
- **参数量**：影响权重和优化器状态；
- **FLOPs**：近似描述计算量；
- **dtype**：影响精度、速度和内存；
- **计算顺序**：影响数值稳定性；
- **随机种子与非确定性算子**：影响复现。

例如普通注意力的分数矩阵是 `[B,H,T,T]`，其空间和主要计算随序列长度近似二次增长。这不是实现细节，而是长上下文系统的核心约束。

## 8. 本章实践顺序

1. 用纸笔和 NumPy 完成 shape、矩阵乘法、reshape、transpose 和 broadcast；
2. 用 PyTorch 重写同样运算，检查 dtype、device 和连续性；
3. 手算一个标量函数的导数，再与 autograd 对照；
4. 实现稳定 softmax 和交叉熵；
5. 写出最小训练循环并让模型过拟合一个 batch；
6. 比较 SGD、Momentum 和 AdamW 的轨迹与失效条件。

## 本章边界

本章只建立通用工具。多头为何需要不同表示、转置怎样服务注意力乘法，会在[序列、注意力与 Transformer](/ai/transformers)中结合完整目标解释；具体训练工程位于[数据、训练与对齐](/ai/data-training-alignment)。

