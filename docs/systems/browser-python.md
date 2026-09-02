---
title: 在浏览器运行 Python
date: 2026-09-02
categories:
  - 系统工程
tags:
  - Python
  - Pyodide
  - WebAssembly
top: true
description: 使用 Pyodide 在纯静态 GitHub Pages 中运行 Python 代码。
---

# 在浏览器运行 Python

GitHub Pages 没有服务端运行环境，但可以通过 WebAssembly 把 Python 解释器加载到浏览器。下面的代码完全在当前页面执行，不会提交到服务器。

<PythonPlayground />

## 适用范围

这种方式适合算法演示、标准库练习和轻量数据处理。首次运行需要下载解释器，因此不会像本地 Python 一样立即启动。

不适合以下场景：

- 依赖操作系统进程、驱动或本地服务；
- 需要私有网络、数据库凭据或云端密钥；
- 超大数据集、长时间计算或完整后端应用。

## 在文章中使用

`PythonPlayground` 已注册为全局组件，可以在任意 Markdown 中提供默认代码：

```html
<PythonPlayground
  title="质数实验"
  :code="`numbers = [n for n in range(2, 30) if all(n % d for d in range(2, int(n ** 0.5) + 1))]\nprint(numbers)`"
/>
```

可复现、需要长期维护的示例仍然应该作为 `.py` 文件进入仓库，并在持续集成中执行。
