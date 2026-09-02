<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";

withDefaults(
  defineProps<{
    title: string;
    description?: string;
  }>(),
  { description: "滚动到附近时自动加载。" },
);

const root = ref<HTMLElement>();
const active = ref(false);
let observer: IntersectionObserver | undefined;

onMounted(() => {
  if (!("IntersectionObserver" in window)) {
    active.value = true;
    return;
  }

  observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return;
      active.value = true;
      observer?.disconnect();
    },
    { rootMargin: "360px 0px" },
  );

  if (root.value) observer.observe(root.value);
});

onBeforeUnmount(() => observer?.disconnect());
</script>

<template>
  <section ref="root" class="lazy-demo" :class="{ 'is-active': active }">
    <div v-if="!active" class="lazy-demo__summary" aria-live="polite" aria-busy="true">
      <div>
        <strong>{{ title }}</strong>
        <span>{{ description }}</span>
      </div>
    </div>
    <div v-else class="lazy-demo__content">
      <slot />
    </div>
  </section>
</template>
