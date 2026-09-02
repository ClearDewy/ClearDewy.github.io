<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { TresCanvas } from "@tresjs/core";

const props = withDefaults(
  defineProps<{
    title?: string;
  }>(),
  {
    title: "TresJS / Three.js：三维结构",
  },
);

const rotation = ref<[number, number, number]>([0.35, 0.45, 0]);
let frame = 0;
let previous = 0;

function animate(time: number) {
  const delta = Math.min((time - previous) / 1000, 0.05);
  previous = time;
  rotation.value = [rotation.value[0] + delta * 0.28, rotation.value[1] + delta * 0.46, 0];
  frame = requestAnimationFrame(animate);
}

onMounted(() => {
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    frame = requestAnimationFrame(animate);
  }
});

onBeforeUnmount(() => cancelAnimationFrame(frame));
</script>

<template>
  <figure class="interactive-card three-scene">
    <figcaption>{{ title }}</figcaption>
    <div class="three-scene__canvas">
      <TresCanvas clear-color="#0f172a">
        <TresPerspectiveCamera :position="[0, 0, 5]" />
        <TresAmbientLight :intensity="1.5" />
        <TresDirectionalLight :position="[3, 4, 5]" :intensity="2.5" />
        <TresMesh :rotation="rotation">
          <TresBoxGeometry :args="[1.8, 1.8, 1.8]" />
          <TresMeshStandardMaterial color="#14b8a6" />
        </TresMesh>
      </TresCanvas>
    </div>
  </figure>
</template>

<style scoped>
.three-scene__canvas {
  height: 340px;
  overflow: hidden;
  background: #0f172a;
}
</style>
