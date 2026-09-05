<script setup lang="ts">
import { computed, ref } from "vue";

const inputVoltage = ref(1.27);
const referenceVoltage = ref(3.3);
const bits = ref(10);
const lowMax = ref(0.8);
const highMin = ref(2.0);
const sampleCount = ref(9);

const safeReference = computed(() => Math.max(.1, Number(referenceVoltage.value) || .1));
const safeInput = computed(() => Number(inputVoltage.value) || 0);
const safeBits = computed(() => Math.min(16, Math.max(2, Math.round(Number(bits.value) || 2))));
const maxCode = computed(() => 2 ** safeBits.value - 1);
const clampedInput = computed(() => Math.min(safeReference.value, Math.max(0, safeInput.value)));
const code = computed(() => Math.round(clampedInput.value / safeReference.value * maxCode.value));
const lsbMv = computed(() => safeReference.value / maxCode.value * 1000);
const level = computed(() => {
  if (safeInput.value < 0 || safeInput.value > safeReference.value) return { name: "越界", tone: "danger" };
  if (safeInput.value <= lowMax.value) return { name: "LOW", tone: "low" };
  if (safeInput.value >= highMin.value) return { name: "HIGH", tone: "high" };
  return { name: "未定义区", tone: "unknown" };
});

const count = computed(() => Math.min(25, Math.max(3, Math.round(Number(sampleCount.value) || 3))));
const wavePoints = computed(() => Array.from({ length: 121 }, (_, index) => {
  const x = 12 + index / 120 * 576;
  const normalized = .5 + .38 * Math.sin(index / 120 * Math.PI * 4);
  const y = 174 - normalized * 140;
  return `${x.toFixed(1)},${y.toFixed(1)}`;
}).join(" "));
const samples = computed(() => Array.from({ length: count.value }, (_, index) => {
  const ratio = index / (count.value - 1);
  const normalized = .5 + .38 * Math.sin(ratio * Math.PI * 4);
  return { x: 12 + ratio * 576, y: 174 - normalized * 140, value: normalized * safeReference.value };
}));

function reset() {
  inputVoltage.value = 1.27;
  referenceVoltage.value = 3.3;
  bits.value = 10;
  lowMax.value = .8;
  highMin.value = 2.0;
  sampleCount.value = 9;
}
</script>

<template>
  <section class="sampling-demo" aria-labelledby="sampling-title">
    <header>
      <div><strong id="sampling-title">从真实电压到逻辑与 ADC 码</strong><p>阈值分类、幅度量化和时间采样是三件不同的事。</p></div>
      <button type="button" @click="reset">恢复基线</button>
    </header>

    <div class="pipeline">
      <label class="object input"><b>输入电压 Vin</b><span><input v-model.number="inputVoltage" type="number" min="-1" max="6" step="0.01" aria-label="输入电压"> V</span><small>真实引脚上的模拟量</small></label>
      <span class="arrow" aria-hidden="true">→</span>
      <div class="object logic" :data-tone="level.tone"><b>数字输入</b><output>{{ level.name }}</output><small>≤ {{ lowMax }} V / ≥ {{ highMin }} V</small></div>
      <span class="arrow" aria-hidden="true">+</span>
      <div class="object adc"><b>ADC</b><output>{{ code }} / {{ maxCode }}</output><small>LSB ≈ {{ lsbMv.toFixed(2) }} mV</small></div>
    </div>

    <div class="parameters">
      <label>LOW 上限 <span><input v-model.number="lowMax" type="number" min="0" :max="highMin" step="0.1"> V</span></label>
      <label>HIGH 下限 <span><input v-model.number="highMin" type="number" :min="lowMax" :max="referenceVoltage" step="0.1"> V</span></label>
      <label>ADC 参考 <span><input v-model.number="referenceVoltage" type="number" min="0.1" max="6" step="0.1"> V</span></label>
      <label>ADC 位数 <span><input v-model.number="bits" type="number" min="2" max="16" step="1"> bit</span></label>
    </div>

    <div class="wave-card">
      <div class="wave-title"><div><b>连续信号与离散采样点</b><small>线只是教学用连续输入；圆点才是 ADC 实际观察时刻。</small></div><label>采样点 <input v-model.number="sampleCount" type="number" min="3" max="25" step="2"></label></div>
      <svg viewBox="0 0 600 190" role="img" :aria-label="`连续波形上有 ${count} 个离散采样点`">
        <line x1="12" y1="174" x2="588" y2="174" class="axis" />
        <line x1="12" y1="20" x2="12" y2="174" class="axis" />
        <polyline :points="wavePoints" class="wave" />
        <g v-for="(sample, index) in samples" :key="index">
          <line :x1="sample.x" :y1="sample.y" :x2="sample.x" y2="174" class="stem" />
          <circle :cx="sample.x" :cy="sample.y" r="4.5" class="point" />
        </g>
        <text x="18" y="32">Vref</text><text x="560" y="187">时间</text>
      </svg>
    </div>

    <p v-if="safeInput < 0 || safeInput > safeReference" class="warning" role="alert">Vin 超出 0–Vref，ADC 码已按教学模型钳位；真实芯片还可能违反输入额定范围。</p>
    <p v-else class="summary" aria-live="polite">{{ safeInput.toFixed(2) }} V 被数字输入解释为“{{ level.name }}”，被 {{ safeBits }} 位 ADC 量化为 {{ code }}；两者使用同一物理输入，但回答不同问题。</p>
  </section>
</template>

<style scoped>
.sampling-demo { margin: 1.25rem 0; border: 1px solid var(--vp-c-divider); border-radius: 16px; overflow: hidden; background: var(--vp-c-bg-soft); }
header { display: flex; justify-content: space-between; align-items: center; gap: 1rem; padding: 1rem 1.1rem; border-bottom: 1px solid var(--vp-c-divider); }
header p { margin: .2rem 0 0; color: var(--vp-c-text-2); font-size: .86rem; }
button { border: 1px solid var(--vp-c-divider); border-radius: 8px; padding: .4rem .65rem; background: var(--vp-c-bg); color: var(--vp-c-text-1); cursor: pointer; }
.pipeline { display: grid; grid-template-columns: 1fr auto 1fr auto 1fr; gap: .7rem; align-items: center; padding: 1.1rem; }
.object { min-height: 105px; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: .35rem; border: 2px solid var(--vp-c-divider); border-radius: 12px; background: var(--vp-c-bg); text-align: center; }
.object input, .parameters input, .wave-title input { width: 4.8rem; padding: .25rem .35rem; border: 1px solid var(--vp-c-divider); border-radius: 6px; background: var(--vp-c-bg-soft); color: var(--vp-c-text-1); text-align: right; font: inherit; }
.object small { color: var(--vp-c-text-2); }
.input { border-color: #69b96b; }
.logic[data-tone="low"] { border-color: #4c9ded; }
.logic[data-tone="high"] { border-color: #69b96b; }
.logic[data-tone="unknown"] { border-color: #d49a45; }
.logic[data-tone="danger"] { border-color: #df5a5a; }
.adc { border-color: #a67ad8; }
.object output { font: 700 1.1rem ui-monospace, monospace; }
.arrow { color: var(--vp-c-text-2); font-weight: 800; }
.parameters { display: grid; grid-template-columns: repeat(4,1fr); gap: 1px; border-block: 1px solid var(--vp-c-divider); background: var(--vp-c-divider); }
.parameters label { display: flex; flex-direction: column; gap: .3rem; padding: .7rem .85rem; background: var(--vp-c-bg); font-size: .84rem; }
.wave-card { padding: 1rem 1.1rem .5rem; }
.wave-title { display: flex; justify-content: space-between; align-items: center; gap: 1rem; }
.wave-title div { display: flex; flex-direction: column; }
.wave-title small { color: var(--vp-c-text-2); }
svg { display: block; width: 100%; height: auto; margin-top: .5rem; color: var(--vp-c-text-2); }
.axis { stroke: var(--vp-c-divider); stroke-width: 1.5; }
.wave { fill: none; stroke: #4c9ded; stroke-width: 3; }
.stem { stroke: #a67ad8; stroke-width: 1; stroke-dasharray: 3 3; }
.point { fill: #a67ad8; stroke: var(--vp-c-bg); stroke-width: 2; }
svg text { fill: currentColor; font-size: 12px; }
.summary, .warning { margin: 0; padding: .85rem 1.1rem; border-top: 1px solid var(--vp-c-divider); }
.summary { color: var(--vp-c-text-2); }
.warning { color: var(--vp-c-danger-1); background: var(--vp-c-danger-soft); }
@media (max-width: 720px) {
  .pipeline { grid-template-columns: 1fr; }
  .arrow { transform: rotate(90deg); justify-self: center; }
  .parameters { grid-template-columns: repeat(2,1fr); }
  .wave-title { align-items: flex-start; flex-direction: column; }
}
</style>
