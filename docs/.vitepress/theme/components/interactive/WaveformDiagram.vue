<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import stringify from "onml/stringify.js";

type WaveSource = {
  signal?: Array<Record<string, unknown>>;
  head?: Record<string, unknown>;
  foot?: Record<string, unknown>;
  config?: Record<string, unknown>;
};

const props = withDefaults(
  defineProps<{
    source?: WaveSource;
    title?: string;
  }>(),
  {
    title: "WaveDrom：SPI 时序示意",
    source: () => ({
      signal: [
        { name: "SCLK", wave: "p......." },
        { name: "CS", wave: "10......1" },
        { name: "MOSI", wave: "x3.4.5.x", data: "CMD ADDR DATA" },
        { name: "MISO", wave: "x......4", data: "RESP" },
      ],
      config: { hscale: 1.4 },
    }),
  },
);

const host = ref<HTMLElement>();
const error = ref("");

async function renderWaveform() {
  if (!host.value) return;
  error.value = "";
  try {
    const [renderModule, skinModule] = await Promise.all([
      import("@wavedrom/render-any"),
      import("wavedrom/skins/default.js"),
    ]);
    const renderAny = renderModule.default;
    const skin = skinModule.default ?? skinModule;
    host.value.innerHTML = stringify(renderAny(0, props.source, skin));
  } catch (reason) {
    error.value = reason instanceof Error ? reason.message : String(reason);
  }
}

onMounted(renderWaveform);
watch(() => props.source, renderWaveform, { deep: true });
</script>

<template>
  <figure class="interactive-card waveform-diagram">
    <figcaption>{{ title }}</figcaption>
    <div ref="host" class="waveform-diagram__canvas" />
    <p v-if="error" class="interactive-error">{{ error }}</p>
  </figure>
</template>

<style scoped>
.waveform-diagram__canvas {
  overflow: auto;
  padding: 18px;
  background: white;
}

.waveform-diagram__canvas :deep(svg) {
  display: block;
  min-width: 620px;
  max-width: 100%;
  height: auto;
  margin: 0 auto;
}
</style>
