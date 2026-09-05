<script setup lang="ts">
import { computed, ref } from "vue";

type Stage = { short: string; title: string; formula: string; note: string; active: string[] };

const layerCount = ref(2);
const current = ref(0);
const stages: Stage[] = [
  { short:"ID", title:"离散 token 先查表成为向量", formula:"[B,T] → embedding → [B,T,C]", note:"Token ID 只是整数索引。Embedding 表 E[V,C] 为每个 ID 取出 C 维向量，再加入位置信息。", active:["embedding"] },
  { short:"注意力", title:"每个 Decoder Block 先混合序列信息", formula:"X ← X + Attention(Norm(X))", note:"因果自注意力让每个位置读取自己和历史位置；残差把读到的新信息加回原表示。", active:["blocks","attention"] },
  { short:"MLP", title:"同一 Block 再逐位置变换特征", formula:"X ← X + MLP(Norm(X))", note:"MLP 不在 token 位置之间通信，而是在每个位置内部扩展、激活并压回通道。", active:["blocks","mlp"] },
  { short:"堆叠", title:"多个 Block 重复更新同一个 shape", formula:"[B,T,C] → L × Block → [B,T,C]", note:"层数增加的是连续加工次数，不会自动改变外部 shape。每层都有自己的一组可训练参数。", active:["blocks"] },
  { short:"输出头", title:"最终表示被投影到词表", formula:"H → Norm → H W_vocab → logits [B,T,V]", note:"最后一维从隐藏宽度 C 变成词表大小 V；每个位置因此得到对所有候选 token 的分数。", active:["norm","head"] },
  { short:"目标", title:"同一 logits 在训练和生成中走向不同动作", formula:"训练: cross_entropy　生成: select token", note:"训练把所有有效位置与右移标签比较并更新参数；生成只使用最后位置分布选出下一个 token。", active:["output"] },
];
const stage = computed(() => stages[current.value]);

function setLayers(event: Event) {
  const value = Number((event.target as HTMLInputElement).value);
  if (!Number.isFinite(value)) return;
  layerCount.value = Math.max(1, Math.min(4, Math.round(value)));
}
function active(name: string) { return stage.value.active.includes(name); }
function go(index: number) { current.value = Math.max(0, Math.min(stages.length - 1, index)); }
function restore() { layerCount.value = 2; current.value = 0; }
</script>

<template>
  <figure class="interactive-card lm-architecture">
    <figcaption>
      <span>把 Transformer Block 组装成 Decoder-only 语言模型</span>
      <button type="button" @click="restore">恢复示例</button>
    </figcaption>

    <ol class="lm-architecture__timeline" aria-label="语言模型组装步骤">
      <li v-for="(item,index) in stages" :key="item.short"><button type="button" :class="{ active:index === current, complete:index < current }" :aria-current="index === current ? 'step' : undefined" @click="go(index)">{{ item.short }}</button></li>
    </ol>

    <div class="lm-architecture__canvas" aria-label="Decoder-only 语言模型结构图">
      <div class="lm-architecture__input">
        <small>输入</small><strong>&lt;BOS&gt;　我　喜欢　猫</strong><code>ids [B,T]</code>
      </div>
      <i>↓</i>
      <section :class="{ active:active('embedding') }">
        <header><strong>Token Embedding + Position</strong><code>E[V,C]</code></header>
        <p>每个位置得到一个 C 维初始表示</p><b>[B,T,C]</b>
      </section>
      <i>↓</i>
      <div class="lm-architecture__stack" :class="{ active:active('blocks') }">
        <header>
          <strong>Decoder Blocks</strong>
          <label>层数 L <input type="number" min="1" max="4" step="1" :value="layerCount" aria-label="演示中的 Decoder Block 层数" @change="setLayers"></label>
        </header>
        <section v-for="layer in layerCount" :key="layer" class="lm-architecture__block">
          <b>Block {{ layer }}</b>
          <span :class="{ active:active('attention') }">Norm → Causal Attention → + Residual</span>
          <span :class="{ active:active('mlp') }">Norm → MLP → + Residual</span>
          <code>[B,T,C] → [B,T,C]</code>
        </section>
      </div>
      <i>↓</i>
      <section :class="{ active:active('norm') }">
        <header><strong>Final Norm</strong></header><p>统一最终隐藏表示的尺度</p><b>H [B,T,C]</b>
      </section>
      <i>↓</i>
      <section :class="{ active:active('head') }">
        <header><strong>Language Model Head</strong><code>W_vocab [C,V]</code></header>
        <p>每个位置投影到整个词表</p><b>logits [B,T,V]</b>
      </section>
      <i>↓</i>
      <div class="lm-architecture__output" :class="{ active:active('output') }">
        <span><small>训练</small>与右移标签计算 loss → 反向传播</span>
        <span><small>生成</small>取最后位置分布 → 选择 token → 接回输入</span>
      </div>
    </div>

    <section class="lm-architecture__explanation" aria-live="polite">
      <div><strong>{{ stage.title }}</strong><code>{{ stage.formula }}</code></div><p>{{ stage.note }}</p>
    </section>
    <div class="interactive-controls lm-architecture__controls">
      <button type="button" class="secondary" :disabled="current === 0" @click="go(current - 1)">上一步</button>
      <button type="button" class="secondary" :disabled="current === stages.length - 1" @click="go(current + 1)">下一步</button>
      <button type="button" class="secondary" @click="go(0)">回到开头</button><span>{{ current + 1 }} / {{ stages.length }}</span>
    </div>
    <p class="interactive-fallback">静态路径：token ID 经词嵌入和位置表示得到 [B,T,C]，依次通过 L 个保持 shape 不变的因果 Decoder Block，再经最终归一化和词表投影得到 [B,T,V] logits；训练比较右移标签，生成选择最后位置的 token。</p>
  </figure>
</template>

<style scoped>
.lm-architecture > figcaption { display:flex; align-items:center; justify-content:space-between; gap:16px; }
.lm-architecture > figcaption button { padding:4px 8px; border:1px solid var(--vp-c-divider); border-radius:6px; color:var(--vp-c-text-2); background:var(--vp-c-bg); cursor:pointer; font-size:11px; }
.lm-architecture__timeline { display:grid; grid-template-columns:repeat(6,1fr); gap:5px; margin:0; padding:14px 18px; list-style:none; }
.lm-architecture__timeline li { margin:0; }
.lm-architecture__timeline button { width:100%; padding:7px 4px; border:1px solid var(--vp-c-divider); border-radius:7px; color:var(--vp-c-text-2); background:var(--vp-c-bg); cursor:pointer; font-size:11px; }
.lm-architecture__timeline button.complete { border-color:color-mix(in srgb,var(--vp-c-brand-1),transparent 60%); }
.lm-architecture__timeline button.active { border-color:#3f3f46; color:white; background:#3f3f46; font-weight:700; }
.lm-architecture__canvas { display:grid; justify-items:stretch; gap:5px; padding:22px clamp(18px,7vw,90px); border-block:1px solid var(--vp-c-divider); background:var(--vp-c-bg-soft); }
.lm-architecture__canvas > i { justify-self:center; color:var(--vp-c-text-3); font-style:normal; }
.lm-architecture__canvas section,.lm-architecture__input,.lm-architecture__stack,.lm-architecture__output { border:1px solid var(--vp-c-divider); border-radius:10px; background:var(--vp-c-bg); transition:border-color .2s,box-shadow .2s,opacity .2s; }
.lm-architecture__canvas > section,.lm-architecture__input { display:grid; grid-template-columns:1fr auto; gap:4px 16px; padding:12px 14px; }
.lm-architecture__canvas header { display:flex; align-items:center; justify-content:space-between; grid-column:1/-1; gap:12px; }
.lm-architecture__canvas p { margin:0; color:var(--vp-c-text-2); font-size:12px; }
.lm-architecture__canvas code { color:var(--vp-c-brand-1); font-size:11px; }
.lm-architecture__canvas b { color:var(--vp-c-text-2); font-size:11px; }
.lm-architecture__input small,.lm-architecture__output small { display:block; color:var(--vp-c-text-3); font-size:9px; }
.lm-architecture__input strong { font-size:13px; }
.lm-architecture__stack { padding:12px; }
.lm-architecture__stack > header { margin-bottom:8px; }
.lm-architecture__stack label { color:var(--vp-c-text-2); font-size:11px; }
.lm-architecture__stack input { width:46px; padding:4px; border:1px solid var(--vp-c-divider); border-radius:5px; color:var(--vp-c-text-1); background:var(--vp-c-bg); text-align:center; }
.lm-architecture__block { display:grid; grid-template-columns:74px minmax(0,1fr) minmax(0,1fr) auto; align-items:center; gap:8px; margin-top:6px; padding:8px !important; border-radius:7px !important; }
.lm-architecture__block span { padding:5px 7px; border-radius:5px; color:var(--vp-c-text-2); background:var(--vp-c-bg-soft); font-size:10px; }
.lm-architecture__block span.active { color:var(--vp-c-brand-1); background:color-mix(in srgb,var(--vp-c-brand-1),transparent 90%); font-weight:700; }
.lm-architecture__canvas .active { border-color:var(--vp-c-brand-1); box-shadow:0 0 0 2px color-mix(in srgb,var(--vp-c-brand-1),transparent 85%); }
.lm-architecture__output { display:grid; grid-template-columns:1fr 1fr; gap:8px; padding:10px; }
.lm-architecture__output span { padding:8px 10px; border-radius:7px; background:var(--vp-c-bg-soft); font-size:11px; }
.lm-architecture__explanation { display:grid; grid-template-columns:minmax(220px,.8fr) minmax(0,1.2fr); gap:20px; padding:16px 20px; }
.lm-architecture__explanation strong,.lm-architecture__explanation code { display:block; }
.lm-architecture__explanation code { width:max-content; max-width:100%; margin-top:6px; padding:4px 7px; overflow:auto; color:var(--vp-c-brand-1); background:var(--vp-c-bg-soft); font-size:11px; }
.lm-architecture__explanation p { margin:0; color:var(--vp-c-text-2); font-size:13px; }
.lm-architecture__controls { padding:0 20px 18px; }
@media (prefers-reduced-motion: reduce) { .lm-architecture * { transition:none !important; } }
@media (max-width:700px) {
 .lm-architecture__timeline { grid-template-columns:repeat(3,1fr); }
 .lm-architecture__canvas { padding:18px 12px; }
 .lm-architecture__block { grid-template-columns:1fr; }
 .lm-architecture__output,.lm-architecture__explanation { grid-template-columns:1fr; }
}
</style>
