---
title: Prefill、Decode 与 KV Cache 怎样工作
date: 2026-09-05
updated: 2026-09-05
type: lesson
status: learnable
track: ai
chapter: foundation-models
prerequisites:
  - /ai/foundation-models/training-vs-generation
  - /ai/foundation-models/parameters-memory-compute
outcomes:
  - 能把一次生成拆成 Prefill 与逐 token Decode 两个阶段
  - 能解释 KV Cache 保存什么、没有保存什么以及为什么结果应保持等价
  - 能区分首 token 延迟、逐 token 延迟、吞吐与缓存显存
estimated: 45min
categories: [智能算法]
tags: [Inference, KV Cache, Prefill, Decode]
description: 用逐步交互追踪 Prompt 的 Prefill、增量 Decode 和每层 KV Cache，理解推理中的时间与显存交换。
---

# Prefill、Decode 与 KV Cache 怎样工作

生成阶段每次只新增一个 token。如果每一步都把完整历史重新通过所有 Decoder Block，历史 token 的 K/V 会被重复计算。KV Cache 保存这些不会改变的中间结果，让下一步只计算新 token。

本页研究标准 Decoder-only 增量推理。不讨论服务端调度、分页缓存和并行部署的具体实现。

## 先拆成两个阶段

给定 Prompt：

```text
<BOS> 我 喜欢
```

一次生成分为：

1. **Prefill**：并行处理 Prompt 的全部 token，建立每层 K/V 缓存，并得到第一个待生成 token 的 logits；
2. **Decode**：选出新 token 后，只处理这个 token，同时读取历史缓存，再生成下一个。

观察组件时比较左右两栏：左边重复计算了哪些历史位置，右边缓存如何增长。Prompt token 可以直接在上方修改，但缓存位置关系不变。

<ClientOnly>
  <KvCacheDemo />
</ClientOnly>

## Prefill 做了什么

Prompt 长度为 `T_prompt`。它一次进入模型：

```text
input_ids [B,T_prompt]
→ L 层 Decoder
→ 每层 K_cache、V_cache
→ 最后一个有效位置 logits [B,V]
```

每层通常保存：

$$
K^{(\ell)},V^{(\ell)}\in\mathbb{R}^{B\times H_{kv}\times T_{prompt}\times d_h}
$$

`H_kv` 是 K/V heads 数。普通多头注意力中它等于查询 heads；GQA/MQA 会让多个查询 heads 共享较少 K/V heads。

Prefill 能并行处理 Prompt 内的所有位置，但标准因果遮罩仍阻止早期位置读取后面的 Prompt token。

## Decode 只新增一行

假设采样得到“猫”。下一步输入只包含新 token 的 ID，模型在每层计算：

```text
Q_new, K_new, V_new
Q_new 与 [K_cache, K_new] 做注意力
读取 [V_cache, V_new]
把 K_new、V_new 追加到缓存
```

Query 不需要长期保存，因为下一步会产生新的 Query；历史 K/V 必须保留，因为未来 token 仍要与它们匹配并读取内容。

### 为什么缓存不会改变模型答案

在 `eval` 模式、相同数值精度和相同位置编码处理下：

```text
完整重算最后位置 logits ≈ 使用缓存的最后位置 logits
```

缓存是避免重复计算的执行优化，不应改变模型定义。如果差异明显，应优先检查：

- 新 token 的位置索引是否从历史长度继续；
- causal mask 与缓存长度是否匹配；
- K/V 拼接轴是否正确；
- batch 中不同序列的有效长度是否混淆；
- 训练模式中的 dropout 是否仍开启。

浮点计算顺序不同可能带来极小数值差异，因此工程测试通常使用容差比较，而不是要求逐 bit 相等。

## Cache 保存在哪里

每个 Decoder Block 都有自己的一份 K/V：

```text
layer 0: K0, V0
layer 1: K1, V1
...
layer L-1: KL-1, VL-1
```

不能只保存第一层 K/V 后给所有层复用，因为每层输入隐藏状态不同，投影参数也不同。

标准缓存大小粗估：

$$
2\times L\times B\times H_{kv}\times T\times d_h\times\text{bytes}
$$

普通多头注意力中 `H_kv d_h = C`，便得到上一课的 `2LBTC×bytes`。

## 它省掉了什么，又没有省掉什么

KV Cache 省掉：

- 历史 token 再次通过 embedding 和所有 Block；
- 历史位置 K/V 的重复线性投影；
- 历史 MLP 与残差路径的重复计算。

它没有省掉：

- 新 token 自己的完整前向；
- 新 Query 与越来越长的历史 Key 做匹配；
- 缓存占用及读写带宽；
- 采样、停止条件和服务调度。

因此 Decode 仍会随上下文增长而变慢，只是不再从头重算整段序列。

## 四个性能词不要混用

| 指标 | 回答的问题 | 主要受什么影响 |
| --- | --- | --- |
| TTFT / 首 token 延迟 | 发出请求后多久看到第一个 token | Prompt 长度、Prefill 吞吐、排队 |
| TPOT / token 间延迟 | 后续每个 token 间隔多久 | Decode、缓存读取、历史长度 |
| throughput / 吞吐 | 单位时间系统处理多少 token/请求 | batch、调度、硬件利用率 |
| KV memory | 能同时保存多少上下文和请求 | 层数、KV heads、长度、dtype |

降低单请求延迟与提高全系统吞吐可能冲突。例如等待更多请求组成 batch 能提高设备利用率，却可能增加排队时间。

## 位置编码是缓存正确性的关键

新 token 的逻辑位置不是 0，而是当前缓存长度。若 Prompt 有 3 个 token，新 token “猫”的位置是 3。对于 RoPE 等位置机制，Q/K 必须使用正确位置，否则缓存中的历史 K 与新 Query 不在一致坐标约定中。

当采用滑动窗口、上下文裁剪或缓存压缩时，位置处理更加复杂。它们属于具体模型/推理引擎约束，不能只删除缓存前几项就假设语义保持不变。

## 停止条件在哪里发生

每次 Decode 得到 logits 后：

1. 应用温度、top-k/top-p 等处理；
2. 选出 token；
3. 若是 `<EOS>`、命中停止字符串或达到最大长度，则停止；
4. 否则把 token 送入下一步并追加 K/V。

KV Cache 决定怎样高效计算 logits，采样策略决定从 logits 选择什么。二者不能混为一个“生成算法”。

## 常见错误

- 缓存了隐藏状态却没有缓存每层 K/V；
- 新 token 仍与整个 Prompt 一起送入，导致缓存内容重复；
- position id 从 0 重新开始；
- beam search 重排候选后没有同步重排 cache；
- 认为 `use_cache=true` 会改变模型参数；
- 用总 token/s 掩盖很差的首 token 延迟。

## 本节自测

<KnowledgeQuiz
  storage-key="foundation-kv-cache-v1"
  :questions="[
    { id:'kv-1', type:'single', prompt:'标准 KV Cache 长期保存哪两类张量？', options:['Q 和 K','K 和 V','Q 和 logits'], answer:'K 和 V', explanation:'未来 Query 仍需与历史 K 匹配并读取历史 V；历史 Q 不再使用。' },
    { id:'kv-2', type:'boolean', prompt:'使用 KV Cache 后，新 token 不需要经过 Decoder Block。', answer:false, explanation:'只有历史 token 不再重复通过；新 token 仍要完成全部层计算。' },
    { id:'kv-3', type:'fill', prompt:'Prompt 有 12 个 token 时，第一个新 token 的零基位置索引是多少？', answer:['12'], explanation:'Prompt 占据位置 0 到 11，新 token 从位置 12 开始。' },
    { id:'kv-4', type:'open', prompt:'为什么 KV Cache 同时可能提高速度和限制并发？', rubric:['说明它避免历史 K/V 与 Block 的重复计算','说明缓存随层数、长度、batch 增长并占显存','指出显存不足会限制同时保留的请求/上下文'], reference:'缓存用更多显存保存历史中间结果，换取 Decode 少做重复计算；并发请求越多，缓存总量越大。' }
  ]"
/>

打印版答案：1. K 和 V；2. 错；3. 12；4. 核心是“显存换计算”。

## 小结与下一步

现在你已经知道 logits 如何高效产生。下一课[采样参数怎样改变生成结果](/ai/foundation-models/sampling)只研究“拿到最后位置分布后怎样选 token”。
