---
title: 训练目标与数据审计实验
date: 2026-09-05
updated: 2026-09-05
type: lab
status: verified
track: ai
chapter: data-training-alignment
prerequisites: [/ai/data-training-alignment/preference-alignment]
outcomes:
  - 能用代码发现规范化后的训练评测重复
  - 能断言 SFT loss mask 只覆盖目标响应
  - 能验证偏好对共享 Prompt 且响应不同
estimated: 45min
categories: [智能算法]
tags: [Data Audit, SFT, Preference, Python]
description: 用确定性 Python 脚本审计数据切分、SFT 目标 token 和偏好样本的结构不变量。
---

# 训练目标与数据审计实验

## 命题

一条训练链路至少能用自动断言证明：评测样本没有显式重复、SFT 计分位置属于目标回答、偏好对结构合法。脚本通过不代表数据优质，但能阻止低级静默错误。

## 环境

- Python 3.10+，只用标准库；
- 固定内置样本，无网络和文件写入；
- 浏览器通常低于 1 秒。

## 基线

先预测：`"2 + 3 = 5"` 与 `"2+3=5"` 的原始字符串不同，规范化后是否会进入同一哈希？

<ClientOnly><TrainingEvidenceLabPlayground /></ClientOnly>

预期输出包含：

```text
normalized duplicate leaks: ['eval-1']
SFT targets: ['5', '</assistant>']
preference pairs: 2
audit passed
```

## 三个实验

1. 删除 `normalize` 中的空白处理，观察泄漏检查为什么漏报；
2. 把 `<user>` 对应 mask 改成 1，让断言失败并解释风险；
3. 让 chosen 与 rejected 相同，增加结构断言阻止无信息偏好对。

## 记录

保存代码版本、输入 records、规范化规则、实际输出和失败断言。真实项目还需增加近重复、许可、时间、长度、语言和人工抽样，不能把哈希检查称为完整数据治理。

## 常见失败

- 修改 normalize 后旧哈希仍被缓存：重新生成全部数据版本；
- mask 长度与 token 长度不同：模板渲染后统一产生二者；
- 偏好 Prompt 看似相同但模板不同：比较 tokenized prompt；
- 只删除 eval 重复却不追踪训练来源：保留去重簇和处理记录。

## 下一步

使用[训练与对齐速查](/ai/data-training-alignment/reference)整理字段，再完成[章节验收](/ai/data-training-alignment/review)。
