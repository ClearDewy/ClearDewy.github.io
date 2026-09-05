---
title: 推理服务怎样处理一个请求
date: 2026-09-05
updated: 2026-09-05
type: lesson
status: learnable
track: ai
chapter: inference-evaluation-safety
prerequisites: [/ai/foundation-models/prefill-kv-cache]
outcomes:
  - 能区分模型、运行时、调度器、缓存和 API 层
  - 能追踪请求从 tokenization 到流式输出的状态
  - 能说明量化、批处理和缓存分别改变什么
estimated: 40min
categories: [智能算法]
tags: [Inference, Serving, Runtime]
description: 从单个请求追踪 tokenizer、模型运行时、KV Cache、调度与流式返回，建立推理服务分层。
---

# 推理服务怎样处理一个请求

调用模型 API 看似只有一行，背后至少有协议、排队、tokenization、Prefill、Decode、采样和流式传输。排障前必须先知道故障属于哪一层。

## 请求路径

```text
HTTP/API 请求
→ 鉴权、配额与参数校验
→ Chat Template + tokenizer
→ scheduler 组 batch
→ runtime 执行 Prefill/Decode
→ KV Cache 管理
→ sampling / stop
→ detokenize 与流式事件
→ 用量、trace 与最终响应
```

## 五层责任

| 层 | 负责 | 不负责 |
| --- | --- | --- |
| API/Harness | 身份、参数、超时、事件协议 | 矩阵内核 |
| Scheduler | 排队、batch、抢占、公平性 | 判断回答事实正确 |
| Runtime | 加载权重、执行算子、设备通信 | 用户权限 |
| Model | 给定上下文产生 logits | 外部事实时效 |
| Decoder | logits 处理、采样、停止与文本解码 | 更新训练参数 |

## 优化分别作用在哪里

- 权重量化：改变权重表示与部分算子；
- continuous batching：在请求到达/完成时动态组合 Decode；
- paged cache：改善变长 KV Cache 的分配与复用；
- speculative decoding：用候选模型提出多个 token，再由目标模型验证；
- 编译/融合内核：减少调度和内存访问开销。

任何优化都要重新验证输出容差、支持的采样方式、显存、延迟和硬件条件。

## 请求状态必须显式

至少区分 queued、prefill、decoding、completed、cancelled、failed。取消后应释放 cache；超时与模型自然 EOS 不能共用同一个“完成”状态；流式连接断开也不一定表示后端计算已经停止。

## 常见错误

- 把排队时间算作模型 Decode 慢；
- 客户端断开但服务仍占用 GPU；
- 量化模型与原 tokenizer/template 错配；
- batch 中序列完成后 cache 未释放；
- 重试生成两份副作用或重复计费。

## 自测

<KnowledgeQuiz storage-key="inference-serving-v1" :questions="[
 {id:'is-1',type:'single',prompt:'continuous batching 主要属于哪一层？',options:['训练数据','请求调度','偏好标注'],answer:'请求调度',explanation:'它动态组合正在 Prefill/Decode 的请求。'},
 {id:'is-2',type:'boolean',prompt:'客户端流式连接断开必然表示 GPU 计算已取消。',answer:false,explanation:'后端必须显式传播取消并释放资源。'},
 {id:'is-3',type:'open',prompt:'量化上线前要做哪些对照？',rubric:['固定模型/tokenizer/template','任务质量与逐样本差异','TTFT/TPOT/吞吐','显存和硬件','异常/采样支持'],reference:'与未量化基线做同输入同配置比较，并记录质量、性能、资源和兼容性。'}
]" />

打印版答案：1. 请求调度；2. 错；3. 质量、性能、资源和兼容性对照。

## 下一步

进入[延迟、吞吐、显存与成本](/ai/inference-evaluation-safety/performance-metrics)。
