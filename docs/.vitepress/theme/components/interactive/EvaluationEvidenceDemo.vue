<script setup lang="ts">
import { computed, ref } from "vue";
const scenario=ref('知识问答');const current=ref(0);
const layers=[
 {name:'单元不变量',evidence:'shape、mask、序列化、引用解析',cannot:'不能证明用户任务成功'},
 {name:'模型离线',evidence:'固定 Prompt 的正确性、校准、鲁棒性',cannot:'不能证明检索和工具正确'},
 {name:'系统离线',evidence:'端到端答案、证据、延迟、成本',cannot:'不能证明线上分布长期稳定'},
 {name:'小流量在线',evidence:'真实任务成功、反馈、回退与副作用',cannot:'不能自动解释因果'},
 {name:'运行监控',evidence:'分布漂移、错误、延迟、事件趋势',cannot:'不能替代版本化评测'}
];
const active=computed(()=>layers[current.value]);
</script>
<template><figure class="interactive-card eval-demo">
 <figcaption><span>一项上线结论需要哪几层证据</span><label>场景 <select v-model="scenario"><option>知识问答</option><option>内容分类</option><option>工具执行</option></select></label></figcaption>
 <ol><li v-for="(item,index) in layers" :key="item.name"><button type="button" :class="{active:index===current,complete:index<current}" @click="current=index"><small>{{ index+1 }}</small>{{ item.name }}</button></li></ol>
 <section aria-live="polite"><div><small>当前场景</small><strong>{{ scenario }} · {{ active.name }}</strong></div><p><b>能提供：</b>{{ active.evidence }}</p><p><b>仍不能单独证明：</b>{{ active.cannot }}</p></section>
 <div class="interactive-controls"><button class="secondary" type="button" :disabled="current===0" @click="current--">上一步</button><button class="secondary" type="button" :disabled="current===layers.length-1" @click="current++">下一步</button><span>{{ current+1 }} / {{ layers.length }}</span></div>
 <p class="interactive-fallback">静态结论：单元测试、模型离线、系统离线、小流量在线和运行监控回答不同问题，任何一层都不能独自证明系统长期可靠。</p>
</figure></template>
<style scoped>
.eval-demo>figcaption{display:flex;justify-content:space-between;gap:12px}.eval-demo select{margin-left:6px;border:1px solid var(--vp-c-divider);border-radius:6px;color:var(--vp-c-text-1);background:var(--vp-c-bg)}.eval-demo>ol{display:grid;grid-template-columns:repeat(5,1fr);gap:5px;margin:0;padding:14px 18px;list-style:none}.eval-demo>ol li{margin:0}.eval-demo>ol button{display:grid;width:100%;gap:3px;padding:8px 4px;border:1px solid var(--vp-c-divider);border-radius:7px;color:var(--vp-c-text-2);background:var(--vp-c-bg);cursor:pointer;font-size:10px}.eval-demo>ol button.active{color:#fff;background:#3f3f46}.eval-demo>ol button.complete{border-color:var(--vp-c-brand-1)}.eval-demo>ol small{font-size:9px}.eval-demo>section{display:grid;grid-template-columns:.7fr 1fr 1fr;gap:14px;padding:20px;border-block:1px solid var(--vp-c-divider);background:var(--vp-c-bg-soft)}.eval-demo>section p{margin:0;color:var(--vp-c-text-2);font-size:12px}.eval-demo>section small{display:block;color:var(--vp-c-text-3);font-size:9px}.eval-demo>.interactive-controls{padding:14px 18px}@media(max-width:700px){.eval-demo>ol{grid-template-columns:repeat(2,1fr)}.eval-demo>section{grid-template-columns:1fr}}
</style>
