import{_ as l}from"./_plugin-vue_export-helper.cdc0426e.js";import{o as e,c as s,a as n,b as i,d as a}from"./app.b553a681.js";const d={},t=n("h1",{id:"ntt",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#ntt","aria-hidden":"true"},"#"),i(" NTT")],-1),v=n("p",null,[i("\u5E38\u89C1\u6A21\u6570\u539F\u6839:"),n("span",{class:"katex"},[n("span",{class:"katex-mathml"},[n("math",{xmlns:"http://www.w3.org/1998/Math/MathML"},[n("semantics",null,[n("mrow",null,[n("mn",null,"998244353"),n("mo",{separator:"true"},","),n("mn",null,"1004535809"),n("mo",{separator:"true"},","),n("mn",null,"469762049")]),n("annotation",{encoding:"application/x-tex"},"998244353,1004535809,469762049")])])]),n("span",{class:"katex-html","aria-hidden":"true"},[n("span",{class:"base"},[n("span",{class:"strut",style:{height:"0.8389em","vertical-align":"-0.1944em"}}),n("span",{class:"mord"},"998244353"),n("span",{class:"mpunct"},","),n("span",{class:"mspace",style:{"margin-right":"0.1667em"}}),n("span",{class:"mord"},"1004535809"),n("span",{class:"mpunct"},","),n("span",{class:"mspace",style:{"margin-right":"0.1667em"}}),n("span",{class:"mord"},"469762049")])])]),i(",\u539F\u6839\u5747\u4E3A"),n("span",{class:"katex"},[n("span",{class:"katex-mathml"},[n("math",{xmlns:"http://www.w3.org/1998/Math/MathML"},[n("semantics",null,[n("mrow",null,[n("mn",null,"3")]),n("annotation",{encoding:"application/x-tex"},"3")])])]),n("span",{class:"katex-html","aria-hidden":"true"},[n("span",{class:"base"},[n("span",{class:"strut",style:{height:"0.6444em"}}),n("span",{class:"mord"},"3")])])])],-1),r=a(`<div class="language-c++ ext-c++ line-numbers-mode"><pre class="language-c++"><code>const int FN=(1&lt;&lt;22)+1,g=3,gi=332748118, mod = 998244353;
ll a[FN],b[FN];
int n,m,rev[FN];

inline ll fp(ll x, ll y) {
    ll base = 1;
    while (y){
        if (y&amp;1)base =base*x%mod;
        x=x*x%mod;y &gt;&gt;= 1;
    }
    return base;
}

int NTT(){
    function&lt;int(int)&gt;pg=[&amp;](int x)-&gt;int{
        x |= x &gt;&gt; 1;x |= x &gt;&gt; 2;x |= x &gt;&gt; 4;x |= x &gt;&gt; 8;x |= x &gt;&gt; 16;return x + 1;
    };
    int len=pg(m+n);
    function&lt;void(ll*,int)&gt;ntt=[&amp;](ll*a,int typ)-&gt;void{
        for (int i = 0; i &lt; len; i++)
            if(i&lt;rev[i])swap(a[i],a[rev[i]]);
        ll x,y;
        for (int i = 1; i &lt; len; i&lt;&lt;=1)
        {
            ll gn=fp(~typ?g:gi,(mod-1)/(i&lt;&lt;1));
            for (int j = 0; j &lt; len; j+=(i&lt;&lt;1)){
                ll g0=1;
                for (int k = 0; k &lt; i; k++,g0=g0*gn%mod)
                {
                    x = a[j + k]; y = g0 * a[i + j + k] % mod;
                    a[j + k] = (x + y) % mod;
                    a[i + j + k] = (x - y + mod) % mod;
                }
            }
        }
    };
    for (int i = 0; i &lt; len; i++)
        rev[i]=(rev[i&gt;&gt;1]&gt;&gt;1)|(i&amp;1)*(pg(m+n)&gt;&gt;1);
    ntt(a,1);ntt(b,1);
    for (int i = 0; i &lt;= len; i++)
        a[i] = a[i] * b[i] % mod; 
    ntt(a,-1);
    //\u7B54\u6848\u4E3A a[i]*inv(len)%mod

    return len;
}
void Qingtuan(){
    n=read();m=read();
    for (int i = 0; i &lt;= n; i++)
    {
        a[i]=read();
    }
    for (int i = 0; i &lt;= m; i++)
    {
        b[i]=read();
    }
    int inv=fp(NTT(),mod-2);
    for (int i = 0; i &lt;= m+n; i++)
    {
        printf(&quot;%lld &quot;,a[i]*inv%mod);
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,1),m=[t,v,r];function c(u,o){return e(),s("div",null,m)}const g=l(d,[["render",c],["__file","NTT.html.vue"]]);export{g as default};
