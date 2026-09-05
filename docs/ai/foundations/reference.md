---
title: 数学符号与 shape 速查
date: 2026-09-04
updated: 2026-09-04
type: reference
status: verified
track: ai
description: 智能算法专栏通用的符号、shape 约束、轴操作和数值规则。
---

# 数学符号与 shape 速查

## 适用范围

适用于本站第 0–7 章。未特别说明时，shape 采用 batch-first 表示。

| 符号 | 含义 | 常见值域/约束 |
| --- | --- | --- |
| `B` | batch size | 正整数 |
| `T` | sequence length | 正整数 |
| `C` | hidden size | 正整数 |
| `H` | query head 数 | `C % H == 0` |
| `D` | 每头维度 | 通常 `C / H` |
| `V` | vocabulary size | 正整数 |
| `N` | 样本数 | 正整数 |
| `θ` | 全部可训练参数 | 向量或参数集合 |
| `η` | learning rate | 正实数 |

## 核心约束

| 运算 | 输入 → 输出 | 不变量/汇总轴 |
| --- | --- | --- |
| 矩阵乘法 | `[M,K] @ [K,N] → [M,N]` | `K` 被乘加汇总 |
| 线性层 | `[B,T,Cin] @ [Cin,Cout] → [B,T,Cout]` | `B,T` 为批次轴 |
| 拆头 | `[B,T,C] → [B,T,H,D]` | `C=H×D`，元素数不变 |
| 转置 | `[B,T,H,D] → [B,H,T,D]` | 数值集合不变，索引顺序改变 |
| 注意力分数 | `[B,H,T,D] @ [B,H,D,T] → [B,H,T,T]` | `D` 被汇总 |

## 数值规则

- 稳定 softmax：先从每行 logits 减去该行最大值；
- 交叉熵单标签形式：$L=-\log p_y$；
- 梯度下降：$\theta_{t+1}=\theta_t-\eta\nabla_\theta L$；
- 比较浮点结果使用容差，不直接要求所有小数位完全相等。

## 易混淆项

- `*` 是逐元素乘，`@` 是矩阵乘；
- rank 是轴数量，shape 是每个轴长度；
- 参数量、激活元素数和 FLOPs 是不同资源指标；
- shape 合法不代表数据语义正确。

最小正确示例见[矩阵乘法](/ai/foundations/matrix-multiplication)和[基础计算实验](/ai/foundations/lab)。
