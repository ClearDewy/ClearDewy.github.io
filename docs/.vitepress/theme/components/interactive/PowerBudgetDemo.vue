<script setup lang="ts">
import { computed, reactive, ref } from "vue";
const vin=ref(5),vout=ref(3.3),rating=ref(500);
const loads=reactive([{name:"MCU",ma:70},{name:"传感器",ma:35},{name:"通信峰值",ma:180},{name:"LED/其他",ma:25}]);
const total=computed(()=>loads.reduce((sum,x)=>sum+Math.max(0,Number(x.ma)||0),0));
const margin=computed(()=>rating.value-total.value);
const dissipation=computed(()=>Math.max(0,vin.value-vout.value)*total.value/1000);
function reset(){vin.value=5;vout.value=3.3;rating.value=500;[70,35,180,25].forEach((v,i)=>loads[i].ma=v)}
</script>
<template>
 <section class="power-demo" aria-labelledby="power-title"><header><div><strong id="power-title">3.3 V 电源峰值预算</strong><p>直接改负载和稳压器参数；结果只表示理想电流与线性耗散。</p></div><button type="button" @click="reset">恢复基线</button></header>
 <div class="tree"><label class="rail">输入 <span><input v-model.number="vin" type="number" min="0" max="36" step=".1"> V</span></label><span>→</span><label class="rail regulator">线性稳压器 <span><input v-model.number="vout" type="number" min="0" :max="vin" step=".1"> V</span><small>额定 <input v-model.number="rating" type="number" min="1" max="5000" step="10"> mA</small></label><span>→</span><div class="loads"><label v-for="load in loads" :key="load.name">{{ load.name }} <span><input v-model.number="load.ma" type="number" min="0" max="3000" step="5"> mA</span></label></div></div>
 <div class="results"><span><small>总峰值</small><b>{{ total }} mA</b></span><span :class="{bad:margin<0}"><small>额定余量</small><b>{{ margin }} mA</b></span><span><small>近似稳压耗散</small><b>{{ dissipation.toFixed(2) }} W</b></span></div>
 <p :class="['summary',{bad:margin<0}]" aria-live="polite">{{ margin>=0?'电流额定值仍有余量；还需检查压差、瞬态、热和降额。':'总峰值超过额定值，设计不能通过。' }}</p></section>
</template>
<style scoped>
.power-demo{margin:1.2rem 0;border:1px solid var(--vp-c-divider);border-radius:16px;overflow:hidden;background:var(--vp-c-bg-soft)}header{display:flex;justify-content:space-between;align-items:center;padding:1rem 1.1rem;gap:1rem;border-bottom:1px solid var(--vp-c-divider)}header p{margin:.2rem 0 0;color:var(--vp-c-text-2);font-size:.85rem}button,input{border:1px solid var(--vp-c-divider);border-radius:7px;background:var(--vp-c-bg);color:var(--vp-c-text-1);padding:.32rem .5rem}button{cursor:pointer}.tree{display:grid;grid-template-columns:.7fr auto 1.1fr auto 1.5fr;gap:.6rem;align-items:center;padding:1rem}.rail,.loads{border:2px solid #69b96b;border-radius:11px;background:var(--vp-c-bg);padding:.8rem;display:flex;flex-direction:column;gap:.4rem}.regulator{border-color:#d49a45}.loads{border-color:#4c9ded}.loads label,.rail span,.rail small{display:flex;justify-content:space-between;align-items:center;gap:.5rem}.tree input{width:4.8rem;text-align:right}.results{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--vp-c-divider);border-top:1px solid var(--vp-c-divider)}.results span{display:flex;flex-direction:column;padding:.75rem 1rem;background:var(--vp-c-bg)}.results small{color:var(--vp-c-text-2)}.bad{color:var(--vp-c-danger-1)!important}.summary{margin:0;padding:.8rem 1rem;border-top:1px solid var(--vp-c-divider);color:var(--vp-c-text-2)}@media(max-width:720px){.tree{grid-template-columns:1fr}.tree>span{justify-self:center;transform:rotate(90deg)}.results{grid-template-columns:1fr}}
</style>
