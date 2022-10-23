# FFT

```cpp
const int FN=(1<<22)+1;
complex<double>a[FN];
const double eps=0.49,PI=acos(-1.0);
int rev[FN];
int n,m;
int FFT(){
    function<int(int)>pg=[&](int x)->int{
        x |= x >> 1;x |= x >> 2;x |= x >> 4;x |= x >> 8;x |= x >> 16;return x + 1;
    };
    int len=pg(m+n);
    function<void(int)>fft=[&](int typ)->void{
        for (int i = 0; i < len; i++)
            if(i<rev[i])swap(a[i],a[rev[i]]);
        complex<double>x,y;
        for (int i = 1; i < len; i<<=1)
        {
            complex<double>wn(cos(PI/i),typ*sin(PI/i));
            for (int j = 0; j < len; j+=(i<<1)){
                complex<double>w0(1,0);
                for (int k = 0; k < i; k++,w0*=wn)
                {
                    x=a[j+k];y=w0*a[i+j+k];
                    a[j+k]=x+y;a[i+j+k]=x-y;
                }
            }
        }
    };
    for (int i = 0; i < len; i++)
        rev[i]=(rev[i>>1]>>1)|(i&1)*(pg(m+n)>>1);
    fft(1);
    for (int i = 0; i <= len; i++)
        a[i]=a[i]*a[i];
    fft(-1);
    //答案为 a[i].imag() / 2 / len + eps 的整数部分

    return len;
}
void Qingtuan(){
    n=read();m=read();
    for (int i = 0; i <= n; i++)
    {
        a[i].real(read());
    }
    for (int i = 0; i <= m; i++)
    {
        a[i].imag(read());
    }
    int len=FFT();
    for (int i = 0; i <= m+n; i++)
    {
        printf("%.0f ",a[i].imag() / 2 / len + eps);
    }
}
```

#### 