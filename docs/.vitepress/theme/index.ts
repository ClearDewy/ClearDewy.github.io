import Teek from "vitepress-theme-teek";
import "vitepress-theme-teek/index.css";
import { defineAsyncComponent } from "vue";
import "./styles/custom.css";

const components = {
  PythonPlayground: () => import("./components/PythonPlayground.vue"),
  MermaidDiagram: () => import("./components/interactive/MermaidDiagram.vue"),
  InteractiveChart: () => import("./components/interactive/InteractiveChart.vue"),
  D3Tree: () => import("./components/interactive/D3Tree.vue"),
  CodeEditor: () => import("./components/interactive/CodeEditor.vue"),
  AlgorithmCanvas: () => import("./components/interactive/AlgorithmCanvas.vue"),
  MotionSequence: () => import("./components/interactive/MotionSequence.vue"),
  ThreeScene: () => import("./components/interactive/ThreeScene.vue"),
  FlowDiagram: () => import("./components/interactive/FlowDiagram.vue"),
  WaveformDiagram: () => import("./components/interactive/WaveformDiagram.vue"),
  LazyDemo: () => import("./components/interactive/LazyDemo.vue"),
};

export default {
  extends: Teek,
  enhanceApp({ app }) {
    Object.entries(components).forEach(([name, loader]) => {
      app.component(name, defineAsyncComponent(loader));
    });
  },
};
