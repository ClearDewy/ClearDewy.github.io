import{_ as i}from"./_plugin-vue_export-helper.cdc0426e.js";import{o as n,c as e,d as l}from"./app.17fea3bf.js";const d={},s=l(`<h1 id="fft" tabindex="-1"><a class="header-anchor" href="#fft" aria-hidden="true">#</a> FFT</h1><div class="language-c++ ext-c++ line-numbers-mode"><pre class="language-c++"><code>const int FN=(1&lt;&lt;22)+1;
complex&lt;double&gt;a[FN];
const double eps=0.49,PI=acos(-1.0);
int rev[FN];
int n,m;
int FFT(){
    function&lt;int(int)&gt;pg=[&amp;](int x)-&gt;int{
        x |= x &gt;&gt; 1;x |= x &gt;&gt; 2;x |= x &gt;&gt; 4;x |= x &gt;&gt; 8;x |= x &gt;&gt; 16;return x + 1;
    };
    int len=pg(m+n);
    function&lt;void(int)&gt;fft=[&amp;](int typ)-&gt;void{
        for (int i = 0; i &lt; len; i++)
            if(i&lt;rev[i])swap(a[i],a[rev[i]]);
        complex&lt;double&gt;x,y;
        for (int i = 1; i &lt; len; i&lt;&lt;=1)
        {
            complex&lt;double&gt;wn(cos(PI/i),typ*sin(PI/i));
            for (int j = 0; j &lt; len; j+=(i&lt;&lt;1)){
                complex&lt;double&gt;w0(1,0);
                for (int k = 0; k &lt; i; k++,w0*=wn)
                {
                    x=a[j+k];y=w0*a[i+j+k];
                    a[j+k]=x+y;a[i+j+k]=x-y;
                }
            }
        }
    };
    for (int i = 0; i &lt; len; i++)
        rev[i]=(rev[i&gt;&gt;1]&gt;&gt;1)|(i&amp;1)*(pg(m+n)&gt;&gt;1);
    fft(1);
    for (int i = 0; i &lt;= len; i++)
        a[i]=a[i]*a[i];
    fft(-1);
    //\u7B54\u6848\u4E3A a[i].imag() / 2 / len + eps \u7684\u6574\u6570\u90E8\u5206

    return len;
}
void Qingtuan(){
    n=read();m=read();
    for (int i = 0; i &lt;= n; i++)
    {
        a[i].real(read());
    }
    for (int i = 0; i &lt;= m; i++)
    {
        a[i].imag(read());
    }
    int len=FFT();
    for (int i = 0; i &lt;= m+n; i++)
    {
        printf(&quot;%.0f &quot;,a[i].imag() / 2 / len + eps);
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="" tabindex="-1"><a class="header-anchor" href="#" aria-hidden="true">#</a></h4>`,3),v=[s];function a(t,r){return n(),e("div",null,v)}const u=i(d,[["render",a],["__file","FFT.html.vue"]]);export{u as default};
