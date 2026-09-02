import { defineConfig } from "vitepress";
import { teekConfig } from "./teek-config";

const siteUrl = "https://ClearDewy.github.io";
const description = "记录计算机、工程实践与持续学习的个人知识库。";

export default defineConfig({
  extends: teekConfig,
  title: "ClearDewy",
  titleTemplate: ":title · ClearDewy",
  description,
  lang: "zh-CN",
  cleanUrls: true,
  lastUpdated: true,
  head: [
    ["link", { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }],
    ["meta", { name: "author", content: "ClearDewy" }],
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:locale", content: "zh-CN" }],
    ["meta", { property: "og:site_name", content: "ClearDewy" }],
    ["meta", { property: "og:url", content: siteUrl }],
    ["meta", { property: "og:description", content: description }],
  ],
  markdown: {
    lineNumbers: true,
    image: { lazyLoading: true },
    container: {
      tipLabel: "提示",
      warningLabel: "注意",
      dangerLabel: "危险",
      infoLabel: "信息",
      detailsLabel: "详细信息",
    },
  },
  sitemap: { hostname: siteUrl },
  themeConfig: {
    logo: "/favicon.svg",
    nav: [
      { text: "首页", link: "/" },
      { text: "开始", link: "/guide/start" },
      { text: "Python", link: "/python/browser-runtime" },
      { text: "工程实践", link: "/engineering/reproducible-examples" },
      {
        text: "索引",
        items: [
          { text: "文章清单", link: "/article-overview" },
          { text: "归档", link: "/archives" },
          { text: "分类", link: "/categories" },
          { text: "标签", link: "/tags" },
        ],
      },
      { text: "关于", link: "/about" },
    ],
    sidebar: {
      "/guide/": [
        { text: "开始", items: [{ text: "使用这个知识库", link: "/guide/start" }] },
      ],
      "/python/": [
        {
          text: "Python",
          items: [{ text: "在浏览器运行 Python", link: "/python/browser-runtime" }],
        },
      ],
      "/engineering/": [
        {
          text: "工程实践",
          items: [{ text: "可复现的代码示例", link: "/engineering/reproducible-examples" }],
        },
      ],
    },
    outline: { level: [2, 4], label: "本页目录" },
    docFooter: { prev: "上一篇", next: "下一篇" },
    darkModeSwitchLabel: "主题",
    sidebarMenuLabel: "目录",
    returnToTopLabel: "返回顶部",
    lastUpdatedText: "最后更新",
    search: { provider: "local" },
    socialLinks: [{ icon: "github", link: "https://github.com/ClearDewy" }],
    editLink: {
      text: "在 GitHub 上编辑此页",
      pattern: "https://github.com/ClearDewy/ClearDewy.github.io/edit/master/docs/:path",
    },
  },
});
