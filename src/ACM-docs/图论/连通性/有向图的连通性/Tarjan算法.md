# Tarjan算法

## 引入

在有向图中求强连通分量

## Tarjan 算法求强连通分量

在 $Tarjan$ 算法中为每个结点$n$维护了以下几个变量：

1.  $dfn_u$深度优先搜索遍历时结点$u$被搜索的次序。
1.  $low_u$在$u$的子树中能够回溯到的最早的已经在栈中的结点。设以$u$为根的子树为$Subyree_u$。 定义为以下结点的$dfn_u$的最小值：$Subyree_u$中的结点；从$Subyree_u$通过一条不在搜索树上的边能到达的结点。

一个结点的子树内结点的 $dfn$ 都大于该结点的 $dfn$。

从根开始的一条路径上的 $dfn$严格递增，$low$严格非降。

按照深度优先搜索算法搜索的次序对图中所有的结点进行搜索，维护每个结点的 $dfn$ 与 $low$ 变量，且让搜索到的结点入栈。每当找到一个强连通元素，就按照该元素包含结点数目让栈中元素出栈。在搜索过程中，对于结点$u$和与其相邻的结点$v$（ 不是$u$的父节点）考虑 $3$ 种情况：

1.  $v$未被访问：继续对$v$进行深度搜索。在回溯过程中，用$low_v$更新$low_u$ 。因为存在从$u$到$v$的直接路径，所以$v$能够回溯到的已经在栈中的结点，$v$也一定能够回溯到。
1.  $v$被访问过，已经在栈中：根据 $low$ 值的定义，用$dfn_v$更新$low_u$。
1.  $v$被访问过，已不在栈中：说明$v$已搜索完毕，其所在连通分量已被处理，所以不用对其做操作。

## 代码

```cpp
#include<bits/stdc++.h>
#define ll long long
#define ptn putchar('\n')
using namespace std;

inline ll read() {ll x = 0, z = 1;char c = getchar();while (!isdigit(c)) {if (c == '-')z = -1;c = getchar();}while (isdigit(c)) {x = (x << 1) + (x << 3) + (c ^ 48);c = getchar();}return z * x;}
template<typename T>
inline void writ(T x,const char &c = -1){if(x<0) {putchar('-');x=(~x)+1;}if(x>9)writ(x/10);putchar(x-x/10*10+48);if(~c)putchar(c);}

const int N=1e5+5;
struct edge
{
    int to=0,next=0;
}e[N<<1];
int head[N],ent=0,sta[N],low[N],dfn[N],col[N],co=0,ti=0,top=0;
 
inline void addedge(int x,int y){
    e[++ent]={y,head[x]};
    head[x]=ent;
}

void tarjan(int u,int fa){
    sta[++top]=u;
    low[u]=dfn[u]=++ti;
    int v;
    for (int i = head[u]; i ; i=e[i].next)
    {
        v=e[i].to;
        if(v==fa)continue;
        if(!dfn[v]){
            tarjan(v,u);low[u]=min(low[u],low[v]);
        }else if(!col[v]) low[u]=min(low[u],dfn[v]);
    }
    if(low[u]==dfn[u]){
        co++;
        do{
            v=sta[top--];
            col[v]=co;
        } while (u!=v);
    }
}



void ClearDewy(){
    int n=read(),m=read();
    int x,y;
    for (int i = 1; i <= m; i++)
    {
        x=read();y=read();addedge(x,y);
    }
    for (int i = 1; i <= n; i++)
    {
        if(!dfn[i])tarjan(i,0);
    }
}

int main(){
    //cin.tie(nullptr)->sync_with_stdio(false);

    //int T=read();while (T--)
    ClearDewy();
    return 0;
}
```

