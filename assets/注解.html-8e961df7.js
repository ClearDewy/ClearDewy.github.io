import{_ as n,W as s,X as a,$ as e}from"./framework-731319f0.js";const i={},t=e(`<h1 id="注解" tabindex="-1"><a class="header-anchor" href="#注解" aria-hidden="true">#</a> 注解</h1><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token annotation punctuation">@MapperScan</span><span class="token punctuation">(</span><span class="token string">&quot;com/qingtuan/labelclocksystem/mapper&quot;</span><span class="token punctuation">)</span>
<span class="token comment">//修饰Application主类，提供mapper路径</span>

<span class="token annotation punctuation">@RestController</span>
<span class="token comment">//Controller类，定义路由访问的类</span>

<span class="token annotation punctuation">@RequestMapping</span><span class="token punctuation">(</span><span class="token string">&quot;/api&quot;</span><span class="token punctuation">)</span>
<span class="token comment">//设置路由访问的路径</span>
<span class="token comment">//细分为@PostMapping等</span>

<span class="token annotation punctuation">@ResponseBody</span>
<span class="token comment">//返回json对象的body区</span>

<span class="token annotation punctuation">@Autowired</span>
<span class="token comment">//修饰数据成员为bean</span>

<span class="token annotation punctuation">@Data</span>
<span class="token comment">//修饰类，给类的数据成员提供getter,setter方法</span>

<span class="token annotation punctuation">@AllArgsConstructor</span>
<span class="token comment">//修饰类，给类提供全部参数的构造函数</span>

<span class="token annotation punctuation">@NoArgsConstructor</span>
<span class="token comment">//修饰类，给类提供无参的构造函数</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,2),o=[t];function c(l,p){return s(),a("div",null,o)}const u=n(i,[["render",c],["__file","注解.html.vue"]]);export{u as default};
