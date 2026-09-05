<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from "vue";

type Step = {
  short: string;
  title: string;
  formula: string;
  note: string;
  mixes: string;
  tokenStates: string[];
};

const tokens = ["我", "爱", "猫"];
const steps: Step[] = [
  { short: "输入", title: "词元表示加位置信息", formula: "h⁰ᵢ = embedding(tokenᵢ) + positionᵢ", note: "三个 token 都用 C 维向量表示；位置信息让相同 token 出现在不同位置时可被区分。", mixes: "不混合 token", tokenStates: ["词义 + 位置1", "词义 + 位置2", "词义 + 位置3"] },
  { short: "Norm 1", title: "进入注意力前先归一化", formula: "nᵢ = Norm(hˡᵢ)", note: "pre-norm 在每个 token 的特征维上调整尺度，shape 保持 [B,T,C]。", mixes: "不混合 token", tokenStates: ["Norm(h₁)", "Norm(h₂)", "Norm(h₃)"] },
  { short: "Attention", title: "因果注意力跨位置读取信息", formula: "aᵢ = CausalAttention(nᵢ, n≤ᵢ)", note: "位置 1 只能读自己；位置 2 可读 1–2；位置 3 可读 1–3。此处才发生 token 间通信。", mixes: "混合允许访问的 token", tokenStates: ["读取 1", "读取 1–2", "读取 1–3"] },
  { short: "Residual 1", title: "保留旧表示并加入注意力结果", formula: "uᵢ = hˡᵢ + aᵢ", note: "残差不是拼接，而是同 shape 逐元素相加；原表示拥有一条绕过子层的短路径。", mixes: "合并旧表示与上下文", tokenStates: ["h₁ + a₁", "h₂ + a₂", "h₃ + a₃"] },
  { short: "Norm 2", title: "进入 FFN 前再次归一化", formula: "mᵢ = Norm(uᵢ)", note: "第二个子层拥有独立 normalization 参数，再次保持 [B,T,C]。", mixes: "不新增 token 混合", tokenStates: ["Norm(u₁)", "Norm(u₂)", "Norm(u₃)"] },
  { short: "FFN", title: "同一个 MLP 独立变换每个 token", formula: "fᵢ = W₂ φ(W₁mᵢ+b₁)+b₂", note: "FFN 参数在全部位置共享，但每个位置独立计算；中间维通常先扩张再投回 C。", mixes: "不混合 token", tokenStates: ["FFN(m₁)", "FFN(m₂)", "FFN(m₃)"] },
  { short: "Residual 2", title: "加入 FFN 结果得到 Block 输出", formula: "hˡ⁺¹ᵢ = uᵢ + fᵢ", note: "第二次 residual 后 shape 仍为 [B,T,C]，可以直接送入下一个 Block。", mixes: "合并 u 与逐位置特征", tokenStates: ["h¹₁", "h¹₂", "h¹₃"] },
  { short: "下一层", title: "重复通信与逐位置变换", formula: "hˡ⁺¹ → next Block / final norm / logits", note: "堆叠多个 Block 后，最后位置的表示经输出头产生下一个 token 的 logits。", mixes: "进入下一层", tokenStates: ["上下文化表示 1", "上下文化表示 2", "用于预测下一 token"] },
];

const current = ref(0);
const playing = ref(false);
let timer: ReturnType<typeof setInterval> | undefined;
const stage = computed(() => steps[current.value]);
function stop() { playing.value = false; if (timer) clearInterval(timer); timer = undefined; }
function go(index: number) { current.value = Math.max(0, Math.min(steps.length - 1, index)); }
function play() {
  if (playing.value) return stop();
  if (current.value === steps.length - 1) current.value = 0;
  playing.value = true;
  timer = setInterval(() => current.value === steps.length - 1 ? stop() : current.value += 1, 1700);
}
function reset() { stop(); current.value = 0; }
onBeforeUnmount(stop);
</script>

<template>
  <figure class="interactive-card transformer-block-demo">
    <figcaption>Pre-Norm Decoder Block：通信、残差与逐位置变换</figcaption>
    <ol class="transformer-block-demo__progress" aria-label="Decoder Block 步骤">
      <li v-for="(item, index) in steps" :key="item.short">
        <button type="button" :class="{ active: index === current, complete: index < current }" :aria-label="`步骤 ${index + 1}：${item.title}`" :aria-current="index === current ? 'step' : undefined" @click="go(index)">
          <span>{{ index + 1 }}</span>{{ item.short }}
        </button>
      </li>
    </ol>

    <section class="transformer-block-demo__body" aria-live="polite">
      <header><small>步骤 {{ current + 1 }}</small><h3>{{ stage.title }}</h3><code>{{ stage.formula }}</code><p>{{ stage.note }}</p></header>
      <div class="transformer-block-demo__tokens">
        <article v-for="(token, index) in tokens" :key="token">
          <span>位置 {{ index + 1 }}</span>
          <strong>{{ token }}</strong>
          <code>{{ stage.tokenStates[index] }}</code>
        </article>
      </div>
      <div class="transformer-block-demo__facts">
        <span><b>Shape</b>[B,T,C] → [B,T,C]</span>
        <span><b>位置关系</b>{{ stage.mixes }}</span>
      </div>
    </section>

    <div class="interactive-controls">
      <button type="button" class="secondary" :disabled="current === 0" @click="go(current - 1)">上一步</button>
      <button type="button" :disabled="current === steps.length - 1" @click="go(current + 1)">下一步</button>
      <button type="button" class="secondary" @click="play">{{ playing ? "暂停" : "播放" }}</button>
      <button type="button" class="secondary" @click="reset">重置</button>
      <span>步骤 {{ current + 1 }} / {{ steps.length }}</span>
    </div>
    <p class="transformer-block-demo__fallback interactive-fallback">静态路径：`x → Norm → causal attention → +x → Norm → FFN → +residual`。attention 跨 token 通信，FFN 对每个 token 独立变换。</p>
  </figure>
</template>

<style scoped>
.transformer-block-demo__progress { display: grid; grid-template-columns: repeat(8,minmax(0,1fr)); gap: 5px; margin: 0; padding: 16px; list-style: none; }
.transformer-block-demo__progress li { margin: 0; }
.transformer-block-demo__progress button { width: 100%; padding: 7px 2px; border: 1px solid var(--vp-c-divider); border-radius: 8px; color: var(--vp-c-text-2); background: var(--vp-c-bg); cursor: pointer; font-size: 10px; }
.transformer-block-demo__progress button span { display: block; margin-bottom: 2px; font-weight: 700; }
.transformer-block-demo__progress button.complete { border-color: color-mix(in srgb,var(--vp-c-brand-1),transparent 55%); background: color-mix(in srgb,var(--vp-c-brand-1),transparent 94%); }
.transformer-block-demo__progress button.active { border-color: var(--vp-c-brand-1); color: white; background: var(--vp-c-brand-1); }
.transformer-block-demo__body { padding: 22px 20px; border-top: 1px solid var(--vp-c-divider); border-bottom: 1px solid var(--vp-c-divider); background: var(--vp-c-bg-soft); }
.transformer-block-demo__body header { min-height: 140px; }
.transformer-block-demo__body header small { color: var(--vp-c-brand-1); font-weight: 700; }
.transformer-block-demo__body h3 { margin: 4px 0 10px; padding: 0; border: 0; font-size: 19px; }
.transformer-block-demo__body header p { margin: 10px 0; color: var(--vp-c-text-2); }
.transformer-block-demo__tokens { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; }
.transformer-block-demo__tokens article { display: grid; min-height: 118px; padding: 12px; place-items: center; border: 1px solid var(--vp-c-divider); border-radius: 11px; background: var(--vp-c-bg); text-align: center; }
.transformer-block-demo__tokens span { color: var(--vp-c-text-2); font-size: 11px; }
.transformer-block-demo__tokens strong { display: grid; width: 34px; height: 34px; place-items: center; border-radius: 50%; color: white; background: var(--vp-c-brand-1); }
.transformer-block-demo__tokens code { color: var(--vp-c-text-1); font-size: 12px; white-space: normal; }
.transformer-block-demo__facts { display: grid; grid-template-columns: repeat(2,1fr); gap: 10px; margin-top: 12px; }
.transformer-block-demo__facts span { padding: 9px 11px; border-radius: 8px; color: var(--vp-c-text-2); background: var(--vp-c-bg); font-size: 12px; }
.transformer-block-demo__facts b { margin-right: 8px; color: var(--vp-c-text-1); }
.transformer-block-demo__fallback { margin: 0; padding: 0 16px 16px; color: var(--vp-c-text-2); font-size: 13px; }
.interactive-controls button:disabled { cursor: not-allowed; opacity: .45; }
@media (max-width: 700px) { .transformer-block-demo__progress { grid-template-columns: repeat(4,1fr); } .transformer-block-demo__tokens, .transformer-block-demo__facts { grid-template-columns: 1fr; } }
</style>
