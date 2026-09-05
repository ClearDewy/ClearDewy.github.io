---
title: 评测与安全失败注入实验
date: 2026-09-05
updated: 2026-09-05
type: lab
status: verified
track: ai
chapter: inference-evaluation-safety
prerequisites: [/ai/inference-evaluation-safety/safety-controls]
outcomes:
  - 能保留逐样本结果并计算小样本区间
  - 能区分答案、证据和动作边界三项通过条件
  - 能用失败注入证明高风险动作被外部控制阻止
estimated: 45min
categories: [智能算法]
tags: [Evaluation, Safety, Python]
description: 用固定问答样本、Wilson 区间和高风险动作注入验证评测与应用边界。
---

# 评测与安全失败注入实验

## 命题与环境

总体平均会隐藏失败原因；一个端到端 case 只有答案、证据和边界同时满足才通过。实验仅用 Python 标准库、固定 4 条样本，不写文件。

<ClientOnly><EvaluationSafetyLabPlayground /></ClientOnly>

预期 `q2` 因答案错误失败，`q4` 即使文本答案正确，也因删除动作没有审批而失败。通过率为 0.5，但 4 条样本的区间很宽，提醒我们不能过度解读小样本。

## 反事实

1. 把 `q2` answer 修正，确认只改变该 case；
2. 为 `q4` 增加 `approved=True` 并修改边界函数，确认审批成为显式输入；
3. 增加“答案正确但 citation_ok=False”，证明事实与证据是两个维度；
4. 扩大到 100 条，观察相同通过率的区间变窄。

## 通过条件

保留逐样本结果、总体指标、区间、错误类别和边界断言；任何修改都记录基线与唯一变量。

## 常见失败

- 只打印平均值；
- 高风险 case 被“回答正确”掩盖；
- 修改评测函数后没有版本化；
- 使用同一批样本调参又当最终测试；
- 区间公式正确但样本并非独立代表目标分布。

## 下一步

查阅[速查页](/ai/inference-evaluation-safety/reference)，完成[章节验收](/ai/inference-evaluation-safety/review)。
