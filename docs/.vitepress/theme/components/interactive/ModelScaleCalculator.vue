<script setup lang="ts">
import { computed, reactive } from "vue";

const defaults = { vocab:32000, context:2048, width:768, layers:12, ffn:4, batch:1, bytes:2 };
const values = reactive({ ...defaults });

const embeddingParameters = computed(() => values.vocab * values.width);
const attentionPerLayer = computed(() => 4 * values.width * values.width);
const mlpPerLayer = computed(() => 2 * values.ffn * values.width * values.width);
const blockParameters = computed(() => values.layers * (attentionPerLayer.value + mlpPerLayer.value));
const totalParameters = computed(() => embeddingParameters.value + blockParameters.value);
const weightMemory = computed(() => totalParameters.value * values.bytes);
const trainingStateMemory = computed(() => totalParameters.value * 16);
const kvPerToken = computed(() => 2 * values.layers * values.width * values.bytes * values.batch);
const kvContext = computed(() => kvPerToken.value * values.context);
const attentionScores = computed(() => values.batch * values.layers * values.context * values.context);

function clamp(key: keyof typeof defaults, event: Event) {
  const input = event.target as HTMLInputElement;
  const number = Number(input.value);
  if (!Number.isFinite(number)) return;
  const limits: Record<keyof typeof defaults,[number,number]> = {
    vocab:[100,500000], context:[16,1048576], width:[16,32768], layers:[1,256], ffn:[1,16], batch:[1,1024], bytes:[1,8],
  };
  values[key] = Math.max(limits[key][0], Math.min(limits[key][1], Math.round(number)));
  input.value = String(values[key]);
}
function format(number: number) {
  const units = [[1e12,"T"],[1e9,"B"],[1e6,"M"],[1e3,"K"]] as const;
  for (const [size,label] of units) if (number >= size) return `${(number / size).toFixed(number / size >= 100 ? 0 : number / size >= 10 ? 1 : 2)} ${label}`;
  return number.toFixed(0);
}
function bytes(number: number) {
  const units = [[2 ** 40,"TiB"],[2 ** 30,"GiB"],[2 ** 20,"MiB"],[2 ** 10,"KiB"]] as const;
  for (const [size,label] of units) if (number >= size) return `${(number / size).toFixed(2)} ${label}`;
  return `${number.toFixed(0)} B`;
}
function restore() { Object.assign(values,defaults); }
</script>

<template>
  <figure class="interactive-card scale-calculator">
    <figcaption><span>参数、权重显存和 KV Cache 的数量级计算器</span><button type="button" @click="restore">恢复基线</button></figcaption>
    <div class="scale-calculator__inputs">
      <label><span>词表 V</span><input type="number" :value="values.vocab" min="100" max="500000" @change="clamp('vocab',$event)"><small>Embedding 行数</small></label>
      <label><span>上下文 T</span><input type="number" :value="values.context" min="16" max="1048576" @change="clamp('context',$event)"><small>每条序列 token 数</small></label>
      <label><span>隐藏宽度 C</span><input type="number" :value="values.width" min="16" max="32768" @change="clamp('width',$event)"><small>每个 token 的通道数</small></label>
      <label><span>层数 L</span><input type="number" :value="values.layers" min="1" max="256" @change="clamp('layers',$event)"><small>Decoder Block 数</small></label>
      <label><span>MLP 倍率 r</span><input type="number" :value="values.ffn" min="1" max="16" @change="clamp('ffn',$event)"><small>中间宽度约 rC</small></label>
      <label><span>批量 B</span><input type="number" :value="values.batch" min="1" max="1024" @change="clamp('batch',$event)"><small>并行序列数</small></label>
      <label><span>每个数的字节</span><input type="number" :value="values.bytes" min="1" max="8" @change="clamp('bytes',$event)"><small>FP16/BF16 通常为 2</small></label>
    </div>

    <div class="scale-calculator__results" aria-live="polite">
      <article><small>Embedding 参数</small><strong>{{ format(embeddingParameters) }}</strong><code>V × C</code></article>
      <article><small>所有 Block 参数</small><strong>{{ format(blockParameters) }}</strong><code>L × (4C² + 2rC²)</code></article>
      <article class="primary"><small>近似总参数</small><strong>{{ format(totalParameters) }}</strong><code>忽略 bias 与 norm 小项</code></article>
      <article><small>仅权重显存</small><strong>{{ bytes(weightMemory) }}</strong><code>N × bytes</code></article>
      <article><small>训练状态粗估</small><strong>{{ bytes(trainingStateMemory) }}</strong><code>约 16 bytes/parameter</code></article>
      <article><small>当前上下文 KV Cache</small><strong>{{ bytes(kvContext) }}</strong><code>2 × L × B × T × C × bytes</code></article>
      <article><small>注意力分数元素</small><strong>{{ format(attentionScores) }}</strong><code>B × L × T²（未计 head）</code></article>
    </div>
    <div class="scale-calculator__notes">
      <p><b>宽度 C</b> 同时平方影响 Block 参数；<b>上下文 T</b> 线性影响 KV Cache、平方影响朴素注意力分数矩阵。</p>
      <p>这些是教学数量级，不是任意框架的显存承诺。真实值还受权重共享、GQA/MQA、激活保存、量化、优化器、并行方式和内核实现影响。</p>
    </div>
    <p class="interactive-fallback">静态公式：Embedding 参数约 V×C；每层注意力参数约 4C²，MLP 参数约 2rC²；KV Cache 约 2LBT C 乘每个数的字节数；朴素注意力分数存储随 T² 增长。</p>
  </figure>
</template>

<style scoped>
.scale-calculator > figcaption { display:flex; align-items:center; justify-content:space-between; gap:16px; }
.scale-calculator > figcaption button { padding:4px 8px; border:1px solid var(--vp-c-divider); border-radius:6px; color:var(--vp-c-text-2); background:var(--vp-c-bg); cursor:pointer; font-size:11px; }
.scale-calculator__inputs { display:grid; grid-template-columns:repeat(4,1fr); gap:8px; padding:18px; border-bottom:1px solid var(--vp-c-divider); background:var(--vp-c-bg-soft); }
.scale-calculator__inputs label { display:grid; gap:4px; padding:9px; border:1px solid var(--vp-c-divider); border-radius:8px; background:var(--vp-c-bg); }
.scale-calculator__inputs span { color:var(--vp-c-text-2); font-size:11px; font-weight:700; }
.scale-calculator__inputs input { min-width:0; padding:6px 7px; border:1px solid var(--vp-c-divider); border-radius:6px; color:var(--vp-c-text-1); background:var(--vp-c-bg); font:inherit; font-variant-numeric:tabular-nums; }
.scale-calculator__inputs input:focus { border-color:var(--vp-c-brand-1); outline:2px solid color-mix(in srgb,var(--vp-c-brand-1),transparent 78%); }
.scale-calculator__inputs small { color:var(--vp-c-text-3); font-size:9px; }
.scale-calculator__results { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; padding:18px; }
.scale-calculator__results article { display:grid; gap:5px; padding:13px; border:1px solid var(--vp-c-divider); border-radius:9px; background:var(--vp-c-bg); }
.scale-calculator__results article.primary { border-color:var(--vp-c-brand-1); background:color-mix(in srgb,var(--vp-c-brand-1),transparent 94%); }
.scale-calculator__results small { color:var(--vp-c-text-2); font-size:10px; }
.scale-calculator__results strong { font-size:20px; font-variant-numeric:tabular-nums; }
.scale-calculator__results code { color:var(--vp-c-brand-1); background:transparent; font-size:9px; }
.scale-calculator__notes { display:grid; grid-template-columns:1fr 1fr; gap:16px; padding:14px 18px; border-top:1px solid var(--vp-c-divider); background:var(--vp-c-bg-soft); }
.scale-calculator__notes p { margin:0; color:var(--vp-c-text-2); font-size:12px; }
@media (max-width:800px) { .scale-calculator__inputs { grid-template-columns:repeat(2,1fr); } .scale-calculator__results { grid-template-columns:repeat(2,1fr); } }
@media (max-width:520px) { .scale-calculator__inputs,.scale-calculator__results,.scale-calculator__notes { grid-template-columns:1fr; } }
</style>
