import { hopeTheme } from "vuepress-theme-hope";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";

export default hopeTheme({
  hostname: "https://ClearDewy.github.io",

  author: {
    name: "ClearDewy",
    url: "https://github.com/ClearDewy",
  },

  iconAssets: "//at.alicdn.com/t/c/font_3722520_p8avvst67qj.css",
  iconPrefix:"iconfont ",
  logo: "/logo.svg",

  repo: "ClearDewy/ClearDewy.github.io",

  // docsRepo:"ClearDewy/ClearDewy.github.io",
  docsBranch:"master",
  docsDir: "src",

  pageInfo: ["Author", "Original", "Date", "Category", "Tag", "ReadingTime"],

  themeColor: {
    blue: "#2196f3",
    red: "#f26d6d",
    green: "#3eaf7c",
    orange: "#fb9b5f",
  },

  blog: {
    name:"ClearDewy",
    avatar:"/logo.svg",
    // 圆形图片
    // roundAvatar: true
    description: "An ACMer",
    medias: {
      QQ: "http://wpa.qq.com/msgrd?v=3&uin=2233408834&site=qq&menu=yes",
      Github: "https://github.com/ClearDewy",
      Gitee: "https://gitee.com/ClearDewy",
      // Codeforces:["https://codeforces.com/profile/Qingtuan",]
    },
    intro:"/",
    timeline:"零露漙兮~",
  },

  navbar: Navbar,
  sidebar: Sidebar,
  footer: "版权 @2022 清漙",
  displayFooter: true,
  metaLocales: {
    editLink: "Edit this page on GitHub",
  },

  encrypt: {
    config: {
      "/Dewy-docs/": ["021107"],
    },
  },


  plugins: {
    blog: {
      // 生成简介
      autoExcerpt: true,
      filter:({filePathRelative})=>{
        if (!filePathRelative) return false;
        return filePathRelative.startsWith("ProblemSolve-docs/")||filePathRelative.startsWith("Blogs-docs/");
      },
    },

    // If you don't need comment feature, you can remove following option
    // The following config is for demo ONLY, if you need comment feature, please generate and use your own config, see comment plugin documentation for details.
    // To avoid disturbing the theme developer and consuming his resources, please DO NOT use the following config directly in your production environment!!!!!
    comment: {
      /**
       * Using Giscus
       */
      provider: "Giscus",
      repo: "vuepress-theme-hope/giscus-discussions",
      repoId: "R_kgDOG_Pt2A",
      category: "Announcements",
      categoryId: "DIC_kwDOG_Pt2M4COD69",
    },

    // Disable features you don't want here
    mdEnhance: {
      align: true,
      attrs: true,
      chart: true,
      codetabs: true,
      container: true,
      demo: true,
      echarts: true,
      flowchart: true,
      gfm: true,
      imageSize: true,
      include: true,
      katex: true,
      lazyLoad: true,
      mark: true,
      mermaid: true,
      playground: {
        presets: ["ts", "vue"],
      },
      presentation: {
        plugins: ["highlight", "math", "search", "notes", "zoom"],
      },
      stylize: [
        {
          matcher: "Recommanded",
          replacer: ({ tag }) => {
            if (tag === "em")
              return {
                tag: "Badge",
                attrs: { type: "tip" },
                content: "Recommanded",
              };
          },
        },
      ],
      sub: true,
      sup: true,
      tabs: true,
      vpre: true,
      vuePlayground: true,
    },

    pwa: {
      favicon: "/favicon.ico",
      cacheHTML: true,
      cachePic: true,
      appendBase: true,
    },
  },
});
