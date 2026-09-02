<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import VChart from "vue-echarts";
import { use } from "echarts/core";
import type { EChartsOption } from "echarts";
import { BarChart, GraphChart, LineChart, PieChart, ScatterChart } from "echarts/charts";
import {
  DataZoomComponent,
  DatasetComponent,
  GridComponent,
  LegendComponent,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  TransformComponent,
} from "echarts/components";
import { LabelLayout, UniversalTransition } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";

use([
  BarChart,
  GraphChart,
  LineChart,
  PieChart,
  ScatterChart,
  DataZoomComponent,
  DatasetComponent,
  GridComponent,
  LegendComponent,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  TransformComponent,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
]);

const props = withDefaults(
  defineProps<{
    option?: EChartsOption;
    title?: string;
    height?: number;
  }>(),
  {
    title: "训练过程",
    height: 320,
  },
);

const dark = ref(false);
let observer: MutationObserver | undefined;

const defaultOption = computed<EChartsOption>(() => ({
  backgroundColor: "transparent",
  title: { text: "Loss 与准确率", left: "center" },
  tooltip: { trigger: "axis" },
  legend: { bottom: 0, data: ["loss", "accuracy"] },
  grid: { left: 48, right: 28, top: 58, bottom: 48 },
  xAxis: { type: "category", name: "epoch", data: [1, 2, 3, 4, 5, 6] },
  yAxis: { type: "value" },
  series: [
    { name: "loss", type: "line", smooth: true, data: [1.2, 0.82, 0.55, 0.39, 0.31, 0.27] },
    { name: "accuracy", type: "line", smooth: true, data: [0.48, 0.62, 0.74, 0.82, 0.86, 0.89] },
  ],
}));

const resolvedOption = computed(() => props.option ?? defaultOption.value);

function syncTheme() {
  dark.value = document.documentElement.classList.contains("dark");
}

onMounted(() => {
  syncTheme();
  observer = new MutationObserver(syncTheme);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
});

onBeforeUnmount(() => observer?.disconnect());
</script>

<template>
  <figure class="interactive-card interactive-chart">
    <figcaption>{{ title }}</figcaption>
    <VChart
      class="interactive-chart__canvas"
      :style="{ height: `${height}px` }"
      :option="resolvedOption"
      :theme="dark ? 'dark' : undefined"
      autoresize
    />
  </figure>
</template>

<style scoped>
.interactive-chart__canvas {
  width: 100%;
}
</style>
