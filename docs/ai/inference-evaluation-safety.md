---
title: 6. 推理、评测与安全
date: 2026-09-05
updated: 2026-09-05
type: overview
status: learnable
track: ai
categories: [智能算法]
tags: [Inference, Evaluation, Safety]
description: 从推理服务和性能指标进入评测设计、错误归因、安全控制与上线证据闭环。
---

# 6. 推理、评测与安全

模型训练完成不等于产品可用。本章把“给出一个回答”扩展成可测量、可限制、可回滚的运行系统。

```text
模型与配置 → 推理运行时 → 请求调度 → 输出
→ 任务评测与错误分类 → 风险场景与外部控制
→ 小流量上线 → 监控、事件与回滚
```

## 固定案例

使用“带来源的内部知识问答”：用户提问一个政策生效日期，系统需要回答、引用证据，并满足延迟和拒答边界。它同时暴露准确性、证据性、时效性、性能和安全问题。

## 学习顺序

| 顺序 | 页面 | 完成证据 |
| ---: | --- | --- |
| 1 | [推理服务怎样处理一个请求](/ai/inference-evaluation-safety/inference-serving) | 能画出 runtime、scheduler、cache 和请求边界 |
| 2 | [延迟、吞吐、显存与成本怎样权衡](/ai/inference-evaluation-safety/performance-metrics) | 能区分 TTFT、TPOT、吞吐和端到端延迟 |
| 3 | [怎样设计可信的模型与系统评测](/ai/inference-evaluation-safety/evaluation-design) | 能从用户任务构造数据、rubric、指标和基线 |
| 4 | [怎样分类错误并归因改进](/ai/inference-evaluation-safety/error-analysis) | 能把失败归属到模型、检索、工具或评分器 |
| 5 | [安全边界为什么必须在模型之外](/ai/inference-evaluation-safety/safety-controls) | 能为高风险动作设计权限、校验和审批 |
| 6 | [评测与安全失败注入实验](/ai/inference-evaluation-safety/evaluation-safety-lab) | 运行固定评测并验证边界 |
| 7 | [推理、评测与安全速查](/ai/inference-evaluation-safety/reference) | 查询指标和发布字段 |
| 8 | [第 6 章复习与验收](/ai/inference-evaluation-safety/review) | 完成发布决策与事故诊断 |

## 过关标准

能为任何“模型变好了”补全：模型/配置、数据版本、基线、多维指标、逐类错误、置信区间或不确定性、延迟/成本和未证明部分；能为任何高风险副作用指出模型之外的强制控制与责任方。

完成后进入[检索、Agent 与智能系统](/ai/agents-and-systems)。
