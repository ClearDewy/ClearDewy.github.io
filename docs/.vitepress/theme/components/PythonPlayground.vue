<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import CodeEditor from "./interactive/CodeEditor.vue";
import { ensurePythonPackages } from "../python-runtime";

const props = withDefaults(
  defineProps<{
    code?: string;
    title?: string;
    packages?: string[];
  }>(),
  {
    code: `from statistics import mean\n\nvalues = [2, 3, 5, 7, 11]\nprint("count:", len(values))\nprint("mean:", mean(values))`,
    title: "Python Playground",
    packages: () => [],
  },
);

const source = ref(props.code);
const output = ref("");
const collapsed = ref(false);
const state = ref<"idle" | "loading" | "ready" | "running" | "done" | "error">("idle");
let preparationPromise: Promise<any> | undefined;

const buttonText = computed(() => {
  if (state.value === "loading") return "加载中";
  if (state.value === "running") return "运行中";
  return "运行";
});

async function prepareRuntime() {
  if (!preparationPromise) {
    state.value = "loading";
    preparationPromise = ensurePythonPackages(props.packages).then((runtime) => {
      state.value = "ready";
      return runtime;
    });
  }
  return preparationPromise;
}

async function run() {
  const lines: string[] = [];
  try {
    const pyodide = await prepareRuntime();
    state.value = "running";
    pyodide.setStdout({ batched: (message: string) => lines.push(message) });
    pyodide.setStderr({ batched: (message: string) => lines.push(message) });
    const result = await pyodide.runPythonAsync(source.value);
    if (result !== undefined && result !== null && String(result) !== "None") {
      lines.push(String(result));
    }
    if (result && typeof result.destroy === "function") result.destroy();
    output.value = lines.join("\n");
    state.value = "done";
  } catch (error) {
    output.value = error instanceof Error ? error.message : String(error);
    state.value = "error";
  }
}

onMounted(() => {
  void prepareRuntime().catch((error) => {
    output.value = `Python 环境加载失败：${error instanceof Error ? error.message : String(error)}`;
    state.value = "error";
  });
});
</script>

<template>
  <section class="python-playground">
    <header class="python-playground__header">
      <div class="python-playground__title">
        <span class="python-playground__language">PY</span>
        <strong>{{ title }}</strong>
      </div>
      <div class="python-playground__actions">
        <button
          class="python-playground__action python-playground__run"
          type="button"
          :disabled="state === 'loading' || state === 'running'"
          :aria-busy="state === 'loading' || state === 'running'"
          :aria-label="buttonText"
          :title="buttonText"
          @click="run"
        >
          <svg aria-hidden="true" viewBox="0 0 20 20">
            <path d="M6.5 4.75 15 10l-8.5 5.25z" />
          </svg>
        </button>
        <button
          class="python-playground__action python-playground__toggle"
          type="button"
          :aria-expanded="!collapsed"
          :aria-label="collapsed ? '展开代码' : '收起代码'"
          :title="collapsed ? '展开代码' : '收起代码'"
          @click="collapsed = !collapsed"
        >
          <svg :class="{ 'is-collapsed': collapsed }" aria-hidden="true" viewBox="0 0 20 20">
            <path d="m5 7.5 5 5 5-5" />
          </svg>
        </button>
      </div>
    </header>
    <div v-show="!collapsed" class="python-playground__body">
      <CodeEditor v-model="source" language="python" label="Python 源代码" />
      <pre v-if="output" :class="{ 'is-error': state === 'error' }" aria-live="polite">{{ output }}</pre>
    </div>
  </section>
</template>
