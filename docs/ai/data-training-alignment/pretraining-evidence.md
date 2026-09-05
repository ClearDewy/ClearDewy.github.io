---
title: 预训练运行怎样建立可信证据
date: 2026-09-05
updated: 2026-09-05
type: lesson
status: learnable
track: ai
chapter: data-training-alignment
prerequisites: [/ai/data-training-alignment/data-lineage-and-splits]
outcomes:
  - 能按单批次、小语料、正式运行逐级放大训练
  - 能定义预训练基线、验证指标和 checkpoint 恢复检查
  - 能区分吞吐、训练 loss 与泛化证据
estimated: 40min
categories: [智能算法]
tags: [Pretraining, Checkpoint, Reproducibility]
description: 从单批次过拟合开始建立可复现的预训练基线，并用验证集和恢复测试证明训练链路可信。
---

# 预训练运行怎样建立可信证据

正式训练不是第一次按下运行按钮。可靠流程会从便宜、确定的小检查逐级放大，让错误在消耗大量计算前暴露。

## 四级放大

```text
形状/样本断言
→ 固定单 batch 过拟合
→ 小语料端到端基线
→ 正式训练与周期评测
```

### 1. 形状与样本

打印 input、label、mask、有效 token 数；检查每个 loss 位置预测原文中的真实后继。

### 2. 单 batch 过拟合

反复训练同一小 batch，期望 loss 显著下降、目标概率上升。失败说明数据、前向、反向或优化器至少一处有问题。

### 3. 小语料基线

固定数据版本和随机种子，跑完整数据加载、保存、验证、恢复链路。它验证系统，不追求模型能力。

### 4. 正式运行

只有前三步通过才扩大 token、设备和训练时长，并持续保存可比较 checkpoint。

## 一份运行身份

至少记录：代码提交、模型配置、tokenizer、数据 manifest、split、随机种子、精度、设备、优化器、学习率曲线、有效 batch、训练 token、验证集版本和父 checkpoint。

“同一个模型名”不足以复现，因为数据和训练状态可能已经不同。

## 观察哪些曲线

- 训练/验证 loss 与 token 数；
- 学习率与梯度范数；
- 有效 token/s、设备利用率与数据等待；
- NaN/溢出/跳过 step；
- checkpoint 保存与验证耗时；
- 固定探针样本的概率或生成。

吞吐提高只说明系统更快，不能证明模型更好；训练 loss 下降也不能替代独立验证。

## 恢复测试

在小基线上执行：连续训练 N 步，与训练 K 步后保存、恢复再训练 N-K 步比较。应核对参数、优化器、学习率、step、随机状态和数据位置。浮点/并行实现可能不是逐 bit 一致，但差异必须在预先定义的容差内且趋势一致。

## 常见错误

- 只保存权重却声称“无缝恢复训练”；
- loss 按 batch 平均但有效 token 数变化；
- 验证时仍开启 dropout；
- 新 checkpoint 使用了旧 tokenizer 或数据 manifest；
- 大规模失败后直接改多个超参，失去可归因性。

## 自测

<KnowledgeQuiz storage-key="pretraining-evidence-v1" :questions="[
 {id:'pt-1',type:'single',prompt:'扩大训练前最有价值的最小学习检查是什么？',options:['单批次过拟合','增加 GPU','提高 temperature'],answer:'单批次过拟合',explanation:'它能快速验证数据、loss、梯度和更新链路。'},
 {id:'pt-2',type:'boolean',prompt:'token/s 提高可以直接证明验证集能力提高。',answer:false,explanation:'吞吐是系统性能，能力需独立评测。'},
 {id:'pt-3',type:'open',prompt:'checkpoint 恢复测试必须比较什么？',rubric:['模型参数','优化器和学习率状态','step/token 计数','随机与数据位置','预定义容差'],reference:'比较连续运行与保存恢复路径的状态和后续 loss，不只验证文件能加载。'}
]" />

打印版答案：1. 单批次过拟合；2. 错；3. 模型、优化器、进度、随机和数据状态。

## 下一步

预训练学会分布后，进入[SFT 与 Chat Template](/ai/data-training-alignment/sft-and-chat-template)学习怎样把示范转成行为监督。
