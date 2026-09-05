---
title: 数据、训练与对齐速查
date: 2026-09-05
updated: 2026-09-05
type: reference
status: verified
track: ai
chapter: data-training-alignment
categories: [智能算法]
tags: [Training, Alignment, Reference]
description: 查询数据 manifest、训练阶段、SFT mask、LoRA、偏好样本与运行证据字段。
---

# 数据、训练与对齐速查

## 数据 manifest

`dataset_id/version/source/license/collected_at/event_time/cleaning_version/tokenizer/split/dedup_cluster/sample_id`。

## 阶段对照

| 阶段 | 输入 | loss | 基线 |
| --- | --- | --- | --- |
| 预训练 | 连续 token | 有效位置 next-token | 未训练/父 checkpoint |
| SFT | Prompt + 目标回答 | 常只计 Assistant token | 预训练模型 |
| LoRA | 与 SFT 等相同 | 由任务定义 | 冻结基座 + adapter |
| DPO | Prompt、chosen、rejected | 相对策略/参考 log-prob | SFT 策略与参考模型 |

## LoRA

$$\Delta W=AB,\quad A\in\mathbb R^{d_{in}\times r},B\in\mathbb R^{r\times d_{out}}$$

可训练参数 `r(d_in+d_out)`；记录基座身份、target modules、rank、alpha、dropout、是否合并。

## 必要运行身份

代码提交、模型配置、tokenizer/template、数据 manifest、split、seed、精度/设备、optimizer、学习率、有效 batch、训练 token、父 checkpoint、评测版本。

## 关键不变量

- 先去重簇再切分；
- loss token 可回到原始目标；
- SFT 训练/推理模板一致；
- checkpoint 恢复包含优化器、进度和随机/数据状态；
- 偏好对共享 Prompt 且标签依据 rubric；
- 任意改善都报告回归与未证明部分。

## 故障速查

| 现象 | 检查 |
| --- | --- |
| 验证异常高 | 泄漏、近重复、模板线索 |
| SFT loss 为 0/NaN | 全零 mask、截断、无有效 token |
| 模型不会停止 | EOS 是否进入目标、推理模板 |
| LoRA 无梯度 | target modules、requires_grad、adapter 挂载 |
| DPO 只变长 | 长度偏好、rubric、分层评测 |
| 恢复后曲线跳变 | optimizer、scheduler、数据位置、seed |

关联：[数据谱系](/ai/data-training-alignment/data-lineage-and-splits)、[SFT](/ai/data-training-alignment/sft-and-chat-template)、[LoRA](/ai/data-training-alignment/lora-adaptation)、[DPO](/ai/data-training-alignment/preference-alignment)、[实验](/ai/data-training-alignment/training-evidence-lab)。
