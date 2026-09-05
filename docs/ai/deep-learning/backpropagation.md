---
title: 反向传播如何沿计算图得到全部梯度
date: 2026-09-04
updated: 2026-09-04
type: lesson
status: learnable
track: ai
chapter: deep-learning
prerequisites:
  - /ai/deep-learning/mlp-representation
  - /ai/foundations/optimization-loop
outcomes:
  - 能区分前向值、上游梯度、局部导数和参数梯度
  - 能沿两分支计算图逐步求出 dL/dw
  - 能解释共享变量和 batch 中的梯度为什么需要累加
  - 能区分 backward 与 optimizer step 的职责
estimated: 55 分钟
categories: [智能算法]
tags: [Backpropagation, Chain Rule, Autograd]
description: 用可播放的两分支计算图逐步观察前向缓存、局部链式法则、梯度累加和参数更新。
---

# 反向传播如何沿计算图得到全部梯度

在上一节中，MLP 用当前参数完成预测，loss 衡量预测与正确答案的差距。但还缺一个关键问题：**网络可能有成千上万个参数，怎样知道每个参数应该往哪个方向改？**

反向传播的答案是：把复杂函数拆成简单局部运算，先从左到右计算并保存必要数值，再从 loss 开始按相反顺序应用链式法则。每个节点只需要处理“收到的梯度 × 自己的局部导数”。

## 本页只解决一个问题

使用下面这个标量计算图，求参数 `w` 对最终损失 `L` 的影响：

$$
a=wx,\qquad b=a^2,\qquad c=3a,\qquad L=b+c
$$

固定 `w=2，x=4`。`w` 是准备优化的参数，`x` 是本次计算中的常量输入。中间量 `a` 被两条分支共同使用，这是本例最重要的结构。

```text
w ─┐          ┌─ square → b ─┐
   × → a ─────┤               + → L
x ─┘          └─ ×3     → c ─┘
```

本页不要求先会自动微分框架，也不讨论二阶导数。学完后，你应当能在纸上得到 `∂L/∂w=76`，并说明每个数字来自哪里。

## 先分清四种数

| 名称 | 含义 | 本例 |
| --- | --- | --- |
| 前向值 | 当前变量实际算出的值 | `a=8、b=64、c=24、L=88` |
| 上游梯度 | 最终目标对当前节点输出的变化率 | 到达 `b` 的 `∂L/∂b=1` |
| 局部导数 | 当前局部运算的输出对输入的变化率 | `∂b/∂a=2a=16` |
| 参数梯度 | 最终目标对待训练参数的变化率 | `∂L/∂w=76` |

“梯度向后传”不是把前向数值倒着搬回来。反向传播的是变化率，而前向值只是计算某些局部导数时需要复用的上下文。

## 分步动画：数据向右，梯度向左

动画中的蓝色虚线表示当前前向数据流，橙色虚线表示当前反向梯度流。先单步观察，再播放完整过程。

<ClientOnly>
  <BackpropagationDemo />
</ClientOnly>

建议至少停在四个关键状态：

1. **第 5 步**：确认前向值 `a=8、b=64、c=24、L=88` 已经存在；
2. **第 8、9 步**：分别找出两条分支返回给 `a` 的贡献 `16` 和 `3`；
3. **第 10 步**：观察共享节点 `a` 怎样把贡献相加为 `19`；
4. **第 11、12 步**：区分“得到梯度 76”和“优化器使用 76 更新 w”。

## 前向传播为什么要保存中间值

从输入开始：

$$a=wx=2\times4=8$$

两条分支分别得到：

$$b=a^2=8^2=64,\qquad c=3a=3\times8=24$$

最后汇合：

$$L=b+c=64+24=88$$

计算 `b=a²` 的局部导数时要用到 `a`：

$$\frac{\partial b}{\partial a}=2a$$

因此反向传播不能只保留最终的 `L=88`。实现通常会保存反向所需的输入、输出或紧凑上下文；反向结束后，这些中间激活才有机会被释放。这也是深层网络训练常常比纯推理更占显存的原因之一。

## 第一步：从 loss 自身开始

反向传播从最终标量目标开始：

$$\frac{\partial L}{\partial L}=1$$

这个 `1` 不是模型计算出来的特殊参数，而是“一个量对自身的变化率为 1”。它是链式法则的起点。

如果框架对非标量张量调用 `backward()`，通常需要显式提供一个同 shape 的上游梯度，本质仍然是在指定反向传播从哪里、以什么权重开始。

## 第二步：加法节点把梯度传给两条分支

因为 `L=b+c`：

$$
\frac{\partial L}{\partial b}=1,
\qquad
\frac{\partial L}{\partial c}=1
$$

可以做一个微小变化实验：保持 `c` 不变，只把 `b` 增加 `0.01`，`L` 也增加 `0.01`；所以变化率为 1。对 `c` 同理。

这里不是把一个梯度平均分成 `0.5` 和 `0.5`。`b` 和 `c` 都独立影响 `L`，两条依赖路径各自得到完整的局部变化率。

## 第三步：每条分支计算自己的链式贡献

上分支 `b=a²`：

$$
\left.\frac{\partial L}{\partial a}\right|_{b\text{ 路径}}
=\frac{\partial L}{\partial b}\frac{\partial b}{\partial a}
=1\times2a
=1\times16
=16
$$

下分支 `c=3a`：

$$
\left.\frac{\partial L}{\partial a}\right|_{c\text{ 路径}}
=\frac{\partial L}{\partial c}\frac{\partial c}{\partial a}
=1\times3
=3
$$

这就是每个局部节点执行的通用规则：

$$
\text{传给输入的梯度}
=\text{收到的上游梯度}
\times\text{局部导数}
$$

节点不需要知道 `w` 在哪里，也不必重新展开完整的 `L(w)`；它只处理自己的输入、输出和上游梯度。

## 第四步：共享变量处必须累加

`a` 通过两条路径影响 `L`，所以总变化率是两条路径贡献之和：

$$
\frac{\partial L}{\partial a}
=16+3
=19
$$

可以直接展开函数验证：

$$
L(a)=a^2+3a
\quad\Rightarrow\quad
\frac{dL}{da}=2a+3=19
$$

这解释了深度学习框架为什么默认**累加梯度**：同一个张量或参数可能被多个分支、多个时间步、多个 token，甚至 batch 中的多个样本重复使用。所有路径都完成后，累积值才是最终梯度。

> 这也是连续训练步骤之间通常要先清空梯度的原因。若没有 `zero_grad()`，上一次反向传播留下的参数梯度会与这一次继续相加。

## 第五步：继续传播到参数 w

对于 `a=wx`，对 `w` 求局部导数时把 `x` 视为常量：

$$\frac{\partial a}{\partial w}=x=4$$

所以：

$$
\frac{\partial L}{\partial w}
=\frac{\partial L}{\partial a}\frac{\partial a}{\partial w}
=19\times4
=76
$$

`76` 的局部含义是：在 `w=2` 附近，如果 `w` 增加一个很小的 `Δw`，那么 `L` 大约增加 `76Δw`。它是当前位置的一阶近似，不表示所有位置的斜率永远是 76。

## backward 不负责更新参数

到 `∂L/∂w=76`，反向传播已经完成。若使用最简单的梯度下降、学习率 `η=0.01`，优化器才执行：

$$
w' = w-\eta\frac{\partial L}{\partial w}
=2-0.01\times76
=1.24
$$

两者职责必须分开：

| 阶段 | 输入 | 输出 | 不负责 |
| --- | --- | --- | --- |
| `backward` | loss、计算图、前向缓存 | 各参数梯度 | 修改参数值 |
| `optimizer.step` | 参数、梯度、优化器状态 | 新参数 | 重新计算当前 batch 的梯度 |
| `zero_grad` | 参数上的旧梯度 | 清空或设为 `None` | 前向和反向计算 |

Adam、动量、权重衰减和梯度裁剪会改变“怎样使用梯度”，但不改变反向传播求导的基本链路。

## 连接回两层 MLP

MLP 看起来比标量图复杂，只是把许多相同规则批量写成矩阵运算。对线性层：

$$Z=XW+b$$

若上游梯度为 `G=∂L/∂Z`，则：

$$
\frac{\partial L}{\partial W}=X^\top G,
\qquad
\frac{\partial L}{\partial X}=GW^\top,
\qquad
\frac{\partial L}{\partial b}=\sum_{\text{batch}}G
$$

- `XᵀG` 把 batch 中所有样本对共享权重 `W` 的贡献汇总起来；
- `GWᵀ` 把梯度继续传给前一层；
- 偏置在每个样本中都被使用，所以它的梯度沿 batch 维求和。

激活函数再执行逐元素的“上游梯度 × 局部导数”。因此自动微分并没有使用另一套数学，只是替你记录计算图并按反拓扑顺序执行这些局部规则。

## 为什么一次反向就能得到全部参数梯度

如果针对每个参数分别做符号展开或重新扰动前向计算，会重复计算大量共享子表达式。反向模式自动微分从单个标量 loss 出发，一次反向遍历便能复用相同中间结果，为所有上游参数收集梯度。

粗略地说，反向传播的计算量通常与前向传播处于同一数量级，但还需要保存或重算中间激活。梯度检查使用有限差分很直观，却需要针对大量参数重复前向，因此适合验证，不适合作为正常训练算法。

## 最小数值验证

下面用中心有限差分从函数值独立估计 `dL/dw`，验证解析结果 76：

<ClientOnly>
  <PythonPlayground
    title="用有限差分检查反向传播结果"
    :code="`def loss(w, x=4):\n    a = w * x\n    b = a * a\n    c = 3 * a\n    return b + c\n\nw = 2.0\neps = 1e-5\nnumeric = (loss(w + eps) - loss(w - eps)) / (2 * eps)\nanalytic = (2 * (w * 4) + 3) * 4\nassert abs(numeric - analytic) < 1e-6\nprint('数值梯度:', numeric)\nprint('解析梯度:', analytic)`"
  />
</ClientOnly>

有限差分会有截断误差和浮点舍入误差，不要求两个结果逐位完全相同；这里只检查误差小于 `1e-6`。

## 常见错误与失效信号

- **在分支处漏加梯度**：只保留最后到达的一条路径，会得到 16 或 3，而不是 19。
- **把前向值当作梯度**：`a=8` 与 `∂L/∂a=19` 描述的是不同对象。
- **反向前修改缓存值**：原地操作可能破坏局部导数需要的前向上下文。
- **忘记清梯度**：参数 `.grad` 默认继续累加，跨训练步骤产生非预期结果。
- **意外断图**：`detach`、转普通数值、不可微操作或禁用梯度记录，会让预期路径没有梯度。
- **梯度为零就认为已最优**：也可能是饱和激活、死 ReLU、断图或数值精度问题。
- **梯度爆炸或消失**：很多局部导数连续相乘后可能迅速放大或缩小；初始化、残差、归一化和裁剪只能改善条件，不保证任务正确。

## 本节自测

<ClientOnly>
  <KnowledgeQuiz
    title="反向传播链路自测"
    storage-key="ai-deep-learning-backpropagation"
    :questions="[
      {
        id: 'backprop-branch-sum',
        type: 'fill',
        prompt: '本页计算图中，上分支给 a 的梯度贡献是 16，下分支是 3，那么 dL/da 等于多少？',
        answer: ['19', '19.0'],
        explanation: '共享变量通过两条路径影响目标，梯度贡献必须相加。',
        remediation: '/ai/deep-learning/backpropagation#第四步共享变量处必须累加'
      },
      {
        id: 'backprop-update',
        type: 'boolean',
        prompt: '调用 backward 的职责包括立刻使用学习率修改参数。',
        answer: false,
        explanation: 'backward 计算并累积梯度；optimizer.step 才读取梯度并更新参数。',
        remediation: '/ai/deep-learning/backpropagation#backward-不负责更新参数'
      },
      {
        id: 'backprop-local-rule',
        type: 'open',
        prompt: '不展开完整函数，用上游梯度和局部导数解释平方节点怎样把梯度传回 a。',
        rubric: [
          '指出平方节点收到的上游梯度 dL/db=1',
          '写出局部导数 db/da=2a，并代入前向缓存 a=8',
          '将两者相乘得到该路径对 a 的贡献 16'
        ],
        reference: '平方节点执行局部规则：(dL/db)(db/da)=1×(2×8)=16；它不需要知道更前面的 w。'
      }
    ]"
  />
</ClientOnly>

<details>
<summary>静态答案与检查点</summary>

1. `∂L/∂a=16+3=19`。
2. 错误；`backward` 求梯度，优化器才改参数。
3. 上游梯度为 1，局部导数为 `2a=16`，相乘得到上分支贡献 16。

</details>

## 小结与下一步

反向传播可以压缩为一句话：**前向保存局部求导所需的值；反向从 loss 的梯度 1 开始，每个节点将上游梯度乘以局部导数，共享节点累加所有路径贡献。**

在本例中，关键链路是：

```text
前向：w=2,x=4 → a=8 → b=64,c=24 → L=88
反向：1 → db=1,dc=1 → da=16+3=19 → dw=19×4=76
更新：backward 结束后，优化器才使用 dw
```

下一步进入[让两层 MLP 过拟合四个样本](/ai/deep-learning/mlp-lab)，把前向、loss、反向与更新接成一次可运行训练循环。
