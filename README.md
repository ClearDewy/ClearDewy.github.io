# ClearDewy Knowledge Blog

新的学习知识博客使用 VitePress 1.6 与 VitePress Theme Teek 构建。

旧的 VuePress 项目完整保存在 `graduate` 分支；`master` 不再包含、构建或发布旧内容。

## 本地开发

```bash
npm ci
npm run docs:dev
```

构建与预览：

```bash
npm run check:python
npm run docs:build
npm run docs:preview
```

文章放在 `docs/` 下。需要进入首页文章流的 Markdown 文件应包含 `date`、`categories` 和 `tags` frontmatter。

## Python 示例

- `examples/python/` 中的脚本会在 GitHub Actions 构建前执行。
- 文章可使用全局组件 `<PythonPlayground />` 在浏览器内运行不含敏感信息的 Python 代码。
- 浏览器运行时由 Pyodide 提供，首次运行需要下载运行环境。
