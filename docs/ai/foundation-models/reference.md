---
title: 基础模型公式、shape 与推理速查
date: 2026-09-05
updated: 2026-09-05
type: reference
status: verified
track: ai
chapter: foundation-models
categories: [智能算法]
tags: [Language Model, Reference, Inference, Scaling]
description: 查询语言模型的数据对齐、完整结构、参数与显存估算、KV Cache、采样、模型家族和多模态生成术语。
---

# 基础模型公式、shape 与推理速查

本页用于查询，不替代章节课程。默认基础公式讨论 Decoder-only 自回归语言模型；标为“粗估”的数值不能替代具体框架实测。

## 符号

| 符号 | 含义 |
| --- | --- |
| `B` | batch 中的序列数 |
| `T` | 每条序列的 token 数 / 当前上下文长度 |
| `C` | 模型隐藏宽度 |
| `L` | Transformer Block 层数 |
| `H` | Query head 数 |
| `H_kv` | K/V head 数 |
| `d_h` | 单个 head 的宽度，通常 `H×d_h=C` |
| `V` | 词表大小 |
| `r` | MLP 中间宽度相对 `C` 的倍率 |
| `N` | 模型参数量 |
| `D` | 训练 token 数 |

## 数据对象与 shape

| 对象 | shape | 含义 |
| --- | --- | --- |
| token IDs | `[B,T]` | 每个位置的词表索引 |
| labels | `[B,T]` | 每个位置的正确下一个 token ID |
| attention/loss mask | `[B,T]` 或可广播形式 | 读取限制 / 损失有效位置 |
| embedding / hidden | `[B,T,C]` | 每个位置的连续表示 |
| Q | `[B,H,T,d_h]` | 每个位置、每个 Query head 的查询 |
| K/V | `[B,H_kv,T,d_h]` | 可匹配索引与可读取内容 |
| attention scores | `[B,H,T,T]` | 每个 Query 对所有 Key 的分数 |
| vocab weight | `[C,V]` | 隐藏维到词表维的输出投影 |
| logits | `[B,T,V]` | 每个位置对每个候选 token 的分数 |

训练对齐：

```text
input_ids = tokens[:-1]
labels    = tokens[1:]
```

不变量：`labels[b,t]` 必须是 `input_ids[b,t]` 在原 token 流中的真实后继。

## 因果遮罩

$$
M_{i,j}=\begin{cases}0,&j\le i\\-\infty,&j>i\end{cases}
$$

$$
P=\operatorname{softmax}\left(\frac{QK^\top}{\sqrt{d_h}}+M\right)
$$

- causal mask：阻止未来位置被读取；
- padding attention mask：阻止 PAD 成为上下文；
- loss mask：决定哪些输出位置计入 loss。

## Decoder-only 完整路径

```text
input_ids [B,T]
→ embedding + position [B,T,C]
→ L × Decoder Block [B,T,C]
→ final norm [B,T,C]
→ language-model head [C,V]
→ logits [B,T,V]
```

常见 Pre-Norm Block：

$$U=X+Attention(Norm(X))$$

$$Y=U+MLP(Norm(U))$$

每个 Block 外部 shape 通常保持 `[B,T,C]`。

## 自回归目标与损失

$$p(x_1,\ldots,x_T)=\prod_{t=1}^{T}p(x_t\mid x_{<t})$$

$$Z=HW_{vocab}$$

稳定 Softmax：

$$p_v=\frac{e^{z_v-\max(z)}}{\sum_j e^{z_j-\max(z)}}$$

单位置交叉熵：

$$L_t=-\log p(y_t\mid x_{\le t})$$

有效位置平均：

$$L=\frac{\sum_{b,t}m_{b,t}L_{b,t}}{\sum_{b,t}m_{b,t}}$$

## 训练循环

```text
batch
→ forward logits
→ masked cross-entropy
→ backward gradients
→ optional gradient clipping
→ optimizer step
→ zero gradients
```

有效 batch：

$$B_{effective}=B_{micro}\times N_{accum}\times N_{data\ parallel}$$

只有 `optimizer.step()` 改变参数；`backward()` 计算/累积梯度；`zero_grad()` 清除旧梯度。

## 参数量与训练资源粗估

标准 Dense Decoder（忽略 bias、Norm 和架构小项）：

$$N_{embed}\approx VC$$

$$N_{attn/layer}\approx4C^2$$

$$N_{mlp/layer}\approx2rC^2$$

$$N\approx VC+L(4+2r)C^2$$

| 项目 | 粗估 | 备注 |
| --- | --- | --- |
| FP16/BF16 权重 | `2N bytes` | 仅权重 |
| 常见混合精度 Adam 状态 | 约 `16N bytes` | 未计激活，具体实现可不同 |
| 激活 | `∝ B×T×C×L×系数` | 系数高度依赖实现 |
| 注意力分数元素 | `∝ B×H×T²` | 高效内核可减少物化存储 |
| Dense 训练 FLOPs | 约 `6ND` | 预算数量级，不是墙钟时间 |

## Prefill、Decode 与 KV Cache

| 阶段 | 输入 | 主要输出 |
| --- | --- | --- |
| Prefill | 完整 Prompt `[B,T_prompt]` | 每层历史 K/V；首个生成 logits |
| Decode | 每步一个新 token | 新 logits；追加的新 K/V |

标准 KV Cache shape：

$$K,V\in\mathbb{R}^{B\times H_{kv}\times T\times d_h}$$

缓存显存粗估：

$$M_{KV}\approx2LBH_{kv}Td_h\times bytes$$

普通多头注意力可简化为 `2LBTC×bytes`。GQA/MQA 通过减少 `H_kv` 降低缓存。

缓存不更新参数；相同条件下，完整重算与缓存增量计算的最后位置 logits 应在数值容差内一致。

## 生成与采样

温度：

$$p_v(\tau)=softmax(z_v/\tau),\quad \tau>0$$

| 方法 | 规则 |
| --- | --- |
| greedy | 选择 `argmax` |
| full sampling | 从完整归一化分布随机抽样 |
| top-k | 只保留概率最高的 `k` 个，再归一化 |
| top-p | 保留累计概率达到 `p` 的最小高概率集合，再归一化 |
| repetition penalty | 按实现规则调整已出现 token 的 logits |
| seed | 固定伪随机序列，不改变概率定义 |

生成循环：

```text
last-position logits
→ logits processors / temperature / truncation
→ choose token
→ stop? EOS / stop string / max tokens
→ append token and decode again
```

## 模型家族

| 家族 | 主体可见性 | 常见目标 | 典型接口 |
| --- | --- | --- | --- |
| Encoder-only | 输入内双向 | masked token | 表示、分类、抽取 |
| Encoder–Decoder | Encoder 双向；Decoder 因果 | 去噪或条件序列生成 | 来源 → 目标 |
| Decoder-only | 全序列因果 | next-token | 前缀 → 继续生成 |

架构、训练目标、数据和后训练必须分开描述。

## Dense 与 MoE

| 项目 | Dense | MoE |
| --- | --- | --- |
| MLP 路径 | 所有 token 用同一组参数 | Router 选择 top-k 专家 |
| total vs active parameters | 接近 | 可能差异很大 |
| 额外成本 | 常规并行通信 | 路由、容量、负载均衡、all-to-all |

MoE 总参数不能直接代替每 token 计算量；激活参数也不能代替总权重存储。

## 多模态与扩散

视觉语言理解：

```text
image → vision encoder [N,Cv] → projector [N,Clm]
→ 与文本表示一起进入语言模型 → text logits
```

Latent Diffusion：

```text
text → text encoder → condition
noise latent → repeated denoising with condition → image latent → decoder → image
```

自回归模型每步通常追加 token；扩散模型每步通常更新整个连续/潜空间状态。

## 关键不变量

- labels 相对 inputs 右移一个 token；
- 位置 `t` 不能通过 causal attention 读取未来；
- 每个有效位置的词表概率和约为 1；
- padding 与忽略位置不计入 loss；
- Decoder Block 外部隐藏 shape 通常保持 `[B,T,C]`；
- 只有优化器 step 更新参数；
- 生成 token 必须接回下一轮上下文；
- KV Cache 保存每层 K/V，不保存“模型新知识”；
- temperature、top-k、top-p 不更新模型参数；
- EOS 与最大长度共同提供停止边界。

## 常见现象速查

| 现象 | 优先检查 |
| --- | --- |
| loss 异常低、生成很差 | labels 错位、causal mask、数据泄漏 |
| 训练 loss 降、验证升 | 过拟合、分布偏移、重复数据 |
| loss 出现 `nan` | 稳定 Softmax、全屏蔽行、学习率、混合精度 |
| padding 主导输出 | loss mask 与 attention mask |
| 缓存与完整重算不一致 | position id、K/V 拼接轴、有效长度、dropout |
| 长上下文显存暴涨 | KV Cache、激活、注意力实现、batch |
| MoE 吞吐不佳 | 路由负载、专家容量、all-to-all 通信 |
| 改 temperature 后“学会新知识” | 参数没有更新，只是采样分布改变 |
| 固定 seed 仍不复现 | 候选顺序、随机调用、实现与硬件差异 |
| 多模态答案遗漏图片细节 | 输入分辨率、裁剪、视觉 token、OCR/空间评测 |

## 关联课程

- 数据：[训练文本怎样变成批次与因果遮罩](/ai/foundation-models/data-batches-and-causal-mask)
- 结构：[完整 Decoder 语言模型怎样组装](/ai/foundation-models/language-model-architecture)
- 资源：[参数量、显存与计算量怎样估算](/ai/foundation-models/parameters-memory-compute)
- 推理：[Prefill、Decode 与 KV Cache 怎样工作](/ai/foundation-models/prefill-kv-cache)
- 扩展：[Scaling 与 MoE](/ai/foundation-models/scaling-and-moe)、[多模态与扩散](/ai/foundation-models/multimodal-and-diffusion)
- 验收：[第 4 章复习与验收](/ai/foundation-models/review)
