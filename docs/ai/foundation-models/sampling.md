---
title: 采样参数怎样改变生成结果
date: 2026-09-05
updated: 2026-09-05
type: lesson
status: learnable
track: ai
chapter: foundation-models
prerequisites:
  - /ai/foundation-models/prefill-kv-cache
outcomes:
  - 能区分 greedy、全量采样、top-k 与 top-p
  - 能预测温度变化对概率分布的影响
  - 能说明采样参数不会修改模型参数或补充事实知识
estimated: 40 分钟
categories: [智能算法]
tags: [Sampling, Temperature, Top-k, Top-p]
description: 直接修改 logits、温度和候选截断方式，观察同一个模型分布怎样产生不同 token。
---

# 采样参数怎样改变生成结果

模型前向只给出下一个 token 的概率分布。生成系统还必须决定怎样从这个分布选择一个 token；选择规则会改变输出风格和随机性，但不会重新训练模型。

## 直接操作同一组 logits

<ClientOnly>
  <SamplingDemo />
</ClientOnly>

先保持 logits 不变：降低温度、升高温度，再切换 greedy、top-k 和 top-p。最后移动随机位置 `u`，观察“分布不变但本次选中项改变”的情况。

## Greedy

每轮选择概率最高的 token：

$$x_{t+1}=\arg\max_v p(v\mid x_{\le t})$$

它没有抽样随机性，但不保证整段序列的联合概率最高，也不保证事实正确或文本不重复。

## Temperature 先改变分布

$$p_v(T)=softmax(z_v/T)$$

- `T<1`：logit 差异被放大，分布更尖锐；
- `T=1`：保留原始 Softmax 分布；
- `T>1`：差异被压缩，分布更平坦；
- `T→0`：行为趋近 greedy，但实现不能直接除以 0。

温度作用于 logits 后再 Softmax。它不是“随机程度百分比”，也不会为模型增加不知道的事实。

## Top-k 先按数量截断

Top-k 只保留概率最高的 `k` 个候选，把其他概率设为 0，再重新归一化。固定 `k` 简单，但不同上下文中的概率集中程度可能不同。

## Top-p 先按累计质量截断

Top-p 从高到低保留候选，直到累计概率达到阈值 `p`，再重新归一化。候选数量会随上下文变化：分布很集中时集合较小，分布较平坦时集合较大。

Top-k 与 top-p 都是对当前分布的截断规则，必须明确它们与 temperature 的应用顺序。不同实现可能还提供最小保留数、重复惩罚或其他处理，复现实验时要记录完整配置。

## 随机数怎样选中 token

将候选概率按固定顺序累加成区间，在 `[0,1)` 取随机数 `u`，它落入哪个区间就选择哪个 token。固定随机种子只保证相同实现和调用顺序下可复现，不会让采样变成确定性推理证明。

## 常见误解

- 温度越高越聪明：错误，只是分布更平坦。
- top-p=0.9 表示保留 90% 的 token：错误，它保留累计概率质量约 0.9 的最小候选集合。
- greedy 一定最可靠：它消除了抽样随机性，但不会修复错误分布。
- 调采样参数等于更新模型：推理设置通常不改变任何参数。
- 一次好结果证明配置更优：必须在固定任务集上重复评测质量、失败率和成本。

## 本节自测

<ClientOnly>
  <KnowledgeQuiz title="采样策略自测" storage-key="ai-foundation-models-sampling" :questions="[
    { id:'sample-temp', type:'boolean', prompt:'在 logits 不变时，提高 temperature 通常会让概率分布更平坦。', answer:true, explanation:'除以更大的 T 会缩小 logit 差异。' },
    { id:'sample-p', type:'single', prompt:'Top-p=0.9 的含义更接近哪一项？', options:['固定保留 90% 的词表','保留累计概率达到约 0.9 的高概率候选','把每个概率乘 0.9','以 90% 概率使用 greedy'], answer:'保留累计概率达到约 0.9 的高概率候选', explanation:'候选数量不是固定值。' },
    { id:'sample-boundary', type:'open', prompt:'为什么改变 temperature 不能证明模型获得了新的事实知识？', rubric:['temperature 只变换当前 logits 分布','模型参数没有更新','候选内容仍来自原模型条件分布','事实性需要外部证据和评测'], reference:'Temperature 只重新缩放同一轮 logits，没有写入参数或引入新证据，因此只能改变选择分布。' }
  ]" />
</ClientOnly>

<details><summary>静态答案与检查点</summary>

1. 正确。2. 累计概率达到阈值。3. 必须指出分布变化不等于参数或知识变化。

</details>

## 小结与下一步

模型产生分布，采样策略从分布中选择 token。下一步在[最小语言模型实验](/ai/foundation-models/language-model-lab)里训练一组真实可更新的 logits，并比较训练与采样的不同作用。
