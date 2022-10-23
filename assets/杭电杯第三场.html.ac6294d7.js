import{_ as l}from"./_plugin-vue_export-helper.cdc0426e.js";import{o as a,c as t,a as n,b as i,e as d,d as e,r}from"./app.17fea3bf.js";const c={},m={id:"\u676D\u7535\u676F\u7B2C\u4E09\u573A-md",tabindex:"-1"},v=n("a",{class:"header-anchor",href:"#\u676D\u7535\u676F\u7B2C\u4E09\u573A-md","aria-hidden":"true"},"#",-1),u={href:"http://xn--ehqx7tornia347o2ni.md",target:"_blank",rel:"noopener noreferrer"},o=e(`<p><em>\u4E2A\u4EBA\u9898\u89E3\uFF0C\u6B22\u8FCE\u6307\u6B63</em></p><p><em>\u9898\u76EE\u53D8\u5F97\u597D\u96BE\uFF0C\u6211\u4E5F\u4E00\u76F4\u5728\u63A8A\u9898\uFF0C\u8FD8\u6CA1\u63A8\u51FA\u6765\uFF0C\u6700\u540E\u4E00\u4E2A\u591A\u5C0F\u65F6\u6765\u770BP1009\uFF0C\u8FD8\u597D\u5199\u51FA\u6765\u4E86</em></p><h1 id="p1003" tabindex="-1"><a class="header-anchor" href="#p1003" aria-hidden="true">#</a> P1003</h1><h2 id="\u601D\u8DEF" tabindex="-1"><a class="header-anchor" href="#\u601D\u8DEF" aria-hidden="true">#</a> \u601D\u8DEF\uFF1A</h2><p>\u7B7E\u5230\u9898</p><h2 id="code" tabindex="-1"><a class="header-anchor" href="#code" aria-hidden="true">#</a> Code\uFF1A</h2><div class="language-c++ ext-c++ line-numbers-mode"><pre class="language-c++"><code>#include&lt;bits/stdc++.h&gt;

using namespace std;

typedef long long ll;
typedef pair&lt;int,int&gt; pii;

#define IOS ios::sync_with_stdio(false),cin.tie(nullptr),cout.tie(nullptr)
#define lowbit(x)   ((x)&amp;(-x))
#define fi first
#define se second
#define pb push_back
#define cf(_) int _;cin &gt;&gt; _;while(_--)

template &lt;typename T&gt; bool chkMax(T &amp;x, T y) { return (y &gt; x) ? x = y, 1 : 0; }
template &lt;typename T&gt; bool chkMin(T &amp;x, T y) { return (y &lt; x) ? x = y, 1 : 0; }

template &lt;typename T&gt; void inline read(T &amp;x) {
    int f = 1; x = 0; char c = getchar();
    while (c &lt; &#39;0&#39; || c &gt; &#39;9&#39;) { if (c == &#39;-&#39;) f = -1; c = getchar(); }
    while (c &lt;= &#39;9&#39; &amp;&amp; c &gt;= &#39;0&#39;) x = (x &lt;&lt; 1) + (x &lt;&lt; 3) + (c ^ 48), c = getchar();
    x *= f;
}

int main()
{
    
    int T;
    cin &gt;&gt; T;
    getchar();
    while(T--)
    {
        
        string s;

        getline(cin,s);
        string ans;
        bool flag = false;
        // cout &lt;&lt; s &lt;&lt; endl;
        for(int i = 0;i &lt; s.size();i++)
        {
            if(!i) ans.pb(s[i]);
            else
            {
                // cout &lt;&lt; s[i] ;
                if(s[i] == &#39; &#39;) {
                    flag = true;
                    continue;
                }
                if(flag)
                {
                    // cout &lt;&lt; s[i];
                    ans.pb(s[i]);
                    flag = false;
                }
            } 
        }
        for(int i = 0;i &lt; ans.size();i++)
        {
            cout &lt;&lt; char(ans[i] - 32);
        }
        cout &lt;&lt; endl;
    }
    return 0;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="p1009" tabindex="-1"><a class="header-anchor" href="#p1009" aria-hidden="true">#</a> P1009</h1><h2 id="\u601D\u8DEF-1" tabindex="-1"><a class="header-anchor" href="#\u601D\u8DEF-1" aria-hidden="true">#</a> \u601D\u8DEF\uFF1A</h2>`,9),h=n("p",null,[i("\u5C06"),n("span",{class:"katex"},[n("span",{class:"katex-mathml"},[n("math",{xmlns:"http://www.w3.org/1998/Math/MathML"},[n("semantics",null,[n("mrow",null,[n("mi",null,"l"),n("mo",{separator:"true"},","),n("mi",null,"r")]),n("annotation",{encoding:"application/x-tex"},"l,r")])])]),n("span",{class:"katex-html","aria-hidden":"true"},[n("span",{class:"base"},[n("span",{class:"strut",style:{height:"0.8889em","vertical-align":"-0.1944em"}}),n("span",{class:"mord mathnormal",style:{"margin-right":"0.01968em"}},"l"),n("span",{class:"mpunct"},","),n("span",{class:"mspace",style:{"margin-right":"0.1667em"}}),n("span",{class:"mord mathnormal",style:{"margin-right":"0.02778em"}},"r")])])]),i("\u6392\u5E8F\u540E\u5F00\u59CB\u904D\u5386\uFF0C\u8BA9\u5F00\u59CB\u7684"),n("span",{class:"katex"},[n("span",{class:"katex-mathml"},[n("math",{xmlns:"http://www.w3.org/1998/Math/MathML"},[n("semantics",null,[n("mrow",null,[n("mi",null,"R")]),n("annotation",{encoding:"application/x-tex"},"R")])])]),n("span",{class:"katex-html","aria-hidden":"true"},[n("span",{class:"base"},[n("span",{class:"strut",style:{height:"0.6833em"}}),n("span",{class:"mord mathnormal",style:{"margin-right":"0.00773em"}},"R")])])]),i("\u4E3A\u7B2C\u4E00\u4E2A"),n("span",{class:"katex"},[n("span",{class:"katex-mathml"},[n("math",{xmlns:"http://www.w3.org/1998/Math/MathML"},[n("semantics",null,[n("mrow",null,[n("mi",null,"r")]),n("annotation",{encoding:"application/x-tex"},"r")])])]),n("span",{class:"katex-html","aria-hidden":"true"},[n("span",{class:"base"},[n("span",{class:"strut",style:{height:"0.4306em"}}),n("span",{class:"mord mathnormal",style:{"margin-right":"0.02778em"}},"r")])])]),i(",\u7136\u540E\u5C06"),n("span",{class:"katex"},[n("span",{class:"katex-mathml"},[n("math",{xmlns:"http://www.w3.org/1998/Math/MathML"},[n("semantics",null,[n("mrow",null,[n("mi",null,"l")]),n("annotation",{encoding:"application/x-tex"},"l")])])]),n("span",{class:"katex-html","aria-hidden":"true"},[n("span",{class:"base"},[n("span",{class:"strut",style:{height:"0.6944em"}}),n("span",{class:"mord mathnormal",style:{"margin-right":"0.01968em"}},"l")])])]),i("\u5C0F\u4E8E"),n("span",{class:"katex"},[n("span",{class:"katex-mathml"},[n("math",{xmlns:"http://www.w3.org/1998/Math/MathML"},[n("semantics",null,[n("mrow",null,[n("mi",null,"R")]),n("annotation",{encoding:"application/x-tex"},"R")])])]),n("span",{class:"katex-html","aria-hidden":"true"},[n("span",{class:"base"},[n("span",{class:"strut",style:{height:"0.6833em"}}),n("span",{class:"mord mathnormal",style:{"margin-right":"0.00773em"}},"R")])])]),i("\u7684\u6570\u90FD\u52A0\u5165\u4E00\u4E2A\u4F18\u5148\u961F\u5217\u4E2D\uFF0C\u540C\u65F6\u5C06"),n("span",{class:"katex"},[n("span",{class:"katex-mathml"},[n("math",{xmlns:"http://www.w3.org/1998/Math/MathML"},[n("semantics",null,[n("mrow",null,[n("mi",null,"R")]),n("annotation",{encoding:"application/x-tex"},"R")])])]),n("span",{class:"katex-html","aria-hidden":"true"},[n("span",{class:"base"},[n("span",{class:"strut",style:{height:"0.6833em"}}),n("span",{class:"mord mathnormal",style:{"margin-right":"0.00773em"}},"R")])])]),i("\u66F4\u65B0\u4E3A\u5F53\u524D\u961F\u5217\u4E2D\u6700\u5C0F\u7684"),n("span",{class:"katex"},[n("span",{class:"katex-mathml"},[n("math",{xmlns:"http://www.w3.org/1998/Math/MathML"},[n("semantics",null,[n("mrow",null,[n("mi",null,"r")]),n("annotation",{encoding:"application/x-tex"},"r")])])]),n("span",{class:"katex-html","aria-hidden":"true"},[n("span",{class:"base"},[n("span",{class:"strut",style:{height:"0.4306em"}}),n("span",{class:"mord mathnormal",style:{"margin-right":"0.02778em"}},"r")])])]),i(",\u7136\u540E\u5C06\u6570\u636E\u5F39\u51FA\uFF0C\u8981\u4E48\u961F\u5217\u4E3A\u7A7A\uFF0C\u8981\u4E48\u5269\u4F59\u5E26\u7684\u5FEB\u9012\u6570\u91CF\u4E3A"),n("span",{class:"katex"},[n("span",{class:"katex-mathml"},[n("math",{xmlns:"http://www.w3.org/1998/Math/MathML"},[n("semantics",null,[n("mrow",null,[n("mn",null,"0")]),n("annotation",{encoding:"application/x-tex"},"0")])])]),n("span",{class:"katex-html","aria-hidden":"true"},[n("span",{class:"base"},[n("span",{class:"strut",style:{height:"0.6444em"}}),n("span",{class:"mord"},"0")])])]),i("\u3002")],-1),p=e(`<h2 id="code-1" tabindex="-1"><a class="header-anchor" href="#code-1" aria-hidden="true">#</a> Code\uFF1A</h2><div class="language-c++ ext-c++ line-numbers-mode"><pre class="language-c++"><code>#include&lt;bits/stdc++.h&gt;
#define ll long long
#define ull unsigned long long
#define WA return 0;
#define ptn putchar(&#39;\\n&#39;)
using namespace std;

inline ll read() { ll x = 0, z = 1; char c = getchar(); while (!isdigit(c)) { if (c == &#39;-&#39;)z = -1; c = getchar(); }while (isdigit(c)) { x = (x &lt;&lt; 1) + (x &lt;&lt; 3) + (c ^ 48); c = getchar(); }return z * x; }
inline void writ(ll x) { if (x &lt; 0) { putchar(&#39;-&#39;); x = (~x) + 1; }if (x &gt; 9)writ(x / 10); putchar(x - x / 10 * 10 + 48); }

#define pii pair&lt;int,int&gt;
const ll INF = 1e18+7;


void Qingtuan() {
    int n = read(), k = read();
    priority_queue&lt;pii,vector&lt;pii&gt;,greater&lt;pii&gt;&gt;pq;			//\u6539\u4E3A\u6570\u7EC4\u6392\u5E8F\u4E5F\u53EF
    pii t;
    for (int i = 1; i &lt;= n; i++)
    {
        t.first = read(); t.second = read();
        pq.push(t);
    }
    priority_queue&lt;int,vector&lt;int&gt;,greater&lt;int&gt;&gt;p;
    int res=0;
    int r;
    int m;
    while (!p.empty()||!pq.empty())
    {
        m=k;
        if(p.empty()){
            t=pq.top();
            r=t.second;
        }else{
            r=p.top();
        }
        while (!pq.empty())
        {
            t=pq.top();
            if(t.first&lt;=r){
                pq.pop();p.push(t.second);
                r=min(r,t.second);
            }else{
                break;
            }
        }
        
        while (!p.empty()&amp;&amp;m)
        {
            p.pop();m--;
        }
        res++;
    }
    writ(res); ptn;
}



int main() {
    //cin.tie(nullptr)-&gt;sync_with_stdio(false);
    //freopen(&quot;data.in&quot;, &quot;r&quot;, stdin);freopen(&quot;data1.out&quot;, &quot;w&quot;, stdout);

    int T = read(); while (T--)
        Qingtuan();
    WA
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,2);function b(g,x){const s=r("ExternalLinkIcon");return a(),t("div",null,[n("h1",m,[v,i(),n("a",u,[i("\u676D\u7535\u676F\u7B2C\u4E09\u573A.md"),d(s)])]),o,h,p])}const _=l(c,[["render",b],["__file","\u676D\u7535\u676F\u7B2C\u4E09\u573A.html.vue"]]);export{_ as default};
