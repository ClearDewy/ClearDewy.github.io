---
title: 从零实现并验证单头因果注意力
date: 2026-09-04
updated: 2026-09-05
type: lab
status: verified
track: ai
chapter: transformers
prerequisites:
  - /ai/transformers/attention-pipeline
outcomes:
  - 能仅用 Python 标准库实现稳定 softmax 和因果注意力
  - 能用断言验证 mask、权重行和与输出 shape
  - 能通过消融复现未来信息泄漏和错误归一化
  - 能区分固定样例验证与真实框架实现的边界
estimated: 50 分钟
categories: [智能算法]
tags: [Attention, Python, Experiment, Causal Mask]
description: 使用固定两 token 输入实现 QK 转置、缩放、mask、softmax 和 weighted V，并通过消融与断言验证关键不变量。
---

# 从零实现并验证单头因果注意力

## 实验目标与待验证命题

不用 NumPy 或张量框架，实现：

```text
QKᵀ → ÷√D → causal mask → stable softmax → weights @ V
```

本实验要产生四条证据：

1. 所有未来位置权重为 0；
2. 每个合法 query 的权重行和约为 1；
3. 输出 shape 为 `[Tq,Dv]`，保留 query 数量；
4. 去掉 causal mask 后，第一个输出混入第二个 Value。

## 环境、输入与预计耗时

- Python 3.10+；只使用标准库 `math`；
- CPU 即可，固定样例运行时间通常低于 1 秒；
- 无随机数、无网络下载、无文件输出；
- 数值与[完整注意力流水线](/ai/transformers/attention-pipeline)一致。

$$
Q=K=\begin{bmatrix}1&0\\0&1\end{bmatrix},
\qquad
V=\begin{bmatrix}2&0\\0&4\end{bmatrix}
$$

## 基线实现

先阅读代码并预测两个权重行，再运行。不要先改数字。

<ClientOnly>
  <PythonPlayground
    title="实现并验证单头因果注意力"
    :code="`from math import exp, sqrt\n\nQ = K = [[1.0, 0.0], [0.0, 1.0]]\nV = [[2.0, 0.0], [0.0, 4.0]]\n\ndef dot(left, right):\n    assert len(left) == len(right)\n    return sum(a * b for a, b in zip(left, right))\n\ndef stable_softmax(row):\n    peak = max(row)\n    values = [exp(value - peak) for value in row]\n    total = sum(values)\n    return [value / total for value in values]\n\ndef attention(queries, keys, values, causal=True):\n    dimension = len(queries[0])\n    scores = [\n        [dot(query, key) / sqrt(dimension) for key in keys]\n        for query in queries\n    ]\n    if causal:\n        for query_index, row in enumerate(scores):\n            for key_index in range(query_index + 1, len(row)):\n                row[key_index] = float('-inf')\n    weights = [stable_softmax(row) for row in scores]\n    output = [\n        [sum(weights[i][j] * values[j][d] for j in range(len(values)))\n         for d in range(len(values[0]))]\n        for i in range(len(queries))\n    ]\n    return scores, weights, output\n\nscores, weights, output = attention(Q, K, V)\n\nassert len(output) == len(Q)\nassert all(len(row) == len(V[0]) for row in output)\nassert all(abs(sum(row) - 1.0) < 1e-12 for row in weights)\nassert all(weights[i][j] == 0.0\n           for i in range(len(Q))\n           for j in range(i + 1, len(K)))\nassert output[0] == [2.0, 0.0]\nassert abs(output[1][0] - 0.6604769) < 1e-6\nassert abs(output[1][1] - 2.6790462) < 1e-6\n\nfor name, matrix in [('weights', weights), ('output', output)]:\n    print(name)\n    for row in matrix:\n        print(' ', [round(value, 6) for value in row])`"
  />
</ClientOnly>

预期关键输出：

```text
weights
  [1.0, 0.0]
  [0.330238, 0.669762]
output
  [2.0, 0.0]
  [0.660477, 2.679046]
```

只看到“没有报错”还不够。必须解释：第一行为何是 `[1,0]`，第二个输出的两个分量分别来自哪一行 Value。

## 实验一：删除 mask，复现未来信息泄漏

把调用改为：

```python
scores, weights, output = attention(Q, K, V, causal=False)
```

同时暂时注释“未来权重为 0”的断言。预期第一行变为：

```text
weights[0] ≈ [0.669762, 0.330238]
output[0]  ≈ [1.339523, 1.320953]
```

解释：query 1 原本只能读取 value 1；去掉 mask 后，它把约 33% 权重分给未来的 value 2，因此输出第二个分量从 0 变为约 1.32。

这证明的是“当前实现允许未来信息进入”，不是证明现实模型一定会完全依赖泄漏。训练中是否造成问题还取决于目标与数据，但因果生成的访问约束已经被破坏。

## 实验二：故意沿错误轴归一化

当前 `stable_softmax(row)` 对每个 query 行独立执行。为了复现错误，可以先转置 scores，对每列 softmax，再转回来。

检查：

```python
assert all(abs(sum(row) - 1.0) < 1e-12 for row in weights)
```

错误轴下，这个行和断言通常失败。shape 仍是 `[2,2]`，所以只看 shape 无法发现问题。

## 实验三：验证数值稳定 softmax

运行：

```python
print(stable_softmax([1000.0, 1001.0]))
```

预期得到约 `[0.268941,0.731059]`，而不是指数溢出。因为 softmax 对整行平移不敏感：

$$softmax([1000,1001])=softmax([-1,0])$$

减去最大值不能解决全为负无穷的行；真实 padding 与 mask 逻辑必须保证至少一个合法 key，或显式定义空行行为。

## 实验四：只修改 Value

保持 Q、K 不变，将：

```python
V = [[10.0, 1.0], [20.0, 2.0]]
```

预期：scores 和 weights 完全不变，output 改变。这个消融验证 Q/K 负责匹配、V 负责提供内容。

## 实验记录与判断条件

| 实验 | 需要记录 | 通过条件 |
| --- | --- | --- |
| 基线 | weights、output、断言 | 全部断言通过，数值符合预期 |
| 无 mask | 第一行权重和输出 | 未来权重大于 0，输出混入 value 2 |
| 错误轴 | 每行权重和 | 至少一行不满足和为 1 |
| 大 logits | softmax 输出 | 无溢出，结果约 `[0.2689,0.7311]` |
| 改 Value | 前后 scores、weights、output | 前两者不变，output 改变 |

## 实际验证结果

仓库中的 `examples/python/ai_core_examples.py` 使用同一组数值验证了 causal attention。当前基线应满足：

- `weights[0]=[1,0]`；
- 两行权重和误差低于 `1e-12`；
- `output[0]=[2,0]`；
- `output[1]≈[0.6604769,2.6790462]`。

这是固定输入、标准库双精度浮点下的功能验证，不覆盖 GPU kernel、低精度 dtype、自动微分、多头广播或长序列性能。

## 常见失败与排查

- `exp` 溢出：确认每行先减最大合法分数。
- masked 权重不是 0：确认 mask 在 softmax 前加入，且非法值足够小。
- 第一行读到未来：检查上三角方向和是否保留对角线。
- 权重列和为 1、行和不为 1：softmax 轴写反。
- 输出 shape 是 `[Tk,D]`：检查是否误把 weights 转置。
- 浮点断言偶发失败：使用容差，不直接比较一般小数结果。
- 全遮罩行出现 `nan`：确保至少一个合法 key，或显式处理空行。

## 清理与复现

代码不写文件，无需清理。复现记录应包含 Python 版本、修改过的实验分支、实际输出和断言结果。恢复基线后进入[多头注意力的 shape](/ai/transformers/multi-head-shapes)：此时只是给已经验证过的单头增加 batch 和 head 轴。
