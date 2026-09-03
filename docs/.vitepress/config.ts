import { defineConfig } from "vitepress";
import { templateCompilerOptions } from "@tresjs/core";
import { fileURLToPath, URL } from "node:url";
import { teekConfig } from "./teek-config";

const siteUrl = "https://docs.dewyx.cn";
const description = "围绕智能算法、系统工程与嵌入式持续整理的个人知识库。";
const avatarUrl = "https://avatars.githubusercontent.com/u/93588007?s=512&v=4";

export default defineConfig({
  extends: teekConfig,
  title: "Dewyx Docs",
  titleTemplate: ":title · Dewyx Docs",
  description,
  lang: "zh-CN",
  cleanUrls: true,
  lastUpdated: true,
  vue: {
    ...templateCompilerOptions,
  },
  head: [
    ["link", { rel: "icon", type: "image/jpeg", href: avatarUrl }],
    ["link", { rel: "apple-touch-icon", href: avatarUrl }],
    ["meta", { name: "author", content: "Dewyx" }],
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:locale", content: "zh-CN" }],
    ["meta", { property: "og:site_name", content: "Dewyx Docs" }],
    ["meta", { property: "og:image", content: avatarUrl }],
    ["meta", { property: "og:url", content: siteUrl }],
    ["meta", { property: "og:description", content: description }],
  ],
  markdown: {
    math: true,
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
  vite: {
    server: {
      watch: {
        // 允许开发服务运行时执行生产构建，避免 dist 变化触发数千次 HMR。
        ignored: ["**/.vitepress/dist/**"],
      },
    },
    optimizeDeps: {
      // 重型演示库仅在文章实际使用时转换，避免开发服务器启动时一次性预构建。
      exclude: [
        "@codemirror/lang-javascript",
        "@codemirror/lang-python",
        "@codemirror/theme-one-dark",
        "@tresjs/core",
        "@vue-flow/core",
        "codemirror",
        "d3",
        "echarts",
        "konva",
        "mermaid",
        "motion-v",
        "three",
        "vue-echarts",
        "vue-konva",
        "wavedrom",
      ],
    },
    resolve: {
      alias: {
        "@wavedrom/render-any": fileURLToPath(
          new URL("../../node_modules/wavedrom/lib/render-any.js", import.meta.url),
        ),
      },
    },
  },
  themeConfig: {
    logo: avatarUrl,
    nav: [
      { text: "智能算法", link: "/ai/" },
      { text: "系统工程", link: "/systems/" },
      { text: "嵌入式", link: "/embedded/" },
      {
        text: "索引",
        items: [
          { text: "文章清单", link: "/article-overview" },
          { text: "归档", link: "/archives" },
          { text: "分类", link: "/categories" },
          { text: "标签", link: "/tags" },
        ],
      },
      {
        text: "更多",
        items: [
          { text: "使用指南", link: "/guide/start" },
          { text: "交互组件", link: "/guide/interactive-components" },
          { text: "关于", link: "/about" },
        ],
      },
    ],
    sidebar: {
      "/guide/": [
        {
          text: "知识库",
          items: [
            { text: "使用这个知识库", link: "/guide/start" },
            { text: "交互组件", link: "/guide/interactive-components" },
          ],
        },
      ],
      "/ai/": [
        {
          text: "智能算法",
          items: [
            { text: "专栏总览", link: "/ai/" },
            { text: "知识地图", link: "/ai/roadmap" },
          ],
        },
      ],
      "/systems/": [
        {
          text: "系统工程",
          items: [
            { text: "专栏总览", link: "/systems/" },
            { text: "知识地图", link: "/systems/roadmap" },
          ],
        },
        {
          text: "工程方法",
          items: [
            { text: "在浏览器运行 Python", link: "/systems/browser-python" },
            { text: "可复现的代码示例", link: "/systems/reproducible-examples" },
          ],
        },
      ],
      "/embedded/": [
        {
          text: "嵌入式",
          items: [
            { text: "专栏总览", link: "/embedded/" },
            { text: "知识地图", link: "/embedded/roadmap" },
          ],
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
      pattern: "https://github.com/ClearDewy/docs/edit/master/docs/:path",
    },
  },
});
