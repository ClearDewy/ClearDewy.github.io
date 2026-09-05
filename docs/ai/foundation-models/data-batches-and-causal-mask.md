---
title: 训练文本怎样变成批次与因果遮罩
date: 2026-09-05
updated: 2026-09-05
type: lesson
status: learnable
track: ai
chapter: foundation-models
prerequisites:
  - /ai/foundation-models/tokenization-and-samples
outcomes:
  - 能把连续 token 流切成固定长度样本并写出 input、label、attention mask 与 loss mask
  - 能逐格解释因果遮罩为什么是下三角矩阵
  - 能区分 padding、文档边界和未来位置三类限制
estimated: 40min
categories: [智能算法]
tags: [Batch, Causal Mask, Data Pipeline]
description: 从原始文档出发构造语言模型训练批次，并用可操作矩阵理解因果遮罩、padding 与 loss mask 的职责。
---

# 训练文本怎样变成批次与因果遮罩

上一课得到了一条 token 序列，但训练程序不能把“整个互联网”一次塞进模型。它需要把连续 token 流切成长度一致的小矩阵，同时保证每个位置不偷看未来、补齐位置不参与训练。

本页只解决数据进入模型前的最后一步，不讨论模型怎样计算 logits。

## 一条真实的数据路径

原始文本到 batch 通常经历：

```text
文档收集
→ 清洗、去重与质量过滤
→ tokenizer 编码
→ 在文档之间插入 <EOS>
→ 拼成 token 流
→ 切成固定长度窗口
→ 右移生成 input / label
→ 组成 [B,T] 批次
→ 构造 attention mask 与 loss mask
```

这里要区分两层问题：

- 数据治理决定哪些文本可以进入语料，属于下一章“数据、训练与对齐”；
- 本页只研究已确定 token 流怎样变成模型输入。

## 贯穿示例：从两个短文档开始

假设 tokenizer 已经产生：

```text
文档 A：<BOS> 我 喜欢 猫 <EOS>
文档 B：<BOS> 猫 喜欢 鱼 <EOS>
```

`<EOS>` 很重要。没有它，模型会把“文档 A 的结尾 → 文档 B 的开头”当作普通连续文本；插入边界后，模型至少能学习何时结束一段内容。

把它们拼成 token 流，再以 `T=4` 切窗：

| 窗口 | input | label |
| --- | --- | --- |
| 0 | `<BOS> 我 喜欢 猫` | `我 喜欢 猫 <EOS>` |
| 1 | `<EOS> <BOS> 猫 喜欢` | `<BOS> 猫 喜欢 鱼` |

切窗策略可以重叠，也可以不重叠；只要 input 的每个位置与 token 流中的下一个 token 对齐，next-token 目标就成立。

## Batch 只是把多条等长样本叠起来

两条长度为 4 的 input 叠成：

$$
X=\begin{bmatrix}
x_{0,0}&x_{0,1}&x_{0,2}&x_{0,3}\\
x_{1,0}&x_{1,1}&x_{1,2}&x_{1,3}
\end{bmatrix}\in\mathbb{N}^{B\times T},\quad B=2,T=4
$$

- `B` 是一次并行处理的样本数；
- `T` 是每条样本的 token 数；
- 格子里仍是 token ID，不是 embedding；
- batch 不会让两条样本互相做注意力，它们只是共享一次硬件计算。

## 因果遮罩约束“时间方向”

观察下面组件。先只看第 0 行，再逐步移动到第 3 行。注意三个对应关系：行是 Query 位置，列是 Key 位置，格子表示这一行能否读取这一列。

<ClientOnly>
  <CausalMaskDemo />
</ClientOnly>

### 为什么是下三角

位置 $i$ 只能读取 $j\le i$：

$$
M_{i,j}=\begin{cases}
0,&j\le i\\
-\infty,&j>i
\end{cases}
$$

遮罩加在注意力分数上：

$$
P=\operatorname{softmax}\left(\frac{QK^\top}{\sqrt{d_k}}+M\right)
$$

被加上 $-\infty$ 的格子经过 Softmax 后概率为 0，因此未来 token 不会参与加权读取。实现中常用当前数据类型可表达的极小负数代替数学上的负无穷。

### 遮罩不等于删除未来 token

训练时整条序列仍然同时进入模型。并行成立是因为：

1. 所有位置的 Q、K、V 可以一起计算；
2. 每一行通过遮罩只保留合法的历史列；
3. 所有位置的 loss 也可以一起计算。

所以“训练并行”和“不能看未来”并不矛盾。

## 三种 mask 不要混为一谈

| 名称 | 限制什么 | 常见形状 | 典型错误 |
| --- | --- | --- | --- |
| causal mask | 禁止读取未来位置 | `[T,T]` 或可广播形式 | 方向反了，模型能偷看答案 |
| padding attention mask | 禁止读取 `<PAD>` | `[B,T]` 扩展后广播 | 把补齐位置当成真实上下文 |
| loss mask | 决定哪些标签计入损失 | `[B,T]` | 对 `<PAD>` 或提示部分错误计分 |

Attention mask 控制“读取谁”，loss mask 控制“考核谁”。一个位置可以被允许读取，却不一定计入 loss。例如指令微调时，Prompt 可能作为上下文可见，但只对回答 token 计算损失。

## 不等长样本为什么需要 padding

假设同一 batch 有长度 4 和长度 2 的样本：

```text
A: <BOS> 我 喜欢 猫
B: <BOS> 猫 <PAD> <PAD>
```

为了组成规则矩阵，短样本补到 `T=4`。但是：

- 注意力不能把 `<PAD>` 当作有意义的 Key；
- `<PAD>` 对应的标签通常不计入 loss；
- padding 在左边还是右边取决于模型和推理实现，不能混用约定。

更高效的训练实现也会按相近长度分桶、拼接多段文本或使用变长注意力，目的都是减少无效 padding；它们不改变本页的逻辑约束。

## 最小构造算法

```python
tokens = [BOS, WO, XI_HUAN, MAO, EOS]
context = 4

input_ids = tokens[:context]
labels = tokens[1:context + 1]

assert len(input_ids) == len(labels) == context
assert labels[0] == input_ids[1]
```

批量实现通常不会逐样本写循环，但无论怎样向量化，都必须保持这个不变量：`labels[b,t]` 是 `input_ids[b,t]` 后面的真实 token。

## 反事实检查

在动画里把“喜欢”改成“真的喜欢”。遮罩的下三角结构会改变吗？

不会。token 内容改变了，但长度仍为 4，所以合法位置关系不变。若插入一个新 token 使 `T` 变成 5，遮罩才会扩成 `5×5`。这说明遮罩由位置关系决定，不由词义决定。

## 常见错误与排查

- **input 与 label 没右移**：模型只学会复制当前 token；先打印一条样本逐格比对。
- **遮罩方向反了**：训练 loss 异常低，生成却失败；画出第 0 行，确认它只能看到自己。
- **跨文档没有 EOS**：模型把无关文档边界学成连续关系；检查拼接前后的边界 token。
- **PAD 参与 loss**：短样本越多，模型越偏向输出 PAD；统计有效 loss token 数。
- **把 batch 轴当序列轴**：不同样本互相注意；检查 QK 转置发生在哪些轴。

## 本节自测

<KnowledgeQuiz
  storage-key="foundation-data-mask-v1"
  :questions="[
    { id:'mask-1', type:'boolean', prompt:'训练时并行计算所有位置，意味着位置 0 可以读取位置 3。', answer:false, explanation:'并行计算不等于相互可见；因果遮罩令未来列的注意力概率为 0。' },
    { id:'mask-2', type:'fill', prompt:'长度 T=4 的标准因果遮罩矩阵 shape 是什么？', answer:['4×4','4x4','[4,4]'], explanation:'每个 Query 位置都要对每个 Key 位置定义可见性。' },
    { id:'mask-3', type:'single', prompt:'哪一种 mask 决定 PAD 标签是否计入交叉熵？', options:['causal mask','padding attention mask','loss mask'], answer:'loss mask', explanation:'loss mask 控制考核位置；attention mask 控制可读取位置。' },
    { id:'mask-4', type:'open', prompt:'解释为什么训练可以并行、生成却仍然需要逐 token。', rubric:['指出训练时真实序列全部已知','指出 causal mask 阻止未来信息泄漏','指出生成时下一个 token 尚不存在，必须先选出再接回输入'], reference:'训练拥有完整真值序列，因此能并行计算所有受遮罩的位置；生成没有未来 token，只能用当前最后位置分布选出一个 token 后继续。' }
  ]"
/>

打印版答案：1. 错；2. `4×4`；3. loss mask；4. 应同时说明“完整真值已知、遮罩限制可见性、生成未来未知”。

## 小结与下一步

本页把 token 流变成了 `[B,T]` 输入、右移标签和合法可见性。下一步进入[完整 Decoder 语言模型怎样组装](/ai/foundation-models/language-model-architecture)，观察这些输入怎样穿过 Embedding、多个 Block 和词表头。
