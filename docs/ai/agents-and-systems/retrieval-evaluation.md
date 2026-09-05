---
title: 怎样分别评测检索与回答
date: 2026-09-05
updated: 2026-09-05
type: lesson
status: learnable
track: ai
chapter: agents-and-systems
prerequisites: [/ai/agents-and-systems/rag-pipeline]
outcomes:
  - 能分别定义检索、上下文和生成指标
  - 能用 oracle context 和无检索对照定位失败
  - 能为无答案、冲突和权限场景设计评测
estimated: 40min
categories: [智能算法]
tags: [Retrieval Evaluation, Grounding, RAG]
description: 分层评测候选召回、重排上下文、引用支持和最终答案，避免一个端到端分数掩盖故障。
---

# 怎样分别评测检索与回答

RAG 回答正确可能只是模型参数记得；回答错误也可能是检索、组装或生成任一层。评测要保存中间证据。

## 四层指标

| 层 | 问题 | 例子 |
| --- | --- | --- |
| corpus | 正确证据是否存在且有权限 | coverage |
| retrieval | gold chunk 是否进入候选/前 k | recall@k、MRR/nDCG |
| context | 最终给模型的证据是否充分、无冲突 | context precision/coverage |
| answer | 主张是否正确且被引用支持 | correctness、citation support |

Recall@k 高不保证答案正确；答案正确也不证明使用了检索证据。

## 三个对照

- 无检索：测参数/Prompt 基线；
- 实际检索：测端到端系统；
- oracle context：手工给正确证据，测试生成上限。

实际检索差、oracle 好，优先修检索；oracle 也差，检查上下文理解、Prompt 和模型。

## 必须包含的困难集

无答案、多个版本冲突、相似标题、表格信息、跨 chunk 组合、无权限文档和提示注入内容。只测简单单段命中会高估系统。

## 自测

<KnowledgeQuiz storage-key="retrieval-eval-v1" :questions="[
 {id:'re-1',type:'boolean',prompt:'最终答案正确可以证明检索链路正确。',answer:false,explanation:'模型可能依靠参数或猜测。'},
 {id:'re-2',type:'single',prompt:'gold chunk 未进入 top-k，属于哪层？',options:['retrieval','answer formatting','tool permission'],answer:'retrieval',explanation:'候选召回已失败。'},
 {id:'re-3',type:'open',prompt:'oracle context 对照能怎样定位问题？',rubric:['保持模型/Prompt固定','替换为正确证据','与实际检索比较','oracle好指向检索','oracle差指向生成/任务'],reference:'只改变上下文证据，比较答案与引用。'}
]" />

打印版答案：1. 错；2. retrieval；3. 固定其他条件比较 oracle。

## 下一步

RAG 只读外部知识；需要行动时进入[工具调用协议](/ai/agents-and-systems/tool-protocol)。
