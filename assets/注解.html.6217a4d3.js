import{_ as n}from"./_plugin-vue_export-helper.cdc0426e.js";import{o as s,c as a,d as e}from"./app.17fea3bf.js";const i={},t=e(`<h1 id="\u6CE8\u89E3" tabindex="-1"><a class="header-anchor" href="#\u6CE8\u89E3" aria-hidden="true">#</a> \u6CE8\u89E3</h1><div class="language-java ext-java line-numbers-mode"><pre class="language-java"><code><span class="token annotation punctuation">@MapperScan</span><span class="token punctuation">(</span><span class="token string">&quot;com/qingtuan/labelclocksystem/mapper&quot;</span><span class="token punctuation">)</span>
<span class="token comment">//\u4FEE\u9970Application\u4E3B\u7C7B\uFF0C\u63D0\u4F9Bmapper\u8DEF\u5F84</span>

<span class="token annotation punctuation">@RestController</span>
<span class="token comment">//Controller\u7C7B\uFF0C\u5B9A\u4E49\u8DEF\u7531\u8BBF\u95EE\u7684\u7C7B</span>

<span class="token annotation punctuation">@RequestMapping</span><span class="token punctuation">(</span><span class="token string">&quot;/api&quot;</span><span class="token punctuation">)</span>
<span class="token comment">//\u8BBE\u7F6E\u8DEF\u7531\u8BBF\u95EE\u7684\u8DEF\u5F84</span>
<span class="token comment">//\u7EC6\u5206\u4E3A@PostMapping\u7B49</span>

<span class="token annotation punctuation">@ResponseBody</span>
<span class="token comment">//\u8FD4\u56DEjson\u5BF9\u8C61\u7684body\u533A</span>

<span class="token annotation punctuation">@Autowired</span>
<span class="token comment">//\u4FEE\u9970\u6570\u636E\u6210\u5458\u4E3Abean</span>

<span class="token annotation punctuation">@Data</span>
<span class="token comment">//\u4FEE\u9970\u7C7B\uFF0C\u7ED9\u7C7B\u7684\u6570\u636E\u6210\u5458\u63D0\u4F9Bgetter,setter\u65B9\u6CD5</span>

<span class="token annotation punctuation">@AllArgsConstructor</span>
<span class="token comment">//\u4FEE\u9970\u7C7B\uFF0C\u7ED9\u7C7B\u63D0\u4F9B\u5168\u90E8\u53C2\u6570\u7684\u6784\u9020\u51FD\u6570</span>

<span class="token annotation punctuation">@NoArgsConstructor</span>
<span class="token comment">//\u4FEE\u9970\u7C7B\uFF0C\u7ED9\u7C7B\u63D0\u4F9B\u65E0\u53C2\u7684\u6784\u9020\u51FD\u6570</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,2),o=[t];function c(l,p){return s(),a("div",null,o)}const r=n(i,[["render",c],["__file","\u6CE8\u89E3.html.vue"]]);export{r as default};
