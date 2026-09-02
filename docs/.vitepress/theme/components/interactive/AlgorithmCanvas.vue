<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { Stage, Layer, Rect, Text } from "vue-konva";

const props = withDefaults(
  defineProps<{
    title?: string;
    initialValues?: number[];
  }>(),
  {
    title: "Konva：冒泡排序单步演示",
    initialValues: () => [5, 2, 8, 1, 6, 3],
  },
);

const host = ref<HTMLElement>();
const width = ref(640);
const height = 290;
const values = ref([...props.initialValues]);
const cursor = ref(0);
const comparisons = ref(0);
const message = ref("点击“单步”比较相邻元素。");
let resizeObserver: ResizeObserver | undefined;

const maxValue = computed(() => Math.max(...values.value, 1));
const barWidth = computed(() => Math.max(34, (width.value - 56) / values.value.length - 10));
const startX = computed(() => Math.max(22, (width.value - values.value.length * (barWidth.value + 10)) / 2));

const bars = computed(() =>
  values.value.map((value, index) => {
    const barHeight = (value / maxValue.value) * 170;
    return {
      value,
      x: startX.value + index * (barWidth.value + 10),
      y: 218 - barHeight,
      width: barWidth.value,
      height: barHeight,
      active: index === cursor.value || index === cursor.value + 1,
    };
  }),
);

function step() {
  if (values.value.length < 2) return;
  if (cursor.value >= values.value.length - 1) {
    cursor.value = 0;
    message.value = "完成一轮扫描，从头继续比较。";
    return;
  }

  const left = values.value[cursor.value];
  const right = values.value[cursor.value + 1];
  comparisons.value += 1;
  if (left > right) {
    [values.value[cursor.value], values.value[cursor.value + 1]] = [right, left];
    message.value = `${left} > ${right}，交换位置。`;
  } else {
    message.value = `${left} ≤ ${right}，保持不变。`;
  }
  cursor.value += 1;
}

function reset() {
  values.value = [...props.initialValues];
  cursor.value = 0;
  comparisons.value = 0;
  message.value = "已重置，点击“单步”开始。";
}

onMounted(() => {
  resizeObserver = new ResizeObserver(([entry]) => {
    width.value = Math.max(320, Math.floor(entry.contentRect.width));
  });
  if (host.value) resizeObserver.observe(host.value);
});

onBeforeUnmount(() => resizeObserver?.disconnect());
</script>

<template>
  <figure ref="host" class="interactive-card algorithm-canvas">
    <figcaption>{{ title }}</figcaption>
    <Stage :config="{ width, height }">
      <Layer>
        <template v-for="(bar, index) in bars" :key="`${index}-${bar.value}`">
          <Rect
            :config="{
              x: bar.x,
              y: bar.y,
              width: bar.width,
              height: bar.height,
              fill: bar.active ? '#f59e0b' : '#0f766e',
              cornerRadius: [7, 7, 0, 0],
            }"
          />
          <Text
            :config="{
              x: bar.x,
              y: 228,
              width: bar.width,
              text: String(bar.value),
              align: 'center',
              fill: '#94a3b8',
              fontSize: 15,
            }"
          />
        </template>
      </Layer>
    </Stage>
    <div class="interactive-controls">
      <button type="button" @click="step">单步</button>
      <button type="button" class="secondary" @click="reset">重置</button>
      <span>比较次数：{{ comparisons }}</span>
    </div>
    <p class="interactive-note">{{ message }}</p>
  </figure>
</template>

<style scoped>
.algorithm-canvas {
  overflow: hidden;
}

.algorithm-canvas :deep(canvas) {
  display: block;
}
</style>
