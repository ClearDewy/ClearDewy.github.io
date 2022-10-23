# Codeforces Round #829 (Div. 2)

:rocket::[Codeforces Round #829 (Div. 2) - Codeforces](https://codeforces.com/contest/1754)

## A. Technical Support

### Solve:

从前往后遍历到某一点时，如果‘$A$’比‘$Q$’多，则清空为$0$，最后判断‘$A$’的个数是否比‘’$Q$’的个数多即可

### Code

```cpp
#include<bits/stdc++.h>
#define ll long long
#define ptn putchar('\n')
using namespace std;

inline ll read() {ll x = 0, z = 1;char c = getchar();while (!isdigit(c)) {if (c == '-')z = -1;c = getchar();}while (isdigit(c)) {x = (x << 1) + (x << 3) + (c ^ 48);c = getchar();}return z * x;}
inline void writ(ll x){if(x<0) {putchar('-');x=(~x)+1;}if(x>9)writ(x/10);putchar(x-x/10*10+48);}

const int N=105;
char s[N];

void Qingtuan(){
    int n=read();
    cin>>s+1;
    int ans=0;
    for (int i = 1; i <= n; i++)
    {
        if(s[i]=='Q')ans++;
        else if(s[i]=='A')ans--;
        if(ans<0)ans=0;
    }
    if(ans)puts("No");
    else puts("Yes");

}



int main(){
    //cin.tie(nullptr)->sync_with_stdio(false);

    int T=read();while (T--)
    Qingtuan();
    return 0;
}
```

## B. Kevin and Permutation

### Solve:

找规律构造：

-   $n$为偶数时，最大构造为:

$$
1,\frac{n}{2}+1,2,\frac{n}{2}+2,\dots,\frac{n}{2},n
$$

-   $n$为奇数时，将最大的数字放在首位，使他不影响结果，剩下的数字按照$n$为偶数时构造，最大构造为:

$$
n,1,\frac{n-1}{2}+1,2,\frac{n-1}{2}+2,\dots,\frac{n-1}{2},n-1
$$

### Code:

```cpp
#include<bits/stdc++.h>
#define ll long long
#define ptn putchar('\n')
using namespace std;

inline ll read() {ll x = 0, z = 1;char c = getchar();while (!isdigit(c)) {if (c == '-')z = -1;c = getchar();}while (isdigit(c)) {x = (x << 1) + (x << 3) + (c ^ 48);c = getchar();}return z * x;}
inline void writ(ll x){if(x<0) {putchar('-');x=(~x)+1;}if(x>9)writ(x/10);putchar(x-x/10*10+48);}




void Qingtuan(){
    int n=read();
    if(n&1){
        writ(n);putchar(' ');n--;
    }
    int m=n/2;
    for (int i = m; i; i--)
    {
        printf("%d %d ",i,m+i);
    }
    ptn;
}



int main(){
    //cin.tie(nullptr)->sync_with_stdio(false);

    int T=read();while (T--)
    Qingtuan();
    return 0;
}
```

## C1. Make Nonzero Sum (easy version)

### Solve:

-   若数组中的数字和不为$2$的倍数，则一定不成立

-   记录$sum$为数组中每个数字的和
   -   若$sum=0$，将每个数字单个输出即可
   -   若$sum\neq 0$，可以证明必有连续的$1$或$-1$（$sum > 0$时为$1$,$sum < 0$时为$-1$，将连续的两个放在一起消掉即可，直到$sum=0$

### Code:

```cpp
#include<bits/stdc++.h>
#define ll long long
#define ptn putchar('\n')
using namespace std;

inline ll read() {ll x = 0, z = 1;char c = getchar();while (!isdigit(c)) {if (c == '-')z = -1;c = getchar();}while (isdigit(c)) {x = (x << 1) + (x << 3) + (c ^ 48);c = getchar();}return z * x;}
inline void writ(ll x){if(x<0) {putchar('-');x=(~x)+1;}if(x>9)writ(x/10);putchar(x-x/10*10+48);}




void Qingtuan(){
    int n=read();
    vector<int>a(n+1);
    int sum=0;
    for (int i = 1; i <= n; i++)
    {
        sum+=a[i]=read();
    }
    if(n&1){
        puts("-1");return;
    }
    vector<pair<int,int>>v;
    for (int i = 1; i <= n;i++)
    {
        if(i<n&&a[i]==a[i+1]&&a[i]*sum>0){
            v.push_back({i,i+1});sum-=2*a[i];i++;
        }
        else v.push_back({i,i});
    }
    writ(v.size());ptn;
    for(pair<int,int> &i:v){
        printf("%d %d\n",i.first,i.second);
    }

}



int main(){
    //cin.tie(nullptr)->sync_with_stdio(false);

    int T=read();while (T--)
    Qingtuan();
    return 0;
}
```

## C2. Make Nonzero Sum (hard version)

### Solve:

与$c1$相比多了元素为$0$的情况，同$c1$，假设$sum>0$，则必有连续的${1,1}$或${0,1}$，选取后对$sum$的影响都是$-2$，操作到$sum=0$后再将每一个单独选取即可

### Code:

```cpp
#include<bits/stdc++.h>
#define ll long long
#define ptn putchar('\n')
using namespace std;

inline ll read() {ll x = 0, z = 1;char c = getchar();while (!isdigit(c)) {if (c == '-')z = -1;c = getchar();}while (isdigit(c)) {x = (x << 1) + (x << 3) + (c ^ 48);c = getchar();}return z * x;}
inline void writ(ll x){if(x<0) {putchar('-');x=(~x)+1;}if(x>9)writ(x/10);putchar(x-x/10*10+48);}




void Qingtuan(){
    int n=read();
    vector<int>a(n+1);
    int sum=0;
    for (int i = 1; i <= n; i++)
    {
        sum+=a[i]=read();
    }
    if(sum&1){
        puts("-1");return;
    }
    vector<pair<int,int>>v;
    for (int i = 1; i <= n;i++)
    {
        if(i<n&&(a[i]==a[i+1]||a[i]==0)&&a[i+1]*sum>0){
            v.push_back({i,i+1});sum-=2*a[i+1];i++;
        }
        else v.push_back({i,i});
    }




    writ(v.size());ptn;
    for(pair<int,int> &i:v){
        printf("%d %d\n",i.first,i.second);
    }

}



int main(){
    //cin.tie(nullptr)->sync_with_stdio(false);

    int T=read();while (T--)
    Qingtuan();
    return 0;
}
```

## D. Factorial Divisibility

### Solve:

将排列合并：
$$
\underbrace{n!+n!+\dots +n!}_{n+1}=(n+1)!
$$
最后合并到只要$\forall i<x,i!$个数为$0$即可

## Code：

```cpp
#include<bits/stdc++.h>
#define ll long long
#define ptn putchar('\n')
using namespace std;

inline ll read() {ll x = 0, z = 1;char c = getchar();while (!isdigit(c)) {if (c == '-')z = -1;c = getchar();}while (isdigit(c)) {x = (x << 1) + (x << 3) + (c ^ 48);c = getchar();}return z * x;}
inline void writ(ll x){if(x<0) {putchar('-');x=(~x)+1;}if(x>9)writ(x/10);putchar(x-x/10*10+48);}



void Qingtuan(){
    int n=read(),x=read();
    vector<int>a(x+2);
    for (int i = 1; i <= n; i++)
    {
        a[read()]++;
    }
    for (int i = 1; i < x; i++)
    {
        a[i+1]+=a[i]/(i+1);
        a[i]%=i+1;
        if(a[i]){
            puts("No");return;
        }
    }
    puts("Yes");

}



int main(){
    //cin.tie(nullptr)->sync_with_stdio(false);

    //int T=read();while (T--)
    Qingtuan();
    return 0;
}
```

## E. Wish I Knew How to Sort

### Solve:

*简单的期望题*

假设$n$个数中有$m$个$0$，最终状态为：
$$
\underbrace{0,0,\dots 0}_m,\underbrace{1,1,\dots 1}_{n-m}
$$
假设最初状态前$m$个数组中有$x$个$1$,则后$n-m$个数中也有$x$个$0$

一次选择的总方案数为$\binom{n}{2}$即$C_n^2$，若当前前$m$个数中还剩$i$个$1$，有效的方案数为$i*i$

所以：
$$
P_i=\frac{i*i}{\frac{n*(n-1)}{2}}
$$
我们又知道期望：
$$
E_i=\frac{1}{P_i}
$$
我们还知道期望有线性，所以最后结果为：
$$
\sum_{i=1}^{z}E_i
$$
**最后别忘了取模！！！，因此$WA$了一发**

### Code:

```cpp
#include<bits/stdc++.h>
#define ll long long
#define ptn putchar('\n')
using namespace std;

inline ll read() {ll x = 0, z = 1;char c = getchar();while (!isdigit(c)) {if (c == '-')z = -1;c = getchar();}while (isdigit(c)) {x = (x << 1) + (x << 3) + (c ^ 48);c = getchar();}return z * x;}
inline void writ(ll x){if(x<0) {putchar('-');x=(~x)+1;}if(x>9)writ(x/10);putchar(x-x/10*10+48);}
const int mod=998244353,N=1e5+5;

inline ll fp(ll x, ll y) {
    ll base = 1;
    while (y){
        if (y&1)base =base*x%mod;
        x=x*x%mod;y >>= 1;
    }
    return base;
}

ll inv(ll x){
    return fp(x,mod-2);
}

void Qingtuan(){
    int n=read();
    ll invn=inv(1LL*n*(n-1)/2%mod);
    vector<int>a(n+1);
    int num0=0;
    for (int i = 1; i <= n; i++)
    {
        a[i]=read();if(!a[i])num0++;
    }
    int c1=0;
    for (int i = 1; i <= num0; i++)
    {
        c1+=a[i];
    }

    ll res=0;
    for (int i = 1; i <= c1; i++)
    {
        res=(res+inv(1LL*i*i%mod*invn%mod))%mod;
    }

    writ(res);ptn;
}



int main(){
    //cin.tie(nullptr)->sync_with_stdio(false);

    int T=read();while (T--)
    Qingtuan();
    return 0;
}
```

