import{_ as i}from"./_plugin-vue_export-helper.cdc0426e.js";import{o as n,c as e,d as s}from"./app.804c2880.js";const l={},d=s(`<h1 id="manacher" tabindex="-1"><a class="header-anchor" href="#manacher" aria-hidden="true">#</a> Manacher</h1><div class="language-c++ ext-c++ line-numbers-mode"><pre class="language-c++"><code>const int N = 1e5 + 5;
const char g = &#39;&amp;&#39;;
char s[N];
int n = 0;
int pi[N &lt;&lt; 1] = { 0 };  //\u4EE5i\u4E3A\u4E2D\u5FC3\u7684\u534A\u5F84\u4E3Api[i]\u7684\u56DE\u6587\u5B57\u7B26\u4E32

void Manacher() {
    char c;
    s[0] = &#39;$&#39;;   //\u4F7F\u5934\u548C\u5C3E\u4E0D\u76F8\u540C 
    while (1)
    {
        c = getchar();
        if (c == &#39;\\n&#39;)
        {
            break;
        }
        s[++n] = c;
        s[++n] = g;
    }
    s[n] = &#39;^&#39;;

    for (int i = 0, l = 0, r = -1; i &lt;= n; i++)
    {
        int k = (i &gt; r) ? 1 : min(pi[l + r - i], r - i + 1);
        while (s[i - k] == s[i + k])
        {
            k++;
        }
        pi[i] = --k;
        if (i + k &gt; r)
        {
            r = i + k;
            l = i - k;
        }
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,2),a=[d];function c(r,v){return n(),e("div",null,a)}const b=i(l,[["render",c],["__file","Manacher.html.vue"]]);export{b as default};
