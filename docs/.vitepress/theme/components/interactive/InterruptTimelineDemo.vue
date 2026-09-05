<script setup lang="ts">
import { computed, ref } from "vue";
const blocked=ref(80), execution=ref(240), interference=ref(180), deadline=ref(1000);
const response=computed(()=>Math.max(0,blocked.value)+Math.max(0,execution.value)+Math.max(0,interference.value));
const margin=computed(()=>deadline.value-response.value);
const scale=computed(()=>100/Math.max(deadline.value,response.value,1));
function reset(){blocked.value=80;execution.value=240;interference.value=180;deadline.value=1000}
</script>
<template>
  <section class="timing-demo" aria-labelledby="timing-title">
    <header><div><strong id="timing-title">一次事件的最坏响应预算</strong><p>阻塞 B + 本路径 C + 高优先级干扰 I 必须不超过截止期 D。</p></div><button type="button" @click="reset">恢复基线</button></header>
    <div class="inputs"><label>阻塞 B <span><input v-model.number="blocked" type="number" min="0" max="3000" step="10"> μs</span></label><label>执行 C <span><input v-model.number="execution" type="number" min="0" max="3000" step="10"> μs</span></label><label>干扰 I <span><input v-model.number="interference" type="number" min="0" max="3000" step="10"> μs</span></label><label>截止期 D <span><input v-model.number="deadline" type="number" min="1" max="5000" step="100"> μs</span></label></div>
    <div class="timeline" aria-label="响应时间线"><div class="segment blocked" :style="{width:`${blocked*scale}%`}">B {{ blocked }}</div><div class="segment execution" :style="{width:`${execution*scale}%`}">C {{ execution }}</div><div class="segment interference" :style="{width:`${interference*scale}%`}">I {{ interference }}</div><span class="deadline" :style="{left:`${deadline*scale}%`}">D</span></div>
    <p class="result" :class="{late:margin<0}" aria-live="polite"><b>R = {{ response }} μs</b><span v-if="margin>=0">满足截止期，余量 {{ margin }} μs</span><span v-else>超期 {{ -margin }} μs</span></p>
  </section>
</template>
<style scoped>
.timing-demo{margin:1.2rem 0;border:1px solid var(--vp-c-divider);border-radius:16px;overflow:hidden;background:var(--vp-c-bg-soft)}header{display:flex;justify-content:space-between;align-items:center;padding:1rem 1.1rem;gap:1rem;border-bottom:1px solid var(--vp-c-divider)}header p{margin:.2rem 0 0;color:var(--vp-c-text-2);font-size:.85rem}button,input{border:1px solid var(--vp-c-divider);border-radius:7px;background:var(--vp-c-bg);color:var(--vp-c-text-1);padding:.35rem .55rem}.inputs{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:var(--vp-c-divider)}.inputs label{display:flex;flex-direction:column;gap:.3rem;padding:.75rem;background:var(--vp-c-bg)}.inputs input{width:5rem;text-align:right}.timeline{position:relative;display:flex;height:54px;margin:2rem 1.2rem 1rem;background:var(--vp-c-bg);border:1px solid var(--vp-c-divider);overflow:visible}.segment{display:grid;place-items:center;min-width:2px;overflow:hidden;color:#202228;font-size:.78rem}.blocked{background:#f0ba68}.execution{background:#79c77b}.interference{background:#83bdf1}.deadline{position:absolute;top:-16px;bottom:-10px;border-left:2px solid #df5a5a;color:#df5a5a;font-weight:700}.result{display:flex;justify-content:space-between;margin:0;padding:.9rem 1.1rem;border-top:1px solid var(--vp-c-divider);color:#25833b}.result.late{color:var(--vp-c-danger-1);background:var(--vp-c-danger-soft)}button{cursor:pointer}@media(max-width:650px){.inputs{grid-template-columns:repeat(2,1fr)}}
</style>
