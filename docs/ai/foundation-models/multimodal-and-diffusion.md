---
title: 多模态与扩散模型怎样连接语言模型
date: 2026-09-05
updated: 2026-09-05
type: lesson
status: learnable
track: ai
chapter: foundation-models
prerequisites:
  - /ai/foundation-models/scaling-and-moe
outcomes:
  - 能解释图像等连续信号怎样被编码成可供 Transformer 使用的表示
  - 能区分多模态理解模型与图像生成模型的输入输出闭环
  - 能比较自回归 token 生成与扩散去噪的状态和训练目标
estimated: 45min
categories: [智能算法]
tags: [Multimodal, Diffusion, Vision Encoder]
description: 从语言模型的表示与生成闭环出发，理解视觉编码器、跨模态投影、图像 token 和扩散去噪的职责边界。
---

# 多模态与扩散模型怎样连接语言模型

语言模型处理离散 token，图片却是一组连续像素。把图片交给“多模态大模型”并不意味着像素会直接变成汉字；系统需要先把不同模态转成模型能够读取的表示。

本页建立两条最小路径：

```text
图片理解：图像 → 视觉表示 → 对齐到语言隐藏空间 → 语言模型生成文本
图片生成：文本条件 → 噪声/潜变量 → 多步去噪 → 图像
```

二者都可能使用注意力，但训练目标和生成状态不同。

## 图片怎样进入语言模型

一个常见视觉语言模型可以拆成：

```text
图像
→ 切成 patch 或视觉网格
→ Vision Encoder
→ visual features [N,C_v]
→ projector / adapter
→ visual tokens [N,C_lm]
→ 与文本 token 一起进入语言模型
→ 文本 logits
```

### 视觉 Encoder

它把像素转成一组具有语义的特征。若图片切成 `N` 个 patch，就可以得到 `N` 行视觉表示；每一行对应某个空间区域或聚合后的视觉内容。

### Projector

视觉宽度 `C_v` 往往与语言模型隐藏宽度 `C_lm` 不同。Projector 用线性层或小型网络把视觉特征映射到语言模型可以接收的维度：

$$
X_{vision}\in\mathbb{R}^{N\times C_v}
\rightarrow
P(X_{vision})\in\mathbb{R}^{N\times C_{lm}}
$$

它不仅处理 shape，也在训练中学习跨模态对齐。

### 语言模型

对齐后的视觉 token 可以作为上下文前缀，文本 Query 通过注意力读取它们，再自回归生成回答。最终输出仍是词表 logits，所以“看图回答”在输出端仍遵循本章的 next-token 与采样机制。

## 视觉 token 不是文字 token

二者都可以表现为 `[T,C]` 行向量，但来源和语义不同：

| 对象 | 一行来自哪里 | 通常怎样产生 |
| --- | --- | --- |
| 文本 token | tokenizer 的离散片段 | ID 查 embedding 表 |
| 视觉 token | 图片 patch 或聚合区域 | 视觉 Encoder 计算 |
| 音频 token/特征 | 时间窗、频谱块或量化码 | 音频 Encoder/codec |

shape 相同只说明能够进入统一计算接口，不说明它们已经具有完全相同的语义。

## 对齐是怎样学到的

常见阶段可能包括：

1. 使用图文配对学习视觉与文本的对应关系；
2. 固定部分预训练模块，先训练 projector；
3. 使用图文问答、描述和指令数据训练模型按要求回答；
4. 继续进行偏好、安全或工具相关训练。

具体系统可以选择不同组合，不能把某个项目的训练流程当作所有多模态模型的统一标准。

## 自回归图像 token：仍然可以预测“下一个”

图片也可以先被离散化成一串视觉 token：

```text
image → tokenizer/codec → z1,z2,...,zN
```

随后用自回归模型学习：

$$
p(z_1,\ldots,z_N\mid text)=\prod_i p(z_i\mid text,z_{<i})
$$

这条路径与语言模型非常接近，只是词表变成视觉码本，token 顺序来自图像网格或其他扫描规则。最后还要由解码器把视觉 token 恢复成像素。

## 扩散模型不是逐 token 追加

扩散模型使用另一种状态变化：训练时逐步给数据加入噪声，并学习从带噪状态恢复信息；生成时从随机噪声开始，多次预测并去除噪声。

```text
训练：真实图像 x0 → 加噪得到 xt → 模型预测噪声/速度/目标
生成：随机噪声 xT → 去噪 xT-1 → ... → x0 图像
```

一个常见训练目标是预测加入的噪声：

$$
\mathcal L=\mathbb E_{x_0,\epsilon,t}\left[\|\epsilon-\epsilon_\theta(x_t,t,c)\|^2\right]
$$

`c` 是可选条件，例如文本编码；`t` 是噪声时间步；模型输出不是“下一个词”，而是当前带噪状态的去噪方向或等价参数化目标。

## 文本怎样控制扩散生成

文本先通过文本 Encoder 得到条件表示。去噪网络中的 cross-attention 可以让图像/潜空间位置读取文本条件：

```text
Q：来自当前图像潜变量
K/V：来自文本表示
```

这与 Transformer 章节的 Cross-Attention 结构相通，但被更新的主体是图像潜变量，不是语言 token 序列。

## 为什么常在 latent space 去噪

直接对高分辨率像素反复运行网络成本很高。Latent Diffusion 先用编码器把图片压缩到较小潜空间，在潜空间扩散和去噪，最后再解码成图片：

```text
image ↔ autoencoder latent
                 ↑
         diffusion happens here
```

压缩降低空间尺寸，但也可能损失细节；最终质量同时取决于 autoencoder、去噪模型、条件编码和采样过程。

## 两类生成闭环对照

| 维度 | 自回归 token 模型 | 扩散模型 |
| --- | --- | --- |
| 初始状态 | 已有前缀 | 随机噪声 |
| 一步改变 | 追加一个离散 token | 更新整张连续/潜变量状态 |
| 训练目标 | next-token 交叉熵 | 去噪相关目标 |
| 顺序 | token 顺序明确 | 噪声时间步 |
| 条件方式 | 条件 token 作为前缀或 cross-attention | 文本特征常通过 cross-attention/引导 |
| 最终解码 | token ID → 文本/其他码本解码 | 潜变量 → 图像解码器 |

两者都“多步生成”，但不能因此把扩散的一步称为“预测下一个像素”。它通常在每一步同时更新整个带噪状态。

## 多模态能力的边界

- 视觉 Encoder 的输入分辨率、裁剪与 patch 化可能丢失细节；
- OCR、小物体、计数和空间关系需要具体评测，不能从流畅回答推断准确；
- 图片包含的信息不一定完整进入有限数量的视觉 token；
- 语言模型可能基于常见模式补全而非读取真实像素证据；
- 生成图片的文字、精确几何和身份一致性受训练与架构限制；
- 外部工具结果、检索图片与原始上传图片应明确区分来源。

## 常见误解

- **图片直接进入 LLM 的 tokenizer**：常见系统先经过视觉 Encoder 和 projector。
- **视觉 token 就是图片中的词**：它通常对应 patch 特征或离散视觉码，不必有人类可读含义。
- **用了 Transformer 就一定是自回归**：Transformer 是结构，扩散目标和状态转移可以不同。
- **多模态模型看到了图片就等于看清全部细节**：输入处理和表示容量会丢失信息。
- **扩散每一步只生成一块新像素**：常见扩散会更新整个像素/潜变量状态。

## 本节自测

<KnowledgeQuiz
  storage-key="foundation-multimodal-diffusion-v1"
  :questions="[
    { id:'multi-1', type:'single', prompt:'视觉特征宽度与语言模型隐藏宽度不同时，常用哪个模块连接？', options:['loss mask','projector / adapter','KV Cache'], answer:'projector / adapter', explanation:'它把视觉表示映射到语言模型可接收的宽度并学习跨模态对齐。' },
    { id:'multi-2', type:'boolean', prompt:'扩散生成通常在每一步追加一个离散图像 token。', answer:false, explanation:'典型扩散从噪声开始，每一步更新整个连续或潜空间状态。' },
    { id:'multi-3', type:'fill', prompt:'文本控制图像去噪时，图像潜变量常作为 Cross-Attention 的 Q 还是 K/V？', answer:['Q','q','query'], explanation:'文本条件通常提供 K/V，当前图像/潜变量位置发出 Query。' },
    { id:'multi-4', type:'open', prompt:'比较“看图回答”和“文生图”的输入、内部状态与最终输出。', rubric:['看图回答由视觉编码产生表示，语言模型输出文本 token','文生图从噪声/潜变量多步去噪并解码为图像','指出两者可通过 cross-attention 使用条件','没有把视觉 token、文字 token 和像素混为一谈'], reference:'看图回答把图像编码成语言模型上下文，最终走词表 logits；文生图把文本作为条件，更新噪声潜变量，最后由图像解码器恢复像素。' }
  ]"
/>

打印版答案：1. projector / adapter；2. 错；3. Q；4. 应明确两条闭环的状态和输出不同。

## 来源与下一步

- [Learning Transferable Visual Models From Natural Language Supervision](https://arxiv.org/abs/2103.00020)
- [Visual Instruction Tuning](https://arxiv.org/abs/2304.08485)
- [Denoising Diffusion Probabilistic Models](https://arxiv.org/abs/2006.11239)
- [High-Resolution Image Synthesis with Latent Diffusion Models](https://arxiv.org/abs/2112.10752)

扩展结构已经闭环。下一课[模型回答中的能力来自哪里](/ai/foundation-models/capability-boundaries)会把模型内部能力与上下文、检索、工具等外部条件分开。
