<script setup lang="ts">
import { computed, ref } from "vue";

type MeterMode = "resistor" | "led" | "source" | "current";

const source = ref(3.3);
const resistance = ref(330);
const ledDrop = ref(2.0);
const meterMode = ref<MeterMode>("resistor");
const reverseProbes = ref(false);
const circuitOpen = ref(false);

const safeSource = computed(() => Math.max(0, Number(source.value) || 0));
const safeResistance = computed(() => Math.max(1, Number(resistance.value) || 1));
const safeLedDrop = computed(() => Math.max(0, Number(ledDrop.value) || 0));
const resistorVoltage = computed(() => circuitOpen.value ? 0 : Math.max(0, safeSource.value - safeLedDrop.value));
const currentA = computed(() => circuitOpen.value ? 0 : resistorVoltage.value / safeResistance.value);
const resistorPower = computed(() => resistorVoltage.value * currentA.value);
const ledPower = computed(() => Math.min(safeLedDrop.value, safeSource.value) * currentA.value);
const nodeB = computed(() => circuitOpen.value ? safeSource.value : Math.min(safeLedDrop.value, safeSource.value));

const meter = computed(() => {
  const polarity = reverseProbes.value ? -1 : 1;
  if (meterMode.value === "current") return { value: currentA.value * 1000, unit: "mA", label: "支路电流" };
  if (meterMode.value === "led") return { value: polarity * nodeB.value, unit: "V", label: "LED 两端" };
  if (meterMode.value === "source") return { value: polarity * safeSource.value, unit: "V", label: "电源两端" };
  return { value: polarity * resistorVoltage.value, unit: "V", label: "电阻两端" };
});

const condition = computed(() => {
  if (circuitOpen.value) return "回路断开：没有持续支路电流。";
  if (safeSource.value <= safeLedDrop.value) return "电源没有超过教学 LED 压降，模型中的电流为 0。";
  if (currentA.value > 0.02) return "教学警告：电流超过 20 mA，真实器件必须查额定值。";
  return "闭合回路：同一电流依次流过电阻与 LED。";
});

function reset() {
  source.value = 3.3;
  resistance.value = 330;
  ledDrop.value = 2.0;
  meterMode.value = "resistor";
  reverseProbes.value = false;
  circuitOpen.value = false;
}
</script>

<template>
  <section class="circuit-demo" aria-labelledby="circuit-demo-title">
    <header>
      <div>
        <strong id="circuit-demo-title">低压 LED 串联回路</strong>
        <p>直接修改器件参数，再选择仪表要测的对象。</p>
      </div>
      <button type="button" class="reset" @click="reset">恢复基线</button>
    </header>

    <div class="circuit" :class="{ open: circuitOpen }">
      <label class="part source">
        <span>电源</span>
        <span><input v-model.number="source" type="number" min="0" max="24" step="0.1" aria-label="电源电压"> V</span>
        <small>节点 A = {{ safeSource.toFixed(2) }} V</small>
      </label>
      <span class="wire" aria-hidden="true">──→</span>
      <label class="part resistor">
        <span>限流电阻 R</span>
        <span><input v-model.number="resistance" type="number" min="1" max="100000" step="10" aria-label="电阻值"> Ω</span>
        <small>压降 {{ resistorVoltage.toFixed(2) }} V</small>
      </label>
      <span class="wire" aria-hidden="true">──→</span>
      <label class="part led">
        <span>LED 近似压降</span>
        <span><input v-model.number="ledDrop" type="number" min="0" max="12" step="0.1" aria-label="LED 近似压降"> V</span>
        <small>节点 B = {{ nodeB.toFixed(2) }} V</small>
      </label>
      <span class="wire" aria-hidden="true">──→</span>
      <div class="part ground"><span>GND</span><b>0 V</b><small>参考与回流</small></div>
    </div>

    <label class="switch"><input v-model="circuitOpen" type="checkbox"> 断开回路</label>

    <div class="meter-panel">
      <div class="meter" aria-live="polite">
        <small>{{ meterMode === 'current' ? '串联电流表' : '并联电压表' }} · {{ meter.label }}</small>
        <output>{{ meter.value.toFixed(2) }} <span>{{ meter.unit }}</span></output>
        <span v-if="reverseProbes && meterMode !== 'current'" class="probe">红黑表笔已交换</span>
      </div>
      <fieldset>
        <legend>测量对象</legend>
        <label><input v-model="meterMode" type="radio" value="resistor"> 电阻压降</label>
        <label><input v-model="meterMode" type="radio" value="led"> LED 压降</label>
        <label><input v-model="meterMode" type="radio" value="source"> 电源电压</label>
        <label><input v-model="meterMode" type="radio" value="current"> 支路电流</label>
        <label v-if="meterMode !== 'current'"><input v-model="reverseProbes" type="checkbox"> 交换表笔</label>
      </fieldset>
    </div>

    <div class="results">
      <span><small>支路电流</small><b>{{ (currentA * 1000).toFixed(2) }} mA</b></span>
      <span><small>电阻功率</small><b>{{ (resistorPower * 1000).toFixed(2) }} mW</b></span>
      <span><small>LED 功率</small><b>{{ (ledPower * 1000).toFixed(2) }} mW</b></span>
    </div>
    <p class="condition">{{ condition }}</p>
  </section>
</template>

<style scoped>
.circuit-demo { margin: 1.25rem 0; border: 1px solid var(--vp-c-divider); border-radius: 16px; overflow: hidden; background: var(--vp-c-bg-soft); }
header { display: flex; justify-content: space-between; gap: 1rem; align-items: center; padding: 1rem 1.1rem; border-bottom: 1px solid var(--vp-c-divider); }
header strong { font-size: 1rem; }
header p { margin: .2rem 0 0; color: var(--vp-c-text-2); font-size: .86rem; }
button { border: 1px solid var(--vp-c-divider); border-radius: 8px; padding: .4rem .65rem; background: var(--vp-c-bg); color: var(--vp-c-text-1); cursor: pointer; }
.circuit { display: grid; grid-template-columns: minmax(125px,1fr) auto minmax(145px,1fr) auto minmax(145px,1fr) auto minmax(105px,.7fr); align-items: center; padding: 1.3rem 1rem .8rem; }
.part { min-height: 104px; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: .3rem; border: 2px solid var(--vp-c-divider); border-radius: 12px; background: var(--vp-c-bg); text-align: center; }
.part > span:first-child { font-weight: 700; }
.part small { color: var(--vp-c-text-2); }
.source { border-color: #69b96b; }
.resistor { border-color: #d49a45; }
.led { border-color: #4c9ded; }
.ground { border-color: #8b8f99; }
.wire { color: var(--vp-c-text-2); font-weight: 700; letter-spacing: -.08em; }
.open .wire { opacity: .25; text-decoration: line-through; }
input[type="number"] { width: 5rem; padding: .26rem .35rem; border: 1px solid var(--vp-c-divider); border-radius: 6px; background: var(--vp-c-bg-soft); color: var(--vp-c-text-1); font: inherit; text-align: right; }
.switch { display: block; width: fit-content; margin: .2rem auto 1rem; }
.meter-panel { display: grid; grid-template-columns: minmax(210px,.8fr) 1.4fr; gap: 1rem; padding: 1rem; border-top: 1px solid var(--vp-c-divider); background: var(--vp-c-bg); }
.meter { border: 2px solid #50545d; border-radius: 12px; padding: .8rem 1rem; background: #272a30; color: #f4f5f7; display: flex; flex-direction: column; }
.meter output { margin: .25rem 0; font: 700 1.75rem/1.2 ui-monospace, monospace; color: #8ee59a; }
.meter output span { font-size: .9rem; }
.meter small, .probe { color: #c9ccd2; }
fieldset { border: 0; padding: 0; display: flex; flex-wrap: wrap; gap: .55rem 1rem; align-content: center; }
legend { width: 100%; margin-bottom: .45rem; font-weight: 700; }
fieldset label { white-space: nowrap; }
.results { display: grid; grid-template-columns: repeat(3,1fr); gap: 1px; background: var(--vp-c-divider); border-top: 1px solid var(--vp-c-divider); }
.results span { display: flex; flex-direction: column; padding: .75rem 1rem; background: var(--vp-c-bg-soft); }
.results small { color: var(--vp-c-text-2); }
.condition { margin: 0; padding: .8rem 1rem; border-top: 1px solid var(--vp-c-divider); color: var(--vp-c-text-2); }
@media (max-width: 760px) {
  .circuit { grid-template-columns: 1fr; gap: .45rem; }
  .wire { transform: rotate(90deg); }
  .meter-panel { grid-template-columns: 1fr; }
  .results { grid-template-columns: 1fr; }
}
</style>
