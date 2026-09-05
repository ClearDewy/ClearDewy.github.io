---
title: Scaling 与 MoE 怎样扩展模型容量
date: 2026-09-05
updated: 2026-09-05
type: lesson
status: learnable
track: ai
chapter: foundation-models
prerequisites:
  - /ai/foundation-models/model-families
  - /ai/foundation-models/parameters-memory-compute
outcomes:
  - 能区分模型参数、训练 token 与计算预算三种 scaling 轴
  - 能解释 Dense 与 MoE 的总参数、激活参数和通信成本差异
  - 能识别把 scaling law 当作单模型保证的错误推论
estimated: 45min
categories: [智能算法]
tags: [Scaling Law, MoE, Sparse Model]
description: 从参数、数据和计算的联合扩展出发，解释 Dense 模型与 Mixture of Experts 的容量和成本差异。
---

# Scaling 与 MoE 怎样扩展模型容量

已经知道一个 Decoder-only 模型由 `L` 层、宽度 `C` 和词表 `V` 组成。接下来不能只问“参数能不能再多”，还要问：训练数据是否同步增长、计算预算怎样分配、每个 token 是否真的经过全部参数。

本页先讲经验 scaling 的正确读法，再用最小路由例子解释 Mixture of Experts（MoE）。

## 三条扩展轴必须同时记录

| 轴 | 常用量 | 增加它意味着 |
| --- | --- | --- |
| 模型规模 | 参数量 `N` | 更大的函数容量与权重存储 |
| 数据规模 | 训练 token 数 `D` | 模型看到更多训练信号 |
| 计算预算 | FLOPs / GPU 时间 | 能执行更多或更大的前后向计算 |

三者有关但不相等。用同一份小数据训练更大的模型，可能更快记住数据而非提高泛化；给小模型无限重复相同 token，也不等于提供无限新信息。

## Scaling law 是经验关系，不是魔法定律

经典研究观察到，在特定模型家族、数据分布和训练设置内，验证 loss 与模型规模、数据规模和计算量常呈平滑的幂律趋势。这带来两个用途：

1. 先训练一系列小模型，估计更大预算下的趋势；
2. 在固定计算预算中比较“更大模型、较少 token”和“较小模型、更多 token”的分配。

它不能直接证明：

- 任意数据和任意任务都遵循同一指数；
- 参数翻倍会让所有能力按固定比例提高；
- loss 的小幅下降必然带来某项应用可用性跃迁；
- 数据质量、污染、安全和推理成本可以忽略。

使用 scaling 结论时必须带上实验范围，而不是把一条拟合曲线写成普遍保证。

## Dense 模型：每个 token 经过同一组参数

标准 Dense Decoder 中，每个 token 都会经过每层相同的注意力和 MLP：

```text
token A → attention → MLP
token B → attention → 同一个 MLP
token C → attention → 同一个 MLP
```

总参数与每 token 激活参数基本在同一数量级。模型变大时，权重存储和单 token 计算通常一起增长。

## MoE 改变的是 MLP 路径

常见 Transformer MoE 会保留注意力层，但把部分 Dense MLP 替换成多个专家 MLP：

```text
隐藏状态 x
→ router 计算专家分数
→ 选择 top-k 专家
→ 专家分别处理 x
→ 加权合并输出
```

若有 8 个专家、每个 token 只选 2 个：

- **总参数**包含全部 8 个专家；
- **激活参数**主要只包含被选中的 2 个专家；
- 权重仍需存储或分布在设备上；
- 计算量低于激活全部 8 个专家，但不等于没有路由和通信成本。

这就是为什么 MoE 必须同时报告 total parameters 与 active parameters。

## 一个两专家路由例子

设 Router 对 token “猫”给出：

```text
专家 A（语言结构）  0.75
专家 B（动物知识）  0.25
专家 C（代码）      0.05
```

若使用 top-2，保留 A、B 后要重新归一化，再合并两位专家输出。这里的专家名称只是教学标签；真实模型不会天然保证某个专家具有人类可读的固定职业。

Router 和专家参数都由训练学习。路由不是手写 if/else，也不能根据一次 token 分配就断言专家永久职责。

## 容量限制与负载均衡

如果很多 token 都选择同一专家，设备负载会失衡。实现通常设置：

- 每个专家每 batch 可接收的容量；
- 负载均衡辅助损失；
- token 超出容量时的丢弃、重路由或其他策略；
- expert parallel，把不同专家分散到不同设备。

这些机制引入新的失败方式：

- 热门专家拥堵，其他专家空闲；
- all-to-all 通信消耗抵消稀疏计算收益；
- 路由训练不稳定；
- 总权重很大，部署和加载仍然昂贵；
- 小 batch 下专家负载波动明显。

所以“稀疏激活”描述计算路径，不代表权重稀疏存储、系统通信免费或效果必然优于 Dense。

## Dense 与 MoE 对照

| 维度 | Dense | MoE |
| --- | --- | --- |
| 每 token 参数路径 | 同一组 MLP | Router 选择少数专家 |
| 总参数 vs 激活参数 | 较接近 | 可相差很大 |
| 权重存储 | 所有 Dense 权重 | 所有专家权重 |
| 计算 | 规则、易批量化 | 稀疏，但有路由开销 |
| 通信 | 常规张量/数据并行通信 | 可能增加 expert all-to-all |
| 主要风险 | 计算随规模直接增长 | 负载、容量、通信与稳定性 |

是否选择 MoE 是模型质量、训练预算、硬件拓扑和推理部署的联合决策，不是仅凭“总参数更大”。

## 与数据规模的关系

增加专家扩大了模型容量，但专家仍需足够、足够多样且正确路由的数据才能学到有用函数。若某类 token 很少到达某个专家，该专家的相关参数就缺少训练信号。

因此 scaling 仍然要回到三条轴：模型容量、有效数据和可承担的计算/通信预算。

## 常见误解

- **100B MoE 等于每个 token 都跑 100B 参数**：错误，要查看 active parameters 和 top-k。
- **MoE 只占激活专家的权重显存**：未必。未激活权重仍要驻留、分片或按需加载。
- **专家天然按学科分工**：路由职责是训练结果，可能混合且随层不同。
- **Scaling law 证明规模是唯一变量**：实验趋势建立在特定数据和训练设置中。
- **同计算量只比较参数量即可**：还必须比较训练 token、架构稀疏性与实际硬件效率。

## 本节自测

<KnowledgeQuiz
  storage-key="foundation-scaling-moe-v1"
  :questions="[
    { id:'moe-1', type:'boolean', prompt:'MoE 模型的总参数量通常等于每个 token 实际激活的参数量。', answer:false, explanation:'每个 token 通常只路由到少数专家，但总参数包含全部专家。' },
    { id:'moe-2', type:'single', prompt:'很多 token 同时选择同一个专家时，最直接的系统问题是什么？', options:['词表自动缩小','专家负载不均与拥堵','因果遮罩失效'], answer:'专家负载不均与拥堵', explanation:'需要容量约束、负载均衡和跨设备通信策略。' },
    { id:'moe-3', type:'fill', prompt:'评估 MoE 计算路径时，除总参数外还应报告哪一种参数量？', answer:['激活参数','active parameters','每 token 激活参数'], explanation:'它表示一次 token 前向实际经过的主要参数规模。' },
    { id:'moe-4', type:'open', prompt:'为什么不能根据“总参数更大”直接断言 MoE 推理一定更慢或一定更强？', rubric:['区分总参数和激活参数','考虑路由、通信、权重存储与硬件效率','指出模型质量还取决于数据与训练','要求在具体任务和部署条件下评测'], reference:'MoE 只激活少数专家，计算不与总参数直接等同；但存储、通信和路由仍有成本，效果也由数据与训练决定。' }
  ]"
/>

打印版答案：1. 错；2. 专家负载不均与拥堵；3. 激活参数；4. 必须同时分析模型、数据、计算和系统开销。

## 来源与下一步

- [Scaling Laws for Neural Language Models](https://arxiv.org/abs/2001.08361)
- [Training Compute-Optimal Large Language Models](https://arxiv.org/abs/2203.15556)
- [Switch Transformers](https://arxiv.org/abs/2101.03961)

下一课[多模态模型与扩散模型怎样连接本章主线](/ai/foundation-models/multimodal-and-diffusion)会说明哪些机制延续了 token 预测，哪些属于另一种生成过程。
