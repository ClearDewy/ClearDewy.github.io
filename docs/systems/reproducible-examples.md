---
title: 可复现的代码示例
date: 2026-09-02
categories:
  - 系统工程
tags:
  - CI
  - Python
description: 让博客里的代码不只是看起来正确，而是在每次发布前得到执行验证。
---

# 可复现的代码示例

博客中的代码很容易随依赖和语言版本变化而失效。这个项目把关键示例放在 `examples/`，GitHub Actions 会在构建页面前执行它们。

```python
from dataclasses import dataclass


@dataclass(frozen=True)
class StudySession:
    topic: str
    minutes: int


sessions = [
    StudySession("Python", 45),
    StudySession("Systems", 60),
    StudySession("Writing", 30),
]

total_minutes = sum(item.minutes for item in sessions)
assert total_minutes == 135
print({"sessions": len(sessions), "minutes": total_minutes})
```

当前示例位于 `examples/python/quickstart.py`。如果断言失败，部署会停止，错误不会进入线上文章。

## 维护约定

- 示例应当确定性执行，不依赖随机网络响应。
- 外部依赖必须固定版本。
- 文章展示的结果应和脚本输出一致。
- 较慢的实验应缓存产物，并注明生成环境与日期。
