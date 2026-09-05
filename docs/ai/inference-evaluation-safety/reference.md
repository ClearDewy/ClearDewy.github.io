---
title: 推理、评测与安全速查
date: 2026-09-05
updated: 2026-09-05
type: reference
status: verified
track: ai
chapter: inference-evaluation-safety
categories: [智能算法]
tags: [Inference, Evaluation, Safety, Reference]
description: 查询推理状态、性能指标、评测身份、错误类别和模型外安全控制。
---

# 推理、评测与安全速查

## 推理状态

`queued → prefill → decoding → completed | cancelled | failed`。取消、超时、EOS 和错误必须区分并释放资源。

## 性能指标

| 指标 | 范围 |
| --- | --- |
| queue time | 到达至执行 |
| TTFT | 到达至首 token |
| TPOT | 后续 token 间隔 |
| E2E latency | 到达至完成 |
| throughput | 全系统单位时间 token/请求 |

报告模型/量化、硬件、输入输出长度、并发、采样、预热和 p50/p95/p99。

## 评测身份

模型与 checkpoint、tokenizer/template、Prompt、采样、数据集/split、索引/工具、评分器、代码版本、运行时间。

## 证据层

单元不变量 → 模型离线 → 系统离线 → 小流量在线 → 运行监控。每层不可替代下一层。

## 错误标签

输入歧义、知识缺失、推理/计算、检索召回、重排/上下文、工具、权限、格式、超时、评分错误。保存主因、次因和证据。

## 安全链

身份 → 授权 → schema → allowlist → 风险审批 → 隔离执行 → 结果校验 → 审计 → 取消/补偿。

## 发布门禁

- 质量和关键子群不低于阈值；
- 延迟、吞吐、显存、成本满足 SLO；
- 高严重度风险 case 全部被控制；
- 回滚、监控、owner 和事件响应可用；
- 模型卡记录适用范围与限制。

来源：[HELM](https://arxiv.org/abs/2211.09110)、[Model Cards](https://arxiv.org/abs/1810.03993)、[NIST AI RMF](https://www.nist.gov/itl/ai-risk-management-framework)。
