<script setup lang="ts">
import { computed, ref } from "vue";
const a = ref(false), b = ref(false), q = ref(false), clocks = ref(0);
const sum = computed(() => a.value !== b.value);
const carry = computed(() => a.value && b.value);
function clock() { q.value = sum.value; clocks.value += 1; }
function reset() { a.value = false; b.value = false; q.value = false; clocks.value = 0; }
</script>

<template>
  <section class="logic-demo" aria-labelledby="logic-title">
    <header><div><strong id="logic-title">半加器与一位寄存器</strong><p>输入改变组合结果；只有时钟沿把 SUM 写入 Q。</p></div><button type="button" @click="reset">复位</button></header>
    <div class="flow">
      <fieldset><legend>当前输入</legend><label><input v-model="a" type="checkbox"> A = {{ Number(a) }}</label><label><input v-model="b" type="checkbox"> B = {{ Number(b) }}</label></fieldset>
      <span class="arrow">→</span>
      <div class="block"><b>组合逻辑</b><span>XOR → SUM = <strong>{{ Number(sum) }}</strong></span><span>AND → CARRY = <strong>{{ Number(carry) }}</strong></span></div>
      <span class="arrow">→</span>
      <div class="block register"><b>D 寄存器</b><span>D = {{ Number(sum) }}</span><span>Q = <strong>{{ Number(q) }}</strong></span></div>
    </div>
    <div class="controls"><button type="button" class="clock" @click="clock">↑ 产生时钟沿</button><span aria-live="polite">已提交 {{ clocks }} 次；当前两位和为 {{ Number(carry) }}{{ Number(sum) }}₂，Q 保存 {{ Number(q) }}</span></div>
  </section>
</template>

<style scoped>
.logic-demo{margin:1.2rem 0;border:1px solid var(--vp-c-divider);border-radius:16px;overflow:hidden;background:var(--vp-c-bg-soft)}
header{display:flex;justify-content:space-between;align-items:center;gap:1rem;padding:1rem 1.1rem;border-bottom:1px solid var(--vp-c-divider)}header p{margin:.2rem 0 0;color:var(--vp-c-text-2);font-size:.86rem}
button{border:1px solid var(--vp-c-divider);border-radius:8px;padding:.42rem .7rem;background:var(--vp-c-bg);color:var(--vp-c-text-1);cursor:pointer}.flow{display:grid;grid-template-columns:1fr auto 1.2fr auto 1fr;gap:.8rem;align-items:center;padding:1.2rem}
fieldset,.block{min-height:112px;border:2px solid #69b96b;border-radius:12px;background:var(--vp-c-bg);padding:.8rem;display:flex;flex-direction:column;justify-content:center;gap:.45rem}fieldset legend{font-weight:700}.block{border-color:#4c9ded}.register{border-color:#a67ad8}.block strong{font:700 1.1rem ui-monospace,monospace}.arrow{font-weight:800;color:var(--vp-c-text-2)}
.controls{display:flex;align-items:center;gap:1rem;padding:.85rem 1.1rem;border-top:1px solid var(--vp-c-divider);background:var(--vp-c-bg)}.clock{background:#3f424a;color:white;border-color:#3f424a}.controls span{color:var(--vp-c-text-2)}
@media(max-width:700px){.flow{grid-template-columns:1fr}.arrow{justify-self:center;transform:rotate(90deg)}.controls{align-items:flex-start;flex-direction:column}}
</style>
