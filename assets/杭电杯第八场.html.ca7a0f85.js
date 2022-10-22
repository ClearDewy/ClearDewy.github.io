import{_ as i}from"./_plugin-vue_export-helper.cdc0426e.js";import{o as n,c as e,d as l}from"./app.b553a681.js";const d={},s=l(`<p>\u676D\u7535\u676F\u7B2C\u516B\u573A</p><p><em>\u4E2A\u4EBA\u9898\u89E3\uFF0C\u6B22\u8FCE\u6307\u6B63</em></p><h1 id="p1001" tabindex="-1"><a class="header-anchor" href="#p1001" aria-hidden="true">#</a> P1001</h1><h2 id="\u601D\u8DEF" tabindex="-1"><a class="header-anchor" href="#\u601D\u8DEF" aria-hidden="true">#</a> \u601D\u8DEF\uFF1A</h2><p>\u5947\u6570\u4F4D\u548C\u5076\u6570\u4E3A\u6392\u5E8F\u540E\u4EA4\u9519\u8F93\u51FA\u5373\u53EF</p><h2 id="code" tabindex="-1"><a class="header-anchor" href="#code" aria-hidden="true">#</a> Code\uFF1A</h2><div class="language-c++ ext-c++ line-numbers-mode"><pre class="language-c++"><code>#include&lt;bits/stdc++.h&gt;
#define ll long long
#define ptn putchar(&#39;\\n&#39;)
using namespace std;

inline ll read() {ll x = 0, z = 1;char c = getchar();while (!isdigit(c)) {if (c == &#39;-&#39;)z = -1;c = getchar();}while (isdigit(c)) {x = (x &lt;&lt; 1) + (x &lt;&lt; 3) + (c ^ 48);c = getchar();}return z * x;}
inline void writ(ll x){if(x&lt;0) {putchar(&#39;-&#39;);x=(~x)+1;}if(x&gt;9)writ(x/10);putchar(x-x/10*10+48);}
const int N=1e5+5;
string s;
char c[2][N];
int d[2];

void Qingtuan(){
    cin&gt;&gt;s;d[1]=d[0]=0;
    for (int i = 0; i &lt; s.size(); i++)
    {
        c[i&amp;1][++d[i&amp;1]]=s[i];
    }
    sort(c[0]+1,c[0]+d[0]+1);
    sort(c[1]+1,c[1]+d[1]+1);
    for (int i = 1; i &lt;= d[1]; i++)
    {
        putchar(c[0][i]);putchar(c[1][i]);
    }
    if(d[0]&gt;d[1])putchar(c[0][d[0]]);
    ptn;

}



int main(){
    //cin.tie(nullptr)-&gt;sync_with_stdio(false);

    int T=read();while (T--)
    Qingtuan();
    return 0;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="p1004" tabindex="-1"><a class="header-anchor" href="#p1004" aria-hidden="true">#</a> P1004</h1><p>\u7B7E\u5230\u9898</p><div class="language-c++ ext-c++ line-numbers-mode"><pre class="language-c++"><code>#include&lt;bits/stdc++.h&gt;
#define ll long long
#define ptn putchar(&#39;\\n&#39;)
using namespace std;

inline ll read() {ll x ;scanf(&quot;%lld&quot;,&amp;x);return x;}
inline void writ(ll x){printf(&quot;%lld&quot;,x);}


int n;

void Qingtuan(){
    n=read();
    printf(&quot;%d\\n&quot;,2*n);


}



int main(){
    //cin.tie(nullptr)-&gt;sync_with_stdio(false);

    int T=read();while (T--)
    Qingtuan();
    return 0;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="p1005" tabindex="-1"><a class="header-anchor" href="#p1005" aria-hidden="true">#</a> P1005</h1><p>\u9010\u6B65\u5411\u540E\u5904\u7406\uFF0C\u5229\u7528\u5904\u7406\u8FC7\u7684\u8282\u70B9\u8FDB\u884C\u201C\u8DF3\u8DC3\u201D\uFF0C\u5F97\u5230\u7531\u6BCF\u4E2A\u70B9\u51FA\u53D1\u7684\u5DE6\u53F3\u8FB9\u754C\uFF0C\u6700\u540E\u5224\u65AD\u5373\u53EF</p><div class="language-c++ ext-c++ line-numbers-mode"><pre class="language-c++"><code>#include&lt;bits/stdc++.h&gt;
#define ll long long
#define ptn putchar(&#39;\\n&#39;)
using namespace std;

inline ll read() {ll x = 0;scanf(&quot;%lld&quot;,&amp;x);return x;};
inline void writ(ll x){printf(&quot;%lld&quot;,x);}

#define pii pair&lt;int,int&gt;


void Qingtuan(){
    int n=read(),m=read();
    vector&lt;pii&gt;a(n+2);
    vector&lt;set&lt;int&gt;&gt;pri(n+1);
    vector&lt;int&gt;e(n+1);
    e[0]=e[n]=1e9+7;a[n+1]={n+1,n+1};
    int x,y;
    for (int i = 1; i &lt;= n; i++)
    {
        a[i]={i,i};
        x=read();
        for (int j = 2; j &lt;= x/j; j++)
        {
            if(x%j)continue;
            pri[i].insert(j);
            while (!(x%j))x/=j;
        }
        if(x&gt;1)pri[i].insert(x);
    }
    for (int i = 1; i &lt; n; i++)
    {
        e[i]=read();
    }
    for (int i = 1; i &lt;= n; i++)
    {
        int l=i-1,r;
        while (l&amp;&amp;pri[i].count(e[l]))
        {
            pri[i].insert(pri[l].begin(),pri[l].end());
            a[i].first=a[l].first;
            a[i].second=max(a[i].second,a[l].second);
            l=a[i].first-1;
        }
        r=a[i].second;
        while (pri[i].count(e[r]))
        {
            r++;
            pri[i].insert(pri[r].begin(),pri[r].end());
            a[i].second=r;
            while (l&amp;&amp;pri[i].count(e[l]))
            {
                pri[i].insert(pri[l].begin(),pri[l].end());
                a[i].first=a[l].first;
                a[i].second=max(a[i].second,a[l].second);
                l=a[i].first-1;
            }
            r=a[i].second;
        }
    }

    // for(int i = 1;i &lt;= n;i++)
    //     cout &lt;&lt; a[i].first &lt;&lt; &quot; &quot; &lt;&lt; a[i].second &lt;&lt;endl;
    while (m--)
    {
        x=read();y=read();
        if(y&gt;=a[x].first&amp;&amp;y&lt;=a[x].second)puts(&quot;Yes&quot;);
        else puts(&quot;No&quot;);
    }
    
}



int main(){
    //cin.tie(nullptr)-&gt;sync_with_stdio(false);

    int T=read();while (T--)
    Qingtuan();
    return 0;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="p1008" tabindex="-1"><a class="header-anchor" href="#p1008" aria-hidden="true">#</a> P1008</h1><p>\u9012\u5F52\u8FD4\u56DE\u65F6\u5F53\u524D\u5EA6\u6570\u5927\u4E8E\u4E00\u65F6\u5220\u9664\u8BE5\u8282\u70B9\uFF0C\u6700\u540E\u904D\u5386\u7EDF\u8BA1</p><h2 id="code-1" tabindex="-1"><a class="header-anchor" href="#code-1" aria-hidden="true">#</a> Code\uFF1A</h2><div class="language-c++ ext-c++ line-numbers-mode"><pre class="language-c++"><code>#include&lt;bits/stdc++.h&gt;
#define ll long long
#define ptn putchar(&#39;\\n&#39;)
using namespace std;

inline ll read() { ll x = 0; scanf(&quot;%lld&quot;, &amp;x); return x; };
inline void writ(ll x) { printf(&quot;%lld&quot;, x); }

void Qingtuan() {
    int n = read();
    vector&lt;vector&lt;int&gt;&gt;f(n+1);
    vector&lt;bool&gt;visi(n+1);
    vector&lt;int&gt;du(n+1);
    int x, y;
    for (int i = 1; i &lt; n; i++)
    {
        x = read(); y = read();
        f[x].push_back(y); f[y].push_back(x);
        du[x]++; du[y]++;
    }

    function&lt;int(int)&gt;dfs=[&amp;](int x)-&gt;int{
        int y=0;
        visi[x]=1;
        for(auto i:f[x]){
            if(!visi[i])y+=dfs(i);
        }
        if(y&gt;1){
            du[x]=0;return 0;
        }
        return y+1;
    };

    dfs(1);
    int res=0;
    for (int i = 1; i &lt;= n; i++)
    {
        if(du[i])res++;
    }
    printf(&quot;%d\\n&quot;,res);
}



int main() {
    //cin.tie(nullptr)-&gt;sync_with_stdio(false);
    int size(512&lt;&lt;20);  // 512M
    __asm__ ( &quot;movq %0, %%rsp\\n&quot;::&quot;r&quot;((char*)malloc(size)+size));
    int T = read(); while (T--)
        Qingtuan();
    exit(0);
    return 0;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="p1011" tabindex="-1"><a class="header-anchor" href="#p1011" aria-hidden="true">#</a> P1011</h1><p>\u679A\u4E3E\u5BBD\u53EF\u4EE5\u5206\u6210\u7684\u5757\u6570</p><div class="language-c++ ext-c++ line-numbers-mode"><pre class="language-c++"><code>#include&lt;bits/stdc++.h&gt;
#define ll long long
#define ptn putchar(&#39;\\n&#39;)
using namespace std;

inline ll read() {ll x = 0;scanf(&quot;%lld&quot;,&amp;x);return x;};
inline void writ(ll x){printf(&quot;%lld&quot;,x);}


int n,m,k;

void Qingtuan(){
    m=read();n=read();k=read();
    int res=0;
    int a,b;
    for (int i = 1; i &lt;= m; i++)
    {
        a=m/i;
        if(!a)break;
        b=(k-1)/a+1;
        b=n/b;
        if(b&lt;=0)continue;
        res=max(res,i+b-2);
    }
    printf(&quot;%d\\n&quot;,res);

}



int main(){
    //cin.tie(nullptr)-&gt;sync_with_stdio(false);

    int T=read();while (T--)
    Qingtuan();
    return 0;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,20),v=[s];function a(r,c){return n(),e("div",null,v)}const m=i(d,[["render",a],["__file","\u676D\u7535\u676F\u7B2C\u516B\u573A.html.vue"]]);export{m as default};
