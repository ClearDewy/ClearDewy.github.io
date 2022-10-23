import{_ as i}from"./_plugin-vue_export-helper.cdc0426e.js";import{o as n,c as e,d as l}from"./app.17fea3bf.js";const d={},s=l(`<h1 id="\u676D\u7535\u676F\u7B2C\u4E5D\u573A" tabindex="-1"><a class="header-anchor" href="#\u676D\u7535\u676F\u7B2C\u4E5D\u573A" aria-hidden="true">#</a> \u676D\u7535\u676F\u7B2C\u4E5D\u573A</h1><p><em>\u4E2A\u4EBA\u9898\u89E3\uFF0C\u6B22\u8FCE\u6307\u6B63</em></p><h1 id="p1007" tabindex="-1"><a class="header-anchor" href="#p1007" aria-hidden="true">#</a> P1007</h1><p>DP,\u672C\u4EBA\u4E0D\u4F1A</p><p>Code\uFF1A</p><div class="language-c++ ext-c++ line-numbers-mode"><pre class="language-c++"><code>#include &lt;bits/stdc++.h&gt;
#define ll long long
#define endl &#39;\\n&#39;
using namespace std;

const int mod=998244353;
ll n,k,r;
int a[5010];
int dp[5010][5010];

void solve() {
    cin&gt;&gt;n&gt;&gt;k&gt;&gt;r;
    for(int i=1;i&lt;=n;i++) cin&gt;&gt;a[i];
    memset(dp,0,sizeof(dp));
    dp[1][1]=1;
    for(int i=2;i&lt;=n;i++) {
        ll p=upper_bound(a+1,a+n+1,a[i]-r)-a-1;
        for(int j=1;j&lt;=i;j++){
            if(j==i) {
                dp[i][j]=dp[i-1][j-1];
            }
            else if(j==1) {
                ll p1=p;
                if(i-1-j&gt;=0)
                   p1=p-(i-1-j);
                dp[i][j]=(p1*dp[i-1][j])%mod;
            }
            else {
                ll p1=p;
                if(i-1-j&gt;=0)
                p1=p-(i-1-j);
                dp[i][j]=(dp[i-1][j-1]+(p1*dp[i-1][j])%mod)%mod;
            }
        }
    }
    cout&lt;&lt;dp[n][k]&lt;&lt;endl;
}

int main() {
    std::ios::sync_with_stdio(false);
    cin.tie(0); cout.tie(0);
    int T=1;
    cin&gt;&gt;T;
    while(T--) {
        solve();
    }
    return 0;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="p1008" tabindex="-1"><a class="header-anchor" href="#p1008" aria-hidden="true">#</a> P1008</h1><p>\u5373\u5728[1,n]\u4E2D\u6709\u591A\u5C11\u4E2A\u6570\u548Cx,y\u4E92\u8D28\uFF0C\u5C06\u4E24\u4E2A\u6570\u8D28\u56E0\u6570\u5206\u89E3\u540E\u5BB9\u65A5\u5373\u53EF</p><p>\u5751\u70B9\uFF1A1.\u6709\u91CD\u590D\u6570\u636E\uFF0C\u9700\u8981\u8BB0\u5F55 2.\u5F53gcd(x,y)==2\u65F6\uFF0C\u8DEF\u5F84\u6570\u91CF\u591A\u51FA\u6765\u4E00\u6761</p><h2 id="code" tabindex="-1"><a class="header-anchor" href="#code" aria-hidden="true">#</a> Code\uFF1A</h2><div class="language-c++ ext-c++ line-numbers-mode"><pre class="language-c++"><code>#include&lt;bits/stdc++.h&gt;
#define ll long long
#define ptn putchar(&#39;\\n&#39;)
using namespace std;

inline ll read() {ll x = 0;scanf(&quot;%lld&quot;,&amp;x);return x;}
inline void writ(ll x){printf(&quot;%lld&quot;,x);}

int n,m;

inline int gcd(int x,int y){
    return !y?x:gcd(y,x%y);
}

void Qingtuan(){
    scanf(&quot;%d%d&quot;,&amp;n,&amp;m);
    int x,y;
    ll l;
    map&lt;ll,int&gt;mq;
    while (m--)
    {
        scanf(&quot;%d%d&quot;,&amp;x,&amp;y);
        if(gcd(x,y)==1){
            puts(&quot;1 1&quot;);continue;
        }

        auto gjj=[&amp;](int a,int b)-&gt;int{
            set&lt;int&gt;q;ll lc=1;
            for (int i = 2; i &lt;= a/i; i++)
            {
                if(!(a%i)){
                    q.insert(i);
                    while (!(a%i))a/=i;
                }
            }
            if(a&gt;1)q.insert(a);
            for (int i = 2; i &lt;= b/i; i++)
            {
                if(!(b%i)){
                    q.insert(i);
                    while (!(b%i))b/=i;
                }
            }
            if(b&gt;1)q.insert(b);
            vector&lt;int&gt;pme(q.begin(),q.end());
            for(auto i:pme)lc*=i;
            if(mq.count(lc))return mq[lc];
            int sum=0;
            for(int i=1;i&lt;(1&lt;&lt;pme.size());++i)
            {
                ll z=1,num=0;
                for(int j=0;j&lt;pme.size();++j)
                    if(i&gt;&gt;j&amp;1) z*=pme[j],++num;
                if(num&amp;1) sum+=n/z;
                else sum-=n/z;
            }
            
            return mq[lc]=n-sum;
        };
        printf(&quot;2 %d\\n&quot;,gjj(x,y)+(gcd(x,y)==2?1:0));
    }
}

int main(){
    //cin.tie(nullptr)-&gt;sync_with_stdio(false);

    //int T=read();while (T--)
    Qingtuan();
    return 0;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="p1010" tabindex="-1"><a class="header-anchor" href="#p1010" aria-hidden="true">#</a> P1010</h1><p>\u89C2\u5BDF\u540E\u53D1\u73B0\u7ED3\u679C\u548C\u987A\u5E8F\u65E0\u5173\uFF0C\u76F4\u63A5\u6309\u987A\u5E8F\u8BA1\u7B97\u5373\u53EF</p><h2 id="code-1" tabindex="-1"><a class="header-anchor" href="#code-1" aria-hidden="true">#</a> Code\uFF1A</h2><div class="language-c++ ext-c++ line-numbers-mode"><pre class="language-c++"><code>#include &lt;bits/stdc++.h&gt;
#define ll long long
#define endl &#39;\\n&#39;
using namespace std;

const int mod=998244353;
const int maxn=505;
ll a[maxn];

void solve() {
    int n;
    cin&gt;&gt;n;
    for(int i=1;i&lt;=n;i++) {
        cin&gt;&gt;a[i];
    }
    for(int i=2;i&lt;=n;i++) {
        a[i]=(a[i-1]+a[i]+a[i-1]*a[i])%mod;
    }
    cout&lt;&lt;a[n]&lt;&lt;endl;
}

int main() {
    std::ios::sync_with_stdio(false);
    cin.tie(0); cout.tie(0);
    int T=1;
    cin&gt;&gt;T;
    while(T--) {
        solve();
    }
    return 0;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,15),v=[s];function a(c,r){return n(),e("div",null,v)}const t=i(d,[["render",a],["__file","\u676D\u7535\u676F\u7B2C\u4E5D\u573A.html.vue"]]);export{t as default};
