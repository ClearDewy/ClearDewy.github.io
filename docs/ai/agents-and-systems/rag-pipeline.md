---
title: RAG 怎样从文档得到可引用证据
date: 2026-09-05
updated: 2026-09-05
type: lesson
status: learnable
track: ai
chapter: agents-and-systems
prerequisites: [/ai/foundation-models/capability-boundaries]
outcomes:
  - 能追踪文档解析、切块、索引、召回、重排、组装和生成
  - 能区分参数知识、检索证据和引用
  - 能识别切块边界、版本和权限造成的失败
estimated: 45min
categories: [智能算法]
tags: [RAG, Retrieval, Citation]
description: 从原始文档到可引用回答逐步理解 RAG 的索引侧、查询侧和证据边界。
---

# RAG 怎样从文档得到可引用证据

RAG 把外部文档作为可更新、可追踪的非参数知识。它不是“向量数据库 + LLM”两个黑盒，而是两条相接的数据路径。

## 索引侧

```text
文档 → 解析 → 结构/权限/版本 → 切块 → Embedding
→ 向量/关键词索引 → chunk_id 与来源元数据
```

## 查询侧

```text
问题 → query 处理 → 召回候选 → 重排 → 权限过滤
→ 上下文组装 → 模型回答 → 引用映射
```

固定政策文档的每个 chunk 必须保留 document_id、section、version、valid_from/to、ACL 和原文位置。否则回答中的 `[1]` 只是编号，不能回到证据。

## 切块权衡

过小会丢上下文，过大则降低检索精度并浪费 context。优先利用标题、段落、表格等结构；重叠用于保留边界信息，但会增加重复候选。切块规则必须版本化。

## 混合召回与重排

向量检索擅长语义近似，关键词检索擅长精确名称、编号和日期。融合后再用重排器对 query—chunk 相关性排序。召回扩大候选，重排改善前几名；二者评测不能合并成一个“RAG 分数”。

## 上下文组装

按 token 预算选择证据，保留来源分隔和优先级。冲突文档要依据版本/生效时间处理，而不是让模型自行猜。检索内容是不可信数据，不能覆盖系统指令或获得工具权限。

## 引用成立的条件

回答中的具体主张能定位到引用 chunk，chunk 原文直接支持主张，版本/权限有效。引用相关但不支持数字，仍是 grounding 失败。

## 常见错误

- PDF 解析丢表格列；
- chunk 没有标题和版本；
- 先检索再做权限过滤导致侧信道；
- top-k 都是同一重复文档；
- 引用编号与最终上下文重排错位；
- 新索引上线未保留旧版本，无法重放。

## 自测

<KnowledgeQuiz storage-key="rag-pipeline-v1" :questions="[
 {id:'rag-1',type:'boolean',prompt:'回答附带一个相关链接就足以证明引用支持主张。',answer:false,explanation:'引用原文必须直接支持具体主张。'},
 {id:'rag-2',type:'single',prompt:'政策版本冲突应优先依靠什么？',options:['模型猜测','版本和生效时间元数据','提高 temperature'],answer:'版本和生效时间元数据',explanation:'冲突处理应是可审计规则。'},
 {id:'rag-3',type:'open',prompt:'一条 chunk 至少保存哪些来源字段？',rubric:['document/chunk ID','章节/原文位置','版本和有效时间','权限','解析/切块版本'],reference:'必须能回到原文、判断当前有效性与访问权限。'}
]" />

打印版答案：1. 错；2. 版本和生效时间；3. 身份、位置、版本、权限和处理版本。

来源：[Retrieval-Augmented Generation](https://arxiv.org/abs/2005.11401)。

## 下一步

进入[怎样分别评测检索与回答](/ai/agents-and-systems/retrieval-evaluation)。
