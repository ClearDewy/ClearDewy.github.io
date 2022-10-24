import { defineUserConfig } from "vuepress";
import theme from "./theme.js";

export default defineUserConfig({
  base: "/",
  lang: "zh-CN",
  title: "Dewy-Wiki",
  description: "ClearDewy's own Wiki",

  theme,

  shouldPrefetch: false,
});
