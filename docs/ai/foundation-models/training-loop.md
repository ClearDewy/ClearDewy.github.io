---
title: 语言模型怎样从一个 batch 学习
date: 2026-09-05
updated: 2026-09-05
type: lesson
status: learnable
track: ai
chapter: foundation-models
prerequisites:
  - /ai/foundation-models/next-token-prediction
  - /ai/foundations/optimization-loop
outcomes:
  - 能追踪语言模型一次训练 step 中数据、loss、梯度和参数的变化
  - 能区分 step、batch、token 数、epoch 与梯度累积
  - 能依据训练 loss 和验证 loss 识别欠拟合、过拟合与数据泄漏
estimated: 40min
categories: [智能算法]
tags: [Training Loop, Optimization, Validation]
description: 把 next-token loss 放进完整训练循环，解释 batch、梯度累积、验证集和 checkpoint 怎样共同工作。
---

# 语言模型怎样从一个 batch 学习

上一课只计算了一个位置的 loss。本页把它放回真实训练循环：一次 step 如何汇总许多 token 的错误、求梯度、更新参数，并用独立数据判断模型是否真的学会。

优化器和反向传播的数学细节已经在[优化循环](/ai/foundations/optimization-loop)与[反向传播](/ai/deep-learning/backpropagation)讲过。本页只建立语言模型训练中的对象和节奏。

## 一次训练 step 的五个状态

```text
1. 取 batch：input_ids、labels、masks
2. 前向：logits = model(input_ids)
3. 汇总：loss = 有效位置交叉熵的平均
4. 反向：loss.backward() 得到所有参数梯度
5. 更新：optimizer.step()，随后清空梯度
```

固定 batch 若有 `B=2,T=4`，但其中两个位置被 loss mask 排除，则本次 loss 由 6 个有效 next-token 目标平均得到，不是由“两条句子”平均得到。

$$
\mathcal L=-\frac{1}{N_{valid}}\sum_{b,t:m_{b,t}=1}\log p(y_{b,t}\mid x_{b,\le t})
$$

`N_valid` 是实际参与考核的 token 数。比较不同实验时，必须确认 loss 的归一化规则一致。

## 训练程序的最小骨架

```python
model.train()
optimizer.zero_grad()

for input_ids, labels, loss_mask in loader:
    logits = model(input_ids)                 # [B,T,V]
    token_loss = cross_entropy(logits, labels, reduction="none")
    loss = (token_loss * loss_mask).sum() / loss_mask.sum()
    loss.backward()
    clip_grad_norm_(model.parameters(), max_norm=1.0)
    optimizer.step()
    optimizer.zero_grad()
```

这是概念骨架，不是绑定某个框架的可复制 API。实际代码还会处理混合精度、分布式同步、学习率调度、日志和异常恢复。

## Step、batch、token 和 epoch

| 术语 | 含义 | 不要误解为 |
| --- | --- | --- |
| micro-batch | 单次前向/反向进入设备的样本 | 一定会立刻更新参数 |
| optimizer step | 优化器真正更新一次参数 | 读入一条样本 |
| tokens/step | 一次更新消化的有效 token 数 | `B×T` 必然全部有效 |
| epoch | 数据集大致遍历一轮 | 大模型训练必须按 epoch 组织 |
| checkpoint | 某一步保存的参数及训练状态 | 只有模型权重 |

大规模预训练更常用“已经训练了多少 token”和“执行了多少 optimizer step”描述进度，因为语料可能混合、重复采样或持续流入，并不存在直观的一轮 epoch。

## 显存不够时：梯度累积

假设目标有效 batch 是 32 条序列，但设备一次只能放 8 条。可以连续处理 4 个 micro-batch，累加梯度后再更新一次：

```text
micro 1: forward → backward → 累加
micro 2: forward → backward → 累加
micro 3: forward → backward → 累加
micro 4: forward → backward → 累加
optimizer.step → zero_grad
```

若每个 micro-batch 的 loss 已经取平均，通常还要除以累积步数，才能保持与大 batch 近似一致的梯度尺度。分布式训练还要乘上数据并行进程数：

$$
B_{effective}=B_{micro}\times N_{accum}\times N_{data\ parallel}
$$

它能降低单设备激活显存，但不会减少处理这些 token 所需的总计算量。

## 学习率为什么不是固定按钮

语言模型训练常见：

1. **warmup**：开始时逐步增大学习率，避免随机初始化阶段更新过猛；
2. **主训练**：按预定曲线衰减；
3. **梯度裁剪**：梯度范数异常大时限制单次更新；
4. **混合精度与 loss scaling**：降低存储/计算成本，同时避免小梯度下溢。

这些机制都服务于“让优化过程稳定”，不会改变模型仍在最小化 next-token loss 的事实。

## 训练 loss 下降还不够

至少同时观察训练集与验证集：

| 现象 | 更可能的解释 | 下一步检查 |
| --- | --- | --- |
| 两者都高且缓慢下降 | 欠拟合、学习率过小、数据/模型有错 | 检查样本、梯度和容量 |
| 训练下降，验证也下降 | 当前阶段正常学习 | 继续并保存 checkpoint |
| 训练下降，验证开始上升 | 过拟合或分布偏移 | 检查数据量、正则与早停 |
| 训练和验证都异常低 | 可能发生标签泄漏或数据重复 | 审核 mask、切分和去重 |
| loss 突然 NaN | 数值溢出、坏 batch 或梯度爆炸 | 定位首次异常 step |

验证集必须与训练集分离。若同一文档的近重复片段同时出现在两边，验证 loss 可能虚假乐观。

## Checkpoint 保存什么

要“继续训练”而不是只“加载推理”，通常要保存：

- 模型参数；
- 优化器状态（如动量）；
- 学习率调度器状态；
- 当前 step 和已处理 token 数；
- 随机数状态；
- 数据读取位置或可复现的采样状态；
- tokenizer 与模型配置。

只保存权重也能推理，但恢复训练时学习率、动量和数据顺序会改变，不能声称与未中断训练完全一致。

## 最小调试顺序

正式训练前先让模型过拟合一个极小 batch：

1. 固定一条或几条样本；
2. 关闭随机数据增强和复杂分布式路径；
3. 反复训练同一 batch；
4. 确认 loss 能显著下降；
5. 检查目标 token 概率是否上升；
6. 再逐步恢复真实数据和规模。

连一个固定 batch 都学不会时，扩大语料或增加 GPU 只会让错误变贵。

## 常见错误

- `zero_grad` 放错位置，梯度在不期望的 step 间累加；
- loss 包含 PAD 或不应训练的 Prompt token；
- 训练/验证模式没有切换，dropout 导致验证不稳定；
- 只保存模型权重，却把恢复结果当作连续训练；
- 日志按 batch 平均，但 batch 的有效 token 数差异很大；
- 只看 loss，不检查样本文本、标签对齐和实际生成。

## 本节自测

<KnowledgeQuiz
  storage-key="foundation-training-loop-v1"
  :questions="[
    { id:'train-1', type:'single', prompt:'哪一个动作真正改变模型参数？', options:['loss.backward()','optimizer.step()','optimizer.zero_grad()'], answer:'optimizer.step()', explanation:'backward 计算并累积梯度，step 才按梯度更新参数。' },
    { id:'train-2', type:'fill', prompt:'micro-batch=8、累积4步、数据并行2路时，有效 batch 是多少？', answer:['64','64条','64 条'], explanation:'8×4×2=64。' },
    { id:'train-3', type:'boolean', prompt:'训练 loss 持续下降足以证明模型在未见数据上也变好。', answer:false, explanation:'必须查看独立验证集，并排除数据泄漏与近重复。' },
    { id:'train-4', type:'open', prompt:'如果训练第一步就出现 NaN，你会按什么顺序排查？', rubric:['定位首次异常 batch 与前向输出','检查输入、标签、mask 和有效 token 数','检查学习率、梯度范数和混合精度','先在固定小 batch 与高精度下复现'], reference:'先缩小到首次异常 batch，验证数据与 loss，再检查 logits/梯度的首个非有限值，最后逐项关闭混合精度和复杂训练机制。' }
  ]"
/>

打印版答案：1. `optimizer.step()`；2. 64；3. 错；4. 应从数据和首次非有限值开始，而不是盲目降低所有参数。

## 小结与下一步

一次 step 已经闭环，但模型为什么会变得巨大、显存为什么仍然不够还没解释。下一课[参数量、显存与计算量怎样估算](/ai/foundation-models/parameters-memory-compute)建立数量级直觉。
