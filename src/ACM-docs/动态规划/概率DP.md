# 概率DP

## 递推期望

已知初始态，求末态的期望

### 解法

$$
dp[i+1]=dp[i]+\sum p_{i+1,j}w_{i+1,j}
$$

### 例题

[A-Monster Killer_2022年华中科技大学程序设计新生赛 (nowcoder.com)](https://ac.nowcoder.com/acm/contest/43084/A)

>   按顺序击败怪物，自己战斗力初始$m=0$，怪物战斗力为$a_i$
>
>   -   $m=a_i$，击败怪物
>   -   $m>a_i$，击败怪物，有$p_i$的概率战斗力减一
>   -   $m<a_i$，不能击败怪物，有$p_i$的概率战斗力加一
>
>   求期望战斗次数

#### Code

```cpp
#include<bits/stdc++.h>
#define ll long long
#define ptn putchar('\n')
using namespace std;

inline ll read() {ll x = 0, z = 1;char c = getchar();while (!isdigit(c)) {if (c == '-')z = -1;c = getchar();}while (isdigit(c)) {x = (x << 1) + (x << 3) + (c ^ 48);c = getchar();}return z * x;}
inline void writ(ll x){if(x<0) {putchar('-');x=(~x)+1;}if(x>9)writ(x/10);putchar(x-x/10*10+48);}

const int mod=998244353,N=2003;

void ClearDewy(){
    int n=read();
    vector<ll>a(n+1),x(n+1),p(n+1),dp(n+1),inv(101);
    vector<vector<ll>>blood(n+1,vector<ll>(N+2));
    inv[1] = 1;
    for (int i = 2; i <= 100; i++) inv[i] = (mod - mod / i) * inv[mod % i] % mod;

    for (int i = 1; i <= n; i++)
    {
        a[i]=read();x[i]=read();p[i]=x[i]*inv[100]%mod;
    }
    blood[0][0]=1;
    for (int i = 1; i <= n; i++)
    {
        dp[i]=dp[i-1]+1;
        for (int j = 0; j < N; j++)
        {
            dp[i]=(dp[i]+max(a[i]-j,0LL)*100*inv[x[i]]%mod*blood[i-1][j]%mod)%mod;
        }
        for (int j = 0; j < a[i]; j++)
        {
            blood[i-1][a[i]]=blood[i-1][a[i]]+blood[i-1][j];
        }
        blood[i][a[i]]=(blood[i-1][a[i]]+blood[i-1][a[i]+1]*p[i]%mod)%mod;
        for (int j = a[i]+1; j < N; j++)
        {
            blood[i][j]=(blood[i-1][j+1]*p[i]%mod+blood[i-1][j]*(1-p[i]+mod)%mod)%mod;
        }
    }

    writ(dp[n]);
}

int main(){
    //cin.tie(nullptr)->sync_with_stdio(false);

    //int T=read();while (T--)
    ClearDewy();
    return 0;
}
```

## 逆推期望

已知末态，求到末态的期望

### 解法

设$dp[i]$为从$i$到$n$的期望，$p_i$为成功的概率，故$dp[n]=0$，结果为$dp[1]$
$$
dp[i]=(dp[i]+w_i)(1-p_i)+(dp[i+1]+w_i)p_i
$$
化简得：
$$
dp[i]=dp[i+1]+\frac{w_i}{p_i}
$$

### 例题

[P4550 收集邮票 - 洛谷 | 计算机科学教育新生态 (luogu.com.cn)](https://www.luogu.com.cn/problem/P4550)

>   收集$n$中不同的邮票，第$k$次购买的花费为$k$，求收集$n$种邮票的花费

显然，$w$会改变，设$w[i]$为买第$i$张邮票的期望花费
$$
g[i]=\frac{i}{n}(g[i]+dp[i]+1)+\frac{n-i}{n}(g[i+1]+dp[i+1]+1)
$$
化简得：
$$
g[i]=\frac{i}{n-i}dp[i]+g[i+1]+dp[i+1]+\frac{n}{n-i}
$$

#### Code

```cpp
#include<bits/stdc++.h>
#define ll long long
using namespace std;

inline ll read() {ll x = 0, z = 1;char c = getchar();while (!isdigit(c)) {if (c == '-')z = -1;c = getchar();}while (isdigit(c)) {x = (x << 1) + (x << 3) + (c ^ 48);c = getchar();}return z * x;}
inline void writ(ll x){if(x<0) {putchar('-');x=(~x)+1;}if(x>9)writ(x/10);putchar(x-x/10*10+48);}

const int N=10005;
double a[N]={0},b[N]={0};
int n;

void ClearDewy(){
    n=read();
    for (int i = n-1; ~i; i--)
    {
        a[i]=a[i+1]+1.0*n/(n-i);
        b[i]=1.0*i/(n-i)*a[i]+b[i+1]+1.0*n/(n-i)+a[i+1];
    }
    printf("%.2f",b[0]);
}

int main(){
    //ios::sync_with_stdio(false);
    //cin.tie(0);cout.tie(0);
    ClearDewy();
    return 0;
}
```

## 环形期望

状态转移为一个循环，当成功一次后循环终止

### 解法

设$\overline p_i$为不成功的概率，即$\overline p_i=1-p_i$，根据逆推期望$dp[i]=\overline p_i(dp[i+1]+w_i)$写出方程组
$$
\begin{cases}
dp[1]&=\overline p_1(dp[2]+w_1)\\
dp[2]&=\overline p_2(dp[3]+w_2)\\
&\dots	\\
dp[n-1]&=\overline p_{n-1}(dp[n]+w_{n-1})\\
dp[n]&=\overline p_n(dp[1]+w_n)
\end{cases}
$$
设$x=dp[1]$，得：
$$
x=\overline p_1(\overline p_2(\cdots\overline p_n(w_n+x)\cdots+w_2)+w_1)
$$
设
$$
\begin{align}
a&=\overline p_1\overline p_2\cdots\overline p_n\\b&=\overline p_1(w_1+\overline p_2(w_2+\cdots \overline p_nw_n))
\end{align}
$$
则
$$
x=ax+b
$$
得
$$
x=\frac{b}{1-a}
$$

### 例题

[Problem - D - Codeforces](https://codeforces.com/contest/1623/problem/D)

>   机器人每秒朝一个方向（斜方向）移动一格，撞墙后方向改变，当横坐标或者纵坐标与污渍相同时，有$p$的概率清楚掉污渍，求期望时间

### Code

```cpp
#include<bits/stdc++.h>
#define ll long long
#define ptn putchar('\n')
using namespace std;

inline ll read() {ll x = 0, z = 1;char c = getchar();while (!isdigit(c)) {if (c == '-')z = -1;c = getchar();}while (isdigit(c)) {x = (x << 1) + (x << 3) + (c ^ 48);c = getchar();}return z * x;}
inline void writ(ll x){if(x<0) {putchar('-');x=(~x)+1;}if(x>9)writ(x/10);putchar(x-x/10*10+48);}

ll mod=1e9+7;

ll m,n,a,b,x,y,p;
int dira,dirb;

inline ll fp(ll x, ll y) {
    ll base = 1;
    while (y)
    {
        if (y&1)
            base =base*x%mod;
        x=x*x%mod;y >>= 1;
    }
    return base;
}

void ClearDewy(){
    m=read();n=read();a=read();b=read();x=read();y=read();p=read();
    dira=dirb=-1;
    if(a==1)dira=1;if(b==1)dirb=1;
    if(a==m)dira=-1;if(b==n)dirb=-1;
    ll q=(100-p)*fp(100,mod-2)%mod;
    set<array<ll,4>>se;
    se.insert({a,b,dira,dirb});
    ll u=0,v=1;
    while (true)
    {
        a+=dira;b+=dirb;
        if(a==1)dira=1;
        if(b==1)dirb=1;
        if(a==m)dira=-1;if(b==n)dirb=-1;
        u=(u+1)%mod;
        if (a==x||b==y)
        {
            u=u*q%mod;v=v*q%mod;
        }
        if(se.count({a,b,dira,dirb})){
            break;
        }
        se.insert({a,b,dira,dirb});
    }
    writ(u*fp((1-v+mod)%mod,mod-2)%mod);ptn;
}

int main(){
    //cin.tie(nullptr)->sync_with_stdio(false);

    int T=read();while (T--)
    ClearDewy();
    return 0;
}
```

## 有向无环图的期望

### 解法

-   逆推

$$
\begin{align}
E(y)&=p_1x_1+p_2x_2+\dots+p_nx_n\\
E(x)&=p_1(x_1+w)+p_2(x_2+w)+\dots+p_n(x_n+w)=E(y)+\sum_{i=1}^np_iw+E(y)+w
\end{align}
$$

-   $dp[i]$表示从$i$到$n$的期望，方程的转移：对于一条从$x$到$y$边

$$
dp[x]=\sum_{i=1}^{out[x]}\frac{dp[y]+edge[i]}{out[x]}
$$

### 例题

[P4316 绿豆蛙的归宿 - 洛谷 | 计算机科学教育新生态 (luogu.com.cn)](https://www.luogu.com.cn/problem/P4316)

>   起点为 $1$，终点为 $n$，的有向无环图，每条路劲有一个长度，求到重点的期望

#### Code

```cpp
#include<bits/stdc++.h>
#define ll long long
#define ull unsigned long long
using namespace std;

inline ll read() {ll x = 0, z = 1;char c = getchar();while (!isdigit(c)) {if (c == '-')z = -1;c = getchar();}while (isdigit(c)) {x = (x << 1) + (x << 3) + (c ^ 48);c = getchar();}return z * x;}
inline void writ(ll x){if(x<0) {putchar('-');x=(~x)+1;}if(x>9)writ(x/10);putchar(x-x/10*10+48);}
const int N=1e5+5;
int n,m;
int out[N]={0},deg[N]={0};

struct edge
{
    int to=0,next=0,w=0;
}e[N<<1];
int head[N]={0};
int cnt=0;
inline void addedge(int &x,int &y,int &w){
    e[++cnt].to=y;
    e[cnt].w=w;
    e[cnt].next=head[x];
    head[x]=cnt;
}

double dp[N]={0};

void topsort(){
    queue<int>q;
    q.push(n);
    int h;int to;
    while (!q.empty())
    {
        h=q.front();
        q.pop();
        for (int i = head[h]; i ; i=e[i].next)
        {
            to=e[i].to;
            dp[to]+=(dp[h]+e[i].w)/out[to];
            if (!(--deg[to]))
            {
                q.push(to);
            }
        }
    }
}

void ClearDewy(){
    int x,y,w;
    n=read();m=read();
    for (int i = 1; i <= m; i++)
    {
        x=read();y=read();w=read();
        out[x]++;
        deg[x]++;
        addedge(y,x,w);
    }
    topsort();
    printf("%.2f",dp[1]);

}

int main(){
    //ios::sync_with_stdio(false);
    //cin.tie(0);cout.tie(0);
    ClearDewy();
    return 0;
}
```

