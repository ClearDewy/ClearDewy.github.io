import { hopeTheme } from "vuepress-theme-hope";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";

export default hopeTheme({
  mobileBreakPoint: 0,
  hostname: "https://ClearDewy.github.io",

  author: {
    name: "ClearDewy",
    url: "https://github.com/ClearDewy",
  },

  iconAssets: "//at.alicdn.com/t/c/font_3722520_bkg7wvtn8k6.css",
  iconPrefix:"iconfont ",
  logo: "/logo.svg",

  repo: "ClearDewy/ClearDewy.github.io",

  // docsRepo:"ClearDewy/ClearDewy.github.io",
  docsBranch:"master",
  docsDir: "src",


  themeColor: {
    blue: "#2196f3",
    red: "#f26d6d",
    green: "#3eaf7c",
    orange: "#fb9b5f",
  },

  pageInfo: ["Author", "Original", "Date", "Category", "Tag", "ReadingTime"],

  // navbar
  navbar: Navbar,

  // sidebar
  sidebar: Sidebar,

  footer: "版权 @2022 清漙",

  displayFooter: true,
  metaLocales: {
    editLink: "Edit this page on GitHub",
  },

  encrypt: {
    config: {
      "/demo/encrypt.html": ["1234"],
    },
  },

  editLink:true,
  // editLinkPattern:"master",

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
      // Codeforces:["https://codeforces.com/profile/Qingtuan","data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAOw4AADsOAFxK8o4AAAC90lEQVRYw+2XvWsVQRTFf5OMGhS00EI0SJRgYhEI2BgUC7GxtVe0EwI2fjQWItaCoAjiPyBaWFiIoCDBQEpREdMoQlAMgaAk0ZDdORa7szv7mfceAQtdWGZndvaee8899+4u/D/+9cN0s3nw/nt/2Q/0AcrtGMfX+ZihvcydP7jxDgTgp4CzwEBpywrwAHiFxNyFsY7s2i4Z2wPcBA5nK1J+VwwJnQa+d2qwr2NoCaQDSCPpNXIOSeE5hhhGHVvtnAElkdqC06ps6gc2dUNp5ymogrXf33gH2gGl3jyw0ewV78gOkvISkgGtAj8B2dFb7YA9Ru+Bh4FLwBGQTYw5g7QEeoLc3ejDxeV9L1sAe4w+dUDXEOcSq0qNCeQQGkf6guFhAbQE2Cv9iQNyEyXQ3AncFsRoCKr1xCeBMUwNDvuV3cBRYHu62wC/BTMGPltctK0Imjji2RCyRga5hijrtJCvjQD3gOMk+vJbJHgruGylWDn1zoPmc4Qw9XluEGbQ388AJwq+JYMRjAOTFkVZ9CpFn42GWqVX05HP06ud4TxzwmRr+60UF6IPwZWtmVawKhvCJUwY6oHT0WBxUZD7EDRkYT3AMhtKwNJHMUXQ8HGL4nrqg6owoYVa6qvaUBBxHXDmgAINVEpRLs9fW+erSY8CKapltCiu1r8CRnzpNjSi2iYkFbc3jQasvAZKQlQ2J62CLhpR8mSheJqEWCzDoCMWW3NDI2p0RoWyqwP2KbJycZGBsAxTDdRWQU30ITtFARZBSxqITBG01BPqNFCX/0ofMJh0sQ7Yd0SL4nlJg+Xo857ASgC2BsQtuY+A1RzArLVVAPCjT4oeoWgZxeBipAi5iKQ84zmIpyD2bs8i3mQp8R+n+Tkj6aOUaeCp4JtXVDYakGFJhscWuTtIn4QmkBsIWFgEPQdNZ68XaQG4CkxKOkT+geqAd8BtYNGnRvBCyT/ESSWvY6+NX8A08KyrPyOAXddfA2wGtpYcWAbWFm4c69bk3z3+AMt6cbUhQPI6AAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIyLTEwLTI0VDA1OjA4OjIwKzAwOjAwC3u87gAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMi0xMC0yNFQwNTowODoyMCswMDowMHomBFIAAAAodEVYdGRhdGU6dGltZXN0YW1wADIwMjItMTAtMjRUMDU6MDg6MjArMDA6MDAtMyWNAAAARnRFWHRzb2Z0d2FyZQBJbWFnZU1hZ2ljayA2LjcuOC05IDIwMTQtMDUtMTIgUTE2IGh0dHA6Ly93d3cuaW1hZ2VtYWdpY2sub3Jn3IbtAAAAABh0RVh0VGh1bWI6OkRvY3VtZW50OjpQYWdlcwAxp/+7LwAAABh0RVh0VGh1bWI6OkltYWdlOjpoZWlnaHQAMTkyDwByhQAAABd0RVh0VGh1bWI6OkltYWdlOjpXaWR0aAAxOTLTrCEIAAAAGXRFWHRUaHVtYjo6TWltZXR5cGUAaW1hZ2UvcG5nP7JWTgAAABd0RVh0VGh1bWI6Ok1UaW1lADE1Nzc0Mzg1OTOjZUwAAAAAD3RFWHRUaHVtYjo6U2l6ZQAwQkKUoj7sAAAAVnRFWHRUaHVtYjo6VVJJAGZpbGU6Ly8vbW50bG9nL2Zhdmljb25zLzIwMTktMTItMjcvMTQyYjQxNTY0NDI1OGJkYzZlM2IwYTg0YzFmNDhlMDAuaWNvLnBuZ3Su8sUAAAAASUVORK5CYII="],
    },
    intro:"/",
    timeline:"零露漙兮~",
  },


  plugins: {

    blog: {
      // 生成简介
      autoExcerpt: true,
      filter:({filePathRelative})=>{
        if (!filePathRelative) return false;
        return filePathRelative.startsWith("ProblemSolve-docs/");
      },

    },

    comment:{
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
  }
});
