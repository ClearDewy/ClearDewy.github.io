<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { basicSetup, EditorView } from "codemirror";
import { EditorState } from "@codemirror/state";
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

const host = ref<HTMLElement>();
let view: EditorView | undefined;

onMounted(() => {
  const language = props.language === "javascript" ? javascript() : python();
  const state = EditorState.create({
    doc: props.modelValue,
    extensions: [
      basicSetup,
      language,
      oneDark,
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

onBeforeUnmount(() => view?.destroy());
</script>

<template>
  <div ref="host" class="code-editor" role="region" :aria-label="label" />
</template>

<style scoped>
.code-editor {
  min-height: 210px;
  background: #282c34;
}

.code-editor :deep(.cm-editor) {
  min-height: 210px;
  font-size: 14px;
}

.code-editor :deep(.cm-scroller) {
  font-family: var(--vp-font-family-mono);
  line-height: 1.65;
}
</style>
