<script setup lang="ts">
import { computed, ref } from "vue";
import { motion, useReducedMotion } from "motion-v";

const props = withDefaults(
  defineProps<{
    title?: string;
    steps?: string[];
  }>(),
  {
    title: "Motion：Agent 循环",
    steps: () => ["输入", "规划", "调用工具", "观察", "输出"],
  },
);

const current = ref(0);
const reducedMotion = useReducedMotion();
const progress = computed(() =>
  props.steps.length <= 1 ? 0 : (current.value / (props.steps.length - 1)) * 100,
);

function next() {
  current.value = (current.value + 1) % props.steps.length;
}
</script>

<template>
  <figure class="interactive-card motion-sequence">
    <figcaption>{{ title }}</figcaption>
    <div class="motion-sequence__track">
      <div class="motion-sequence__line" />
      <motion.div
        class="motion-sequence__token"
        :animate="{ left: `${progress}%`, scale: reducedMotion ? 1 : [1, 1.14, 1] }"
        :transition="{ type: 'spring', stiffness: 280, damping: 24 }"
      />
      <div
        v-for="(step, index) in steps"
        :key="step"
        class="motion-sequence__step"
        :class="{ active: index === current }"
        :style="{ left: `${(index / Math.max(steps.length - 1, 1)) * 100}%` }"
      >
        <span>{{ index + 1 }}</span>
        <small>{{ step }}</small>
      </div>
    </div>
    <div class="interactive-controls">
      <button type="button" @click="next">下一步</button>
      <span>当前：{{ steps[current] }}</span>
    </div>
  </figure>
</template>

<style scoped>
.motion-sequence__track {
  position: relative;
  height: 124px;
  margin: 20px 42px 0;
}

.motion-sequence__line {
  position: absolute;
  top: 35px;
  right: 0;
  left: 0;
  height: 2px;
  background: var(--vp-c-divider);
}

.motion-sequence__token {
  position: absolute;
  z-index: 2;
  top: 26px;
  width: 20px;
  height: 20px;
  margin-left: -10px;
  border: 4px solid var(--vp-c-bg);
  border-radius: 50%;
  background: #f59e0b;
}

.motion-sequence__step {
  position: absolute;
  top: 22px;
  display: grid;
  width: 72px;
  margin-left: -36px;
  justify-items: center;
  gap: 10px;
  color: var(--vp-c-text-2);
}

.motion-sequence__step span {
  display: grid;
  width: 28px;
  height: 28px;
  place-items: center;
  border: 2px solid var(--vp-c-divider);
  border-radius: 50%;
  background: var(--vp-c-bg);
  font-size: 12px;
}

.motion-sequence__step.active {
  color: var(--vp-c-brand-1);
  font-weight: 700;
}

.motion-sequence__step.active span {
  border-color: var(--vp-c-brand-1);
}

@media (max-width: 640px) {
  .motion-sequence__track {
    margin-right: 30px;
    margin-left: 30px;
  }

  .motion-sequence__step small {
    max-width: 56px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
