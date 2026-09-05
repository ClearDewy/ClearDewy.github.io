---
title: 注意力公式、符号与 shape 速查
date: 2026-09-04
updated: 2026-09-05
type: reference
status: verified
track: ai
chapter: transformers
categories: [智能算法]
tags: [Attention, Shape, Mask, KV Cache]
description: 查询缩放点积注意力、多头变形、mask 广播、MHA/MQA/GQA、KV cache 和复杂度约束。
---

# 注意力公式、符号与 shape 速查

适用范围：batch-first 表示、标准缩放点积注意力。本文用于查询，不代替[QKV 概念课](/ai/transformers/qkv-retrieval)、[完整流水线](/ai/transformers/attention-pipeline)和[多头 shape](/ai/transformers/multi-head-shapes)。

## 符号约定

| 符号 | 含义 |
| --- | --- |
| `B` | batch size |
| `Tq` | query 序列长度 |
| `Tk` | key/value 序列长度 |
| `C` | 模型隐藏维度 |
| `Hq` | Query 头数 |
| `Hkv` | Key/Value 头数 |
| `D` | 每头 Q/K 维度 |
| `Dv` | 每头 Value 维度，常与 `D` 相同 |
| `M` | 可广播到 scores 的加性 mask |

self-attention 常有 `Tq=Tk=T`；cross-attention 可以 `Tq≠Tk`。MHA 中 `Hq=Hkv`，GQA/MQA 中二者不同。

## 核心公式

单头：

$$
O=\operatorname{softmax}_{T_k}\left(\frac{QK^\top}{\sqrt D}+M\right)V
$$

多头：

$$
head_h=Attention(Q_h,K_{g(h)},V_{g(h)})
$$

$$
Y=Concat(head_1,\ldots,head_{H_q})W_O
$$

`g(h)` 在 MHA 中是一一对应，在 GQA/MQA 中把多个 Query 头映射到共享 K/V 头。

## 主要张量 shape

| 对象 | shape | 轴语义 |
| --- | --- | --- |
| 输入 `X` | `[B,T,C]` | 样本、token、隐藏特征 |
| packed Q | `[B,Tq,Hq×D]` | 尚未拆头的 Query 投影 |
| Q | `[B,Hq,Tq,D]` | 样本、Query 头、Query 位置、每头特征 |
| K | `[B,Hkv,Tk,D]` | 样本、KV 头、Key 位置、每头特征 |
| V | `[B,Hkv,Tk,Dv]` | 样本、KV 头、Value 位置、每头内容 |
| scores | `[B,Hq,Tq,Tk]` | 每个 Query 对每个 Key 的分数 |
| weights | `[B,Hq,Tq,Tk]` | 沿 `Tk` 归一化的读取比例 |
| heads output | `[B,Hq,Tq,Dv]` | 每个 Query 头的读取结果 |
| concat output | `[B,Tq,Hq×Dv]` | 合并头后的 token 表示 |
| final output | `[B,Tq,C]` | 经输出投影，通常与 residual 兼容 |

## Shape 推导模板

```text
X [B,T,C]
@ Wq [C,Hq×D]
→ [B,T,Hq×D]
reshape → [B,T,Hq,D]
transpose → Q [B,Hq,T,D]

Q [B,Hq,Tq,D]
@ Kᵀ [B,Hq,D,Tk]
→ scores [B,Hq,Tq,Tk]

weights [B,Hq,Tq,Tk]
@ V [B,Hq,Tk,Dv]
→ heads [B,Hq,Tq,Dv]

transpose + reshape
→ [B,Tq,Hq×Dv]
@ Wo [Hq×Dv,C]
→ [B,Tq,C]
```

GQA/MQA 需要把每个 Query 头逻辑映射到 K/V 头。实现可以通过广播、分组 kernel 或临时展开完成；缓存前不应无意义地物理复制 K/V。

## 必须成立的不变量

- Q 与 K 的最后一维必须相同，才能点积。
- K 与 V 的 `Tk` 必须一致，才能用同一权重寻址内容。
- scores 的行轴是 `Tq`，列轴是 `Tk`。
- softmax 沿 `Tk`；每个非全遮罩行权重和约为 1。
- causal self-attention 中所有 `key_position > query_position` 的权重为 0。
- weighted V 消去 `Tk`，输出保留 `Tq`。
- `C=Hq×Dv` 时可直接合并回 C；否则输出投影输入维应匹配 `Hq×Dv`。
- residual 相加的两个张量必须 shape 兼容。

## Mask 类型与广播

目标 scores shape：`[B,Hq,Tq,Tk]`。

| Mask | 常见 shape | 语义 |
| --- | --- | --- |
| causal | `[Tq,Tk]` 或 `[1,1,Tq,Tk]` | 禁止读取未来位置 |
| key padding | `[B,Tk]`，整理为 `[B,1,1,Tk]` | 禁止读取 padding key |
| query-specific | `[B,1,Tq,Tk]` | 每个样本、query 有不同访问边界 |
| combined | 可广播到 `[B,Hq,Tq,Tk]` | 同时应用 causal 与 padding 等规则 |

两种常见接口语义：

- boolean mask：由 API 规定 `true` 表示保留还是屏蔽，必须查清约定；
- additive mask：合法位置加 0，非法位置加负无穷或 dtype 安全的极小值。

不要只看 mask 自身 shape；要写出它与 `[B,Hq,Tq,Tk]` 对齐后的每个轴。

## MHA、MQA、GQA

| 变体 | 头数关系 | Query 输出头 | KV cache 相对规模 |
| --- | --- | ---: | ---: |
| MHA | `Hq=Hkv` | `Hq` | 基线 |
| MQA | `Hkv=1` | `Hq` | 约为 MHA 的 `1/Hq` |
| GQA | `1<Hkv<Hq` 且通常 `Hq%Hkv=0` | `Hq` | 约为 MHA 的 `Hkv/Hq` |

这些比例只比较头数，其余条件需固定，例如层数、序列长度、每头维度、dtype 和 batch。

## KV Cache

自回归 decode 时，每层保存历史 token 的 K/V，避免对历史位置重复做 K/V 投影。单层元素数近似：

$$N_{cache}=2\times B\times H_{kv}\times T\times D$$

总字节数近似：

$$Bytes=N_{layers}\times N_{cache}\times bytes(dtype)$$

KV cache：

- 保存历史 K/V，不保存未来 token；
- 不免除新 Query 与全部历史 Key 的打分；
- 不等同于 attention scores 缓存；
- 会受 batch、序列长度、层数、KV 头数、每头维度和 dtype 共同影响。

## 计算与存储复杂度

忽略常数和具体 kernel：

| 部分 | 主要量级 |
| --- | --- |
| QKV 投影 | 约 `O(B×T×C²)`，取决于投影维度 |
| QK 转置 | `O(B×Hq×Tq×Tk×D)` |
| weights @ V | `O(B×Hq×Tq×Tk×Dv)` |
| 显式 scores/weights 存储 | `O(B×Hq×Tq×Tk)` |
| 单层 KV cache | `O(B×Hkv×T×D)` |

FlashAttention 一类算法可以减少中间读写和显式存储，但数学上的 token 两两依赖与输出结果定义不因此改变。

## 最小正确数值

本章固定例：

```text
Q = K = [[1,0],[0,1]]
V = [[2,0],[0,4]]
D = 2
causal mask = [[0,-∞],[0,0]]

scores = [[1,0],[0,1]]
scaled = [[0.7071,0],[0,0.7071]]
weights ≈ [[1,0],[0.3302,0.6698]]
output ≈ [[2,0],[0.6605,2.6790]]
```

## 常见错误速查

| 现象 | 优先检查 |
| --- | --- |
| matmul shape 报错 | K 是否转置最后两轴；Q/K 的 D 是否相同 |
| 行权重和不为 1 | softmax 轴；全遮罩行；mask 是否在 softmax 前 |
| 训练 loss 过低、逐步生成崩溃 | label shift；causal mask 方向、对角线和广播 |
| 输出 token 数变成 Tk | weights 与 V 的乘法方向 |
| GQA cache 没减少 | 缓存前是否把 K/V 物理复制到 Hq |
| 长序列显存急剧增长 | scores/weights 的 `Tq×Tk`；kernel 是否显式物化 |
| attention 权重正常但结果异常 | Value、输出投影、residual、位置编码与 dtype |

数值推导见[完整注意力流水线](/ai/transformers/attention-pipeline)，可执行断言见[单头因果注意力实验](/ai/transformers/attention-lab)。
