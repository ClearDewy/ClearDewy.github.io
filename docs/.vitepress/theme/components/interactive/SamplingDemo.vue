<script setup lang="ts">
import { computed, ref } from "vue";

type Strategy = "greedy" | "sample" | "top-k" | "top-p";
type Candidate = { token: string; logit: number };
const defaults: Candidate[] = [
  { token: "猫", logit: 2.4 },
  { token: "狗", logit: 1.1 },
  { token: "书", logit: 0.2 },
  { token: "<EOS>", logit: -0.4 },
];
const candidates = ref(defaults.map((item) => ({ ...item })));
const temperature = ref(1);
const strategy = ref<Strategy>("sample");
const topK = ref(2);
const topP = ref(0.8);
const randomPoint = ref(0.42);

const baseProbabilities = computed(() => softmax(candidates.value.map((item) => item.logit / temperature.value)));
const kept = computed(() => {
  const order = baseProbabilities.value.map((value, index) => ({ value, index })).sort((a, b) => b.value - a.value);
  if (strategy.value === "top-k") return new Set(order.slice(0, topK.value).map((item) => item.index));
  if (strategy.value === "top-p") {
    let total = 0;
    const indexes = new Set<number>();
    for (const item of order) { indexes.add(item.index); total += item.value; if (total >= topP.value) break; }
    return indexes;
  }
  return new Set(order.map((item) => item.index));
});
const probabilities = computed(() => {
  if (strategy.value === "greedy") {
    const winner = baseProbabilities.value.indexOf(Math.max(...baseProbabilities.value));
    return baseProbabilities.value.map((_, index) => index === winner ? 1 : 0);
  }
  const values = baseProbabilities.value.map((value, index) => kept.value.has(index) ? value : 0);
  const total = values.reduce((sum, value) => sum + value, 0);
  return values.map((value) => value / total);
});
const selectedIndex = computed(() => {
  if (strategy.value === "greedy") return probabilities.value.indexOf(1);
  let total = 0;
  for (let index = 0; index < probabilities.value.length; index += 1) {
    total += probabilities.value[index];
    if (randomPoint.value <= total + 1e-12) return index;
  }
  return probabilities.value.length - 1;
});

function softmax(values: number[]) {
  const peak = Math.max(...values);
  const exps = values.map((value) => Math.exp(value - peak));
  const total = exps.reduce((sum, value) => sum + value, 0);
  return exps.map((value) => value / total);
}
function updateLogit(index: number, event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.value.trim()) return;
  const value = Number(input.value);
  if (!Number.isFinite(value)) return;
  candidates.value[index].logit = Math.max(-20, Math.min(20, value));
  input.value = String(candidates.value[index].logit);
}
function restore() {
  candidates.value = defaults.map((item) => ({ ...item }));
  temperature.value = 1;
  strategy.value = "sample";
  topK.value = 2;
  topP.value = 0.8;
  randomPoint.value = 0.42;
}
</script>

<template>
  <figure class="interactive-card sampling-demo">
    <figcaption><span>同一组 logits 怎样经过温度、截断与抽样</span><button type="button" @click="restore">恢复数值</button></figcaption>
    <section class="sampling-demo__controls" aria-label="采样参数">
      <label>策略<select v-model="strategy"><option value="greedy">Greedy</option><option value="sample">全量采样</option><option value="top-k">Top-k</option><option value="top-p">Top-p</option></select></label>
      <label>温度 T <input v-model.number="temperature" type="range" min="0.2" max="2" step="0.1"><output>{{ temperature.toFixed(1) }}</output></label>
      <label v-if="strategy === 'top-k'">k <input v-model.number="topK" type="range" min="1" :max="candidates.length" step="1"><output>{{ topK }}</output></label>
      <label v-if="strategy === 'top-p'">p <input v-model.number="topP" type="range" min="0.1" max="1" step="0.05"><output>{{ topP.toFixed(2) }}</output></label>
      <label v-if="strategy !== 'greedy'">随机位置 u <input v-model.number="randomPoint" type="range" min="0" max="0.999" step="0.001"><output>{{ randomPoint.toFixed(3) }}</output></label>
    </section>
    <section class="sampling-demo__candidates" aria-live="polite">
      <article v-for="(item,index) in candidates" :key="item.token" :class="{ removed: !kept.has(index) && strategy !== 'greedy', selected: index === selectedIndex }">
        <header><strong>{{ item.token }}</strong><span v-if="index === selectedIndex">本次选中</span></header>
        <label>logit <input type="number" min="-20" max="20" step="0.1" :value="item.logit" :aria-label="`${item.token} 的 logit`" @input="updateLogit(index,$event)"></label>
        <div class="sampling-demo__bar"><i :style="{ width: `${probabilities[index]*100}%` }"></i></div>
        <small>基础 {{ baseProbabilities[index].toFixed(3) }} · 采样 {{ probabilities[index].toFixed(3) }}</small>
      </article>
    </section>
    <p class="sampling-demo__result"><b>结果：</b>在当前设置下，随机位置 <code>{{ randomPoint.toFixed(3) }}</code> 落入 <strong>{{ candidates[selectedIndex].token }}</strong> 的累计概率区间。改变 `u` 只模拟另一次随机抽样，不会训练或修改模型参数。</p>
    <p class="interactive-fallback">静态说明：温度先改变完整概率分布；top-k 保留概率最高的 k 个候选，top-p 保留累计概率达到阈值的最小候选集合；截断后重新归一化，再用随机位置在累计概率区间中选出一个 token。</p>
  </figure>
</template>

<style scoped>
.sampling-demo>figcaption{display:flex;align-items:center;justify-content:space-between;gap:16px}.sampling-demo>figcaption button{padding:4px 8px;border:1px solid var(--vp-c-divider);border-radius:6px;color:var(--vp-c-text-2);background:var(--vp-c-bg);cursor:pointer;font-size:11px}.sampling-demo__controls{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;padding:16px;border-bottom:1px solid var(--vp-c-divider);background:var(--vp-c-bg-soft)}.sampling-demo__controls label{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:9px;color:var(--vp-c-text-2);font-size:12px}.sampling-demo select,.sampling-demo input{min-width:0}.sampling-demo select,.sampling-demo__candidates input{box-sizing:border-box;padding:5px 7px;border:1px solid var(--vp-c-divider);border-radius:6px;color:var(--vp-c-text-1);background:var(--vp-c-bg)}.sampling-demo output{min-width:38px;color:var(--vp-c-text-1);font-weight:650}.sampling-demo__candidates{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;padding:18px}.sampling-demo__candidates article{display:grid;gap:9px;padding:12px;border:1px solid var(--vp-c-divider);border-radius:10px;background:var(--vp-c-bg);transition:.18s}.sampling-demo__candidates article.removed{opacity:.36}.sampling-demo__candidates article.selected{border-color:var(--vp-c-brand-1);box-shadow:0 0 0 3px color-mix(in srgb,var(--vp-c-brand-1),transparent 86%)}.sampling-demo__candidates header{display:flex;align-items:center;justify-content:space-between;gap:4px}.sampling-demo__candidates header span{color:var(--vp-c-brand-1);font-size:9px;font-weight:700}.sampling-demo__candidates label{display:flex;align-items:center;justify-content:space-between;color:var(--vp-c-text-2);font-size:10px}.sampling-demo__candidates input{width:58px;text-align:center}.sampling-demo__bar{height:8px;overflow:hidden;border-radius:99px;background:var(--vp-c-default-soft)}.sampling-demo__bar i{display:block;height:100%;border-radius:inherit;background:var(--vp-c-brand-1);transition:width .18s}.sampling-demo__candidates small{color:var(--vp-c-text-2);font-size:10px}.sampling-demo__result{margin:0;padding:15px 18px;border-top:1px solid var(--vp-c-divider);color:var(--vp-c-text-2);font-size:13px}.sampling-demo__result strong{color:var(--vp-c-brand-1)}@media(max-width:700px){.sampling-demo__controls{grid-template-columns:1fr}.sampling-demo__candidates{grid-template-columns:repeat(2,1fr)}}@media(max-width:430px){.sampling-demo__candidates{grid-template-columns:1fr}}@media(prefers-reduced-motion:reduce){.sampling-demo *{transition:none!important}}
</style>
