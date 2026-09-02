---
title: 交互式知识组件
article: false
description: 博客内置的数学公式、图表、算法动画、状态图、波形和三维可视化能力。
---

# 交互式知识组件

这些组件服务于知识解释，而不是页面装饰。所有重量级引擎均采用异步加载；演示滚动到视口附近时会自动下载，无需手动点击，也不会在首屏一次装载全部引擎。

| 能力 | 开源实现 | 适合内容 |
| --- | --- | --- |
| 数学公式 | MathJax / VitePress | 推导、损失函数、复杂度 |
| 文本图表 | Mermaid | 流程图、时序图、架构图 |
| 数据图表 | Apache ECharts | 训练曲线、指标、实验对比 |
| 自定义 SVG | D3 | 树、图、知识结构和数据绑定 |
| 代码编辑 | CodeMirror 6 | 可编辑代码、语法高亮 |
| Canvas | Konva + Vue Konva | 算法步骤、高频二维动画 |
| 小动画 | Motion for Vue | 状态变化、步骤和手势反馈 |
| 状态图 | Vue Flow | Agent、分布式系统和工作流 |
| 数字波形 | WaveDrom | UART、SPI、I²C 和数字逻辑 |
| 三维场景 | Three.js + TresJS | 机器人、坐标系和空间算法 |

## 数学公式

Markdown 可以直接书写行内公式 $O(n \log n)$ 和块级公式：

$$
\operatorname{Attention}(Q,K,V)
= \operatorname{softmax}\left(\frac{QK^\top}{\sqrt{d_k}}\right)V
$$

## Mermaid 图

<LazyDemo title="Mermaid 流程图">
  <ClientOnly>
    <MermaidDiagram />
  </ClientOnly>
</LazyDemo>

## ECharts 数据图

<LazyDemo title="ECharts 训练曲线">
  <ClientOnly>
    <InteractiveChart />
  </ClientOnly>
</LazyDemo>

## D3 知识树

<LazyDemo title="D3 知识树">
  <ClientOnly>
    <D3Tree />
  </ClientOnly>
</LazyDemo>

## CodeMirror 编辑器

<LazyDemo title="CodeMirror 编辑器">
  <ClientOnly>
    <CodeEditor
      language="python"
      :model-value="`def attention(q, k, v):\n    scores = q @ k.T\n    return softmax(scores) @ v`"
      label="算法代码示例"
    />
  </ClientOnly>
</LazyDemo>

需要执行 Python 时，继续使用集成 CodeMirror 和 Pyodide 的完整组件：

<LazyDemo title="浏览器 Python" description="编辑器滚动到附近时加载；Pyodide 仅在点击运行后下载。">
  <ClientOnly>
    <PythonPlayground title="可运行的 Python 示例" />
  </ClientOnly>
</LazyDemo>

## Canvas 算法演示

<LazyDemo title="Konva 算法动画">
  <ClientOnly>
    <AlgorithmCanvas />
  </ClientOnly>
</LazyDemo>

## 小型步骤动画

<LazyDemo title="Motion 步骤动画">
  <ClientOnly>
    <MotionSequence />
  </ClientOnly>
</LazyDemo>

## Agent 与系统状态图

<LazyDemo title="Vue Flow 工作流">
  <ClientOnly>
    <FlowDiagram />
  </ClientOnly>
</LazyDemo>

## 嵌入式数字波形

<LazyDemo title="WaveDrom 数字波形">
  <ClientOnly>
    <WaveformDiagram />
  </ClientOnly>
</LazyDemo>

## 三维场景

<LazyDemo title="TresJS 三维场景">
  <ClientOnly>
    <ThreeScene />
  </ClientOnly>
</LazyDemo>

## 使用原则

- 公式和静态关系优先使用 MathJax 或 Mermaid。
- 训练数据和实验指标优先使用 ECharts。
- 需要自定义节点、数据绑定或精细 SVG 交互时使用 D3。
- 高频二维绘制使用 Konva；不要用 Canvas 替代可以访问的普通文本。
- Agent、协议与分布式状态使用 Vue Flow，硬件时序使用 WaveDrom。
- 只有空间关系确实重要时才使用 Three.js，避免无意义的三维装饰。
- 每个交互组件都应提供正文解释，不能让动画成为唯一的信息载体。
