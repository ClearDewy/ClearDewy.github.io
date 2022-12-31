# 快速数论变换-NTT

*FFT中计算有大小限制，而且使用$sin$和$cos$函数进行计算，会有精度损失问题，于是有了在$\pmod p$意义下的多项式乘法*

## 原根

在$\pmod p$意义下，$p$的原根与复数下的单位根性质相似

常见模数原根:$998244353,1004535809,469762049$,原根均为$3$ 

### 定义

设$m\in N^*,a\in Z$。若$gcd(a,m)=1$，且$\delta_m(a)=\varphi(m)$，则称$a$为模$m$的原根。其中$\delta_m(a)$为$a$模$m$的阶。

### 性质

-   **对于$\forall i \in [0,\delta_p(a))$,所有的$a^i mod p$结果互不相同**

-   **若$a^n \equiv 1 \pmod p$，则$\delta_p(a)\mid n$**

设$n=2^k$，$p$为素数且$n\mid (p-1)$，$g$为$p$的一个原根，设：
$$
g_n=g^{\frac{p-1}{n}}
$$
则
$$
\begin{align}
g_n^n&=g^{n\cdot\frac{p-1}{n}}=g^{p-1}\\
g_n^\frac{n}{2}&=g^\frac{p-1}{2}\\
g_{an}^{ak}&=g^\frac{ak(p-1)}{an}=g^\frac{k(p-1)}{n}=g_n^k
\end{align}
$$
得
$$
\begin{align}
g_n^n&\equiv 1\pmod p\\
g_n^\frac{n}{2}&\equiv -1\pmod p\\
(g_n^{\frac{n}{2}+k})^2=g_n^{n+2k}&\equiv g_n^{2k}\pmod p
\end{align}
$$

## 快速数论变换-NTT

设多项式$A(x)$：
$$
\begin{align}
A(x)&=\sum_{i=0}^{n-1}a_ix^i=a_0+a_1x+a_2x^2+\dots+a_{n-1}x^{n-1} \\
&=(a_0+a_2x^2+\dots+a_{n-2}x^{n-2})+x(a_1+a_3x^3+\dots+a_{n-1}x^{n-2})
\end{align}
$$
设多项式$A_1(x),A_2(x)$：
$$
A_1(x)=a_0+a_2x+a_4x^2+\dots+a_{n-2}x^{\frac{n}{2}-1}\\
A_2(x)=a_1+a_3x+a_5x^2+\dots+a_{n-1}x^{\frac{n}{2}-1}\\
$$
易得：
$$
A(x)=A_1(x^2)+A_2(x^2)
$$
设$k(k<\frac{n}{2})$，令$x=g_n^k$带入$A(x)$得：
$$
\begin{align}
A(g_n^k)&=A_1((g_n^k)^2)+g_n^kA_2((g_n^k)^2)\\
&=A_1(g_n^{2k})+g_n^kA_2(g_n^{2k})\\
&=A_1(g_\frac{n}{2}^k)+g_n^kA_2(g_\frac{n}{2}^k)
\end{align}
$$
令$x=g_n^{\frac{n}{2}+k}$带入$A(x)$得：
$$
\begin{align}
A(g_n^{\frac{n}{2}+k})
&=A_1(g_n^{2k+n})+g_n^{\frac{n}{2}+k}A_2(g_n^{2k+n})\\
&=A_1(g_n^{2k}g_n^n)-g_n^kA_2(g_n^{2k}g_n^n)\\
&=A_1(g_n^{2k})-g_n^kA_2(g_n^{2k})\\
&=A_1(g_\frac{n}{2}^k)-g_n^kA_2(g_\frac{n}{2}^k)
\end{align}
$$
将式$(18)$和式$(22)$比较可知：

如果已知$A_1(g_\frac{n}{2}^k)$和$A_2(g_\frac{n}{2}^k)$的值，我们就可以同时知道$A(g_n^k)$和$A(g_n^{\frac{n}{2}+k})$的值

可以运用递归求得，每次回溯只用算的前一半的值即可得到后一半的值

递归边界：$n==1$时只有一个常数项，$return$即可

## 快速数论逆变换-INTT

把点值表示的多项式**快速**转回系数表示法：

-   一个多项式在分治的过程中乘上原根的逆元，分治完的每一项乘以$inv(n)$即为原多项式的每一项系数

## FFT优化

### 迭代版（蝴蝶变换）

![img](https://raw.githubusercontent.com/ClearDewy/TyporaImg/main/img/202210302103786.png)

发现：**每个位置分治后的最终位置为其二进制翻转后得到的位置**

这样的话我们可以先把原序列变换好，把每个数放在最终的位置上，再一步一步向上合并
一句话就可以$O(n)$预处理第$i$位最终的位置$rev[i]$

```cpp
//求大于等于x的最小2^k
function<int(int)>pg=[&](int x)->int{
        x |= x >> 1;x |= x >> 2;x |= x >> 4;x |= x >> 8;x |= x >> 16;return x + 1;
    };
for (int i = 0; i < len; i++)
        rev[i]=(rev[i>>1]>>1)|(i&1)*(pg(m+n)>>1);
```

## 最终代码
```cpp
const int FN=(1<<22)+1,g=3,gi=332748118, mod = 998244353;
ll a[FN],b[FN];
int n,m,rev[FN];

inline ll fp(ll x, ll y) {
    ll base = 1;
    while (y){
        if (y&1)base =base*x%mod;
        x=x*x%mod;y >>= 1;
    }
    return base;
}

void NTT(){
    function<int(int)>pg=[&](int x)->int{
        if((x&-x)==x)return x;
        x |= x >> 1;x |= x >> 2;x |= x >> 4;x |= x >> 8;x |= x >> 16;return x + 1;
    };
    int len=pg(m+n);
    function<void(ll*,int)>ntt=[&](ll*a,int typ)->void{
        for (int i = 0; i < len; i++)
            if(i<rev[i])swap(a[i],a[rev[i]]);
        ll x,y;
        for (int i = 1; i < len; i<<=1)
        {
            ll gn=fp(~typ?g:gi,(mod-1)/(i<<1));
            for (int j = 0; j < len; j+=(i<<1)){
                ll g0=1;
                for (int k = 0; k < i; k++,g0=g0*gn%mod)
                {
                    x = a[j + k]; y = g0 * a[i + j + k] % mod;
                    a[j + k] = (x + y) % mod;
                    a[i + j + k] = (x - y + mod) % mod;
                }
            }
        }
        if(typ==1)return;
        ll len_inv=fp(len,mod-2);
        for (int i = 0; i < len; i++)a[i]=a[i]*len_inv%mod;
    };
    for (int i = 0; i < len; i++)
        rev[i]=(rev[i>>1]>>1)|(i&1)*(pg(m+n)>>1);
    ntt(a,1);ntt(b,1);
    for (int i = 0; i <= len; i++)
        a[i] = a[i] * b[i] % mod; 
    ntt(a,-1);
}
void ClearDewy(){
    n=read();m=read();
    for (int i = 0; i <= n; i++)
    {
        a[i]=read();
    }
    for (int i = 0; i <= m; i++)
    {
        b[i]=read();
    }
    int inv=fp(NTT(),mod-2);
    for (int i = 0; i <= m+n; i++)
    {
        printf("%lld ",a[i]);
    }
}
```

