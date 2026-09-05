<script setup lang="ts">
import { computed, ref } from "vue";
const steps = [
  ["复位向量", "CPU 取得栈顶与 Reset_Handler 地址"],
  ["初始化 RAM", "复制 .data，并清零 .bss"],
  ["进入 main", "C 运行环境已建立"],
  ["开启 GPIO 时钟", "外设寄存器获得工作时钟"],
  ["配置引脚", "选择 GPIO 输出模式与电气类型"],
  ["写输出寄存器", "输出锁存器保存目标位"],
  ["输出驱动", "驱动器按极性改变引脚电压"],
  ["物理测量", "仪表确认引脚与 LED 的真实状态"],
] as const;
const current = ref(0), activeLow = ref(false), outputBit = ref(1);
const pinHigh = computed(() => current.value >= 6 && outputBit.value === 1);
const ledOn = computed(() => current.value >= 7 && (activeLow.value ? !pinHigh.value : pinHigh.value));
function reset(){ current.value=0; activeLow.value=false; outputBit.value=1; }
</script>

<template>
  <section class="startup-demo" aria-labelledby="startup-title">
    <header><div><strong id="startup-title">从复位到引脚的证据链</strong><p>步骤完成只证明该层状态，不自动证明后续物理结果。</p></div><button type="button" @click="reset">重置</button></header>
    <div class="path">
      <template v-for="(item,index) in steps" :key="item[0]"><button type="button" class="stage" :class="{active:index===current,done:index<current}" @click="current=index"><small>{{ index+1 }}</small><b>{{ item[0] }}</b></button><span v-if="index<steps.length-1">→</span></template>
    </div>
    <div class="state">
      <div><small>当前发生</small><b>{{ steps[current][0] }}</b><p>{{ steps[current][1] }}</p></div>
      <label>输出位 <select v-model.number="outputBit"><option :value="0">0</option><option :value="1">1</option></select></label>
      <label><input v-model="activeLow" type="checkbox"> LED 低电平点亮</label>
      <div class="pin"><small>引脚</small><b>{{ pinHigh ? 'HIGH' : 'LOW / 尚未驱动' }}</b></div>
      <div class="led" :class="{on:ledOn}" role="img" :aria-label="ledOn?'LED 点亮':'LED 熄灭'">LED</div>
    </div>
    <footer><button type="button" :disabled="current===0" @click="current--">上一步</button><span aria-live="polite">{{ current+1 }} / {{ steps.length }}</span><button type="button" :disabled="current===steps.length-1" @click="current++">下一步</button></footer>
  </section>
</template>

<style scoped>
.startup-demo{margin:1.2rem 0;border:1px solid var(--vp-c-divider);border-radius:16px;overflow:hidden;background:var(--vp-c-bg-soft)}header{display:flex;justify-content:space-between;align-items:center;padding:1rem 1.1rem;gap:1rem;border-bottom:1px solid var(--vp-c-divider)}header p{margin:.2rem 0 0;color:var(--vp-c-text-2);font-size:.85rem}button,select{border:1px solid var(--vp-c-divider);border-radius:8px;background:var(--vp-c-bg);color:var(--vp-c-text-1);padding:.4rem .65rem}.path{display:flex;align-items:center;gap:.3rem;overflow:auto;padding:1rem}.stage{min-width:110px;display:flex;flex-direction:column;align-items:flex-start;opacity:.48}.stage.active{opacity:1;border-color:var(--vp-c-brand-1);box-shadow:0 0 0 2px var(--vp-c-brand-soft)}.stage.done{opacity:.8}.stage small{color:var(--vp-c-text-2)}.state{display:grid;grid-template-columns:1.5fr .7fr 1fr .8fr 64px;align-items:center;gap:1rem;padding:1rem 1.1rem;background:var(--vp-c-bg);border-block:1px solid var(--vp-c-divider)}.state>div:first-child{display:flex;flex-direction:column}.state p{margin:.15rem 0 0;color:var(--vp-c-text-2)}.pin{display:flex;flex-direction:column}.led{width:54px;height:54px;border-radius:50%;display:grid;place-items:center;background:#646872;color:white;font-size:.75rem}.led.on{background:#49b85a;box-shadow:0 0 20px #49b85a88}footer{display:flex;justify-content:center;align-items:center;gap:1rem;padding:.75rem}button{cursor:pointer}button:disabled{opacity:.4;cursor:not-allowed}@media(max-width:800px){.state{grid-template-columns:1fr 1fr}.state>div:first-child{grid-column:1/-1}}
</style>
