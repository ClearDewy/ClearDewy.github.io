<script setup lang="ts">
import { computed, ref } from "vue";
type Scenario='success'|'timeout'|'approval';
const scenario=ref<Scenario>('success');const current=ref(0);
const flows:Record<Scenario,{state:string,event:string,owner:string,note:string}[]>={
 success:[{state:'READY',event:'用户目标已验证',owner:'Harness',note:'建立任务 ID 与预算。'},{state:'DECIDING',event:'模型提出 search(query)',owner:'Model',note:'这里只是候选动作。'},{state:'VALIDATING',event:'schema 与只读权限通过',owner:'Harness',note:'确定性校验。'},{state:'RUNNING',event:'工具返回文档',owner:'Tool',note:'执行结果带来源。'},{state:'OBSERVING',event:'写入 observation',owner:'Harness',note:'外部内容按不可信数据处理。'},{state:'COMPLETED',event:'模型给出带引用回答',owner:'Harness',note:'输出校验后终止。'}],
 timeout:[{state:'READY',event:'目标已验证',owner:'Harness',note:'重试预算=1。'},{state:'RUNNING',event:'工具调用开始',owner:'Tool',note:'附带 invocation_id。'},{state:'RETRY_WAIT',event:'超时且未产生副作用',owner:'Harness',note:'记录第一次失败。'},{state:'RUNNING',event:'使用同一幂等键重试',owner:'Tool',note:'不创建重复动作。'},{state:'FAILED',event:'再次超时，预算耗尽',owner:'Harness',note:'终止并返回可恢复错误。'}],
 approval:[{state:'READY',event:'用户请求修改日历',owner:'Harness',note:'识别为有副作用动作。'},{state:'DECIDING',event:'模型提出 calendar.create',owner:'Model',note:'尚未执行。'},{state:'WAITING_APPROVAL',event:'展示精确时间和标题',owner:'Harness',note:'等待用户明确确认。'},{state:'RUNNING',event:'审批后携幂等键执行',owner:'Tool',note:'权限与参数再次校验。'},{state:'COMPLETED',event:'记录 event_id 与结果',owner:'Harness',note:'可以审计和补偿。'}]
};
const steps=computed(()=>flows[scenario.value]);const step=computed(()=>steps.value[current.value]);
function change(){current.value=0}
</script>
<template><figure class="interactive-card agent-demo">
 <figcaption><span>同一个 Agent Loop 在成功、超时和审批路径中的状态闭环</span><label>场景 <select v-model="scenario" @change="change"><option value="success">只读成功</option><option value="timeout">工具超时</option><option value="approval">写入审批</option></select></label></figcaption>
 <ol><li v-for="(item,index) in steps" :key="index"><button type="button" :class="{active:index===current,complete:index<current}" @click="current=index"><small>{{ index+1 }}</small>{{ item.state }}</button></li></ol>
 <section aria-live="polite"><div><small>当前事件</small><strong>{{ step.event }}</strong></div><div><small>状态 owner</small><strong>{{ step.owner }}</strong></div><p>{{ step.note }}</p></section>
 <div class="interactive-controls"><button class="secondary" type="button" :disabled="current===0" @click="current--">上一步</button><button class="secondary" type="button" :disabled="current===steps.length-1" @click="current++">下一步</button><button class="secondary" type="button" @click="current=0">重置路径</button><span>{{ current+1 }} / {{ steps.length }}</span></div>
 <p class="interactive-fallback">静态结论：模型只提出动作；Harness 验证 schema、权限、预算、审批并持有状态；工具执行产生带身份的 observation；每条成功、失败、等待与取消路径都有终止状态。</p>
</figure></template>
<style scoped>
.agent-demo>figcaption{display:flex;justify-content:space-between;gap:12px}.agent-demo select{margin-left:6px;border:1px solid var(--vp-c-divider);border-radius:6px;color:var(--vp-c-text-1);background:var(--vp-c-bg)}.agent-demo>ol{display:flex;gap:5px;margin:0;padding:14px 18px;overflow-x:auto;list-style:none}.agent-demo>ol li{min-width:110px;margin:0;flex:1}.agent-demo>ol button{display:grid;width:100%;gap:3px;padding:8px;border:1px solid var(--vp-c-divider);border-radius:7px;color:var(--vp-c-text-2);background:var(--vp-c-bg);cursor:pointer;font-size:10px}.agent-demo>ol button.active{color:#fff;background:#3f3f46}.agent-demo>ol button.complete{border-color:var(--vp-c-brand-1)}.agent-demo>ol small,.agent-demo>section small{color:var(--vp-c-text-3);font-size:9px}.agent-demo>section{display:grid;grid-template-columns:1fr .5fr 1fr;gap:16px;padding:20px;border-block:1px solid var(--vp-c-divider);background:var(--vp-c-bg-soft)}.agent-demo>section strong{display:block}.agent-demo>section p{margin:0;color:var(--vp-c-text-2);font-size:12px}.agent-demo>.interactive-controls{padding:14px 18px}@media(max-width:650px){.agent-demo>section{grid-template-columns:1fr}}
</style>
