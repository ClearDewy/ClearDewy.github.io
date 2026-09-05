---
title: 第 0 章复习与验收
date: 2026-09-04
updated: 2026-09-04
type: review
status: learnable
track: ai
prerequisites: [第 0 章全部 lesson, 基础计算实验]
outcomes: [独立推导 shape, 独立检查梯度, 定位轴操作错误]
estimated: 20 分钟
description: 用纸笔推导、代码断言和错误诊断验收模型计算与优化基础。
---

# 第 0 章复习与验收

<KnowledgeQuiz
  storage-key="ai-foundations-review-v1"
  title="第 0 章交互自测"
  :questions="[
    { id: 'f0-boolean', type: 'boolean', prompt: 'reshape 会重新计算张量中的数值。', answer: false, explanation: 'reshape 只改变元素的分组方式；元素数量和线性顺序保持不变。', remediation: '/ai/foundations/tensor-shapes' },
    { id: 'f0-single', type: 'single', prompt: '[5,7] @ [7,3] 的输出 shape 是什么？', options: ['[5,3]', '[7,7]', '[5,7]', '[3,5]'], answer: '[5,3]', explanation: '共享维 7 被逐项乘加，外侧维 5 和 3 留在输出中。', remediation: '/ai/foundations/matrix-multiplication' },
    { id: 'f0-fill', type: 'fill', prompt: '把 [2,5,12] 拆成 3 个头，每头维度 D 等于多少？', answer: ['4', 'D=4', 'd=4'], explanation: 'C=H×D，所以 D=12÷3=4。', remediation: '/ai/foundations/tensor-shapes' },
    { id: 'f0-gradient', type: 'fill', prompt: 'L=(3w-9)²，在 w=2 时 dL/dw 等于多少？', answer: ['-18', '−18'], explanation: 'dL/dw=2(3w-9)×3；代入 w=2 得 -18。', remediation: '/ai/foundations/optimization-loop' },
    { id: 'f0-open', type: 'open', prompt: '解释为什么训练 loss 下降不等于模型已经泛化。', rubric: ['区分训练样本上的经验风险与未知数据表现', '提到过拟合、数据分布或评测证据中的至少一项', '没有把优化成功直接包装成任务成功'], reference: '训练 loss 只说明当前参数更符合训练数据和指定目标；泛化还必须由独立、代表未来分布的验证或测试数据确认。', remediation: '/ai/machine-learning/problem-and-evaluation' }
  ]"
/>

<noscript>浏览器未启用 JavaScript，请使用下面的打印版题目与答案完成复习。</noscript>

## 不查资料回答

1. `[4,6] @ [6,3]` 为什么输出 `[4,3]`？`C[2,1]` 从哪里来？
2. `[B,T,C] → [B,T,H,D]` 的必要条件和保持不变的量是什么？
3. 为什么 transpose 后数值没变，却可能让后续矩阵乘法成立？
4. 自动微分替你做了什么，又没有替你做什么？
5. 训练 loss 下降为什么不等于泛化变好？

## 推导与调试任务

- 手算 `[[1,2]] @ [[3],[4]]`。
- 把 `[2,5,12]` 拆成 3 个头并写出转置后的 shape。
- 对 $L=(3w-9)^2$ 在 `w=2` 处求梯度并以 `η=0.05` 更新。
- 诊断：某代码把 `[B,T,H,D]` 直接与 `[B,T,H,D]` 相乘后得到可运行结果。它为何可能语义错误？

## 答案与评分

- 纸笔题：结果 `11`；拆头 `[2,5,3,4]`，转置 `[2,3,5,4]`；梯度 `-18`，新参数 `2.9`。
- 调试题：attention 需要明确 query/key 矩阵轴，通常先形成 `[B,H,T,D] @ [B,H,D,T]`；“能广播”不等于语义正确。
- 满分 10：五个口答各 1 分，三个推导各 1 分，调试解释 2 分。8 分以上且[实验](/ai/foundations/lab)通过可进入下一章。

低于 8 分时按错误回看：[矩阵乘法](/ai/foundations/matrix-multiplication)、[张量形状](/ai/foundations/tensor-shapes)或[优化循环](/ai/foundations/optimization-loop)。建议 1 天后不看答案重做一次，7 天后再抽查 shape 与梯度题。
