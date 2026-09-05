---
title: 参数量、显存与计算量怎样估算
date: 2026-09-05
updated: 2026-09-05
type: lesson
status: learnable
track: ai
chapter: foundation-models
prerequisites:
  - /ai/foundation-models/training-loop
outcomes:
  - 能按词表、宽度、层数与 MLP 倍率估算 Decoder 模型参数量
  - 能区分权重、训练状态、激活与 KV Cache 四类显存
  - 能预测扩大 C、L、T、B 分别主要影响什么
estimated: 45min
categories: [智能算法]
tags: [Parameters, Memory, Compute, Scaling]
description: 用可修改计算器建立语言模型参数、训练显存、注意力成本和 KV Cache 的数量级直觉。
---

# 参数量、显存与计算量怎样估算

“70B 模型”“128K 上下文”“需要多少显存”经常被混在一起讨论。它们其实属于不同对象：参数决定模型保存多少权重，上下文决定一次处理多少 token，训练状态、激活和 KV Cache 又各自占用显存。

本页只做**数量级估算**。目标不是替代框架 profiler，而是在配置模型之前判断一个数字是否合理。

## 先认识四个显存账户

| 账户 | 保存什么 | 训练 | 推理 |
| --- | --- | --- | --- |
| 模型权重 | 所有可训练参数的当前值 | 必需 | 必需 |
| 梯度与优化器状态 | 梯度、动量、方差等 | 必需 | 不需要 |
| 激活 | 当前 batch 的中间结果 | 反向传播需要 | 当前前向短暂需要 |
| KV Cache | 历史 token 在每层的 K/V | 通常不用作长期缓存 | 增量生成的主要动态显存 |

所以“参数能装进显存”不等于“模型就能训练”，也不等于“可以使用任意长上下文推理”。

## 原位修改配置，先观察数量级

下面基线接近一个小型 Decoder 模型。依次尝试把 `C` 翻倍、`T` 翻倍、`L` 翻倍，观察哪些结果按平方增长，哪些按线性增长。

<ClientOnly>
  <ModelScaleCalculator />
</ClientOnly>

## 参数量从哪里来

忽略 bias、Norm 等较小项，词嵌入约有：

$$
N_{embed}=VC
$$

每层标准多头注意力有 Q、K、V 和输出四个 `C×C` 投影：

$$
N_{attn}\approx4C^2
$$

若 MLP 中间宽度是 `rC`，普通两层 MLP 约有：

$$
N_{mlp}\approx C(rC)+(rC)C=2rC^2
$$

`L` 层总参数粗估：

$$
N\approx VC+L(4+2r)C^2
$$

若使用门控 MLP（如额外一条 gate 投影），系数会更大；若输入 embedding 与输出词表头不共享，还要再加一个 `CV`。因此估算时必须先声明具体结构。

### 为什么宽度特别昂贵

层数 `L` 翻倍，Block 参数近似翻倍；宽度 `C` 翻倍，`C²` 项近似变为四倍。这就是“加宽”和“加深”成本不同的原因。

## 权重显存不是训练显存

只存 FP16/BF16 权重时：

$$
M_{weights}\approx2N\ \text{bytes}
$$

但常见混合精度 Adam 训练还可能保存低精度参数、梯度、FP32 主参数、两份 FP32 优化器状态，粗略可达到每参数约 16 bytes。具体实现可能通过低精度优化器、参数分片或重计算改变这个值。

因此 `N×16 bytes` 只是“未考虑分片和激活的训练状态粗估”，不能当成采购承诺。

## 激活为什么与 batch 和序列长度有关

每层至少会产生若干 `[B,T,C]` 中间张量，注意力还涉及 Q/K/V 和概率相关数据。粗略关系：

```text
activation memory ∝ B × T × C × L × 每层保存系数
```

系数受反向实现、激活函数、注意力内核和 checkpointing 影响很大。激活检查点通过“不保存一部分激活、反向时重新算”来换显存，代价是更多计算。

## 上下文长度为什么可能出现平方成本

标准注意力分数矩阵对每个 head 是 `[T,T]`：

$$
N_{scores}\propto BHT^2
$$

若 `T` 翻倍，朴素分数元素变为四倍。高效注意力内核可以不把完整分数矩阵长期写回显存，从而显著降低内存流量，但标准全注意力的配对计算关系仍与 `T²` 有关。

不要把“实现没有保存完整矩阵”误解为“每个 token 不再与所有历史 token 计算关系”。局部、稀疏或线性注意力才会改变可见结构或复杂度假设。

## KV Cache 是推理时增长的状态

标准多头注意力粗估每个 token 每层保存一份 K 和一份 V：

$$
M_{KV}\approx2LBTC\times \text{bytes}
$$

因此：

- 上下文 `T` 翻倍，KV Cache 近似翻倍；
- 并发 batch `B` 翻倍，KV Cache 近似翻倍；
- 层数和宽度也线性影响缓存；
- MQA/GQA 共享较少的 K/V heads，可明显减少实际 KV Cache。

详细执行过程留到[Prefill 与 KV Cache](/ai/foundation-models/prefill-kv-cache)。

## 训练计算量的粗略尺度

对 Dense Transformer，常见数量级近似把训练 FLOPs 写成：

$$
\text{training FLOPs}\approx6ND
$$

其中 `N` 是非 embedding 为主的参数量，`D` 是训练 token 数。常数 6 来自前向和反向的粗略矩阵乘法成本，不包含所有架构细节、数据加载、通信与硬件利用率。

这个公式只适合预算第一眼估算。真实墙钟时间还取决于 GPU 吞吐、并行策略、通信、序列长度、算子融合和故障恢复。

## Scaling 不是只把参数做大

经验 scaling law 研究的是模型规模、数据规模和训练计算之间的关系，而不是“参数越多必然越好”。在固定计算预算下，参数与训练 token 的分配会影响最终 loss；数据质量、重复率和评测分布也不会被一个参数数字替代。

因此看到“大模型”时至少追问：

1. 参数是总参数还是每 token 激活参数？
2. 训练使用多少 token，是否去重？
3. 上下文长度和训练长度是多少？
4. 计算预算与训练是否充分？
5. 比较是否使用相同数据、目标和评测？

## 三个手算练习

### 练习 1：宽度翻倍

保持 `V,L,r` 不变，将 `C` 从 768 变为 1536。Embedding 参数约翻倍，Block 内 `C²` 参数约变为四倍。

### 练习 2：上下文翻倍

保持模型参数不变，将 `T` 从 2048 变为 4096。模型参数不变，标准 KV Cache 约翻倍，朴素注意力分数元素约变为四倍。

### 练习 3：量化权重

把每个权重从 2 bytes 近似降到 1 byte，只能直接说明权重存储约减半。不能据此断言总推理显存减半，因为 KV Cache、临时激活和运行时开销还在。

## 常见误解

- **参数量等于模型文件大小**：还取决于 dtype、量化格式和元数据。
- **推理显存等于权重显存**：长上下文和高并发下 KV Cache 可能很大。
- **上下文翻倍只会慢一倍**：标准注意力的配对项可能按平方增长。
- **MoE 总参数就是每 token 计算量**：MoE 通常只激活部分专家，两者必须分开报告。
- **公式能替代实测**：内核、分片、缓存和框架保留内存都会造成差异。

## 本节自测

<KnowledgeQuiz
  storage-key="foundation-scale-v1"
  :questions="[
    { id:'scale-1', type:'single', prompt:'保持其他量不变，把隐藏宽度 C 翻倍，Block 中 C² 参数约变成多少倍？', options:['2 倍','4 倍','8 倍'], answer:'4 倍', explanation:'注意力和 MLP 的主要矩阵都含 C²。' },
    { id:'scale-2', type:'boolean', prompt:'只要 FP16 权重可以装入显存，这张卡就一定能训练该模型。', answer:false, explanation:'训练还需要梯度、优化器状态和激活。' },
    { id:'scale-3', type:'fill', prompt:'标准 KV Cache 对上下文长度 T 是线性还是平方增长？', answer:['线性','线性增长'], explanation:'每个新增 token 在每层追加 K/V；标准注意力分数配对才涉及 T²。' },
    { id:'scale-4', type:'open', prompt:'为什么“上下文从 4K 提升到 8K”不能只根据模型参数量判断成本？', rubric:['指出参数量通常不随单次输入 T 改变','指出 KV Cache 随 T 线性增长','指出标准注意力配对与 T² 有关','指出实现和并发会影响实际显存与速度'], reference:'模型权重可以不变，但动态缓存、激活和注意力计算会随上下文增长，所以必须同时看架构、内核、batch 和 dtype。' }
  ]"
/>

打印版答案：1. 4 倍；2. 错；3. 线性；4. 应覆盖参数不变、动态状态增长和实现差异。

## 来源与下一步

- [Scaling Laws for Neural Language Models](https://arxiv.org/abs/2001.08361)
- [Training Compute-Optimal Large Language Models](https://arxiv.org/abs/2203.15556)

下一步学习[训练与生成为什么不同](/ai/foundation-models/training-vs-generation)，随后进入增量推理。规模公式是估算工具，不是对任意具体模型的精确承诺。
