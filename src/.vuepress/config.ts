import hopeTheme from "./theme.js";
import {searchPlugin} from "@vuepress/plugin-search";

export default {
  base: "/",
  lang: "zh-CN",
  title: "Dewy-Wiki",
  description: "ClearDewy's own Wiki",
  theme:hopeTheme,
  port:80,
  plugins: [
    searchPlugin({
      locales: {
        '/': {
          placeholder: 'Search~',
        },
      },
    }),
  ],


  shouldPrefetch: false,
}
