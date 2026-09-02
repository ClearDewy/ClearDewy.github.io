<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";

const props = withDefaults(
  defineProps<{
    code?: string;
    title?: string;
  }>(),
  {
    title: "Mermaid 图",
    code: `flowchart LR
  A[输入] --> B[模型]
  B --> C[输出]
  C --> D[评测]
  D -.反馈.-> B`,
  },
);

const container = ref<HTMLElement>();
const error = ref("");
let observer: MutationObserver | undefined;
let renderVersion = 0;

async function renderDiagram() {
  if (!container.value) return;
  const currentVersion = ++renderVersion;
  error.value = "";

  try {
    const { default: mermaid } = await import("mermaid");
    const dark = document.documentElement.classList.contains("dark");
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: "strict",
      theme: dark ? "dark" : "default",
      fontFamily: "var(--vp-font-family-base)",
    });
    const id = `mermaid-${Math.random().toString(36).slice(2)}`;
    const { svg, bindFunctions } = await mermaid.render(id, props.code);
    if (currentVersion !== renderVersion || !container.value) return;
    container.value.innerHTML = svg;
    bindFunctions?.(container.value);
  } catch (reason) {
    error.value = reason instanceof Error ? reason.message : String(reason);
  }
}

onMounted(() => {
  renderDiagram();
  observer = new MutationObserver(renderDiagram);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
});

watch(() => props.code, renderDiagram);
onBeforeUnmount(() => observer?.disconnect());
</script>

<template>
  <figure class="interactive-card mermaid-diagram">
    <figcaption>{{ title }}</figcaption>
    <div ref="container" class="mermaid-diagram__canvas" />
    <p v-if="error" class="interactive-error">{{ error }}</p>
  </figure>
</template>

<style scoped>
.mermaid-diagram__canvas {
  display: grid;
  min-height: 180px;
  place-items: center;
  overflow: auto;
  padding: 18px;
}

.mermaid-diagram__canvas :deep(svg) {
  max-width: 100%;
  height: auto;
}
</style>
