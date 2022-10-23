# NTT

常见模数原根:$998244353,1004535809,469762049$,原根均为$3$ 

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

int NTT(){
    function<int(int)>pg=[&](int x)->int{
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
    };
    for (int i = 0; i < len; i++)
        rev[i]=(rev[i>>1]>>1)|(i&1)*(pg(m+n)>>1);
    ntt(a,1);ntt(b,1);
    for (int i = 0; i <= len; i++)
        a[i] = a[i] * b[i] % mod; 
    ntt(a,-1);
    //答案为 a[i]*inv(len)%mod

    return len;
}
void Qingtuan(){
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
        printf("%lld ",a[i]*inv%mod);
    }
}
```

