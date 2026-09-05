---
title: 第 1 章复习与验收
date: 2026-09-04
updated: 2026-09-04
type: review
status: learnable
track: ai
prerequisites: [机器学习与泛化评估, 基线实验]
outcomes: [审查实验设计, 识别泄漏, 陈述证据边界]
estimated: 20 分钟
description: 通过实验审查题验收问题定义、划分、指标、基线与泛化概念。
---

# 第 1 章复习与验收

## 覆盖范围

学习任务七要素、训练/验证/测试职责、时间与实体泄漏、类别不均衡、基线、误差分析和结论边界。

<KnowledgeQuiz
  storage-key="ai-machine-learning-review-v1"
  title="第 1 章交互自测"
  :questions="[
    { id: 'ml-boolean', type: 'boolean', prompt: '只要使用交叉验证，就能自动避免时间穿越和实体泄漏。', answer: false, explanation: '切分策略必须显式尊重时间、用户、设备等边界；普通随机交叉验证不会自动知道这些语义。', remediation: '/ai/machine-learning/problem-and-evaluation' },
    { id: 'ml-single', type: 'single', prompt: '正例只有 1%，全部预测为负例时 accuracy 是多少？', options: ['1%', '50%', '99%', '无法计算'], answer: '99%', explanation: '高 accuracy 可能完全没有识别正例，因此还要查看 recall、precision 和业务代价。', remediation: '/ai/machine-learning/problem-and-evaluation' },
    { id: 'ml-fill', type: 'fill', prompt: '用于选择模型和决策阈值的数据集叫什么？', answer: ['验证集', 'validation set', 'validation'], explanation: '训练集拟合参数，验证集选择模型和阈值，测试集用于最后的无偏估计。', remediation: '/ai/machine-learning/problem-and-evaluation' },
    { id: 'ml-leak', type: 'single', prompt: '预测交易是否欺诈时，哪个特征最明显地泄漏未来？', options: ['交易金额', '交易发生小时', '退款完成时间', '商户类别'], answer: '退款完成时间', explanation: '预测时退款尚未完成，该字段包含结果发生后的信息。', remediation: '/ai/machine-learning/problem-and-evaluation' },
    { id: 'ml-open', type: 'open', prompt: '为预测用户明天是否流失设计一个可信的数据划分与评测方案。', rubric: ['按时间切分，测试集晚于训练与验证数据', '同一用户不会以泄漏方式跨越边界', '包含简单基线和与业务决策相符的指标', '报告错误类型、数据范围与结论边界'], reference: '使用较早时间窗训练、较近时间窗验证、未来时间窗测试，并按用户处理重复事件；比较多数类或规则基线，结合排序、召回和联系成本分析逐类错误。', remediation: '/ai/machine-learning/problem-and-evaluation' }
  ]"
/>

<noscript>浏览器未启用 JavaScript，请使用下面的打印版题目与评分准则。</noscript>

## 不查资料回答

1. 为什么训练误差不是最终目标？
2. 哪些决策属于验证集，为什么不能反复看测试集？
3. 同一患者多次就诊记录为什么不能按行随机切分？
4. 正例只有 1% 时，99% accuracy 说明了什么？
5. 为什么要同时报告平均指标和错误类别？

## 审查任务

某团队随机切分全部交易记录，加入“退款完成时间”特征预测欺诈，测试 accuracy 99.8%，没有基线，只报告总分。至少指出四个问题，并给出新的划分、基线、指标和错误分析方案。

## 评分准则

- 识别未来信息泄漏：2 分；识别同一用户/商户实体泄漏：2 分；
- 提出时间/实体分组切分：2 分；
- 提出多数类或规则基线：1 分；
- 使用 precision/recall、PR-AUC、业务代价和混淆矩阵：2 分；
- 陈述数据范围与未知结论：1 分。

8 分以上为通过。泄漏相关失分时回看[问题与评测](/ai/machine-learning/problem-and-evaluation)；基线或误差分析不足时重做[实验](/ai/machine-learning/baseline-lab)。建议一周后用自己的真实任务重写一次七要素。
