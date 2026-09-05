<script setup lang="ts">
import { computed, ref } from "vue";
const current = ref(0);
const stages = [
 {short:'预训练',title:'连续文本的每个有效位置都提供 next-token 目标',formula:'L = −Σ log p(token[t+1] | token[≤t])',note:'模型学习数据分布，但没有单独区分“用户要求”和“理想回答”。'},
 {short:'SFT',title:'Prompt 可见，通常只对 Assistant 回答计分',formula:'L = −Σ assistant_mask[t] · log p(label[t])',note:'Chat Template 决定角色边界；loss mask 决定哪段行为被模仿。'},
 {short:'偏好',title:'同一 Prompt 下提高 chosen 相对 rejected 的概率',formula:'Δ = logπ(chosen|x) − logπ(rejected|x)',note:'偏好目标使用成对响应，不是把 rejected 当作普通 next-token 标签。'}
];
const tokens = [
 {text:'<user>',role:'结构'},{text:'2+3?',role:'Prompt'},{text:'</user>',role:'结构'},
 {text:'<assistant>',role:'结构'},{text:'5',role:'回答'},{text:'</assistant>',role:'结构'}
];
const stage = computed(()=>stages[current.value]);
function inLoss(index:number){ return current.value===0 || (current.value===1 && index>=4); }
</script>
<template>
 <figure class="interactive-card objective-demo">
  <figcaption>同一任务在预训练、SFT 与偏好优化中怎样形成目标</figcaption>
  <ol><li v-for="(item,index) in stages" :key="item.short"><button type="button" :class="{active:index===current}" @click="current=index">{{ item.short }}</button></li></ol>
  <div class="objective-demo__body">
   <div v-if="current<2" class="objective-demo__tokens">
    <span v-for="(token,index) in tokens" :key="index" :class="{loss:inLoss(index)}"><small>{{ token.role }}</small>{{ token.text }}<b>{{ inLoss(index) ? '计入 loss' : '仅作上下文' }}</b></span>
   </div>
   <div v-else class="objective-demo__preference">
    <article><small>同一个 Prompt</small><strong>2 + 3 等于多少？</strong></article>
    <article class="chosen"><small>chosen</small><strong>5</strong><span>提高相对 log-prob</span></article>
    <article class="rejected"><small>rejected</small><strong>6</strong><span>降低相对优势</span></article>
   </div>
  </div>
  <section><div><strong>{{ stage.title }}</strong><code>{{ stage.formula }}</code></div><p>{{ stage.note }}</p></section>
  <p class="interactive-fallback">静态结论：预训练对连续文本有效位置做 next-token；SFT 让 Prompt 作为可见上下文而通常只对 Assistant 段计分；偏好优化比较同一 Prompt 下 chosen 与 rejected 的相对概率。</p>
 </figure>
</template>
<style scoped>
.objective-demo>ol{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin:0;padding:14px 18px;list-style:none}.objective-demo>ol li{margin:0}.objective-demo>ol button{width:100%;padding:8px;border:1px solid var(--vp-c-divider);border-radius:7px;color:var(--vp-c-text-2);background:var(--vp-c-bg);cursor:pointer}.objective-demo>ol button.active{border-color:#3f3f46;color:#fff;background:#3f3f46;font-weight:700}.objective-demo__body{padding:22px;border-block:1px solid var(--vp-c-divider);background:var(--vp-c-bg-soft)}.objective-demo__tokens{display:flex;flex-wrap:wrap;gap:8px}.objective-demo__tokens span,.objective-demo__preference article{display:grid;gap:3px;padding:10px;border:1px solid var(--vp-c-divider);border-radius:8px;background:var(--vp-c-bg)}.objective-demo__tokens span.loss{border-color:var(--vp-c-brand-1);background:color-mix(in srgb,var(--vp-c-brand-1),transparent 92%)}.objective-demo small{color:var(--vp-c-text-3);font-size:9px}.objective-demo__tokens b{color:var(--vp-c-text-3);font-size:9px}.objective-demo__tokens .loss b{color:var(--vp-c-brand-1)}.objective-demo__preference{display:grid;grid-template-columns:1.2fr 1fr 1fr;gap:10px}.objective-demo__preference .chosen{border-color:var(--vp-c-success-1)}.objective-demo__preference .rejected{border-color:var(--vp-c-danger-1)}.objective-demo__preference span{color:var(--vp-c-text-2);font-size:10px}.objective-demo>section{display:grid;grid-template-columns:.8fr 1.2fr;gap:20px;padding:16px 20px}.objective-demo>section strong,.objective-demo>section code{display:block}.objective-demo>section code{margin-top:6px;color:var(--vp-c-brand-1);font-size:11px}.objective-demo>section p{margin:0;color:var(--vp-c-text-2);font-size:13px}@media(max-width:650px){.objective-demo__preference,.objective-demo>section{grid-template-columns:1fr}}
</style>
