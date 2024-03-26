import{_ as n,W as s,X as a,$ as e}from"./framework-731319f0.js";const i={},p=e(`<h1 id="pcg技术栈-大数据平台方向" tabindex="-1"><a class="header-anchor" href="#pcg技术栈-大数据平台方向" aria-hidden="true">#</a> pcg技术栈 大数据平台方向</h1><p>1、团队比赛中主要是起什么作用，写的什么题？</p><p>就是基础题签到题，dbug</p><p>2、那来写两道题吧</p><ul><li><p>给定一个字符串s，一个字符串t，找出在s中覆盖t中字符的的最短字符串（包括字符类型以及数量）</p><p>例如：s=“ABDCDDADDC” t=“ACB” 答案为：“ABDC”</p><p>我的解法：双指针 滑动窗口</p></li><li><p>给定一个整数n，选出集合中的一个数，将他拆成两个不等于1的因子，然后放进集合中。请问先后手怎么样胜出</p><p>我的解法：以为是博弈论，其实是质因子拆解</p></li></ul><p>3、线性筛 埃氏筛，复杂度</p><p>4、三个代码问题</p><ul><li><div class="language-go line-numbers-mode" data-ext="go"><pre class="language-go"><code>v<span class="token operator">:=</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token builtin">int</span><span class="token punctuation">{</span><span class="token number">1</span><span class="token punctuation">,</span><span class="token number">2</span><span class="token punctuation">,</span><span class="token number">3</span><span class="token punctuation">}</span>

<span class="token keyword">for</span> i<span class="token operator">:=</span><span class="token keyword">range</span> v<span class="token punctuation">{</span>
    v<span class="token operator">=</span><span class="token function">append</span><span class="token punctuation">(</span>v<span class="token punctuation">,</span>i<span class="token punctuation">)</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这个循环会停止吗</p></li><li><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>string s=&quot;1111111&quot;
for(int i=0;i&lt;strlen(s.c_str()));++i){
    cout&lt;&lt;s[i]&lt;&lt;endl;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这个算法有什么问题吗</p></li><li><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>vector&lt;string&gt;ve{
    &quot;test1&quot;,
    &quot;test2&quot;,
    &quot;test3&quot;,
};

string ans=&quot;&quot;;
for(auto&amp; i:ve){
    ans=ans+i;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这样写有什么问题吗</p></li></ul><p>5、MySQL 事务，什么是可重复读，怎么实现</p><p>6、什么是聚簇索引，非聚簇索引，最大区别是什么，他们数据怎么存的</p><p>7、什么是联合索引，怎么实现，如果联合索引为cde ，怎么存的</p><p>8、Go 和c++区别（内存，编译，速度，并发方面）</p><p>9、Redis 的数据结构有哪些</p><p>10、Zset 底层</p><p>11、使用缓存时遇到过什么问题</p><p>12、如果先更改数据库后更改缓存你觉得会有问题吗，什么问题。如果AB两个线程同时更改，会造成什么问题，从mysql和redis两个地方分开答。</p><p>13、缓存穿透，击穿，雪崩，怎么解决</p><ol start="14"><li>redis 是否支持原子性，支持事务吗？是单线程还是多线程</li></ol><p>反问：部门是干什么的，为什么算法这么看重</p><p>回答：因为我是打acm的，部门其他人没时间，只能我来面，比较看重算法，中台部门，多方都有涉及</p>`,20),l=[p];function t(c,d){return s(),a("div",null,l)}const u=n(i,[["render",t],["__file","pcg技术栈 大数据平台方向.html.vue"]]);export{u as default};
