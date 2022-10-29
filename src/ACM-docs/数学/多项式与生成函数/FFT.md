# 快速傅里叶变换-FFT

## 多项式的表示方法

### 系数表示法

一个$n-1$次$n$项多项式可以表示为
$$
f(x)=a_0+a_1x+a_2x^2+\dots+a_{n-1}x^{n-1}
$$

### 点值表示法

在直角坐标系中由$n$个点组成的函数，可以看成$n$个$n$次方程，联立可将每一项的系数解出来，表示为：
$$
f(x)=\{(x_0,f(x_0)),(x_1,f(x_1))\dots,(x_{n-1},f(x_{n-1}))\}
$$

### 区别

设多项式$g(x)$，求$f(x)\cdot g(x)$

-   系数表示法：逐项相乘再合并，时间复杂度$O(n^2)$
-   点值表示法：将对应的项相乘，时间复杂度$O(n)$

## 离散傅里叶变换-DFT

**以下$n=2^k$**

### 复数

在复平面内作单位元，并将其分成$n$份，如图：![202210292347117](https://cdn.jsdelivr.net/gh/ClearDewy/TyporaImg/img/202210292348928.png)

从$0$开始标号，记$\omega_n^k$为将单位元分成$n$份后的第$k$分，由图我们可以得到如下性质：
$$
\begin{align}
\omega_n^k&=\omega_{2n}^{2k} \\
\omega_n^{k+\frac{n}{2}}&=-\omega_n^k \\
\omega_n^0&=\omega_n^n
\end{align}
$$

## 快速傅里叶变换-FFT

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
设$k(k<\frac{n}{2})$，令$x=\omega_n^k$带入$A(x)$得：
$$
\begin{align}
A(\omega_n^k)&=A_1((\omega_n^k)^2)+\omega_n^kA_2((\omega_n^k)^2)\\
&=A_1(\omega_n^{2k})+\omega_n^kA_2(\omega_n^{2k})\\
&=A_1(\omega_\frac{n}{2}^k)+\omega_n^kA_2(\omega_\frac{n}{2}^k)
\end{align}
$$
令$x=\omega_n^{\frac{n}{2}+k}$带入$A(x)$得：
$$
\begin{align}
A(\omega_n^{\frac{n}{2}+k})
&=A_1(\omega_n^{2k+n})+\omega_n^{\frac{n}{2}+k}A_2(\omega_n^{2k+n})\\
&=A_1(\omega_n^{2k}\omega_n^n)-\omega_n^kA_2(\omega_n^{2k}\omega_n^n)\\
&=A_1(\omega_n^{2k})-\omega_n^kA_2(\omega_n^{2k})\\
&=A_1(\omega_\frac{n}{2}^k)-\omega_n^kA_2(\omega_\frac{n}{2}^k)
\end{align}
$$
将式$(18)$和式$(22)$比较可知：

如果已知$A_1(\omega_\frac{n}{2}^k)$和$A_2(\omega_\frac{n}{2}^k)$的值，我们就可以同时知道$A(\omega_n^k)$和$A(\omega_n^{\frac{n}{2}+k})$的值

可以运用递归求得，每次回溯只用算的前一半的值即可得到后一半的值

递归边界：$n==1$时只有一个常数项，$return$即可

## 快速傅里叶逆变换-IFFT

把点值表示的多项式**快速**转回系数表示法：

-   一个多项式在分治的过程中乘上单位根的共轭复数，分治完的每一项除以$n$即为原多项式的每一项系数

## FFT优化

### 迭代版（蝴蝶变换）

![img](https://cdn.jsdelivr.net/gh/ClearDewy/TyporaImg/img/202210300034009.png)

发现：**每个位置分治后的最终位置为其二进制翻转后得到的位置**

这样的话我们可以先把原序列变换好，把每个数放在最终的位置上，再一步一步向上合并
一句话就可以$O(n)$预处理第$i$位最终的位置$rev[i]$

```c++
//求大于等于x的最小2^k
function<int(int)>pg=[&](int x)->int{
        x |= x >> 1;x |= x >> 2;x |= x >> 4;x |= x >> 8;x |= x >> 16;return x + 1;
    };
for (int i = 0; i < len; i++)
        rev[i]=(rev[i>>1]>>1)|(i&1)*(pg(m+n)>>1);
```

### “三步变两步”优化

设$A$和$B$是 实多项式，$F=A+Bi$，则$F^2=A^2-B^2+2ABi$，注意到我们要求的$AB$正是$F$虚部的一半。这样只需要两次FFT就可以求出结果。

## 最终代码

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
void ClearDewy(){
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
