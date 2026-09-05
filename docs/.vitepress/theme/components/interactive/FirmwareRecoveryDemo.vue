<script setup lang="ts">
import { computed, ref } from "vue";
type Scenario="normal"|"invalid"|"timeout"|"repeated";
const scenario=ref<Scenario>("normal"),step=ref(0);
const paths:Record<Scenario,string[]>={normal:["稳定映像 A","写候选 B","校验通过","试运行 B","自检并确认","B 成为稳定映像"],invalid:["稳定映像 A","写候选 B","校验失败","丢弃 B","继续运行 A"],timeout:["稳定映像 A","候选 B 已校验","试运行 B","Watchdog 超时","记录失败原因","回滚并启动 A"],repeated:["启动映像","启动失败 #1","重试","启动失败 #2","重试","启动失败 #3","安全恢复模式"]};
const currentPath=computed(()=>paths[scenario.value]);const current=computed(()=>currentPath.value[Math.min(step.value,currentPath.value.length-1)]);
function change(){step.value=0}function reset(){scenario.value="normal";step.value=0}
</script>
<template>
 <section class="recovery-demo" aria-labelledby="recovery-title"><header><div><strong id="recovery-title">升级与启动恢复状态机</strong><p>每条故障路径都必须到达稳定、回滚或安全终态。</p></div><button type="button" @click="reset">重置</button></header>
 <div class="scenario"><label>注入场景 <select v-model="scenario" @change="change"><option value="normal">正常候选</option><option value="invalid">候选校验失败</option><option value="timeout">启动后超时</option><option value="repeated">连续启动失败</option></select></label><b aria-live="polite">当前：{{ current }}</b></div>
 <div class="path"><template v-for="(item,index) in currentPath" :key="item"><div :class="{active:index===step,done:index<step}"><small>{{ index+1 }}</small><b>{{ item }}</b></div><span v-if="index<currentPath.length-1">→</span></template></div>
 <footer><button type="button" :disabled="step===0" @click="step--">上一步</button><span>{{ step+1 }} / {{ currentPath.length }}</span><button type="button" :disabled="step===currentPath.length-1" @click="step++">下一步</button></footer></section>
</template>
<style scoped>
.recovery-demo{margin:1.2rem 0;border:1px solid var(--vp-c-divider);border-radius:16px;overflow:hidden;background:var(--vp-c-bg-soft)}header{display:flex;justify-content:space-between;align-items:center;padding:1rem 1.1rem;gap:1rem;border-bottom:1px solid var(--vp-c-divider)}header p{margin:.2rem 0 0;color:var(--vp-c-text-2);font-size:.85rem}button,select{border:1px solid var(--vp-c-divider);border-radius:8px;background:var(--vp-c-bg);color:var(--vp-c-text-1);padding:.4rem .65rem}button{cursor:pointer}button:disabled{opacity:.4}.scenario{display:flex;justify-content:space-between;gap:1rem;padding:.8rem 1rem;background:var(--vp-c-bg)}.path{display:flex;align-items:center;gap:.35rem;padding:1rem;overflow:auto;border-block:1px solid var(--vp-c-divider)}.path div{min-width:118px;min-height:70px;padding:.6rem;border:2px solid var(--vp-c-divider);border-radius:10px;background:var(--vp-c-bg);display:flex;flex-direction:column;opacity:.45}.path div.active{opacity:1;border-color:var(--vp-c-brand-1)}.path div.done{opacity:.8;border-color:#69b96b}.path small{color:var(--vp-c-text-2)}footer{display:flex;justify-content:center;align-items:center;gap:1rem;padding:.75rem}@media(max-width:600px){.scenario{flex-direction:column}}
</style>
