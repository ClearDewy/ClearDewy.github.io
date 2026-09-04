---
title: 智能算法知识地图
article: false
description: 智能算法专题的完整知识结构、章节边界、依赖关系与建设规则。
---

# 智能算法知识地图

## 组织原则

知识库同时采用两条轴：

- **原理轴**：表示 → 学习 → 模型 → 生成与决策；
- **生命周期轴**：问题 → 数据 → 训练 → 评测 → 推理 → 反馈。

原理轴回答“为什么这样计算”，生命周期轴回答“怎样把计算变成可信系统”。任何具体框架或项目都只是这两条轴上的案例。

::: tip 文章粒度
一篇文章对应一个完整知识块，内部再分概念、公式、可视化、实现、实验和边界。只有当某个小节已经大到无法独立阅读或需要独立维护的实验时，才拆成新文章。
:::

## 完整依赖图

<ClientOnly>
  <MermaidDiagram
    title="章节依赖与反馈"
    :code="`flowchart TD\n      F[0 数学、张量与优化基础]\n      M[1 学习问题与经典机器学习]\n      D[2 神经网络与表示学习]\n      T[3 序列、注意力与 Transformer]\n      G[4 基础模型与生成模型]\n      R[5 数据、训练与对齐]\n      E[6 推理、评测与安全]\n      A[7 检索、Agent 与智能系统]\n      P[MiniMind 与其他项目实战]\n      F --> M --> D --> T --> G\n      F --> D\n      M --> R\n      D --> R\n      T --> R\n      G --> R --> E --> A\n      P -.实现验证.-> D\n      P -.训练验证.-> R\n      P -.误差反馈.-> E\n      E -.反馈到问题与数据.-> M`"
  />
</ClientOnly>

## 第 0 章：数学、张量与优化基础

目标不是完整重学高等数学，而是能解释模型中的对象、变换和学习信号。

- **表示与形状**：标量、向量、矩阵、张量、轴语义、索引、广播、reshape、transpose；
- **线性代数**：向量空间、基、线性映射、内积、矩阵乘法、范数、特征值与 SVD 的直觉；
- **微积分**：导数、偏导、梯度、链式法则、Jacobian 与反向传播；
- **概率与信息**：随机变量、条件概率、期望、方差、最大似然、熵、交叉熵和 KL 散度；
- **数值计算**：浮点数、稳定 softmax、精度、随机性、复杂度、内存与向量化；
- **优化**：梯度下降、动量、Adam/AdamW、学习率、正则化和约束；
- **PyTorch 计算模型**：tensor、autograd、module、optimizer、device 与计算图。

过关标准：看到一个张量表达式能说明每个轴、推导输出、估算计算量，并解释梯度怎样回到参数。

## 第 1 章：学习问题与经典机器学习

- 问题定义、样本、特征、标签、目标函数、假设空间和归纳偏置；
- 监督、无监督、自监督、半监督与强化学习的区别；
- 线性/逻辑回归、朴素贝叶斯、kNN、决策树、随机森林、Boosting、SVM；
- 聚类、降维、密度估计、异常检测与时间序列基础；
- 训练/验证/测试、交叉验证、数据泄漏、偏差—方差和校准；
- 分类、回归、排序与概率预测的指标选择；
- 可解释性、因果问题与相关性边界。

过关标准：能把真实问题写成可验证的学习任务，并建立一个难以被复杂模型轻易糊弄的基线。

## 第 2 章：神经网络与表示学习

- 感知机、MLP、激活函数、损失和反向传播；
- 初始化、归一化、残差、正则化和优化稳定性；
- CNN：局部连接、共享权重、感受野和视觉层级；
- RNN/LSTM/GRU：状态、时间展开、长程依赖与梯度问题；
- Embedding、自编码器、对比学习与迁移学习；
- 图神经网络、视觉、语音和多模态的共同表示问题；
- 参数、激活、FLOPs、显存和硬件执行的基本关系。

过关标准：能手写并训练小网络，解释每个模块的归纳偏置，而不只会组合框架层。

## 第 3 章：序列、注意力与 Transformer

- 序列建模问题与 RNN 的串行瓶颈；
- query、key、value 的信息检索解释；
- scaled dot-product attention、mask 与 softmax；
- 多头注意力为什么需要不同投影，为什么拆头和转置；
- MHA、MQA、GQA 的能力与 KV Cache 代价；
- 位置编码、RoPE、ALiBi 与长上下文；
- FFN/SwiGLU、RMSNorm、残差与 Decoder Block；
- Encoder-only、Decoder-only、Encoder–Decoder 的任务差异；
- 参数量、注意力复杂度、FlashAttention 与稀疏/线性注意力。

过关标准：能从 `[B,T,C]` 推导一次完整前向传播，并解释每次变形服务于哪次计算。

## 第 4 章：基础模型与生成模型

- Tokenization、词表、Embedding 与语言建模目标；
- BERT/GPT/T5 等预训练范式及其适用任务；
- scaling law、涌现的观察边界与数据/算力/参数权衡；
- Dense、MoE、模型容量与路由；
- 自回归生成、扩散模型、VAE/GAN 的目标差异；
- 视觉 Transformer、CLIP、视觉语言模型和多模态对齐；
- 上下文学习、提示、推理行为与能力归因边界。

过关标准：能从训练目标解释模型擅长和不擅长什么，不把语言流畅等同于事实、推理或可靠性。

## 第 5 章：数据、训练与对齐

- 数据采集、许可、清洗、去重、过滤、配比、版本与污染；
- BPE/WordPiece/Unigram、ByteLevel、特殊 token 与 chat template；
- 预训练数据管线、packing、mask、batch 和 checkpoint；
- SFT、continued pretraining、LoRA/Adapter 等 PEFT；
- 蒸馏、量化感知训练与模型压缩；
- 偏好数据、reward model、DPO 与 RLHF；
- PPO、GRPO/CISPO 等策略优化的前置假设和失败方式；
- 单卡、多卡、混合精度、梯度累积、并行与实验追踪。

过关标准：能把模型行为追溯到数据与目标函数，并用最小对照实验验证训练改动。

## 第 6 章：推理、评测与安全

- greedy、temperature、top-k/top-p、beam search 和停止条件；
- KV Cache、continuous batching、量化、编译和推理引擎；
- 延迟、吞吐、显存、成本、容量规划与降级；
- 离线/在线评测、基准集、污染、统计不确定性与人工评审；
- 任务成功率、事实性、校准、鲁棒性和长尾误差；
- 提示注入、越权工具调用、隐私、数据泄漏和模型滥用；
- tracing、监控、漂移、回归集、红队和事件响应。

过关标准：任何“变好”都能指出基线、数据范围、指标、置信边界以及没有被证明的部分。

## 第 7 章：检索、Agent 与智能系统

- Prompt、结构化输出、function/tool calling 和协议边界；
- Embedding 检索、切块、召回、重排、引用和 RAG 评测；
- 短期上下文、长期记忆、状态、存储与遗忘策略；
- Agent loop、状态机、工作流、规划与反思；
- 权限、沙箱、人工审批、幂等、重试、超时和失败恢复；
- 多 Agent 的通信、任务分解、共享状态和成本；
- Evals、trace、可观测性、调度与持续改进；
- 产品边界：何时用确定性软件、模型调用、RAG 或 Agent。

过关标准：能把模型的不确定输出包进显式控制和证据链，而不是依赖一句更长的 prompt。

## 实战层

实战不决定目录，只负责验证目录中的知识：

- **MiniMind**：观察小型 Decoder LLM 的 tokenizer、模型、预训练、SFT、LoRA、DPO、RL、推理和服务；
- **从零最小实现**：先自己实现，再对照成熟项目，避免被封装掩盖原理；
- **框架实践**：用 PyTorch、Transformers、Datasets、PEFT 等验证生态接口；
- **系统实践**：用固定评测集、日志、服务和监控验证完整闭环。

## 开放资料如何使用

| 资料 | 在本知识库中的角色 | 不直接照搬的部分 |
| --- | --- | --- |
| [Dive into Deep Learning](https://github.com/d2l-ai/d2l-en) | 数学、经典网络、注意力、优化和计算性能的主参考 | 它的书籍章节粒度不等于本站文章粒度 |
| [Stanford CS229](https://cs229.stanford.edu/) | 经典机器学习、学习理论与问题定义 | 不以课程周次组织本站 |
| [Stanford CS336](https://cs336.stanford.edu/spring2025/) | 从 tokenizer、Transformer 到数据、训练、扩展和对齐的实现闭环 | GPU/分布式作业按资源条件选做 |
| [Hugging Face Course](https://github.com/huggingface/course) | Tokenizer、Datasets、Transformers 和微调工具链 | 先理解原理，再使用高层 API |
| [Full Stack Deep Learning](https://fullstackdeeplearning.com/course/2022/) | 数据管理、实验、测试、部署和监控 | 通用系统能力链接到系统工程专栏 |
| [Hugging Face Agents Course](https://huggingface.co/learn/agents-course/) | 工具、Agentic RAG、可观测性和评测案例 | 框架只是实现选择，不作为概念定义 |
| [MiniMind](https://github.com/jingyaogong/minimind) | 小模型全链路实战与源码对照 | 项目文件树不作为知识树 |

## 建设顺序

1. 先补齐第 0、2、3 章，使每个公式都有变量语义、shape 推导和最小实验；
2. 同步建立第 1、6 章的基线与评测习惯；
3. 再进入第 4、5 章和 MiniMind 全链路实践；
4. 模型与评测稳定后学习第 7 章，不提前用 Agent 框架遮蔽基础问题；
5. 视觉、多模态、强化学习、推荐和时间序列作为各章的纵向专题逐步展开。

新内容必须说明自己位于哪个知识块、依赖什么、验证了什么，以及不能据此声称什么。
