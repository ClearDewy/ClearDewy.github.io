import{_ as n}from"./_plugin-vue_export-helper.cdc0426e.js";import{o as s,c as a,d as t}from"./app.17fea3bf.js";const e={},p=t(`<h1 id="vue-router\u8DEF\u7531" tabindex="-1"><a class="header-anchor" href="#vue-router\u8DEF\u7531" aria-hidden="true">#</a> vue-router\u8DEF\u7531</h1><div class="language-typescript ext-ts line-numbers-mode"><pre class="language-typescript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> createRouter<span class="token punctuation">,</span> createWebHistory<span class="token punctuation">,</span> RouteRecordRaw <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;vue-router&#39;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> defineAsyncComponent <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;vue&#39;</span>

<span class="token keyword">const</span> routes<span class="token operator">:</span> <span class="token builtin">Array</span><span class="token operator">&lt;</span>RouteRecordRaw<span class="token operator">&gt;</span> <span class="token operator">=</span> <span class="token punctuation">[</span>
    <span class="token punctuation">{</span>
        path<span class="token operator">:</span> <span class="token string">&#39;/&#39;</span><span class="token punctuation">,</span>
        redirect<span class="token operator">:</span> <span class="token string">&#39;/home&#39;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">{</span>
        path<span class="token operator">:</span> <span class="token string">&#39;/home&#39;</span><span class="token punctuation">,</span>
        name<span class="token operator">:</span> <span class="token string">&#39;Home&#39;</span><span class="token punctuation">,</span>
        component<span class="token operator">:</span> <span class="token function">defineAsyncComponent</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token keyword">import</span><span class="token punctuation">(</span><span class="token string">&#39;../components/Home.vue&#39;</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">{</span>
        path<span class="token operator">:</span> <span class="token string">&#39;/counttime&#39;</span><span class="token punctuation">,</span>
        name<span class="token operator">:</span> <span class="token string">&#39;CountTime&#39;</span><span class="token punctuation">,</span>
        component<span class="token operator">:</span> <span class="token function">defineAsyncComponent</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
            <span class="token function-variable function">loader</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token keyword">import</span><span class="token punctuation">(</span><span class="token string">&#39;../components/CountTime.vue&#39;</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
            delay<span class="token operator">:</span> <span class="token number">200</span><span class="token punctuation">,</span>
            timeout<span class="token operator">:</span> <span class="token number">3000</span>
        <span class="token punctuation">}</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">]</span>

<span class="token keyword">const</span> router <span class="token operator">=</span> <span class="token function">createRouter</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
    history<span class="token operator">:</span> <span class="token function">createWebHistory</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
    routes
<span class="token punctuation">}</span><span class="token punctuation">)</span>

<span class="token keyword">export</span> <span class="token keyword">default</span> router
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,2),o=[p];function c(i,l){return s(),a("div",null,o)}const k=n(e,[["render",c],["__file","vue-router\u8DEF\u7531.html.vue"]]);export{k as default};
