import{_ as i}from"./_plugin-vue_export-helper.cdc0426e.js";import{o as n,c as e,d}from"./app.804c2880.js";const s={},l=d(`<h1 id="\u6811\u94FE\u5256\u5206" tabindex="-1"><a class="header-anchor" href="#\u6811\u94FE\u5256\u5206" aria-hidden="true">#</a> \u6811\u94FE\u5256\u5206</h1><div class="language-c++ ext-c++ line-numbers-mode"><pre class="language-c++"><code>//modify\u4E3A\u7EBF\u6BB5\u6811\u7684\u66F4\u65B0\u64CD\u4F5C
int a[N],son[N],top[N],wei[N],dfn[N],deep[N],f[N],w[N];
int ti=0;

inline int dfs1(int x,int fa){
    f[x]=fa;deep[x]=deep[fa]+1;
    int y,mxson=-1;son[x]=1,t;
    for(int i=head[x];i;i=e[i].next){
        y=e[i].to;if(y==fa)continue;
        t=dfs1(y,x);son[x]+=t;
        if(t&gt;mxson)mxson=t,wei[x]=y;
    }
    return son[x]; 
}

inline void dfs2(int x,int wfa){
    dfn[x]=++ti;top[x]=wfa;w[ti]=a[x];
    if(!wei[x])return;
    dfs2(wei[x],wfa);
    int y;
    for(int i=head[x];i;i=e[i].next){
        y=e[i].to;if(y==f[x]||y==wei[x])continue;
        dfs2(y,y);
    }
}
//\u66F4\u65B0idx\u7684\u5B50\u6811
modify(dfn[idx],dfn[idx]+son[idx]-1,k);

//\u66F4\u65B0x\u5230y\u7684\u6700\u77ED\u94FE\u4E0A\u7684\u8282\u70B9
inline void mchain(int x,int y,ll k){
    while (top[x]!=top[y])
    {
        if(deep[top[x]]&lt;deep[top[y]])swap(x,y);
        modify(dfn[top[x]],dfn[x],k);
        x=f[top[x]];
    }
    if(deep[x]&gt;deep[y])swap(x,y);
    modify(dfn[x],dfn[y],k);
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,2),v=[l];function a(r,c){return n(),e("div",null,v)}const u=i(s,[["render",a],["__file","\u6811\u94FE\u5256\u5206.html.vue"]]);export{u as default};
