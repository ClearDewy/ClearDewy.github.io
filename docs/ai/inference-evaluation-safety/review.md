---
title: 第 6 章复习与验收
date: 2026-09-05
updated: 2026-09-05
type: review
status: learnable
track: ai
chapter: inference-evaluation-safety
prerequisites: [/ai/inference-evaluation-safety/evaluation-safety-lab]
outcomes:
  - 能设计推理压测、端到端评测、错误归因和安全发布门禁
  - 能根据证据作出上线或回滚决定
estimated: 75min
categories: [智能算法]
tags: [Review, Evaluation, Safety]
description: 通过性能实验、评测设计、错误诊断和高风险控制验收推理与安全知识。
---

# 第 6 章复习与验收

<KnowledgeQuiz storage-key="inference-review-v1" :questions="[
 {id:'r6-1',type:'fill',prompt:'从请求到首 token 的时间简称什么？',answer:['TTFT','ttft'],explanation:'包含排队和 Prefill。'},
 {id:'r6-2',type:'boolean',prompt:'吞吐更高必然意味着每个用户等待更短。',answer:false,explanation:'batch 和排队可能提高吞吐却增加延迟。'},
 {id:'r6-3',type:'single',prompt:'正确文档未被召回属于哪层？',options:['检索','采样','授权'],answer:'检索',explanation:'模型尚未看到证据。'},
 {id:'r6-4',type:'boolean',prompt:'模型明确拒绝危险操作即可删除后端权限校验。',answer:false,explanation:'安全边界必须在模型之外强制。'},
 {id:'r6-5',type:'open',prompt:'为一个新模型写上线决策所需证据。',rubric:['固定身份与基线','多维离线评测','逐类错误和不确定性','性能/成本分位数','安全失败注入','小流量与回滚/监控'],reference:'先离线证明质量和边界，再小流量验证真实分布，并保留回滚与责任人。'}
]" />

## 综合任务

为“带来源的政策问答”设计：

1. 请求状态与超时/取消语义；
2. 4 个输入长度桶、2 个并发档的 TTFT/TPOT/吞吐压测；
3. 50 条版本化评测，含过期文档、冲突来源和无答案；
4. 答案、引用、拒答、延迟和成本 rubric；
5. oracle context 消融与错误分类；
6. 注入提示、越权参数、重试和取消；
7. 上线阈值、owner、告警与回滚步骤；
8. 运行[失败注入实验](/ai/inference-evaluation-safety/evaluation-safety-lab)。

## 评分

推理状态 2 分、性能 2 分、评测 2 分、归因 2 分、安全控制 2 分、实验 2 分。10/12 以上且高风险路径有模型外控制视为合格。

完成后进入[检索、Agent 与智能系统](/ai/agents-and-systems)。
