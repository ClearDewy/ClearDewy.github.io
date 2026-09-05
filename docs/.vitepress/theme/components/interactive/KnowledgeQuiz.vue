<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from "vue";

type QuestionType = "boolean" | "single" | "fill" | "open";
type Question = {
  id: string;
  type: QuestionType;
  prompt: string;
  options?: string[];
  answer?: boolean | string | string[];
  explanation?: string;
  rubric?: string[];
  reference?: string;
  remediation?: string;
};

const props = withDefaults(defineProps<{
  questions: Question[];
  storageKey?: string;
  title?: string;
}>(), {
  storageKey: "",
  title: "本节自测",
});

const answers = reactive<Record<string, string>>({});
const checked = reactive<Record<string, boolean>>({});
const revealed = reactive<Record<string, boolean>>({});
const skipped = reactive<Record<string, boolean>>({});
const validation = reactive<Record<string, string>>({});
const ready = ref(false);
const confirmClear = ref(false);

const typeLabel: Record<QuestionType, string> = {
  boolean: "判断题",
  single: "单选题",
  fill: "填空题",
  open: "开放题",
};

function normalize(value: unknown) {
  return String(value ?? "").normalize("NFKC").trim().toLocaleLowerCase().replace(/\s+/g, " ");
}

function isCorrect(question: Question) {
  if (question.type === "open" || skipped[question.id]) return false;
  const expected = Array.isArray(question.answer) ? question.answer : [question.answer];
  return expected.some((item) => normalize(item) === normalize(answers[question.id]));
}

const completed = computed(() => props.questions.filter((item) => checked[item.id]).length);
const objectiveCompleted = computed(() => props.questions.filter((item) => item.type !== "open" && checked[item.id] && !skipped[item.id]).length);
const correct = computed(() => props.questions.filter((item) => item.type !== "open" && checked[item.id] && isCorrect(item)).length);

function submit(question: Question) {
  if (!normalize(answers[question.id])) {
    validation[question.id] = question.type === "open" ? "请先写下自己的回答，或选择“暂时不会”。" : "请先作答。";
    return;
  }
  validation[question.id] = "";
  skipped[question.id] = false;
  checked[question.id] = true;
  revealed[question.id] = true;
}

function skip(question: Question) {
  validation[question.id] = "";
  skipped[question.id] = true;
  checked[question.id] = true;
  revealed[question.id] = true;
}

function reset(question: Question) {
  delete answers[question.id];
  delete checked[question.id];
  delete revealed[question.id];
  delete skipped[question.id];
  delete validation[question.id];
}

function answerText(question: Question) {
  if (question.type === "boolean") return question.answer ? "正确" : "错误";
  if (Array.isArray(question.answer)) return question.answer.join(" / ");
  return question.answer ?? "请根据评分要点自评";
}

function clearAll() {
  if (!confirmClear.value) {
    confirmClear.value = true;
    window.setTimeout(() => { confirmClear.value = false; }, 3000);
    return;
  }
  for (const question of props.questions) reset(question);
  confirmClear.value = false;
}

function persist() {
  if (!ready.value || !props.storageKey) return;
  try {
    localStorage.setItem(`knowledge-quiz:${props.storageKey}`, JSON.stringify({
      answers: { ...answers }, checked: { ...checked }, revealed: { ...revealed }, skipped: { ...skipped },
    }));
  } catch {
    // Storage may be disabled. The quiz remains usable for the current page session.
  }
}

onMounted(() => {
  if (props.storageKey) {
    try {
      const stored = JSON.parse(localStorage.getItem(`knowledge-quiz:${props.storageKey}`) ?? "null");
      if (stored) {
        Object.assign(answers, stored.answers);
        Object.assign(checked, stored.checked);
        Object.assign(revealed, stored.revealed);
        Object.assign(skipped, stored.skipped);
      }
    } catch {
      try { localStorage.removeItem(`knowledge-quiz:${props.storageKey}`); } catch { /* storage unavailable */ }
    }
  }
  ready.value = true;
});

watch([answers, checked, revealed, skipped], persist, { deep: true });
</script>

<template>
  <section class="knowledge-quiz" :aria-label="title">
    <header class="knowledge-quiz__header">
      <div>
        <strong>{{ title }}</strong>
        <p>先作答，再查看解释。记录只保存在当前浏览器。</p>
      </div>
      <div class="knowledge-quiz__summary" aria-live="polite">
        <span>完成 {{ completed }} / {{ questions.length }}</span>
        <span v-if="objectiveCompleted">客观题 {{ correct }} / {{ objectiveCompleted }}</span>
      </div>
    </header>

    <ol class="knowledge-quiz__list">
      <li v-for="(question, index) in questions" :key="question.id" class="knowledge-quiz__item">
        <fieldset>
          <legend>
            <span>{{ index + 1 }}</span>
            <small>{{ typeLabel[question.type] }}</small>
            {{ question.prompt }}
          </legend>

          <div v-if="question.type === 'boolean'" class="knowledge-quiz__choices">
            <label v-for="option in ['true', 'false']" :key="option">
              <input v-model="answers[question.id]" type="radio" :name="question.id" :value="option" :disabled="checked[question.id]">
              <span>{{ option === 'true' ? '正确' : '错误' }}</span>
            </label>
          </div>

          <div v-else-if="question.type === 'single'" class="knowledge-quiz__choices">
            <label v-for="option in question.options" :key="option">
              <input v-model="answers[question.id]" type="radio" :name="question.id" :value="option" :disabled="checked[question.id]">
              <span>{{ option }}</span>
            </label>
          </div>

          <label v-else-if="question.type === 'fill'" class="knowledge-quiz__text-answer">
            <span>你的答案</span>
            <input v-model="answers[question.id]" type="text" :disabled="checked[question.id]" autocomplete="off" @keyup.enter="submit(question)">
          </label>

          <label v-else class="knowledge-quiz__text-answer">
            <span>先写下自己的回答</span>
            <textarea v-model="answers[question.id]" rows="5" :disabled="checked[question.id]"></textarea>
          </label>

          <p v-if="validation[question.id]" class="knowledge-quiz__validation" role="alert">{{ validation[question.id] }}</p>

          <div class="knowledge-quiz__actions">
            <template v-if="!checked[question.id]">
              <button type="button" @click="submit(question)">{{ question.type === 'open' ? '提交并对照' : '提交本题' }}</button>
              <button type="button" class="secondary" @click="skip(question)">暂时不会</button>
            </template>
            <button v-else type="button" class="secondary" @click="reset(question)">重做本题</button>
          </div>

          <div v-if="revealed[question.id]" class="knowledge-quiz__feedback" aria-live="polite">
            <strong v-if="question.type === 'open'">对照评分要点，自行检查</strong>
            <strong v-else-if="skipped[question.id]">已选择暂时不会</strong>
            <strong v-else :class="isCorrect(question) ? 'is-correct' : 'is-wrong'">
              {{ isCorrect(question) ? '回答正确' : '回答错误' }}
            </strong>

            <p v-if="question.type !== 'open'"><b>参考答案：</b>{{ answerText(question) }}</p>
            <p v-if="question.explanation">{{ question.explanation }}</p>
            <ul v-if="question.rubric?.length">
              <li v-for="item in question.rubric" :key="item">{{ item }}</li>
            </ul>
            <p v-if="question.reference"><b>参考回答：</b>{{ question.reference }}</p>
            <a v-if="question.remediation" :href="question.remediation">回到相关课程补学 →</a>
          </div>
        </fieldset>
      </li>
    </ol>

    <footer class="knowledge-quiz__footer">
      <span>这里的分数只用于本章自测，不代表真实任务能力。</span>
      <button type="button" class="secondary danger" @click="clearAll">{{ confirmClear ? '再次点击确认清空' : '清空本页记录' }}</button>
    </footer>
  </section>
</template>

<style scoped>
.knowledge-quiz { margin: 24px 0; overflow: hidden; border: 1px solid var(--vp-c-divider); border-radius: 14px; background: var(--vp-c-bg); }
.knowledge-quiz__header { display: flex; align-items: center; justify-content: space-between; gap: 20px; padding: 18px 20px; border-bottom: 1px solid var(--vp-c-divider); background: var(--vp-c-bg-soft); }
.knowledge-quiz__header strong { font-size: 18px; }
.knowledge-quiz__header p { margin: 4px 0 0; color: var(--vp-c-text-2); font-size: 13px; }
.knowledge-quiz__summary { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 8px; }
.knowledge-quiz__summary span { padding: 5px 9px; border-radius: 999px; color: var(--vp-c-brand-1); background: color-mix(in srgb, var(--vp-c-brand-1), transparent 90%); font-size: 12px; font-weight: 700; }
.knowledge-quiz__list { margin: 0; padding: 0; list-style: none; }
.knowledge-quiz__item { margin: 0; padding: 20px; border-bottom: 1px solid var(--vp-c-divider); }
.knowledge-quiz__item fieldset { min-width: 0; margin: 0; padding: 0; border: 0; }
.knowledge-quiz__item legend { width: 100%; padding: 0; color: var(--vp-c-text-1); font-weight: 650; }
.knowledge-quiz__item legend > span { display: inline-grid; width: 26px; height: 26px; margin-right: 8px; place-items: center; border-radius: 50%; color: white; background: var(--vp-c-brand-1); }
.knowledge-quiz__item legend small { margin-right: 8px; color: var(--vp-c-text-2); font-weight: 500; }
.knowledge-quiz__choices { display: grid; gap: 8px; margin-top: 14px; }
.knowledge-quiz__choices label { display: flex; align-items: center; gap: 9px; padding: 10px 12px; border: 1px solid var(--vp-c-divider); border-radius: 9px; cursor: pointer; }
.knowledge-quiz__choices label:has(input:checked) { border-color: var(--vp-c-brand-1); background: color-mix(in srgb, var(--vp-c-brand-1), transparent 92%); }
.knowledge-quiz__text-answer { display: grid; gap: 7px; margin-top: 14px; color: var(--vp-c-text-2); font-size: 13px; }
.knowledge-quiz__text-answer input, .knowledge-quiz__text-answer textarea { width: 100%; box-sizing: border-box; padding: 10px 12px; border: 1px solid var(--vp-c-divider); border-radius: 9px; color: var(--vp-c-text-1); background: var(--vp-c-bg); font: inherit; resize: vertical; }
.knowledge-quiz__text-answer input:focus, .knowledge-quiz__text-answer textarea:focus { border-color: var(--vp-c-brand-1); outline: 2px solid color-mix(in srgb, var(--vp-c-brand-1), transparent 75%); outline-offset: 1px; }
.knowledge-quiz__validation { margin: 8px 0 0; color: var(--vp-c-danger-1); font-size: 13px; }
.knowledge-quiz__actions { display: flex; gap: 8px; margin-top: 13px; }
.knowledge-quiz button { padding: 7px 12px; border: 1px solid var(--vp-c-brand-1); border-radius: 8px; color: white; background: var(--vp-c-brand-1); cursor: pointer; font-weight: 650; }
.knowledge-quiz button.secondary { border-color: var(--vp-c-divider); color: var(--vp-c-text-1); background: var(--vp-c-bg); }
.knowledge-quiz__feedback { margin-top: 14px; padding: 14px 16px; border-left: 4px solid var(--vp-c-brand-1); border-radius: 8px; background: var(--vp-c-bg-soft); }
.knowledge-quiz__feedback .is-correct { color: var(--vp-c-success-1); }
.knowledge-quiz__feedback .is-wrong { color: var(--vp-c-danger-1); }
.knowledge-quiz__feedback p { margin: 7px 0; }
.knowledge-quiz__feedback ul { margin: 7px 0; }
.knowledge-quiz__feedback a { font-weight: 650; }
.knowledge-quiz__footer { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 14px 20px; color: var(--vp-c-text-2); font-size: 12px; }
.knowledge-quiz__footer button.danger { color: var(--vp-c-danger-1); }
@media (max-width: 640px) {
  .knowledge-quiz__header, .knowledge-quiz__footer { align-items: stretch; flex-direction: column; }
  .knowledge-quiz__summary { justify-content: flex-start; }
}
</style>
