---
title: 延迟、吞吐、显存与成本怎样权衡
date: 2026-09-05
updated: 2026-09-05
type: lesson
status: learnable
track: ai
chapter: inference-evaluation-safety
prerequisites: [/ai/inference-evaluation-safety/inference-serving]
outcomes:
  - 能区分排队、TTFT、TPOT 和端到端延迟
  - 能设计固定输入输出长度的性能实验
  - 能解释提高吞吐为何可能损害单请求延迟
estimated: 35min
categories: [智能算法]
tags: [Latency, Throughput, Cost]
description: 建立推理性能指标和受控压测方法，避免用单个 token/s 掩盖用户等待与资源成本。
---

# 延迟、吞吐、显存与成本怎样权衡

“模型每秒 100 token”信息不足：是单请求还是全系统？输入多长？输出多长？是否含排队？

## 时间线

```text
到达 → 排队 → Prefill → 首 token → Decode 间隔 → 最后 token → 完成
```

| 指标 | 定义 |
| --- | --- |
| queue time | 到达至开始执行 |
| TTFT | 到达至首 token |
| TPOT | 首 token 后平均每个输出 token 间隔 |
| end-to-end latency | 到达至最终完成 |
| throughput | 系统每秒完成的 token 或请求 |

必须同时报告输入/输出 token 分布和并发，否则不同结果不可比。

## 为什么吞吐与延迟冲突

调度器等待更多请求组成大 batch，可以提高设备利用率和总 token/s，却增加排队与单请求等待。优化目标应来自产品 SLO，而不是只最大化 GPU 利用率。

## 受控压测

固定：模型与量化、硬件、输入长度桶、输出长度/停止、采样、并发模式、预热次数和测量窗口。报告 p50/p95/p99，不只平均值；区分冷启动和稳态。

## 成本单位

可以报告每百万输入/输出 token 成本、每成功任务成本、每 GPU 小时吞吐。若质量下降导致重试，便宜的单次调用可能带来更高任务成本。

## 常见错误

- 把输入和输出 token/s 混在一起；
- 忽略排队，只测内核时间；
- 用短 Prompt 推断长上下文性能；
- 只报告平均值，隐藏长尾；
- 不固定输出长度，快模型只是更早停止。

## 自测

<KnowledgeQuiz storage-key="performance-metrics-v1" :questions="[
 {id:'pm-1',type:'fill',prompt:'用户发出请求到看到第一个 token 的时间简称什么？',answer:['TTFT','ttft'],explanation:'Time To First Token。'},
 {id:'pm-2',type:'boolean',prompt:'提高 batch 通常可能同时提高吞吐并增加等待延迟。',answer:true,explanation:'设备利用率和排队目标可能冲突。'},
 {id:'pm-3',type:'open',prompt:'怎样公平比较两个推理配置？',rubric:['固定模型/硬件','固定输入输出长度分布','固定并发和采样','预热与测量窗口','报告分位数、显存和质量'],reference:'使用同一 workload 与质量评测，分开报告 TTFT、TPOT、吞吐、长尾和资源。'}
]" />

打印版答案：1. TTFT；2. 对；3. 固定 workload 并多维报告。

## 下一步

性能只回答“跑得怎样”，下一课[可信评测设计](/ai/inference-evaluation-safety/evaluation-design)回答“做得怎样”。
