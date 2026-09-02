import Teek from "vitepress-theme-teek";
import "vitepress-theme-teek/index.css";
import PythonPlayground from "./components/PythonPlayground.vue";
import "./styles/custom.css";

export default {
  extends: Teek,
  enhanceApp({ app }) {
    app.component("PythonPlayground", PythonPlayground);
  },
};
