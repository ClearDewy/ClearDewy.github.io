---
title: 让两层 MLP 过拟合四个样本
date: 2026-09-04
updated: 2026-09-04
type: lab
status: learnable
track: ai
prerequisites: [MLP 表示, 反向传播, Python 与 PyTorch 基础]
outcomes: [验证非线性作用, 检查梯度与 loss, 区分可优化性和泛化]
estimated: 40 分钟
description: 使用固定 XOR 数据让小网络过拟合，并通过消融定位非线性的作用。
---

# 让两层 MLP 过拟合四个样本

## 目标与命题

验证：带非线性的两层 MLP 能表示 XOR；去掉非线性后，即使写成两层也仍是线性模型。单 batch 过拟合是实现检查，不是泛化证据。

## 环境与固定输入

- Python 3.10+、PyTorch 2.x；CPU 即可；预计低于 1 分钟；
- `torch.manual_seed(7)`；四个 XOR 样本；隐藏维 4；全批次训练。

```python
import torch
torch.manual_seed(7)
X = torch.tensor([[0.,0.],[0.,1.],[1.,0.],[1.,1.]])
y = torch.tensor([[0.],[1.],[1.],[0.]])
model = torch.nn.Sequential(
    torch.nn.Linear(2, 4), torch.nn.Tanh(), torch.nn.Linear(4, 1)
)
opt = torch.optim.Adam(model.parameters(), lr=0.05)
loss_fn = torch.nn.BCEWithLogitsLoss()

for step in range(1000):
    opt.zero_grad()
    logits = model(X)
    loss = loss_fn(logits, y)
    loss.backward()
    assert all(p.grad is not None for p in model.parameters())
    opt.step()

pred = (model(X).sigmoid() > 0.5).float()
assert torch.equal(pred, y)
print(float(loss), pred.squeeze().tolist())
```

## 消融与判断条件

1. 原版最终预测应与 `y` 完全相同。
2. 删除 `Tanh`，保持两个 Linear。运行多个固定种子，记录是否无法稳定达到四个全对。
3. 每 100 步记录 loss；若长期不降，检查梯度是否存在、学习率和目标 shape。

## 实际结果怎样解释

原版通过只支持“该实现能优化并表示这四点”。删除非线性失败支持“线性复合不足以表示 XOR”。它不支持网络能泛化到现实分类任务，也不比较不同优化器的普遍优劣。

## 常见失败与清理

- 输出使用 logits 时应搭配 `BCEWithLogitsLoss`，不要先 sigmoid 再重复使用该损失。
- `y` 的 shape 应与 logits 一致，避免无意广播。
- 过大学习率可能振荡；先记录曲线再调整。
- 无文件输出，无需清理；复现时记录 PyTorch 版本、种子和本地代码变化。

完成后做[第 2 章复习](/ai/deep-learning/review)。
