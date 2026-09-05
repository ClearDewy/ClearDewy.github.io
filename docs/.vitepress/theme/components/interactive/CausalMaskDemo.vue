<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from "vue";

const defaults = ["<BOS>", "我", "喜欢", "猫"];
const tokens = ref([...defaults]);
const current = ref(0);
const playing = ref(false);
let timer: ReturnType<typeof setInterval> | undefined;

const labels = computed(() => [...tokens.value.slice(1), "<EOS>"]);
const stages = computed(() => [
  ...tokens.value.map((token, row) => ({
    short: `位置 ${row}`,
    title: `${token} 只能读取位置 0 到 ${row}`,
    formula: `mask[${row}, j] = ${row}≥j ? 0 : −∞`,
    note: `第 ${row} 行是查询位置 ${row}。列号大于 ${row} 的 token 属于未来，必须在 Softmax 前屏蔽。`,
  })),
  {
    short: "标签",
    title: "同一序列同时提供四个训练答案",
    formula: "input[t] → label[t] = token[t+1]",
    note: "因果遮罩决定每个位置能看见什么；右移标签决定每个位置应该预测什么。两者职责不同，必须同时正确。",
  },
]);
const stage = computed(() => stages.value[current.value]);

function stop() {
  playing.value = false;
  if (timer) clearInterval(timer);
  timer = undefined;
}
function go(index: number) {
  stop();
  current.value = Math.max(0, Math.min(stages.value.length - 1, index));
}
function play() {
  if (playing.value) return stop();
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return go(Math.min(current.value + 1, stages.value.length - 1));
  if (current.value === stages.value.length - 1) current.value = 0;
  playing.value = true;
  timer = setInterval(() => current.value === stages.value.length - 1 ? stop() : current.value += 1, 1700);
}
function updateToken(index: number, event: Event) {
  const value = (event.target as HTMLInputElement).value.trim();
  if (!value) return;
  tokens.value[index] = value.slice(0, 10);
  stop();
}
function restore() {
  tokens.value = [...defaults];
  go(0);
}
onBeforeUnmount(stop);
</script>

<template>
  <figure class="interactive-card causal-demo">
    <figcaption>
      <span>因果遮罩怎样阻止当前位置偷看未来</span>
      <button type="button" @click="restore">恢复示例</button>
    </figcaption>

    <div class="causal-demo__sequence" aria-label="可直接修改的输入 token">
      <label v-for="(_, index) in tokens" :key="index">
        <small>位置 {{ index }}</small>
        <input :value="tokens[index]" :aria-label="`位置 ${index} 的 token`" @change="updateToken(index, $event)">
      </label>
    </div>

    <ol class="causal-demo__timeline" aria-label="因果遮罩观察步骤">
      <li v-for="(item, index) in stages" :key="item.short">
        <button type="button" :class="{ active: index === current, complete: index < current }" :aria-current="index === current ? 'step' : undefined" @click="go(index)">{{ item.short }}</button>
      </li>
    </ol>

    <div class="causal-demo__workbench">
      <section>
        <h4>注意力可见性矩阵</h4>
        <p>行是正在计算的 Query，列是它想读取的 Key。</p>
        <div class="causal-demo__matrix" role="table" aria-label="四个 token 的下三角因果遮罩">
          <span class="corner">Q \ K</span>
          <strong v-for="(token, column) in tokens" :key="`head-${column}`">{{ column }}<small>{{ token }}</small></strong>
          <template v-for="(query, row) in tokens" :key="`row-${row}`">
            <strong>{{ row }}<small>{{ query }}</small></strong>
            <span
              v-for="(_, column) in tokens"
              :key="`${row}-${column}`"
              :class="{
                allowed: column <= row,
                masked: column > row,
                active: current === row,
                source: current === row && column <= row,
              }"
              role="cell"
              :aria-label="`位置 ${row} ${column <= row ? '可以' : '不可以'}读取位置 ${column}`"
            >{{ column <= row ? "0" : "−∞" }}</span>
          </template>
        </div>
      </section>

      <section>
        <h4>右移后的监督信号</h4>
        <p>每一行隐藏状态负责预测同一行的标签。</p>
        <div class="causal-demo__pairs">
          <div v-for="(token, index) in tokens" :key="`pair-${index}`" :class="{ active: current === index || current === stages.length - 1 }">
            <span><small>输入 {{ index }}</small>{{ token }}</span>
            <i>→</i>
            <span class="target"><small>标签 {{ index }}</small>{{ labels[index] }}</span>
          </div>
        </div>
      </section>
    </div>

    <section class="causal-demo__explanation" aria-live="polite">
      <div><strong>{{ stage.title }}</strong><code>{{ stage.formula }}</code></div>
      <p>{{ stage.note }}</p>
    </section>

    <div class="interactive-controls causal-demo__controls">
      <button type="button" class="secondary" :disabled="current === 0" @click="go(current - 1)">上一步</button>
      <button type="button" @click="play">{{ playing ? "暂停" : "播放" }}</button>
      <button type="button" class="secondary" :disabled="current === stages.length - 1" @click="go(current + 1)">下一步</button>
      <button type="button" class="secondary" @click="go(0)">回到开头</button>
      <span>{{ current + 1 }} / {{ stages.length }}</span>
    </div>
    <p class="interactive-fallback">静态结论：第 i 个 token 只能读取第 0 到 i 个位置，未来位置在 Softmax 前被加上负无穷；输入序列右移一位形成标签，因此每个可见位置都产生一个 next-token 训练目标。</p>
  </figure>
</template>

<style scoped>
.causal-demo > figcaption { display:flex; align-items:center; justify-content:space-between; gap:16px; }
.causal-demo > figcaption button { padding:4px 8px; border:1px solid var(--vp-c-divider); border-radius:6px; color:var(--vp-c-text-2); background:var(--vp-c-bg); cursor:pointer; font-size:11px; }
.causal-demo__sequence { display:grid; grid-template-columns:repeat(4,minmax(90px,1fr)); gap:8px; padding:16px 18px 0; }
.causal-demo__sequence label { display:grid; gap:4px; }
.causal-demo__sequence small { color:var(--vp-c-text-3); font-size:10px; }
.causal-demo__sequence input { min-width:0; padding:7px 8px; border:1px solid var(--vp-c-divider); border-radius:7px; color:var(--vp-c-text-1); background:var(--vp-c-bg); text-align:center; font:inherit; font-weight:650; }
.causal-demo__sequence input:focus { border-color:var(--vp-c-brand-1); outline:2px solid color-mix(in srgb,var(--vp-c-brand-1),transparent 78%); }
.causal-demo__timeline { display:grid; grid-template-columns:repeat(5,1fr); gap:5px; margin:0; padding:14px 18px; list-style:none; }
.causal-demo__timeline li { margin:0; }
.causal-demo__timeline button { width:100%; padding:7px 4px; border:1px solid var(--vp-c-divider); border-radius:7px; color:var(--vp-c-text-2); background:var(--vp-c-bg); cursor:pointer; font-size:11px; }
.causal-demo__timeline button.complete { border-color:color-mix(in srgb,var(--vp-c-brand-1),transparent 60%); }
.causal-demo__timeline button.active { border-color:#3f3f46; color:white; background:#3f3f46; font-weight:700; }
.causal-demo__workbench { display:grid; grid-template-columns:minmax(0,1.25fr) minmax(0,.75fr); gap:24px; padding:20px; border-block:1px solid var(--vp-c-divider); background:var(--vp-c-bg-soft); }
.causal-demo__workbench h4 { margin:0; font-size:15px; }
.causal-demo__workbench section > p { margin:4px 0 14px; color:var(--vp-c-text-2); font-size:12px; }
.causal-demo__matrix { display:grid; grid-template-columns:76px repeat(4,minmax(48px,1fr)); gap:4px; }
.causal-demo__matrix > * { display:grid; min-height:45px; place-items:center; border:1px solid var(--vp-c-divider); border-radius:6px; background:var(--vp-c-bg); font-size:13px; transition:border-color .2s,background .2s,opacity .2s; }
.causal-demo__matrix strong { color:var(--vp-c-text-2); font-size:11px; }
.causal-demo__matrix small { display:block; max-width:64px; overflow:hidden; color:var(--vp-c-text-3); font-size:9px; text-overflow:ellipsis; white-space:nowrap; }
.causal-demo__matrix .corner { color:var(--vp-c-text-3); font-size:10px; }
.causal-demo__matrix .masked { color:var(--vp-c-danger-1); background:color-mix(in srgb,var(--vp-c-danger-1),transparent 94%); }
.causal-demo__matrix .allowed { color:var(--vp-c-success-1); }
.causal-demo__matrix span:not(.active) { opacity:.62; }
.causal-demo__matrix span.active { border-color:var(--vp-c-brand-1); opacity:1; }
.causal-demo__matrix span.source { background:color-mix(in srgb,var(--vp-c-brand-1),transparent 86%); font-weight:750; }
.causal-demo__pairs { display:grid; gap:6px; }
.causal-demo__pairs > div { display:grid; grid-template-columns:1fr auto 1fr; align-items:center; gap:7px; opacity:.45; transition:opacity .2s; }
.causal-demo__pairs > div.active { opacity:1; }
.causal-demo__pairs span { display:grid; padding:7px; border:1px solid var(--vp-c-divider); border-radius:7px; background:var(--vp-c-bg); text-align:center; font-size:12px; }
.causal-demo__pairs small { color:var(--vp-c-text-3); font-size:9px; }
.causal-demo__pairs .target { border-color:color-mix(in srgb,var(--vp-c-brand-1),transparent 45%); }
.causal-demo__pairs i { color:var(--vp-c-text-3); font-style:normal; }
.causal-demo__explanation { display:grid; grid-template-columns:minmax(220px,.8fr) minmax(0,1.2fr); gap:20px; padding:16px 20px; }
.causal-demo__explanation strong,.causal-demo__explanation code { display:block; }
.causal-demo__explanation code { width:max-content; max-width:100%; margin-top:6px; padding:4px 7px; overflow:auto; color:var(--vp-c-brand-1); background:var(--vp-c-bg-soft); font-size:11px; }
.causal-demo__explanation p { margin:0; color:var(--vp-c-text-2); font-size:13px; }
.causal-demo__controls { padding:0 20px 18px; }
@media (prefers-reduced-motion: reduce) { .causal-demo * { transition:none !important; } }
@media (max-width:700px) {
  .causal-demo__sequence { grid-template-columns:repeat(2,1fr); }
  .causal-demo__timeline { grid-template-columns:repeat(3,1fr); }
  .causal-demo__workbench,.causal-demo__explanation { grid-template-columns:1fr; }
  .causal-demo__workbench { overflow-x:auto; }
  .causal-demo__matrix { min-width:410px; }
}
</style>
