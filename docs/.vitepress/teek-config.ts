import { defineTeekConfig } from "vitepress-theme-teek/config";

export const teekConfig = defineTeekConfig({
  // 目录和侧边栏使用 VitePress 原生路由与手写配置。
  // Teek 的 permalink 插件会在路由钩子中发起嵌套跳转，导致部分浏览器的 SPA 导航挂起。
  vitePlugins: {
    permalink: false,
    sidebar: false,
  },
  // 首页使用 VitePress 原生 Hero + Features，Teek 继续负责文章页与功能页。
  teekHome: false,
  vpHome: true,
  loading: false,
  // Teek 的窗口过渡会在 SPA 路由切换后批量启动页面动画。
  // 部分 WebView/内置浏览器会因此卡死；保留普通 CSS 动效即可。
  windowTransition: false,
  sidebarTrigger: true,
  author: {
    name: "Dewyx",
    link: "https://github.com/ClearDewy",
  },
  articleAnalyze: {
    showAuthor: true,
    showCreateDate: true,
    showUpdateDate: true,
    showCategory: true,
    showTag: true,
    dateFormat: "yyyy-MM-dd",
  },
  articleBanner: {
    enabled: true,
    showCategory: true,
    showTag: true,
    defaultCoverBgColor: "#0f766e",
  },
  codeBlock: {
    enabled: true,
    collapseHeight: 700,
    overlay: false,
  },
  docAnalysis: {
    enabled: true,
    createTime: "2026-09-02",
    wordCount: true,
    readingTime: true,
  },
  social: [
    {
      icon: "mdi:github",
      name: "GitHub",
      link: "https://github.com/ClearDewy",
    },
  ],
  footerInfo: {
    theme: { show: true },
    copyright: {
      show: true,
      createYear: 2026,
      suffix: "Dewyx",
    },
  },
  themeEnhance: {
    enabled: true,
    position: "top",
  },
});
