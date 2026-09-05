---
title: QKV 如何把注意力变成可学习检索
date: 2026-09-04
updated: 2026-09-05
type: lesson
status: learnable
track: ai
chapter: transformers
prerequisites:
  - /ai/foundations/matrix-multiplication
  - /ai/foundations/tensor-shapes
  - /ai/deep-learning/mlp-representation
outcomes:
  - 能分别说明 Query、Key、Value 在一次读取中的职责
  - 能用具体向量算出匹配分数、权重和加权输出
  - 能解释三个可学习投影为什么不能等同于复制输入
estimated: 35 分钟
categories: [智能算法]
tags: [Attention, QKV, Retrieval]
description: 从两个 token 的软检索动画开始，理解 Q、K、V 怎样分离匹配问题、候选索引和实际内容。
---

# QKV 如何把注意力变成可学习检索

先用一句话定位：**Query 提出当前需要，Key 负责接受匹配，Value 提供匹配后真正取回的内容。**

注意力不是传统数据库中的精确查找。它通常让一个 query 同时读取多个候选，只是比例不同，因此更接近“可微分的软检索”。

本页只解决两个问题：`X` 怎样产生 Q、K、V，以及三者为什么必须分工。缩放、因果遮罩和 Softmax 的完整计算留到下一课，避免在认识对象之前同时处理整条公式。

## 文本怎样进入矩阵 X

先把自然语言和矩阵中的行对应起来。以教学序列“红色 苹果”为例，可以把入口简化为：

```text
文本“红色 苹果”
→ tokenizer 划分为两个教学 token
→ token id 查 embedding 表
→ 让位置机制参与表示或后续注意力
→ X：第一行表示“红色”，第二行表示“苹果”
```

若每个 token 用 `C` 个数字表示，那么 `X` 的 shape 是 `[T,C]`。代码中的 `X[1]` 不是单个词义标签，而是第二个位置当前拥有的整行特征。真实 tokenizer 可能采用不同切分，真实 embedding 也有很多维；本页使用二维人工坐标，是为了能手算，不声称它是真实模型产生的语义向量。

## 为什么需要检索

MLP 可以变换单个 token 的特征，却不会自动让一个 token 读取另一个 token。在“红色 苹果”中，只对“苹果”这一行做 MLP，不会凭空得到第一行携带的颜色信息。要形成上下文化表示，第二个位置必须拥有一条从第一位置读取信息的路径。

序列通信至少要回答三个不同问题：

1. 当前 token 正在寻找什么信息？
2. 其他 token 用什么特征参与匹配？
3. 匹配成功后，其他 token 实际提供什么内容？

把这三件事都压在同一个向量上会限制分工。QKV 用三个可学习投影分别处理。

## Q、K、V 从哪里来

对输入表示 `X`：

$$
Q=XW_Q,\qquad K=XW_K,\qquad V=XW_V
$$

`WQ、WK、WV` 是训练更新的参数；`Q、K、V` 是当前输入产生的激活。三者 shape 可以相同，但数值和职责通常不同。

| 角色 | 面向谁 | 用在什么计算 | 直觉问题 |
| --- | --- | --- | --- |
| Query | 当前读取位置 | 与所有 Key 点积 | “我现在要找什么？” |
| Key | 所有候选位置 | 接受 Query 匹配 | “我适合被哪些问题找到？” |
| Value | 所有候选位置 | 被注意力权重加权求和 | “如果选中我，我提供什么？” |

类比只能帮助入门：Q 不是自然语言问题，K 不是数据库主键，V 也不是原样复制的记录。它们都是训练目标塑造出的连续向量。

## 固定两个位置的最小数值

为保证每一步可以手算，本章使用：

$$
Q=K=\begin{bmatrix}1&0\\0&1\end{bmatrix},
\qquad
V=\begin{bmatrix}2&0\\0&4\end{bmatrix}
$$

这可以由 `X=I、WQ=WK=I、WV=diag(2,4)` 产生。真实模型的投影矩阵当然不是手工固定为单位矩阵；这里刻意简化，只为把角色分工看清。

两行继续对应前面的教学 token：第一行是“红色”，第二行是“苹果”。`X=I` 只是给两行安排了容易区分的二维坐标，不表示现实 embedding 恰好是单位矩阵。

## 矩阵动画：同一个 X 怎样产生三种角色

下面的 Canvas 只观察投影阶段。点击 Q、K、V 三个阶段，比较同一个 `X` 经过不同参数后怎样承担不同职责。`X、WQ、WK、WV` 的矩阵格可以直接输入数值，派生出的 Q、K、V 保持只读并即时重算。

<ClientOnly>
  <QkvRetrievalDemo scope="roles" />
</ClientOnly>

操作时注意：

- `Q、K、V` 的行始终对应原来的 token 位置，投影改变的是每行的特征表示；
- 修改 `WQ` 只会直接改变 Query，修改 `WK` 只会直接改变 Key；
- 修改 `WV` 会改变可读取的内容，但不会改变 Q/K 的匹配依据；
- 自定义实验应修改输入或投影参数；Q、K、V 是派生结果，不作为可编辑答案。

## 手算位置 1 的一次读取

第一个 Query 是 `q₁=[1,0]`。它与两个 Key 的点积为：

$$
s_1=[q_1\cdot k_1,q_1\cdot k_2]=[1,0]
$$

进入下一课使用的完整单头基线后，分数还要除以 `√2`，并加入 causal mask。位置 1 不允许读取未来位置 2，因此：

$$
s_1/\sqrt2=[0.707,0]
\quad\xrightarrow{\text{mask}}\quad
[0.707,-\infty]
\quad\xrightarrow{\text{softmax}}\quad
p_1=[1,0]
$$

再汇总 Value：

$$
o_1
=1[2,0]+0[0,4]
=[2,0]
$$

这里恰好完整选择第一行，是 causal mask 只留下一个合法候选，不代表注意力一般都是硬选择。

## 手算位置 2 的一次读取

第二个 Query 是 `q₂=[0,1]`：

$$s_2=[0,1],\qquad p_2=softmax([0,1/\sqrt2])\approx[0.3302,0.6698]$$

因此：

$$
o_2
=0.3302[2,0]+0.6698[0,4]
\approx[0.6605,2.6790]
$$

同一组 Key 和 Value，面对不同 Query 会产生不同权重和输出。这就是“每个位置根据自己的需要读取序列”的最小数值证据。

对应到教学序列，第二个输出仍属于“苹果”所在位置，但其中已经混入第一行 Value 携带的部分信息。Attention 更新的是每个位置的表示，不会把两个 token 合并成一个。

## 为什么不能省略 Value

`QKᵀ` 只产生一个“从哪里读、读多少”的权重表，并不等于要传递的内容。

设 Key 保持不变，把 `V₂` 从 `[0,4]` 改成 `[10,10]`：

- Query 与 Key 的点积不变；
- softmax 权重不变；
- 加权输出改变。

这使模型可以使用一组特征寻址，同时传递另一组特征。例如某些方向适合判断句法关系，另一些方向适合携带最终需要汇总的内容。不要把这个解释理解成每个维度必然具有清晰人类语义。

## 为什么三个投影是“可学习”的

如果直接设 `Q=K=V=X` 且没有投影，匹配方式与取回内容都被输入空间固定。使用不同参数后，训练可以改变：

- 哪些输入特征进入 Query；
- 哪些输入特征决定 Key 的可匹配性；
- 哪些输入特征作为 Value 被传播；
- 不同注意力头各自使用什么子空间。

反向传播会从最终任务 loss 经过输出、权重、分数回到 `WQ/WK/WV`。因此“检索规则”不是人工写死，而是任务训练的结果。

## 扩展阅读：输入来源不同时怎样称呼

下面的名称用于帮助后续识别模型结构，不属于本页过关要求。核心计算仍然是 Query 与 Key 匹配、再读取 Value。

| 类型 | Query 来源 | Key/Value 来源 | 典型用途 |
| --- | --- | --- | --- |
| self-attention | 当前序列 | 同一序列 | token 之间建立上下文 |
| causal self-attention | 当前序列 | 同一序列，但遮住未来 | 自回归生成 |
| cross-attention | 一组表示 | 另一组表示 | Decoder 读取 Encoder、文本读取图像特征等 |

“来自同一序列”不表示 Q/K/V 数值相同，只表示它们投影前共享输入来源。

## 从角色直觉过渡到完整公式

对所有 query 批量计算，得到：

$$
\operatorname{Attention}(Q,K,V)
=\operatorname{softmax}\left(\frac{QK^\top}{\sqrt D}+M\right)V
$$

本页只要求看懂公式两端：`QKᵀ` 负责匹配，最后乘 `V` 负责取回。中间的 `√D`、mask 和 softmax 轴将在[完整注意力流水线](/ai/transformers/attention-pipeline)逐项展开。先完成一个头的完整闭环，再扩展到 batch 和多头。

## 常见误解与边界

- **Q、K、V 不是三份相同输入。** 它们通常来自不同参数投影。
- **Key 与 Value 不可随意互换。** 前者参与匹配，后者参与输出汇总。
- **高注意力权重不自动等于因果解释。** 它只描述当前前向计算中的加权路径。
- **softmax 权重不是硬选择。** 一个 query 通常同时读取多个合法位置。
- **attention 本身不知道顺序。** 顺序需要位置编码、mask 或其他结构进入计算。
- **权重高不保证模型理解语义。** 仍需任务评估、干预和对照证据。

## 本节自测

<ClientOnly>
  <KnowledgeQuiz
    title="QKV 角色与读取自测"
    storage-key="ai-transformers-qkv-retrieval"
    :questions="[
      {
        id: 'qkv-value-change',
        type: 'boolean',
        prompt: '保持 Q 和 K 不变，只修改 V，会同时改变注意力分数和最终输出。',
        answer: false,
        explanation: '分数只由 Q 与 K 产生；修改 V 不改分数和权重，但会改变加权输出。',
        remediation: '/ai/transformers/qkv-retrieval#为什么不能省略-value'
      },
      {
        id: 'qkv-score-shape',
        type: 'single',
        prompt: '单头 Q 的 shape 为 [Tq,D]，K 为 [Tk,D]，QK 转置后的分数 shape 是什么？',
        options: ['[D,D]', '[Tq,Tk]', '[Tk,Tq]', '[Tq,D]'],
        answer: '[Tq,Tk]',
        explanation: '每一行固定一个 query，每一列对应一个 key。',
        remediation: '/ai/transformers/qkv-retrieval#从角色直觉过渡到完整公式'
      },
      {
        id: 'qkv-roles',
        type: 'open',
        prompt: '不用数据库类比，说明 Key 和 Value 在数值计算上为什么是不同角色。',
        rubric: [
          '指出 Key 与 Query 点积形成匹配分数',
          '指出 Value 不参与该点积，而在 softmax 后被权重加权求和',
          '说明只改 Value 时权重不变但输出改变'
        ],
        reference: 'Key 出现在 QK 转置中并决定读取比例；Value 只在最后的权重乘 V 中提供被汇总内容。'
      }
    ]"
  />
</ClientOnly>

<details>
<summary>静态答案与检查点</summary>

1. 错误；只改 V 不改变 QK 分数。
2. `[Tq,Tk]`。
3. 回答应同时指出 Key 参与匹配、Value 参与加权输出，并给出只改 V 的反事实。

</details>

## 小结与下一步

QKV 把一次注意力读取拆成了“提出需求、接受匹配、提供内容”三种可学习角色。`QKᵀ` 只决定读取比例，真正的新表示来自权重对 V 的加权和。

下一步学习[完整注意力流水线](/ai/transformers/attention-pipeline)，用同一组 Q、K、V 解释缩放、因果遮罩、Softmax 和 Value 汇总。
