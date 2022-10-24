import { defineUserConfig } from "vuepress";
// import {searchPlugin} from "@vuepress/plugin-search"

import theme from "./theme.js";

export default defineUserConfig({
  base: "/",
  lang: "zh-CN",
  title: "Dewy-Wiki",
  description: "ClearDewy's own Wiki",

  theme,

  // plugins:[
  //   searchPlugin({
  //     locales: {
  //       '/': {
  //         placeholder: 'Search',
  //       },
  //     },
  //   }),
  // ],

  shouldPrefetch: false,
});
