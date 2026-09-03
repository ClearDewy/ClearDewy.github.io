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
const output = ref("点击“运行”后，输出会显示在这里。");
const state = ref<"idle" | "loading" | "ready" | "running" | "done" | "error">("idle");
let preparationPromise: Promise<any> | undefined;

const buttonText = computed(() => {
  if (state.value === "loading") return "正在加载 Python 与依赖…";
  if (state.value === "running") return "正在运行…";
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
    output.value = lines.join("\n") || "运行完成，没有输出。";
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
      <div>
        <strong>{{ title }}</strong>
        <span>在你的浏览器中运行</span>
      </div>
      <button type="button" :disabled="state === 'loading' || state === 'running'" @click="run">
        {{ buttonText }}
      </button>
    </header>
    <CodeEditor v-model="source" language="python" label="Python 源代码" />
    <pre :class="{ 'is-error': state === 'error' }" aria-live="polite">{{ output }}</pre>
    <p>Pyodide 和默认机器学习依赖会异步下载到浏览器；不要在代码中填写密码或令牌。</p>
  </section>
</template>
