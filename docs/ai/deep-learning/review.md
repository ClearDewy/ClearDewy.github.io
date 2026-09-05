---
title: 第 2 章复习与验收
date: 2026-09-04
updated: 2026-09-04
type: review
status: learnable
track: ai
prerequisites: [MLP 表示, 反向传播, MLP 实验]
outcomes: [推导网络 shape, 追踪计算图梯度, 诊断训练故障]
estimated: 20 分钟
description: 验收非线性表示、参数与激活、反向传播和最小训练实验。
---

# 第 2 章复习与验收

<KnowledgeQuiz
  storage-key="ai-deep-learning-review-v1"
  title="第 2 章交互自测"
  :questions="[
    { id: 'dl-boolean', type: 'boolean', prompt: '堆叠多个不带激活函数的线性层，可以形成非线性决策边界。', answer: false, explanation: '线性变换的复合仍是线性变换，权重和偏置可以合并。', remediation: '/ai/deep-learning/mlp-representation' },
    { id: 'dl-single', type: 'single', prompt: 'X[16,32] 经过 Linear(32,64) 后的激活 shape 是什么？', options: ['[16,32]', '[32,64]', '[16,64]', '[64,16]'], answer: '[16,64]', explanation: 'batch 轴 16 保留，输入特征轴 32 被汇总，输出特征轴变为 64。', remediation: '/ai/deep-learning/mlp-representation' },
    { id: 'dl-fill', type: 'fill', prompt: 'Linear(32,64) 包含 bias 时共有多少个参数？', answer: ['2112', '2,112'], explanation: '权重 32×64=2048，加上 64 个 bias，共 2112。', remediation: '/ai/deep-learning/mlp-representation' },
    { id: 'dl-branch', type: 'single', prompt: '同一中间量经过两条分支影响 loss，反向传播汇合时怎样处理梯度？', options: ['取最大值', '取平均值', '将各路径贡献相加', '只保留第一条路径'], answer: '将各路径贡献相加', explanation: '总导数等于每条下游路径贡献之和。', remediation: '/ai/deep-learning/backpropagation' },
    { id: 'dl-open', type: 'open', prompt: '模型训练 loss 不降且第一层 grad=None，你会怎样定位？', rubric: ['确认执行了 backward 且 loss 来自当前前向图', '检查第一层参数是否实际参与计算并被优化器管理', '检查 detach、no_grad、转普通数值等断图操作', '检查目标 shape、损失函数和梯度清零顺序'], reference: '先从 loss 沿计算图反向确认第一层是否可达，再检查 requires_grad、参数注册、优化器参数列表和断图操作；grad=None 首先表示没有梯度路径，不应先盲调学习率。', remediation: '/ai/deep-learning/backpropagation' }
  ]"
/>

<noscript>浏览器未启用 JavaScript，请使用下面的打印版题目与答案要点。</noscript>

## 不查资料回答

1. 为什么两个不带激活的 Linear 仍是一个线性变换？
2. 参数和激活在生命周期、shape 和训练中的角色有何不同？
3. 计算图分支汇合时，梯度为何相加？
4. residual、normalization 和初始化各自主要保护什么？
5. 单 batch 过拟合成功证明了什么、没有证明什么？

## 推导与调试

- `X[16,32] → Linear(32,64) → ReLU → Linear(64,10)`：写每步 shape 和参数量。
- 对 `a=wx, L=a²+3a` 推导 `dL/dw`。
- 某模型 loss 不降且第一层 `grad=None`：列出至少三条检查路径。
- 某模型训练集 100%、验证集 55%：为何不能只增加训练步数？

## 答案要点与评分

shape 为 `[16,64] → [16,64] → [16,10]`；参数量 `32×64+64 + 64×10+10 = 2762`。梯度为 `(2wx+3)x`。断图、未调用 backward、参数未参与 loss、误用 no-grad 是典型检查点。

每个口答 1 分、shape/参数题 2 分、梯度题 1 分、两道诊断各 1 分，共 10 分；8 分且[实验](/ai/deep-learning/mlp-lab)通过为合格。薄弱项回看[MLP](/ai/deep-learning/mlp-representation)或[反向传播](/ai/deep-learning/backpropagation)，一周后重做诊断题。
