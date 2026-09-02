<script setup lang="ts">
import { ref } from "vue";
import { MarkerType, VueFlow, type Edge, type Node } from "@vue-flow/core";
import "@vue-flow/core/dist/style.css";
import "@vue-flow/core/dist/theme-default.css";

const props = withDefaults(
  defineProps<{
    title?: string;
  }>(),
  {
    title: "Vue Flow：Harness 工作流",
  },
);

const nodes = ref<Node[]>([
  { id: "input", position: { x: 20, y: 100 }, data: { label: "用户输入" }, type: "input" },
  { id: "agent", position: { x: 190, y: 40 }, data: { label: "Agent" } },
  { id: "tool", position: { x: 370, y: 20 }, data: { label: "工具" } },
  { id: "memory", position: { x: 370, y: 160 }, data: { label: "记忆" } },
  { id: "eval", position: { x: 550, y: 100 }, data: { label: "评测与输出" }, type: "output" },
]);

const edges = ref<Edge[]>([
  { id: "input-agent", source: "input", target: "agent", animated: true },
  { id: "agent-tool", source: "agent", target: "tool", markerEnd: MarkerType.ArrowClosed },
  { id: "tool-agent", source: "tool", target: "agent", label: "观察", markerEnd: MarkerType.ArrowClosed },
  { id: "agent-memory", source: "agent", target: "memory", markerEnd: MarkerType.ArrowClosed },
  { id: "memory-agent", source: "memory", target: "agent", label: "上下文", markerEnd: MarkerType.ArrowClosed },
  { id: "agent-eval", source: "agent", target: "eval", animated: true, markerEnd: MarkerType.ArrowClosed },
]);
</script>

<template>
  <figure class="interactive-card flow-diagram">
    <figcaption>{{ title }}</figcaption>
    <VueFlow
      v-model:nodes="nodes"
      v-model:edges="edges"
      class="flow-diagram__canvas"
      fit-view-on-init
      :min-zoom="0.5"
      :max-zoom="1.8"
      :nodes-draggable="true"
      :nodes-connectable="false"
    />
    <p class="interactive-note">节点可以拖动，画布支持缩放和平移。</p>
  </figure>
</template>

<style scoped>
.flow-diagram__canvas {
  height: 360px;
  background: radial-gradient(circle, var(--vp-c-divider) 1px, transparent 1px);
  background-size: 18px 18px;
}

.flow-diagram :deep(.vue-flow__node) {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}

.flow-diagram :deep(.vue-flow__edge-textbg) {
  fill: var(--vp-c-bg);
}

.flow-diagram :deep(.vue-flow__edge-text) {
  fill: var(--vp-c-text-1);
}
</style>
