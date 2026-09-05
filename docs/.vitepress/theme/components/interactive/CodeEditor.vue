<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useData } from "vitepress";
import { basicSetup, EditorView } from "codemirror";
import { Compartment, EditorState } from "@codemirror/state";
import { python } from "@codemirror/lang-python";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    language?: "python" | "javascript";
    label?: string;
  }>(),
  {
    modelValue: "",
    language: "python",
    label: "代码编辑器",
  },
);

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

const { isDark } = useData();
const host = ref<HTMLElement>();
const theme = new Compartment();
let view: EditorView | undefined;

onMounted(() => {
  const language = props.language === "javascript" ? javascript() : python();
  const state = EditorState.create({
    doc: props.modelValue,
    extensions: [
      basicSetup,
      language,
      theme.of(isDark.value ? oneDark : []),
      EditorView.lineWrapping,
      EditorView.updateListener.of((update) => {
        if (update.docChanged) emit("update:modelValue", update.state.doc.toString());
      }),
    ],
  });
  view = new EditorView({ state, parent: host.value });
});

watch(
  () => props.modelValue,
  (value) => {
    if (!view || value === view.state.doc.toString()) return;
    view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: value } });
  },
);

watch(isDark, (value) => {
  view?.dispatch({ effects: theme.reconfigure(value ? oneDark : []) });
});

onBeforeUnmount(() => view?.destroy());
</script>

<template>
  <div ref="host" class="code-editor" role="region" :aria-label="label" />
</template>

<style scoped>
.code-editor {
  background: var(--vp-c-bg);
}

.code-editor :deep(.cm-editor) {
  font-size: 14px;
}

.code-editor :deep(.cm-scroller) {
  font-family: var(--vp-font-family-mono);
  line-height: 1.65;
}
</style>
