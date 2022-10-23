import { hopeTheme } from "vuepress-theme-hope";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";

export default hopeTheme({
  blogLocales: undefined,
  navbarLocales: undefined,
  hostname: "https://vuepress-theme-hope-docs-demo.netlify.app",

  author: {
    name: "Qingtuan",
    url: "https://github.com/Qingqingtuan",
  },

  iconAssets: "//at.alicdn.com/t/c/font_3722520_hfdaawkzbqp.css",
  iconPrefix:"iconfont ",
  logo: "/logo.svg",

  repo: "Qingqingtuan/Qingqingtuan.github.io",

  // docsRepo:"Qingqingtuan/Qingqingtuan.github.io",
  docsBranch:"master",
  docsDir: "src",


  themeColor: {
    blue: "#2196f3",
    red: "#f26d6d",
    green: "#3eaf7c",
    orange: "#fb9b5f",
  },

  pageInfo: ["Author", "Original", "Date", "Category", "Tag", "ReadingTime"],

  locales: {
    "/": {
      // navbar
      navbar: Navbar,

      // sidebar
      sidebar: Sidebar,

      footer: "版权 @2022 清漙",

      displayFooter: true,

    },

  },

  encrypt: {
    config: {
      "/demo/encrypt.html": ["1234"],
    },
  },

  editLink:true,
  // editLinkPattern:"master",

  plugins: {
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
  }
});
