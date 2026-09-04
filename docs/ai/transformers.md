---
title: 序列、注意力与 Transformer
date: 2026-09-04
categories:
  - 智能算法
tags:
  - Attention
  - Transformer
  - RoPE
description: 从信息检索问题推导注意力，解释多头、拆轴、转置、位置编码与 Transformer Block。
---

# 序列、注意力与 Transformer

本章不从背诵 `Q、K、V` 开始，而从问题开始：序列中每个位置怎样根据当前需要，从其他位置选择和汇总信息？

## 1. 为什么从 RNN 走向注意力

RNN 把历史压进一个不断更新的状态，顺序明确但必须逐步计算；很远的信息要经过许多状态传递。注意力让一个位置直接读取所有允许访问的位置，路径更短，也能并行计算整个训练序列。

代价是普通 self-attention 要显式处理 token 两两关系，分数矩阵随序列长度 $T$ 近似按 $T^2$ 增长。

## 2. Q、K、V 是一次可学习检索

对输入 $X$ 做三个不同线性投影：

$$
Q=XW_Q, \qquad K=XW_K, \qquad V=XW_V
$$

- Query：当前位置正在寻找什么；
- Key：每个位置可以用什么特征被匹配；
- Value：匹配后实际取回什么信息。

相似度、归一化和加权汇总为：

$$
\operatorname{Attention}(Q,K,V)
=\operatorname{softmax}\left(\frac{QK^\top}{\sqrt{D}}+M\right)V
$$

缩放因子 $\sqrt D$ 防止维度增加时点积幅度过大，使 softmax 过早饱和；mask $M$ 决定哪些关系被允许。

## 3. 为什么需要多个头

单头只有一组 $W_Q,W_K,W_V$，所有关系被压在同一个相似度空间里。多头注意力让不同投影学习不同的匹配方式：一个头可能更关注局部搭配，另一个头可能更关注远距离指代或结构位置。

这不是把同一份最终注意力矩阵机械切几块。完整投影矩阵的不同列对应不同头的子空间，训练会让它们形成不同参数；拆头只是把已经投影出的 `H×D` 个特征重新组织为 `H` 组。

多头提供的是并行的关系子空间，不保证每个头都会自动获得清晰、唯一、可人工命名的功能。

## 4. 为什么先拆头，再转置

假设输入为 `[B,T,C]`，且 `C=H×D`。

### 第一步：投影

```text
X [B,T,C] @ Wq [C,H×D] → Q [B,T,H×D]
```

投影完成了真正的特征混合，并为不同头产生不同子空间。

### 第二步：拆头

```text
[B,T,H×D] reshape → [B,T,H,D]
```

reshape 没有计算新数值，只把最后一个轴解释为“头 × 每头特征”。

### 第三步：转置

```text
[B,T,H,D] transpose → [B,H,T,D]
```

PyTorch 的批量矩阵乘法把最后两个轴当作矩阵、前面的轴当作批次。我们需要针对每个 `B,H` 独立执行：

```text
Q [T,D] @ Kᵀ [D,T] → scores [T,T]
```

因此把 `B,H` 放在前面，`T,D` 放在最后。转置不是注意力理论额外要求的神秘步骤，而是把语义轴排列成矩阵乘法接口需要的布局。

<ClientOnly>
  <AttentionShapeDemo />
</ClientOnly>

## 5. `[T,T]` 到底表示什么

在分数矩阵中，行轴是 query token，列轴是 key token：

```text
scores[b, h, i, j]
```

表示第 `b` 条样本、第 `h` 个头中，第 `i` 个 token 对第 `j` 个 token 的未归一化关注分数。softmax 通常沿最后的 key 轴进行，因此每个 query 的一行权重和为 1。

## 6. causal mask 为什么不可缺少

自回归模型训练时一次输入整个序列，但位置 $t$ 只能预测下一个 token，不能看到未来答案。causal mask 把 `j > i` 的分数设为负无穷，使 softmax 后权重为 0。

如果 mask 错位，训练 loss 可能异常漂亮，因为模型偷看了未来；推理时没有未来 token，能力会崩溃。mask 是数据因果边界，不只是加速细节。

## 7. MHA、MQA 与 GQA

- MHA：每个 query 头都有独立 K、V 头，表达灵活但 KV Cache 大；
- MQA：所有 query 头共享一组 K、V，缓存小但约束更强；
- GQA：若干 query 头共享一组 K、V，在质量与缓存之间折中。

MiniMind 当前实现使用多个 query 头和较少 KV 头，再通过 `repeat_kv` 对齐计算。理解这一点前，必须先掌握 `[B,H,T,D]` 的语义。

## 8. 位置为什么必须进入模型

纯 self-attention 对输入排列本身没有顺序偏好。位置编码为模型提供次序或相对距离信息：

- 绝对位置向量直接加入 token 表示；
- RoPE 旋转 Q、K，使点积携带相对位置信息；
- ALiBi 用与距离相关的偏置影响分数；
- 长上下文外推还要考虑训练长度、频率和注意力退化。

RoPE 不改变 Q、K 的 shape，只改变同一维度中成对坐标的数值。

## 9. 一个 Decoder Block

现代 Decoder-only Transformer 通常包含：

```text
x
 ├─ Norm → Causal Self-Attention → 残差相加
 └─ Norm → FFN/SwiGLU             → 残差相加
```

注意力负责 token 之间通信，FFN 对每个 token 独立做非线性特征变换；残差保留原信息并提供短梯度路径；RMSNorm 控制特征尺度。堆叠多个 Block 后，经输出头映射到词表 logits。

## 10. 本章实践与过关标准

1. 手写单头 attention，打印从 `[B,T,C]` 到 `[B,T,C]` 的每个 shape；
2. 扩展为多头并验证拆头前后元素数不变；
3. 构造极小序列，观察 mask 前后的注意力矩阵；
4. 比较 MHA 与 GQA 的 KV 元素数；
5. 实现一个 Decoder Block，并为 shape、mask、梯度写测试。

过关不是背出公式，而是能解释公式中的每一项为什么存在、每次变形服务于哪次计算，以及错误会怎样暴露。

