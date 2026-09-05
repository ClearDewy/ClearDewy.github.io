<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from "vue";

type Stage = { short: string; title: string; note: string; formula: string };
type Candidate = { token: string; logit: number };

const defaults: Candidate[] = [
  { token: "猫", logit: 2.4 },
  { token: "狗", logit: 1.1 },
  { token: "书", logit: 0.2 },
  { token: "<EOS>", logit: -0.4 },
];
const candidates = ref(defaults.map((item) => ({ ...item })));
const current = ref(0);
const playing = ref(false);
let timer: ReturnType<typeof setInterval> | undefined;

const stages: Stage[] = [
  { short: "样本", title: "把一段 token 右移成输入与答案", formula: "input[t] → label[t] = token[t+1]", note: "每个位置只负责预测紧跟在它后面的 token；答案不是人工类别，而是原文本中的下一个 token。" },
  { short: "表示", title: "Token ID 变成带位置的连续表示", formula: "ids → embedding + position → X [T,C]", note: "ID 只是词表索引；Embedding 查表后，每个位置才得到可参与矩阵计算的 C 维向量。" },
  { short: "Block", title: "因果 Decoder 更新每个位置", formula: "X → Decoder Blocks → H [T,C]", note: "位置 t 只能读取自己和更早的位置，因此 H[t] 概括了当前可见上下文。" },
  { short: "词表头", title: "最后一维投影到整个词表", formula: "logits[t] = H[t] W_vocab", note: "每个候选 token 得到一个未归一化分数。Logit 可以为负，也不要求总和为 1。" },
  { short: "概率", title: "Softmax 把 logits 变成条件分布", formula: "p(token | context) = softmax(logits)", note: "直接修改候选格中的 logit，概率和损失会即时重算；增大一个 logit 会挤压其他候选的概率。" },
  { short: "损失", title: "训练只惩罚正确下一个 token 的概率", formula: "loss = -log p(猫 | <BOS> 我 喜欢)", note: "当前教学位置的正确答案是“猫”。概率越接近 1，交叉熵越接近 0。" },
  { short: "生成", title: "生成阶段从分布中选一个 token 接到末尾", formula: "context ← context + sampled_token", note: "新 token 会成为下一轮输入。训练参数更新与生成时选 token 是两件不同的事。" },
];

const probabilities = computed(() => {
  const peak = Math.max(...candidates.value.map((item) => item.logit));
  const exps = candidates.value.map((item) => Math.exp(item.logit - peak));
  const total = exps.reduce((sum, value) => sum + value, 0);
  return exps.map((value) => value / total);
});
const correctIndex = computed(() => candidates.value.findIndex((item) => item.token === "猫"));
const loss = computed(() => -Math.log(Math.max(probabilities.value[correctIndex.value], 1e-12)));
const predicted = computed(() => candidates.value[probabilities.value.indexOf(Math.max(...probabilities.value))].token);
const stage = computed(() => stages[current.value]);

function stop() { playing.value = false; if (timer) clearInterval(timer); timer = undefined; }
function go(index: number) { stop(); current.value = Math.max(0, Math.min(stages.length - 1, index)); }
function play() {
  if (playing.value) return stop();
  if (current.value === stages.length - 1) current.value = 0;
  playing.value = true;
  timer = setInterval(() => current.value === stages.length - 1 ? stop() : current.value += 1, 1800);
}
function updateLogit(index: number, event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.value.trim()) return;
  const value = Number(input.value);
  if (!Number.isFinite(value)) return;
  candidates.value[index].logit = Math.max(-20, Math.min(20, value));
  input.value = String(candidates.value[index].logit);
  stop();
  current.value = Math.max(current.value, 4);
}
function restore() {
  candidates.value = defaults.map((item) => ({ ...item }));
  stop();
  current.value = 0;
}
onBeforeUnmount(stop);
</script>

<template>
  <figure class="interactive-card next-token-demo">
    <figcaption>
      <span>一个训练位置怎样产生 next-token 概率与损失</span>
      <button type="button" @click="restore">恢复数值</button>
    </figcaption>

    <ol class="next-token-demo__timeline" aria-label="Next-token 前向步骤">
      <li v-for="(item, index) in stages" :key="item.short">
        <button type="button" :class="{ active: index === current, complete: index < current }" :aria-current="index === current ? 'step' : undefined" @click="go(index)">{{ item.short }}</button>
      </li>
    </ol>

    <section class="next-token-demo__flow" aria-live="polite">
      <div class="next-token-demo__tokens">
        <span class="label">可见上下文</span>
        <strong>&lt;BOS&gt;</strong><strong>我</strong><strong>喜欢</strong>
        <span class="arrow">→</span><strong class="target">猫</strong>
      </div>
      <div class="next-token-demo__path">
        <span :class="{ active: current === 1 }">Embedding<br><small>[T,C]</small></span>
        <i>→</i>
        <span :class="{ active: current === 2 }">Decoder Blocks<br><small>[T,C]</small></span>
        <i>→</i>
        <span :class="{ active: current === 3 }">词表输出头<br><small>[C,V]</small></span>
      </div>
      <div class="next-token-demo__candidates" :class="{ active: current >= 3 }">
        <article v-for="(item, index) in candidates" :key="item.token" :class="{ correct: item.token === '猫', predicted: item.token === predicted }">
          <strong>{{ item.token }}</strong>
          <label>
            <span>logit</span>
            <input type="number" min="-20" max="20" step="0.1" :value="item.logit" :aria-label="`${item.token} 的 logit`" @input="updateLogit(index, $event)">
          </label>
          <div class="next-token-demo__bar"><i :style="{ width: `${probabilities[index] * 100}%` }"></i></div>
          <small>p={{ probabilities[index].toFixed(3) }}</small>
        </article>
      </div>
      <div class="next-token-demo__result">
        <span><b>正确标签</b>猫</span>
        <span><b>贪心预测</b>{{ predicted }}</span>
        <span><b>交叉熵</b>{{ loss.toFixed(3) }}</span>
      </div>
    </section>

    <section class="next-token-demo__explanation">
      <div><strong>{{ stage.title }}</strong><code>{{ stage.formula }}</code></div>
      <p>{{ stage.note }}</p>
    </section>

    <div class="interactive-controls next-token-demo__controls">
      <button type="button" class="secondary" :disabled="current === 0" @click="go(current - 1)">上一步</button>
      <button type="button" @click="play">{{ playing ? "暂停" : "播放" }}</button>
      <button type="button" class="secondary" :disabled="current === stages.length - 1" @click="go(current + 1)">下一步</button>
      <button type="button" class="secondary" @click="go(0)">回到开头</button>
      <span>{{ current + 1 }} / {{ stages.length }}</span>
    </div>
    <p class="interactive-fallback">静态路径：右移 token 得到输入与标签；输入经 Embedding、因果 Decoder 和词表头得到 logits；Softmax 得到下一个 token 的条件概率；训练损失是正确标签概率的负对数。</p>
  </figure>
</template>

<style scoped>
.next-token-demo > figcaption { display:flex; align-items:center; justify-content:space-between; gap:16px; }
.next-token-demo > figcaption button { padding:4px 8px; border:1px solid var(--vp-c-divider); border-radius:6px; color:var(--vp-c-text-2); background:var(--vp-c-bg); cursor:pointer; font-size:11px; }
.next-token-demo__timeline { display:grid; grid-template-columns:repeat(7,minmax(0,1fr)); gap:5px; margin:0; padding:14px; list-style:none; }
.next-token-demo__timeline li { margin:0; }
.next-token-demo__timeline button { width:100%; min-width:0; padding:7px 3px; border:1px solid var(--vp-c-divider); border-radius:7px; color:var(--vp-c-text-2); background:var(--vp-c-bg); cursor:pointer; font-size:11px; font-weight:650; }
.next-token-demo__timeline button.complete { border-color:color-mix(in srgb,var(--vp-c-brand-1),transparent 60%); }
.next-token-demo__timeline button.active { border-color:#3f4148; color:#fff; background:#3f4148; }
.next-token-demo__flow { padding:22px 20px; border-block:1px solid var(--vp-c-divider); background:var(--vp-c-bg-soft); }
.next-token-demo__tokens { display:flex; align-items:center; justify-content:center; flex-wrap:wrap; gap:8px; }
.next-token-demo__tokens .label { width:100%; color:var(--vp-c-text-2); font-size:12px; text-align:center; }
.next-token-demo__tokens strong { padding:7px 10px; border:1px solid var(--vp-c-divider); border-radius:8px; background:var(--vp-c-bg); }
.next-token-demo__tokens .target { border-color:var(--vp-c-success-1); color:var(--vp-c-success-1); }
.next-token-demo__tokens .arrow { color:var(--vp-c-text-3); }
.next-token-demo__path { display:grid; grid-template-columns:1fr auto 1fr auto 1fr; align-items:center; gap:9px; max-width:700px; margin:20px auto; }
.next-token-demo__path span { padding:12px; border:1px solid var(--vp-c-divider); border-radius:10px; background:var(--vp-c-bg); text-align:center; transition:.18s; }
.next-token-demo__path span.active { border-color:var(--vp-c-brand-1); box-shadow:0 0 0 3px color-mix(in srgb,var(--vp-c-brand-1),transparent 86%); }
.next-token-demo__path small { color:var(--vp-c-text-2); }
.next-token-demo__path i { color:var(--vp-c-text-3); font-style:normal; }
.next-token-demo__candidates { display:grid; grid-template-columns:repeat(4,1fr); gap:9px; opacity:.58; transition:.18s; }
.next-token-demo__candidates.active { opacity:1; }
.next-token-demo__candidates article { display:grid; gap:7px; padding:11px; border:1px solid var(--vp-c-divider); border-radius:10px; background:var(--vp-c-bg); }
.next-token-demo__candidates article.correct { border-color:color-mix(in srgb,var(--vp-c-success-1),transparent 45%); }
.next-token-demo__candidates article.predicted strong::after { margin-left:5px; color:var(--vp-c-brand-1); content:"最高"; font-size:9px; }
.next-token-demo__candidates label { display:flex; align-items:center; justify-content:space-between; gap:5px; color:var(--vp-c-text-2); font-size:10px; }
.next-token-demo__candidates input { width:58px; min-width:0; box-sizing:border-box; padding:3px 4px; border:1px solid var(--vp-c-divider); border-radius:5px; color:var(--vp-c-text-1); background:var(--vp-c-bg); font:inherit; text-align:center; }
.next-token-demo__candidates input:focus-visible { outline:2px solid color-mix(in srgb,var(--vp-c-brand-1),transparent 62%); outline-offset:1px; }
.next-token-demo__bar { height:6px; overflow:hidden; border-radius:99px; background:var(--vp-c-default-soft); }
.next-token-demo__bar i { display:block; height:100%; border-radius:inherit; background:var(--vp-c-brand-1); transition:width .2s; }
.next-token-demo__candidates small { color:var(--vp-c-text-2); }
.next-token-demo__result { display:grid; grid-template-columns:repeat(3,1fr); gap:9px; margin-top:12px; }
.next-token-demo__result span { padding:8px 10px; border-radius:8px; background:var(--vp-c-bg); color:var(--vp-c-text-2); font-size:12px; }
.next-token-demo__result b { margin-right:7px; color:var(--vp-c-text-1); }
.next-token-demo__explanation { display:grid; grid-template-columns:minmax(240px,.9fr) 1.1fr; gap:20px; align-items:center; min-height:92px; padding:15px 18px; }
.next-token-demo__explanation div { display:grid; gap:6px; }
.next-token-demo__explanation code { width:fit-content; color:var(--vp-c-brand-1); font-size:12px; }
.next-token-demo__explanation p { margin:0; color:var(--vp-c-text-2); font-size:14px; }
.next-token-demo__controls { justify-content:center; border-top:1px solid var(--vp-c-divider); }
.next-token-demo__controls button:disabled { cursor:not-allowed; opacity:.4; }
@media(max-width:700px){.next-token-demo__timeline{grid-template-columns:repeat(4,1fr)}.next-token-demo__candidates{grid-template-columns:repeat(2,1fr)}.next-token-demo__result,.next-token-demo__explanation{grid-template-columns:1fr}.next-token-demo__path{grid-template-columns:1fr}.next-token-demo__path i{transform:rotate(90deg);text-align:center}}
@media(prefers-reduced-motion:reduce){.next-token-demo *{transition:none!important}}
</style>
