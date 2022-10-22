import{_ as i}from"./_plugin-vue_export-helper.cdc0426e.js";import{o as n,c as e,d as s}from"./app.f03a64c8.js";const d={},l=s(`<h1 id="ac\u81EA\u52A8\u673A" tabindex="-1"><a class="header-anchor" href="#ac\u81EA\u52A8\u673A" aria-hidden="true">#</a> AC\u81EA\u52A8\u673A</h1><div class="language-c++ ext-c++ line-numbers-mode"><pre class="language-c++"><code>//\u7EDF\u8BA1\u539F\u4E32\u4E2D\u6709\u591A\u5C11\u4E2A\u4E0D\u540C\u7684\u6A21\u5F0F\u4E32
const int N=2e6+5;
string s;
int tr[N][26],cnt=0;
int vi[N],fail[N];

inline void insert(){
    int idx=0;
    for(char &amp;i:s){
        if(!tr[idx][i-&#39;a&#39;])tr[idx][i-&#39;a&#39;]=++cnt;
        idx=tr[idx][i-&#39;a&#39;];
    }
    vi[idx]++;
}

inline void get_fail(){
    queue&lt;int&gt;q;
    for (int i = 0; i &lt; 26; i++)if(tr[0][i])q.push(tr[0][i]),fail[tr[0][i]]=0;
    int h;
    while (!q.empty())
    {
        h=q.front();q.pop();
        for (int i = 0; i &lt; 26; i++)if(tr[h][i])fail[tr[h][i]]=tr[fail[h]][i],q.push(tr[h][i]);
        else tr[h][i]=tr[fail[h]][i];
    }
}

int query(){
    int idx,res=0;
    for(char &amp;i:s){
        idx=tr[idx][i-&#39;a&#39;];
        for (int j = idx; j &amp;&amp; ~vi[j]; j=fail[j])
        {
            res+=vi[j];vi[j]=-1;
        }
    }
    return res;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr>`,3),r=[l];function v(a,c){return n(),e("div",null,r)}const m=i(d,[["render",v],["__file","AC\u81EA\u52A8\u673A.html.vue"]]);export{m as default};
