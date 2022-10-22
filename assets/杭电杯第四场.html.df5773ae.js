import{_ as i}from"./_plugin-vue_export-helper.cdc0426e.js";import{o as n,c as e,d}from"./app.f03a64c8.js";const l={},s=d(`<h1 id="\u676D\u7535\u676F\u7B2C\u56DB\u573A" tabindex="-1"><a class="header-anchor" href="#\u676D\u7535\u676F\u7B2C\u56DB\u573A" aria-hidden="true">#</a> \u676D\u7535\u676F\u7B2C\u56DB\u573A</h1><p><em>\u4E2A\u4EBA\u9898\u89E3\uFF0C\u6B22\u8FCE\u6307\u6B63</em></p><h1 id="p1004" tabindex="-1"><a class="header-anchor" href="#p1004" aria-hidden="true">#</a> P1004</h1><h2 id="\u601D\u8DEF" tabindex="-1"><a class="header-anchor" href="#\u601D\u8DEF" aria-hidden="true">#</a> \u601D\u8DEF\uFF1A</h2><p>\u624B\u63A8\u51E0\u79CD\u60C5\u51B5\u53D1\u73B0\u5168\u662F no</p><h2 id="code" tabindex="-1"><a class="header-anchor" href="#code" aria-hidden="true">#</a> Code:</h2><div class="language-c++ ext-c++ line-numbers-mode"><pre class="language-c++"><code>#include&lt;bits/stdc++.h&gt;
#define ll long long
#define WA return 0;
#define ptn putchar(&#39;\\n&#39;)
using namespace std;

inline ll read() {ll x = 0, z = 1;char c = getchar();while (!isdigit(c)) {if (c == &#39;-&#39;)z = -1;c = getchar();}while (isdigit(c)) {x = (x &lt;&lt; 1) + (x &lt;&lt; 3) + (c ^ 48);c = getchar();}return z * x;}
inline void writ(ll x){if(x&lt;0) {putchar(&#39;-&#39;);x=(~x)+1;}if(x&gt;9)writ(x/10);putchar(x-x/10*10+48);}




void Qingtuan(){
    int n=read();
    puts(&quot;No&quot;);


}



int main(){
    //cin.tie(nullptr)-&gt;sync_with_stdio(false);

    int T=read();while (T--)
    Qingtuan();
    WA
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="p1006" tabindex="-1"><a class="header-anchor" href="#p1006" aria-hidden="true">#</a> P1006</h2><h2 id="\u601D\u8DEF-1" tabindex="-1"><a class="header-anchor" href="#\u601D\u8DEF-1" aria-hidden="true">#</a> \u601D\u8DEF\uFF1A</h2><p>\u4E00\u9053\u6A21\u62DF\u9898\uFF0C\u6CE8\u610Fdouble\u7684\u7CBE\u5EA6\u800C\u4E0D\u80FD\u76F4\u63A5==\u5C31\u53EF\u4EE5\u4E86</p><div class="language-c++ ext-c++ line-numbers-mode"><pre class="language-c++"><code>#include&lt;bits/stdc++.h&gt;
#define ll long long
#define WA return 0;
#define ptn putchar(&#39;\\n&#39;)
using namespace std;

inline ll read() {ll x = 0, z = 1;char c = getchar();while (!isdigit(c)) {if (c == &#39;-&#39;)z = -1;c = getchar();}while (isdigit(c)) {x = (x &lt;&lt; 1) + (x &lt;&lt; 3) + (c ^ 48);c = getchar();}return z * x;}
inline void writ(ll x){if(x&lt;0) {putchar(&#39;-&#39;);x=(~x)+1;}if(x&gt;9)writ(x/10);putchar(x-x/10*10+48);}

const double epx=1e-5;


void Qingtuan(){
    int n=read();
    double a=0,b=0;
    int x;
    for (int i = 1; i &lt;= n; i++)
    {
        scanf(&quot;%d&quot;,&amp;x);
        if(b-100&lt;-epx){
            b+=x;
        }else if(b-200&lt;-epx){
            b+=0.8*x;
        }else b+=0.5*x;
        double t=x;

        if(a-100&lt;-epx){
            double t1=min(100-a,t);
            a+=t1;t-=t1;
        }
        if(a-100&gt;=-epx&amp;&amp;a-200&lt;-epx){
            double t1=min((200-a)/0.8,t);
            a+=0.8*t1;t-=t1;
        }
        if(a-200&gt;=-epx){
            a+=0.5*t;
        }
    }
    printf(&quot;%.3f %.3f\\n&quot;,a,b);
}



int main(){
    //cin.tie(nullptr)-&gt;sync_with_stdio(false);

    int T=read();while (T--)
    Qingtuan();
    WA
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="p1007" tabindex="-1"><a class="header-anchor" href="#p1007" aria-hidden="true">#</a> P1007</h1><h2 id="\u601D\u8DEF-2" tabindex="-1"><a class="header-anchor" href="#\u601D\u8DEF-2" aria-hidden="true">#</a> \u601D\u8DEF\uFF1A</h2><p>\u7EF4\u62A4\u4E00\u4E2A\u6808\uFF0C\u6BCF\u6B21\u653B\u51FB\u628A\u6808\u6E05\u7A7A\uFF0C\u4E14\u4E0B\u6B21\u8FDB\u6808\u7684\u6570\u91CF\u548C\u672C\u6B21\u6E05\u7A7A\u7684\u6570\u91CF\u4E0D\u80FD\u5927\u4E8Ek</p><h2 id="code-1" tabindex="-1"><a class="header-anchor" href="#code-1" aria-hidden="true">#</a> Code:</h2><div class="language-c++ ext-c++ line-numbers-mode"><pre class="language-c++"><code>#include&lt;bits/stdc++.h&gt;
#define ll long long
#define WA return 0;
#define ptn putchar(&#39;\\n&#39;)
using namespace std;

inline ll read() { ll x = 0, z = 1; char c = getchar(); while (!isdigit(c)) { if (c == &#39;-&#39;)z = -1; c = getchar(); }while (isdigit(c)) { x = (x &lt;&lt; 1) + (x &lt;&lt; 3) + (c ^ 48); c = getchar(); }return z * x; }
inline void writ(ll x) { if (x &lt; 0) { putchar(&#39;-&#39;); x = (~x) + 1; }if (x &gt; 9)writ(x / 10); putchar(x - x / 10 * 10 + 48); }

int n, k;
ll sum;

void Qingtuan() {
    n = read(); sum = read(); k = read();
    vector&lt;ll&gt;a(n + 1);
    vector&lt;ll&gt;sta(k + 5); int cnt = 0, la = 0;
    bool ju = 1; ll mx = 0;
    for (int i = 1; i &lt;= n; i++)
    {
        a[i] = read();
        sta[++cnt] = a[i];
        mx = max(max(0LL, mx - sta[cnt]), sta[cnt - 1] - sta[cnt]);
        if (sum &gt;= mx &amp;&amp; sum &gt;= sta[cnt]) {
            la = cnt;
            while (cnt)
            {
                sum += sta[cnt--];
            }
            mx = 0;
        }
        if (la + cnt &gt; k) {
            ju = 0; for (int j = i + 1; j &lt;= n; j++)a[j] = read();
            break;
        }
    }
    if (ju &amp;&amp; !cnt) {
        puts(&quot;YES&quot;);
    }
    else puts(&quot;NO&quot;);

}



int main() {
    //cin.tie(nullptr)-&gt;sync_with_stdio(false);

    int T = read(); while (T--)
        Qingtuan();
    WA
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="p1011" tabindex="-1"><a class="header-anchor" href="#p1011" aria-hidden="true">#</a> P1011</h1><h2 id="\u601D\u8DEF-3" tabindex="-1"><a class="header-anchor" href="#\u601D\u8DEF-3" aria-hidden="true">#</a> \u601D\u8DEF\uFF1A</h2><p>\u5076\u6570\u4E2A\u8FDE\u7EED\u7684\u8FDB\u884C\u4E24\u6B21\u64CD\u4F5C\u5C31\u5168\u4E3A0\uFF0C\u5F53\u4E00\u4E2A\u6570\u65C1\u67090\u65F6\uFF0C\u8FD9\u4E2A\u6570\u53EF\u4EE5\u6269\u5C55\u5230\u4EFB\u610F\u4F4D\u7F6E\u3002\u4F8B\u5982\uFF1A</p><p>2 3 0 -&gt; 2 3 3 -&gt; 1 1 3 -&gt;0 0 3 -&gt;3 3 3</p><p>\u7136\u540E\u9898\u76EE\u8BF4\u6709\u4E24\u4E2A\u76F8\u540C\u7684\u6570\uFF0C\u6211\u4EEC\u53EF\u4EE5\u628A\u671F\u4E2D\u4E00\u4E2A\u5F53\u505A \u201C0\u201D\u6765\u7528\uFF0C\u4E0D\u9700\u8981\u8FD9\u4E2A\u6570\u65F6\u4E0E\u53E6\u5916\u4E00\u4E2A\u6570\u5F02\u6216\u4E00\u4E0B\u5373\u53EF\u6D88\u53BB\u3002</p><p>\u4E8E\u662F\u9898\u76EE\u8F6C\u5316\u4E3A\u4ECEn\u4E2A\u6570\u4E2D\u9009\u4EFB\u610F\u4E2A\u6570\u4F7F\u5F02\u6216\u503C\u6700\u5927</p><p><em>\u767E\u5EA6\u4E00\u4E0B\uFF0C\u7EBF\u6027\u57FA\uFF0CCV\u4E86\u4E00\u4E2A\u677F\u5B50\u8FC7\u4E86</em></p><h2 id="code-2" tabindex="-1"><a class="header-anchor" href="#code-2" aria-hidden="true">#</a> Code:</h2><div class="language-c++ ext-c++ line-numbers-mode"><pre class="language-c++"><code>#include&lt;iostream&gt;
#include&lt;cstdio&gt;
#include&lt;cstring&gt;
#include&lt;cmath&gt;
#include&lt;algorithm&gt;
using namespace std;
#define int long long
const int maxm=70;
int a[maxm];
int d[maxm],cnt;
void insertt(int x){
    for(int i=62;i&gt;=0;i--){//\u4ECE\u6700\u9AD8\u4F4D\u5F00\u59CB(\u8FD9\u91CC\u7528\u768450)
        if(x&gt;&gt;i&amp;1){//\u5982\u679C\u4E3A1
            if(d[i]){
                x^=d[i];
            }else{
                d[i]=x;
                break;
            }
        }
    }
}

void Qingtuan(){
    int n;
    scanf(&quot;%lld&quot;,&amp;n);
    memset(a,0,sizeof a);memset(d,0,sizeof d);cnt=0;
    for(int i=1,x;i&lt;=n;i++){
        scanf(&quot;%lld&quot;,&amp;x);
        insertt(x);
    }
    int ans=0;
    for(int i=62;i&gt;=0;i--){
        if((ans^d[i])&gt;ans)ans^=d[i];
    }
    printf(&quot;%lld\\n&quot;,ans);
}

signed main(){
    int T;
    scanf(&quot;%lld&quot;,&amp;T);
    while(T--)Qingtuan();
    return 0;
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,25),a=[s];function v(r,c){return n(),e("div",null,a)}const m=i(l,[["render",v],["__file","\u676D\u7535\u676F\u7B2C\u56DB\u573A.html.vue"]]);export{m as default};
