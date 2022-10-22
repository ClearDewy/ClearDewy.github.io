import{_ as i}from"./_plugin-vue_export-helper.cdc0426e.js";import{o as n,c as e,d as l}from"./app.f03a64c8.js";const d={},s=l(`<h1 id="\u7EBF\u6027\u57FA" tabindex="-1"><a class="header-anchor" href="#\u7EBF\u6027\u57FA" aria-hidden="true">#</a> \u7EBF\u6027\u57FA</h1><div class="language-c++ ext-c++ line-numbers-mode"><pre class="language-c++"><code>void add(ll x)
{
    for(int i=60;i&gt;=0;i--)
    {
        if(x&amp;(1ll&lt;&lt;i))//\u6CE8\u610F\uFF0C\u5982\u679Ci\u5927\u4E8E31\uFF0C\u524D\u9762\u76841\u7684\u540E\u9762\u4E00\u5B9A\u8981\u52A0ll
        {
            if(d[i])x^=d[i];
            else
            {
                d[i]=x;
                break;//\u63D2\u5165\u6210\u529F\u5C31\u9000\u51FA
            }
        }
    }
}

ll mx_xor()
{
    ll anss=0;
    for(int i=60;i&gt;=0;i--)//\u8BB0\u5F97\u4ECE\u7EBF\u6027\u57FA\u7684\u6700\u9AD8\u4F4D\u5F00\u59CB
    if((anss^d[i])&gt;anss)anss^=d[i];
    return anss;
}

//\u6700\u5C0F\u503C\u4E3Ad[i]\u62160(\u6709\u6570\u5B57\u4E0D\u80FD\u63D2\u5165\u65F6)

void work()//\u5904\u7406\u7EBF\u6027\u57FA
{
	for(int i=1;i&lt;=60;i++)
	for(int j=1;j&lt;=i;j++)
	if(d[i]&amp;(1ll&lt;&lt;(j-1)))d[i]^=d[j-1];
}
ll k_th(ll k)
{
	if(k==1&amp;&amp;tot&lt;n)return 0;//\u7279\u5224\u4E00\u4E0B\uFF0C\u5047\u5982k=1\uFF0C\u5E76\u4E14\u539F\u6765\u7684\u5E8F\u5217\u53EF\u4EE5\u5F02\u6216\u51FA0\uFF0C\u5C31\u8981\u8FD4\u56DE0\uFF0Ctot\u8868\u793A\u7EBF\u6027\u57FA\u4E2D\u7684\u5143\u7D20\u4E2A\u6570\uFF0Cn\u8868\u793A\u5E8F\u5217\u957F\u5EA6
	if(tot&lt;n)k--;//\u7C7B\u4F3C\u4E0A\u9762\uFF0C\u53BB\u63890\u7684\u60C5\u51B5\uFF0C\u56E0\u4E3A\u7EBF\u6027\u57FA\u4E2D\u53EA\u80FD\u5F02\u6216\u51FA\u4E0D\u4E3A0\u7684\u89E3
	work();
	ll ans=0;
	for(int i=0;i&lt;=60;i++)
	if(d[i]!=0)
	{
		if(k%2==1)ans^=d[i];
		k/=2;
	}
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="" tabindex="-1"><a class="header-anchor" href="#" aria-hidden="true">#</a></h2>`,3),v=[s];function a(r,c){return n(),e("div",null,v)}const u=i(d,[["render",a],["__file","\u7EBF\u6027\u57FA.html.vue"]]);export{u as default};
