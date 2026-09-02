import { defineTeekConfig } from "vitepress-theme-teek/config";

export const teekConfig = defineTeekConfig({
  teekHome: true,
  vpHome: false,
  loading: false,
  sidebarTrigger: true,
  author: {
    name: "ClearDewy",
    link: "https://github.com/ClearDewy",
  },
  blogger: {
    name: "ClearDewy",
    slogan: "把学到的东西，整理成可以再次使用的知识。",
    avatar: "https://github.com/ClearDewy.png",
    shape: "circle-rotate",
  },
  banner: {
    enabled: true,
    name: "ClearDewy",
    bgStyle: "pure",
    pureBgColor: "#0f172a",
    description: ["持续学习，持续整理，持续验证。", "代码、系统与解决问题的方法。"],
    descStyle: "switch",
    textColor: "#f8fafc",
  },
  post: {
    postStyle: "list",
    showCapture: true,
    coverImgMode: "small",
  },
  homeCardSort: ["topArticle", "category", "tag", "docAnalysis"],
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
      suffix: "ClearDewy",
    },
  },
  themeEnhance: {
    enabled: true,
    position: "top",
  },
});
