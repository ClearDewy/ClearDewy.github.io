<script setup lang="ts">
import { computed, ref } from "vue";

const defaults = ["<BOS>", "我", "喜欢"];
const prompt = ref([...defaults]);
const current = ref(0);
const generated = ["猫", "<EOS>"];
const stages = [
  { short:"Prefill", title:"一次处理完整 Prompt", formula:"3 tokens → 3 组 K/V + 下一 token logits", note:"三个 Prompt token 可以并行通过模型。每层产生的 K、V 被保存，最后位置 logits 用来选择“猫”。" },
  { short:"Decode 1", title:"只让新 token“猫”通过模型", formula:"Q_猫 × [K_prompt, K_猫] → 新 logits", note:"历史 token 的 K、V 直接从缓存读取；新 token 仍要生成自己的 Q、K、V，并把 K、V 追加到缓存。" },
  { short:"Decode 2", title:"再处理新 token <EOS>", formula:"Q_EOS × [K_prompt, K_猫, K_EOS]", note:"缓存随序列增长。它省去历史 K、V 的重复投影，但注意力读取的历史长度仍然越来越长。" },
];
const stage = computed(() => stages[current.value]);
const visibleGenerated = computed(() => generated.slice(0, current.value));
const cacheTokens = computed(() => [...prompt.value, ...visibleGenerated.value]);
const noCacheWork = computed(() => {
  if (current.value === 0) return prompt.value.length;
  let total = prompt.value.length;
  for (let step = 1; step <= current.value; step += 1) total += prompt.value.length + step;
  return total;
});
const cacheWork = computed(() => prompt.value.length + current.value);

function updateToken(index: number, event: Event) {
  const value = (event.target as HTMLInputElement).value.trim();
  if (value) prompt.value[index] = value.slice(0, 10);
}
function go(index: number) { current.value = Math.max(0, Math.min(stages.length - 1, index)); }
function restore() { prompt.value = [...defaults]; current.value = 0; }
</script>

<template>
  <figure class="interactive-card kv-demo">
    <figcaption><span>Prefill 与 Decode 怎样复用历史 K/V</span><button type="button" @click="restore">恢复示例</button></figcaption>
    <ol class="kv-demo__timeline" aria-label="KV Cache 推理步骤">
      <li v-for="(item,index) in stages" :key="item.short"><button type="button" :class="{ active:index === current, complete:index < current }" :aria-current="index === current ? 'step' : undefined" @click="go(index)">{{ item.short }}</button></li>
    </ol>

    <div class="kv-demo__prompt">
      <span>Prompt</span>
      <label v-for="(_,index) in prompt" :key="index"><small>{{ index }}</small><input :value="prompt[index]" :aria-label="`Prompt 位置 ${index}`" @change="updateToken(index,$event)"></label>
      <template v-for="(token,index) in visibleGenerated" :key="token"><i>+</i><b><small>{{ prompt.length + index }}</small>{{ token }}</b></template>
    </div>

    <div class="kv-demo__compare">
      <section>
        <header><strong>不使用缓存</strong><span>重复计算</span></header>
        <div class="kv-demo__rows">
          <div v-for="step in current + 1" :key="`none-${step}`">
            <small>{{ step === 1 ? "Prefill" : `Decode ${step - 1}` }}</small>
            <span v-for="(_,tokenIndex) in prompt.length + step - 1" :key="tokenIndex" :class="{ repeated:step > 1 && tokenIndex < prompt.length + step - 2 }">{{ tokenIndex }}</span>
          </div>
        </div>
        <p>累计进入 Block 的 token 次数：<b>{{ noCacheWork }}</b></p>
      </section>
      <section class="cached">
        <header><strong>使用 KV Cache</strong><span>只计算新增 token</span></header>
        <div class="kv-demo__cache">
          <div><small>缓存 K</small><span v-for="(token,index) in cacheTokens" :key="`k-${index}`">K<sub>{{ index }}</sub><em>{{ token }}</em></span></div>
          <div><small>缓存 V</small><span v-for="(token,index) in cacheTokens" :key="`v-${index}`">V<sub>{{ index }}</sub><em>{{ token }}</em></span></div>
          <div class="query"><small>本步 Q</small><span>Q<sub>{{ current === 0 ? prompt.length - 1 : prompt.length + current - 1 }}</sub></span><i>读取上方全部 K/V</i></div>
        </div>
        <p>累计进入 Block 的 token 次数：<b>{{ cacheWork }}</b></p>
      </section>
    </div>

    <section class="kv-demo__explanation" aria-live="polite"><div><strong>{{ stage.title }}</strong><code>{{ stage.formula }}</code></div><p>{{ stage.note }}</p></section>
    <div class="interactive-controls kv-demo__controls">
      <button type="button" class="secondary" :disabled="current === 0" @click="go(current - 1)">上一步</button>
      <button type="button" class="secondary" :disabled="current === stages.length - 1" @click="go(current + 1)">下一步</button>
      <button type="button" class="secondary" @click="go(0)">回到开头</button><span>{{ current + 1 }} / {{ stages.length }}</span>
    </div>
    <p class="interactive-fallback">静态结论：Prefill 并行处理完整 Prompt 并保存每层每个位置的 K/V；随后每个 Decode 步骤只计算新 token 的 Q/K/V，查询会读取历史缓存，新 K/V 再追加到缓存。缓存以显存换取减少重复投影和重复 Block 计算。</p>
  </figure>
</template>

<style scoped>
.kv-demo > figcaption { display:flex; align-items:center; justify-content:space-between; gap:16px; }
.kv-demo > figcaption button { padding:4px 8px; border:1px solid var(--vp-c-divider); border-radius:6px; color:var(--vp-c-text-2); background:var(--vp-c-bg); cursor:pointer; font-size:11px; }
.kv-demo__timeline { display:grid; grid-template-columns:repeat(3,1fr); gap:6px; margin:0; padding:14px 18px; list-style:none; }
.kv-demo__timeline li { margin:0; }
.kv-demo__timeline button { width:100%; padding:7px; border:1px solid var(--vp-c-divider); border-radius:7px; color:var(--vp-c-text-2); background:var(--vp-c-bg); cursor:pointer; font-size:11px; }
.kv-demo__timeline button.complete { border-color:color-mix(in srgb,var(--vp-c-brand-1),transparent 60%); }
.kv-demo__timeline button.active { border-color:#3f3f46; color:white; background:#3f3f46; font-weight:700; }
.kv-demo__prompt { display:flex; align-items:end; justify-content:center; gap:7px; padding:14px; border-block:1px solid var(--vp-c-divider); background:var(--vp-c-bg-soft); }
.kv-demo__prompt > span { align-self:center; margin-right:8px; color:var(--vp-c-text-2); font-size:12px; font-weight:700; }
.kv-demo__prompt label,.kv-demo__prompt b { display:grid; gap:2px; width:76px; }
.kv-demo__prompt small { color:var(--vp-c-text-3); font-size:9px; font-weight:400; }
.kv-demo__prompt input,.kv-demo__prompt b { box-sizing:border-box; padding:7px; border:1px solid var(--vp-c-divider); border-radius:7px; color:var(--vp-c-text-1); background:var(--vp-c-bg); text-align:center; font:inherit; font-size:12px; }
.kv-demo__prompt b { border-color:var(--vp-c-brand-1); }
.kv-demo__prompt i { align-self:center; color:var(--vp-c-text-3); font-style:normal; }
.kv-demo__compare { display:grid; grid-template-columns:1fr 1fr; gap:14px; padding:20px; }
.kv-demo__compare > section { padding:14px; border:1px solid var(--vp-c-divider); border-radius:10px; background:var(--vp-c-bg-soft); }
.kv-demo__compare header { display:flex; align-items:center; justify-content:space-between; gap:8px; }
.kv-demo__compare header span { color:var(--vp-c-danger-1); font-size:10px; }
.kv-demo__compare .cached header span { color:var(--vp-c-success-1); }
.kv-demo__rows,.kv-demo__cache { display:grid; gap:7px; margin-top:12px; }
.kv-demo__rows > div,.kv-demo__cache > div { display:flex; align-items:center; gap:4px; min-height:38px; }
.kv-demo__rows small,.kv-demo__cache small { width:62px; color:var(--vp-c-text-3); font-size:9px; }
.kv-demo__rows span,.kv-demo__cache span { display:grid; width:37px; height:34px; place-items:center; border:1px solid var(--vp-c-divider); border-radius:5px; color:var(--vp-c-text-2); background:var(--vp-c-bg); font-size:10px; }
.kv-demo__rows span.repeated { border-color:color-mix(in srgb,var(--vp-c-danger-1),transparent 55%); background:color-mix(in srgb,var(--vp-c-danger-1),transparent 93%); }
.kv-demo__cache span { border-color:color-mix(in srgb,var(--vp-c-brand-1),transparent 55%); }
.kv-demo__cache em { max-width:31px; overflow:hidden; color:var(--vp-c-text-3); font-size:7px; font-style:normal; text-overflow:ellipsis; }
.kv-demo__cache .query span { border-color:var(--vp-c-success-1); }
.kv-demo__cache .query i { color:var(--vp-c-text-2); font-size:9px; font-style:normal; }
.kv-demo__compare section > p { margin:12px 0 0; color:var(--vp-c-text-2); font-size:11px; }
.kv-demo__explanation { display:grid; grid-template-columns:minmax(220px,.8fr) minmax(0,1.2fr); gap:20px; padding:16px 20px; border-top:1px solid var(--vp-c-divider); }
.kv-demo__explanation strong,.kv-demo__explanation code { display:block; }
.kv-demo__explanation code { width:max-content; max-width:100%; margin-top:6px; padding:4px 7px; overflow:auto; color:var(--vp-c-brand-1); background:var(--vp-c-bg-soft); font-size:11px; }
.kv-demo__explanation p { margin:0; color:var(--vp-c-text-2); font-size:13px; }
.kv-demo__controls { padding:0 20px 18px; }
@media (prefers-reduced-motion: reduce) { .kv-demo * { transition:none !important; } }
@media (max-width:700px) { .kv-demo__prompt { overflow-x:auto; justify-content:start; } .kv-demo__compare,.kv-demo__explanation { grid-template-columns:1fr; } }
</style>
