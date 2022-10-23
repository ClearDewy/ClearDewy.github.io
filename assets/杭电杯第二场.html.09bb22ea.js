import{_ as e}from"./_plugin-vue_export-helper.cdc0426e.js";import{o as a,c as t,a as n,b as s,e as d,d as i,r}from"./app.a9f9613e.js";const m={},c=i(`<h1 id="\u676D\u7535\u676F\u7B2C\u4E8C\u573A" tabindex="-1"><a class="header-anchor" href="#\u676D\u7535\u676F\u7B2C\u4E8C\u573A" aria-hidden="true">#</a> \u676D\u7535\u676F\u7B2C\u4E8C\u573A</h1><p><em>\u4E2A\u4EBA\u9898\u89E3\uFF0C\u6B22\u8FCE\u6307\u6B63</em></p><h1 id="p1002" tabindex="-1"><a class="header-anchor" href="#p1002" aria-hidden="true">#</a> P1002</h1><h2 id="\u601D\u8DEF" tabindex="-1"><a class="header-anchor" href="#\u601D\u8DEF" aria-hidden="true">#</a> \u601D\u8DEF\uFF1A</h2><p>\u7B7E\u5230\u9898\uFF0C\u5C06&quot;std::make_tuple&quot;\u53BB\u6389\u540E\u8F93\u51FA\u540E\u8F93\u51FA\u5C31\u884C\u4E86</p><h2 id="code" tabindex="-1"><a class="header-anchor" href="#code" aria-hidden="true">#</a> Code\uFF1A</h2><div class="language-c++ ext-c++ line-numbers-mode"><pre class="language-c++"><code>#include&lt;bits/stdc++.h&gt;
#define ll long long
#define ull unsigned long long
#define WA return 0;
#define ptn putchar(&#39;\\n&#39;)
using namespace std;

inline ll read() {ll x = 0, z = 1;char c = getchar();while (!isdigit(c)) {if (c == &#39;-&#39;)z = -1;c = getchar();}while (isdigit(c)) {x = (x &lt;&lt; 1) + (x &lt;&lt; 3) + (c ^ 48);c = getchar();}return z * x;}
inline void writ(ll x){if(x&lt;0) {putchar(&#39;-&#39;);x=(~x)+1;}if(x&gt;9)writ(x/10);putchar(x-x/10*10+48);}

string c=&quot;std::make_tuple&quot;;
string s;

void Qingtuan(){
    cin&gt;&gt;s;
    for (int i = 0; i &lt; s.size(); i++)
    {
        if(i+15&gt;s.size())break;
        if(string(s.begin()+i,s.begin()+i+15)==c){
            s.erase(s.begin()+i,s.begin()+i+15);
        }
    }
    cout&lt;&lt;s&lt;&lt;endl;
}



int main(){
    //cin.tie(nullptr)-&gt;sync_with_stdio(false);

    int T=read();while (T--)
    Qingtuan();
    WA
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="p1003" tabindex="-1"><a class="header-anchor" href="#p1003" aria-hidden="true">#</a> P1003</h1><h2 id="\u9898\u76EE\u5927\u610F" tabindex="-1"><a class="header-anchor" href="#\u9898\u76EE\u5927\u610F" aria-hidden="true">#</a> \u9898\u76EE\u5927\u610F\uFF1A</h2>`,9),v=n("ul",null,[n("li",null,[n("p",null,[s("\u5BF9\u4E8E\u590D\u5236\u64CD\u4F5C\uFF0C\u9009\u53D6\u533A\u95F4"),n("span",{class:"katex"},[n("span",{class:"katex-mathml"},[n("math",{xmlns:"http://www.w3.org/1998/Math/MathML"},[n("semantics",null,[n("mrow",null,[n("mo",{stretchy:"false"},"["),n("mi",null,"l"),n("mo",{separator:"true"},","),n("mi",null,"r"),n("mo",{stretchy:"false"},"]")]),n("annotation",{encoding:"application/x-tex"},"[l,r]")])])]),n("span",{class:"katex-html","aria-hidden":"true"},[n("span",{class:"base"},[n("span",{class:"strut",style:{height:"1em","vertical-align":"-0.25em"}}),n("span",{class:"mopen"},"["),n("span",{class:"mord mathnormal",style:{"margin-right":"0.01968em"}},"l"),n("span",{class:"mpunct"},","),n("span",{class:"mspace",style:{"margin-right":"0.1667em"}}),n("span",{class:"mord mathnormal",style:{"margin-right":"0.02778em"}},"r"),n("span",{class:"mclose"},"]")])])]),s("\u590D\u5236\u540E\u63D2\u5165\u5230"),n("span",{class:"katex"},[n("span",{class:"katex-mathml"},[n("math",{xmlns:"http://www.w3.org/1998/Math/MathML"},[n("semantics",null,[n("mrow",null,[n("mi",null,"r")]),n("annotation",{encoding:"application/x-tex"},"r")])])]),n("span",{class:"katex-html","aria-hidden":"true"},[n("span",{class:"base"},[n("span",{class:"strut",style:{height:"0.4306em"}}),n("span",{class:"mord mathnormal",style:{"margin-right":"0.02778em"}},"r")])])]),s("\u540E\u9762\u7684\u4F4D\u7F6E")])]),n("li",null,[n("p",null,"\u5BF9\u4E8E\u8BE2\u95EE\u64CD\u4F5C\uFF0C\u67E5\u8BE2\u5230\u7ED3\u679C\u540E\u7528\u4E2A\u6570\u5B57\u8BB0\u5F55\u5F02\u6216\u503C\u603B\u548C")])],-1),u={href:"https://codeforces.com/contest/1705/problem/C",target:"_blank",rel:"noopener noreferrer"},h=n("h2",{id:"\u601D\u8DEF-1",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#\u601D\u8DEF-1","aria-hidden":"true"},"#"),s(" \u601D\u8DEF\uFF1A")],-1),p=n("p",null,[s("\u8BB0\u5F55\u6BCF\u6B21\u64CD\u4F5C\u540E\u6B64\u65F6\u5B57\u7B26\u4E32\u590D\u5236\u7684"),n("span",{class:"katex"},[n("span",{class:"katex-mathml"},[n("math",{xmlns:"http://www.w3.org/1998/Math/MathML"},[n("semantics",null,[n("mrow",null,[n("mo",{stretchy:"false"},"["),n("mi",null,"l"),n("mo",{separator:"true"},","),n("mi",null,"r"),n("mo",{stretchy:"false"},"]")]),n("annotation",{encoding:"application/x-tex"},"[l,r]")])])]),n("span",{class:"katex-html","aria-hidden":"true"},[n("span",{class:"base"},[n("span",{class:"strut",style:{height:"1em","vertical-align":"-0.25em"}}),n("span",{class:"mopen"},"["),n("span",{class:"mord mathnormal",style:{"margin-right":"0.01968em"}},"l"),n("span",{class:"mpunct"},","),n("span",{class:"mspace",style:{"margin-right":"0.1667em"}}),n("span",{class:"mord mathnormal",style:{"margin-right":"0.02778em"}},"r"),n("span",{class:"mclose"},"]")])])]),s("\u533A\u95F4\u548C\u603B\u957F\u5EA6(\u82E5\u590D\u5236"),n("span",{class:"katex"},[n("span",{class:"katex-mathml"},[n("math",{xmlns:"http://www.w3.org/1998/Math/MathML"},[n("semantics",null,[n("mrow",null,[n("mo",{stretchy:"false"},"["),n("mn",null,"2"),n("mo",{separator:"true"},","),n("mn",null,"4"),n("mo",{stretchy:"false"},"]")]),n("annotation",{encoding:"application/x-tex"},"[2,4]")])])]),n("span",{class:"katex-html","aria-hidden":"true"},[n("span",{class:"base"},[n("span",{class:"strut",style:{height:"1em","vertical-align":"-0.25em"}}),n("span",{class:"mopen"},"["),n("span",{class:"mord"},"2"),n("span",{class:"mpunct"},","),n("span",{class:"mspace",style:{"margin-right":"0.1667em"}}),n("span",{class:"mord"},"4"),n("span",{class:"mclose"},"]")])])]),s("\u5219"),n("span",{class:"katex"},[n("span",{class:"katex-mathml"},[n("math",{xmlns:"http://www.w3.org/1998/Math/MathML"},[n("semantics",null,[n("mrow",null,[n("mo",{stretchy:"false"},"["),n("mi",null,"l"),n("mo",{separator:"true"},","),n("mi",null,"r"),n("mo",{stretchy:"false"},"]")]),n("annotation",{encoding:"application/x-tex"},"[l,r]")])])]),n("span",{class:"katex-html","aria-hidden":"true"},[n("span",{class:"base"},[n("span",{class:"strut",style:{height:"1em","vertical-align":"-0.25em"}}),n("span",{class:"mopen"},"["),n("span",{class:"mord mathnormal",style:{"margin-right":"0.01968em"}},"l"),n("span",{class:"mpunct"},","),n("span",{class:"mspace",style:{"margin-right":"0.1667em"}}),n("span",{class:"mord mathnormal",style:{"margin-right":"0.02778em"}},"r"),n("span",{class:"mclose"},"]")])])]),s("\u4E3A"),n("span",{class:"katex"},[n("span",{class:"katex-mathml"},[n("math",{xmlns:"http://www.w3.org/1998/Math/MathML"},[n("semantics",null,[n("mrow",null,[n("mo",{stretchy:"false"},"["),n("mn",null,"5"),n("mo",{separator:"true"},","),n("mn",null,"7"),n("mo",{stretchy:"false"},"]")]),n("annotation",{encoding:"application/x-tex"},"[5,7]")])])]),n("span",{class:"katex-html","aria-hidden":"true"},[n("span",{class:"base"},[n("span",{class:"strut",style:{height:"1em","vertical-align":"-0.25em"}}),n("span",{class:"mopen"},"["),n("span",{class:"mord"},"5"),n("span",{class:"mpunct"},","),n("span",{class:"mspace",style:{"margin-right":"0.1667em"}}),n("span",{class:"mord"},"7"),n("span",{class:"mclose"},"]")])])]),s(")\uFF0C\u7136\u540E\u5411\u524D\u4E00\u4E2A\u5B57\u7B26\u4E32\u6620\u5C04\uFF0C\u8BBE\u8BE2\u95EE\u7684\u4E0B\u6807\u4E3A"),n("span",{class:"katex"},[n("span",{class:"katex-mathml"},[n("math",{xmlns:"http://www.w3.org/1998/Math/MathML"},[n("semantics",null,[n("mrow",null,[n("mi",null,"i"),n("mi",null,"d"),n("mi",null,"x")]),n("annotation",{encoding:"application/x-tex"},"idx")])])]),n("span",{class:"katex-html","aria-hidden":"true"},[n("span",{class:"base"},[n("span",{class:"strut",style:{height:"0.6944em"}}),n("span",{class:"mord mathnormal"},"i"),n("span",{class:"mord mathnormal"},"d"),n("span",{class:"mord mathnormal"},"x")])])])],-1),o=n("ul",null,[n("li",null,[s("\u82E5"),n("span",{class:"katex"},[n("span",{class:"katex-mathml"},[n("math",{xmlns:"http://www.w3.org/1998/Math/MathML"},[n("semantics",null,[n("mrow",null,[n("mi",null,"i"),n("mi",null,"d"),n("mi",null,"x"),n("mo",null,"<"),n("mi",null,"l")]),n("annotation",{encoding:"application/x-tex"},"idx<l")])])]),n("span",{class:"katex-html","aria-hidden":"true"},[n("span",{class:"base"},[n("span",{class:"strut",style:{height:"0.7335em","vertical-align":"-0.0391em"}}),n("span",{class:"mord mathnormal"},"i"),n("span",{class:"mord mathnormal"},"d"),n("span",{class:"mord mathnormal"},"x"),n("span",{class:"mspace",style:{"margin-right":"0.2778em"}}),n("span",{class:"mrel"},"<"),n("span",{class:"mspace",style:{"margin-right":"0.2778em"}})]),n("span",{class:"base"},[n("span",{class:"strut",style:{height:"0.6944em"}}),n("span",{class:"mord mathnormal",style:{"margin-right":"0.01968em"}},"l")])])]),s(",\u5219\u76F4\u63A5\u6620\u5C04\u5230\u524D\u4E00\u4E2A\u5B57\u7B26\u4E32")]),n("li",null,[s("\u82E5"),n("span",{class:"katex"},[n("span",{class:"katex-mathml"},[n("math",{xmlns:"http://www.w3.org/1998/Math/MathML"},[n("semantics",null,[n("mrow",null,[n("mi",null,"i"),n("mi",null,"d"),n("mi",null,"x"),n("mo",null,">"),n("mi",null,"r")]),n("annotation",{encoding:"application/x-tex"},"idx>r")])])]),n("span",{class:"katex-html","aria-hidden":"true"},[n("span",{class:"base"},[n("span",{class:"strut",style:{height:"0.7335em","vertical-align":"-0.0391em"}}),n("span",{class:"mord mathnormal"},"i"),n("span",{class:"mord mathnormal"},"d"),n("span",{class:"mord mathnormal"},"x"),n("span",{class:"mspace",style:{"margin-right":"0.2778em"}}),n("span",{class:"mrel"},">"),n("span",{class:"mspace",style:{"margin-right":"0.2778em"}})]),n("span",{class:"base"},[n("span",{class:"strut",style:{height:"0.4306em"}}),n("span",{class:"mord mathnormal",style:{"margin-right":"0.02778em"}},"r")])])]),s(",\u5728\u524D\u4E00\u4E2A\u5B57\u7B26\u4E32\u4E2D\u8BE5\u5B57\u7B26\u7684\u4F4D\u7F6E\u4E3A"),n("span",{class:"katex"},[n("span",{class:"katex-mathml"},[n("math",{xmlns:"http://www.w3.org/1998/Math/MathML"},[n("semantics",null,[n("mrow",null,[n("mi",null,"i"),n("mi",null,"d"),n("mi",null,"x"),n("mo",null,"\u2212"),n("mo",{stretchy:"false"},"("),n("mi",null,"r"),n("mo",null,"\u2212"),n("mi",null,"l"),n("mo",null,"+"),n("mn",null,"1"),n("mo",{stretchy:"false"},")")]),n("annotation",{encoding:"application/x-tex"},"idx-(r-l+1)")])])]),n("span",{class:"katex-html","aria-hidden":"true"},[n("span",{class:"base"},[n("span",{class:"strut",style:{height:"0.7778em","vertical-align":"-0.0833em"}}),n("span",{class:"mord mathnormal"},"i"),n("span",{class:"mord mathnormal"},"d"),n("span",{class:"mord mathnormal"},"x"),n("span",{class:"mspace",style:{"margin-right":"0.2222em"}}),n("span",{class:"mbin"},"\u2212"),n("span",{class:"mspace",style:{"margin-right":"0.2222em"}})]),n("span",{class:"base"},[n("span",{class:"strut",style:{height:"1em","vertical-align":"-0.25em"}}),n("span",{class:"mopen"},"("),n("span",{class:"mord mathnormal",style:{"margin-right":"0.02778em"}},"r"),n("span",{class:"mspace",style:{"margin-right":"0.2222em"}}),n("span",{class:"mbin"},"\u2212"),n("span",{class:"mspace",style:{"margin-right":"0.2222em"}})]),n("span",{class:"base"},[n("span",{class:"strut",style:{height:"0.7778em","vertical-align":"-0.0833em"}}),n("span",{class:"mord mathnormal",style:{"margin-right":"0.01968em"}},"l"),n("span",{class:"mspace",style:{"margin-right":"0.2222em"}}),n("span",{class:"mbin"},"+"),n("span",{class:"mspace",style:{"margin-right":"0.2222em"}})]),n("span",{class:"base"},[n("span",{class:"strut",style:{height:"1em","vertical-align":"-0.25em"}}),n("span",{class:"mord"},"1"),n("span",{class:"mclose"},")")])])])]),n("li",null,[s("\u82E5"),n("span",{class:"katex"},[n("span",{class:"katex-mathml"},[n("math",{xmlns:"http://www.w3.org/1998/Math/MathML"},[n("semantics",null,[n("mrow",null,[n("mi",null,"l"),n("mo",null,"\u2264"),n("mi",null,"i"),n("mi",null,"d"),n("mi",null,"x"),n("mo",null,"\u2264"),n("mi",null,"r")]),n("annotation",{encoding:"application/x-tex"},"l \\leq idx \\leq r")])])]),n("span",{class:"katex-html","aria-hidden":"true"},[n("span",{class:"base"},[n("span",{class:"strut",style:{height:"0.8304em","vertical-align":"-0.136em"}}),n("span",{class:"mord mathnormal",style:{"margin-right":"0.01968em"}},"l"),n("span",{class:"mspace",style:{"margin-right":"0.2778em"}}),n("span",{class:"mrel"},"\u2264"),n("span",{class:"mspace",style:{"margin-right":"0.2778em"}})]),n("span",{class:"base"},[n("span",{class:"strut",style:{height:"0.8304em","vertical-align":"-0.136em"}}),n("span",{class:"mord mathnormal"},"i"),n("span",{class:"mord mathnormal"},"d"),n("span",{class:"mord mathnormal"},"x"),n("span",{class:"mspace",style:{"margin-right":"0.2778em"}}),n("span",{class:"mrel"},"\u2264"),n("span",{class:"mspace",style:{"margin-right":"0.2778em"}})]),n("span",{class:"base"},[n("span",{class:"strut",style:{height:"0.4306em"}}),n("span",{class:"mord mathnormal",style:{"margin-right":"0.02778em"}},"r")])])]),s(",\u5219"),n("span",{class:"katex"},[n("span",{class:"katex-mathml"},[n("math",{xmlns:"http://www.w3.org/1998/Math/MathML"},[n("semantics",null,[n("mrow",null,[n("mi",null,"i"),n("mi",null,"d"),n("mi",null,"x"),n("mo",null,"="),n("mi",null,"i"),n("mi",null,"d"),n("mi",null,"x"),n("mo",null,"\u2212"),n("mi",null,"c"),n("mo",null,"\u2212"),n("mi",null,"r"),n("mo",null,"+"),n("mi",null,"l")]),n("annotation",{encoding:"application/x-tex"},"idx=idx-c-r+l")])])]),n("span",{class:"katex-html","aria-hidden":"true"},[n("span",{class:"base"},[n("span",{class:"strut",style:{height:"0.6944em"}}),n("span",{class:"mord mathnormal"},"i"),n("span",{class:"mord mathnormal"},"d"),n("span",{class:"mord mathnormal"},"x"),n("span",{class:"mspace",style:{"margin-right":"0.2778em"}}),n("span",{class:"mrel"},"="),n("span",{class:"mspace",style:{"margin-right":"0.2778em"}})]),n("span",{class:"base"},[n("span",{class:"strut",style:{height:"0.7778em","vertical-align":"-0.0833em"}}),n("span",{class:"mord mathnormal"},"i"),n("span",{class:"mord mathnormal"},"d"),n("span",{class:"mord mathnormal"},"x"),n("span",{class:"mspace",style:{"margin-right":"0.2222em"}}),n("span",{class:"mbin"},"\u2212"),n("span",{class:"mspace",style:{"margin-right":"0.2222em"}})]),n("span",{class:"base"},[n("span",{class:"strut",style:{height:"0.6667em","vertical-align":"-0.0833em"}}),n("span",{class:"mord mathnormal"},"c"),n("span",{class:"mspace",style:{"margin-right":"0.2222em"}}),n("span",{class:"mbin"},"\u2212"),n("span",{class:"mspace",style:{"margin-right":"0.2222em"}})]),n("span",{class:"base"},[n("span",{class:"strut",style:{height:"0.6667em","vertical-align":"-0.0833em"}}),n("span",{class:"mord mathnormal",style:{"margin-right":"0.02778em"}},"r"),n("span",{class:"mspace",style:{"margin-right":"0.2222em"}}),n("span",{class:"mbin"},"+"),n("span",{class:"mspace",style:{"margin-right":"0.2222em"}})]),n("span",{class:"base"},[n("span",{class:"strut",style:{height:"0.6944em"}}),n("span",{class:"mord mathnormal",style:{"margin-right":"0.01968em"}},"l")])])]),s(","),n("em",null,"\u5316\u7B80\u540E\u7684\uFF0C\u81EA\u5DF1\u5C1D\u8BD5\u63A8\u4E00\u4E0B")])],-1),b=n("p",null,"\u4E00\u76F4\u6620\u5C04\u5230\u6700\u521D\u7684\u5B57\u7B26\u4E32\u5C31\u53EF\u4EE5\u4E86",-1),g=n("p",null,[n("em",null,[s("\u5F53\u7136\u8FD9\u4E0D\u662F\u6B63\u89E3\uFF0C\u56E0\u4E3A\u5BF9\u4E8E\u76F8\u540C\u7684\u67E5\u8BE2\u7684\u503C\u5F02\u6216\u4E3A"),n("span",{class:"katex"},[n("span",{class:"katex-mathml"},[n("math",{xmlns:"http://www.w3.org/1998/Math/MathML"},[n("semantics",null,[n("mrow",null,[n("mn",null,"0")]),n("annotation",{encoding:"application/x-tex"},"0")])])]),n("span",{class:"katex-html","aria-hidden":"true"},[n("span",{class:"base"},[n("span",{class:"strut",style:{height:"0.6444em"}}),n("span",{class:"mord"},"0")])])]),s("\uFF0C\u6807\u7A0B\u662F\u7528"),n("span",{class:"katex"},[n("span",{class:"katex-mathml"},[n("math",{xmlns:"http://www.w3.org/1998/Math/MathML"},[n("semantics",null,[n("mrow",null,[n("mi",null,"b"),n("mi",null,"i"),n("mi",null,"t"),n("mi",null,"s"),n("mi",null,"e"),n("mi",null,"t")]),n("annotation",{encoding:"application/x-tex"},"bitset")])])]),n("span",{class:"katex-html","aria-hidden":"true"},[n("span",{class:"base"},[n("span",{class:"strut",style:{height:"0.6944em"}}),n("span",{class:"mord mathnormal"},"bi"),n("span",{class:"mord mathnormal"},"t"),n("span",{class:"mord mathnormal"},"se"),n("span",{class:"mord mathnormal"},"t")])])]),s("\u4F18\u5316\uFF0C\u8FD9\u91CC\u7ED9\u51FA\u672C\u4EBA\u8D5B\u65F6\u4EE3\u7801")])],-1),x=i(`<h2 id="code-1" tabindex="-1"><a class="header-anchor" href="#code-1" aria-hidden="true">#</a> Code:</h2><div class="language-c++ ext-c++ line-numbers-mode"><pre class="language-c++"><code>#include&lt;bits/stdc++.h&gt;
#define ll long long
#define ull unsigned long long
#define WA return 0;
#define ptn putchar(&#39;\\n&#39;)
using namespace std;

inline ll read() {ll x = 0, z = 1;char c = getchar();while (!isdigit(c)) {if (c == &#39;-&#39;)z = -1;c = getchar();}while (isdigit(c)) {x = (x &lt;&lt; 1) + (x &lt;&lt; 3) + (c ^ 48);c = getchar();}return z * x;}
inline void writ(ll x){if(x&lt;0) {putchar(&#39;-&#39;);x=(~x)+1;}if(x&gt;9)writ(x/10);putchar(x-x/10*10+48);}

ll n,q;
ll res=0;

void Qingtuan(){
    n=read();q=read();res=0;
    vector&lt;ll&gt;a(n+1);
    for (int i = 1; i &lt;= n; i++)
    {
        a[i]=read();
    }
    vector&lt;ll&gt;b;
    vector&lt;pair&lt;ll,ll&gt;&gt;c;
    b.push_back(n);
    c.push_back({1,n});
    pair&lt;ll,ll&gt;t;
    int ch;ll k,idx;
    while (q--)
    {
        ch=read();
        if(ch==1){
            t.first=read();t.second=read();
            b.push_back(*b.rbegin()+t.second-t.first+1);
            c.push_back({t.second+1,t.second+1+t.second-t.first});
        }else{
            k=read();
            for (int i = b.size()-1; i &gt;0; i--)
            {
                if(k&lt;c[i].first)continue;
                if(k&gt;c[i].second){
                    k-=c[i].second-c[i].first+1;
                }else{
                    k=k-1-c[i].second+c[i].first;
                }
            }
            res^=a[k];
        }
    }
    writ(res);ptn;


}



int main(){
    //cin.tie(nullptr)-&gt;sync_with_stdio(false);

    int T=read();while (T--)
    Qingtuan();
    WA
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="p1007" tabindex="-1"><a class="header-anchor" href="#p1007" aria-hidden="true">#</a> P1007</h1><p><em>emm,\u672C\u4EBA\u6CA1\u770B\u8FD9\u9898\uFF0C\u5C31\u76F4\u63A5\u8D34\u4E0A\u961F\u53CB\u7684\u4EE3\u7801\u4E86</em></p><div class="language-c++ ext-c++ line-numbers-mode"><pre class="language-c++"><code>#include&lt;bits/stdc++.h&gt;

using namespace std;

typedef long long ll;
typedef pair&lt;int,int&gt; pii;

#define IOS ios::sync_with_stdio(false),cin.tie(nullptr),cout.tie(nullptr)
#define lowbit(x)   ((x)&amp;(-x))
#define fi first
#define se second
#define pb push_back
#define cf(_) int _;cin &gt;&gt; _;while(_--)

template &lt;typename T&gt; bool chkMax(T &amp;x, T y) { return (y &gt; x) ? x = y, 1 : 0; }
template &lt;typename T&gt; bool chkMin(T &amp;x, T y) { return (y &lt; x) ? x = y, 1 : 0; }

template &lt;typename T&gt; void inline read(T &amp;x) {
	int f = 1; x = 0; char c = getchar();
	while (c &lt; &#39;0&#39; || c &gt; &#39;9&#39;) { if (c == &#39;-&#39;) f = -1; c = getchar(); }
	while (c &lt;= &#39;9&#39; &amp;&amp; c &gt;= &#39;0&#39;) x = (x &lt;&lt; 1) + (x &lt;&lt; 3) + (c ^ 48), c = getchar();
	x *= f;
}

int main()
{
	IOS;
	cf(_)
	{
		int n;
		cin &gt;&gt; n;
		vector&lt;pii&gt; a(n);

		for(int i = 0;i &lt; n;i++)	cin &gt;&gt; a[i].fi &gt;&gt; a[i].se;

		sort(a.begin(),a.end());
		// for(int i = 0;i &lt; n;i++)	cout &lt;&lt; a[i].fi &lt;&lt; &quot; &quot; &lt;&lt; a[i].se &lt;&lt; endl;
		int res = 1;
		for(int i = 0;i &lt; n - 1;i++)
		{
			if(a[i].se &gt;= a[i + 1].fi)	
			{
				res -= 1;
				break;
			}	
			else	res++;
		}
		cout &lt;&lt; res &lt;&lt; endl;
	}
	return 0;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="p1009" tabindex="-1"><a class="header-anchor" href="#p1009" aria-hidden="true">#</a> P1009</h1><h1 id="\u9898\u76EE\u5927\u610F-1" tabindex="-1"><a class="header-anchor" href="#\u9898\u76EE\u5927\u610F-1" aria-hidden="true">#</a> \u9898\u76EE\u5927\u610F</h1>`,7),f=n("p",null,[s("\u7ED9\u5B9A"),n("span",{class:"katex"},[n("span",{class:"katex-mathml"},[n("math",{xmlns:"http://www.w3.org/1998/Math/MathML"},[n("semantics",null,[n("mrow",null,[n("mi",null,"P"),n("mo",{separator:"true"},","),n("mi",null,"Q"),n("mo",{separator:"true"},","),n("mi",null,"x")]),n("annotation",{encoding:"application/x-tex"},"P,Q,x")])])]),n("span",{class:"katex-html","aria-hidden":"true"},[n("span",{class:"base"},[n("span",{class:"strut",style:{height:"0.8778em","vertical-align":"-0.1944em"}}),n("span",{class:"mord mathnormal",style:{"margin-right":"0.13889em"}},"P"),n("span",{class:"mpunct"},","),n("span",{class:"mspace",style:{"margin-right":"0.1667em"}}),n("span",{class:"mord mathnormal"},"Q"),n("span",{class:"mpunct"},","),n("span",{class:"mspace",style:{"margin-right":"0.1667em"}}),n("span",{class:"mord mathnormal"},"x")])])]),s("\u6EE1\u8DB3\uFF1A"),n("em",null,"P"),s(" \xD7 "),n("em",null,"Q"),s("\u22611 mod "),n("em",null,"M"),s("\uFF0C"),n("em",null,"M"),s("\u4E3A\u8D28\u6570")],-1),y=n("p",null,[s("\u5224\u65AD\u662F\u5426\u6709"),n("span",{class:"katex"},[n("span",{class:"katex-mathml"},[n("math",{xmlns:"http://www.w3.org/1998/Math/MathML"},[n("semantics",null,[n("mrow",null,[n("mi",null,"y")]),n("annotation",{encoding:"application/x-tex"},"y")])])]),n("span",{class:"katex-html","aria-hidden":"true"},[n("span",{class:"base"},[n("span",{class:"strut",style:{height:"0.625em","vertical-align":"-0.1944em"}}),n("span",{class:"mord mathnormal",style:{"margin-right":"0.03588em"}},"y")])])]),s("\u6EE1\u8DB3\uFF1Ax = y \xD7 P mod "),n("em",null,"M")],-1),w=i(`<p>\u200B y = x \xD7 Q mod <em>M</em></p><h2 id="\u601D\u8DEF-2" tabindex="-1"><a class="header-anchor" href="#\u601D\u8DEF-2" aria-hidden="true">#</a> \u601D\u8DEF\uFF1A</h2><p>\u56E0\u4E3AM\u4E3A\u8D28\u6570\uFF0C\u4E14M\u6700\u5927\u4E3A <em>P</em> \xD7 <em>Q</em>-1\uFF0C\u6240\u4EE5\u6211\u4EEC\u53EA\u9700\u8981\u5C06<em>P</em> \xD7 <em>Q</em>-1\u8D28\u56E0\u6570\u5206\u89E3\uFF0C\u7136\u540E\u6C42\u51FA\u662F\u5426\u6709\u8FD9\u4E2A y \u5C31\u53EF\u4EE5\u4E86</p><h2 id="code-2" tabindex="-1"><a class="header-anchor" href="#code-2" aria-hidden="true">#</a> Code\uFF1A</h2><div class="language-c++ ext-c++ line-numbers-mode"><pre class="language-c++"><code>#include&lt;bits/stdc++.h&gt;
#define ll long long
#define ull unsigned long long
#define WA return 0;
#define ptn putchar(&#39;\\n&#39;)
using namespace std;

inline ll read() {ll x = 0, z = 1;char c = getchar();while (!isdigit(c)) {if (c == &#39;-&#39;)z = -1;c = getchar();}while (isdigit(c)) {x = (x &lt;&lt; 1) + (x &lt;&lt; 3) + (c ^ 48);c = getchar();}return z * x;}
inline void writ(ll x){if(x&lt;0) {putchar(&#39;-&#39;);x=(~x)+1;}if(x&gt;9)writ(x/10);putchar(x-x/10*10+48);}

const int pri =2e6;
bool visi[pri+5];
int prime[pri+5];
int num = 0;

void getprime() {
    for (int i = 2; i &lt;= pri; i++)
    {
        if (!visi[i])
        {
            prime[num++] = i;
        }
        for (int j = 0; j &lt; num &amp;&amp; i * prime[j] &lt;= pri; j++)
        {
            visi[i * prime[j]] = 1;
            if (i % prime[j] == 0)
            {
            break;
            }
        }
    }
}

ll p,q,x,y;
ll m;


void Qingtuan(){
    p=read();q=read();x=read();
    m=p*q-1;
    bool ju=0;
    for (int i = 0; i &lt; num; i++)
    {
        if(!(m%prime[i])){
            while (!(m%prime[i]))
            {
                m/=prime[i];
            }
            y=x*q%prime[i];
            if(x==y*p%prime[i]){
                ju=1;break;
            }
        }
    }
    if(m!=1){
        y=x*q%m;
        if(x==y*p%m){
            ju=1;
        }
    }
    if(ju){
        writ(y);ptn;
    }else{
        puts(&quot;shuanQ&quot;);
    }


}



int main(){
    //cin.tie(nullptr)-&gt;sync_with_stdio(false);
    getprime();
    int T=read();while (T--)
    Qingtuan();
    WA
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="p1012" tabindex="-1"><a class="header-anchor" href="#p1012" aria-hidden="true">#</a> P1012</h1><h2 id="\u9898\u76EE\u5927\u610F-2" tabindex="-1"><a class="header-anchor" href="#\u9898\u76EE\u5927\u610F-2" aria-hidden="true">#</a> \u9898\u76EE\u5927\u610F\uFF1A</h2><p>\u6709\u9762\u503C\u4E3A7,31,365\u7684\u4E09\u79CD\u786C\u5E01\u4F7F\u7528\u6700\u5C0F\u7684\u786C\u5E01\u6570\u91CF\u51D1\u6210\u603B\u4EF7\u503C\u4E3A n \uFF0C\u6C42\u662F\u5426\u80FD\u51D1\u6210\u6216\u6700\u5C0F\u786C\u5E01\u6570</p><h2 id="\u601D\u8DEF-3" tabindex="-1"><a class="header-anchor" href="#\u601D\u8DEF-3" aria-hidden="true">#</a> \u601D\u8DEF\uFF1A</h2><p>\u6211\u4EEC\u53D1\u73B07\u548C31\u4E92\u8D28\uFF0C\u5BF9\u4E8E\u4E24\u4E2A\u4E92\u8D28\u7684\u6570a\uFF0Cb\uFF0C\u6700\u5927\u4E0D\u80FD\u7EC4\u6210\u7684\u6570\u4E3Aa*b-a-b\uFF0C\u6B64\u9898\u4E3A217\uFF0C\u6240\u4EE5\u5F53n\u5F88\u5927\u65F6\uFF0C\u6211\u4EEC\u76F4\u63A5\u53D6\u6A21365\uFF0C\u5224\u65AD\u662F\u5426\u6709\u89E3\uFF0C\u5982\u679C\u6CA1\u6709\uFF0C\u5728n\u539F\u672C\u5927\u4E8E365\u7684\u60C5\u51B5\u4E0B\uFF0C\u53D6\u6A21\u540E\u52A0\u4E0A\u4E00\u4E2A365\uFF0C\u6B64\u65F6\u5FC5\u5B9A\u6709\u89E3\uFF0C\u66B4\u529B\u679A\u4E3E\u540E\u8F93\u51FA\u5373\u53EF</p><p><em>\u6BD4\u8D5B\u7684\u65F6\u5019\u5361\u4E86\u597D\u4E45\uFF0C\u6807\u7A0B\u662Fdp\u679A\u4E3E\u8F83\u5C0F\u7684\uFF0C\u6211\u8FD9\u8FB9\u76F4\u63A5\u66B4\u529B\u54C8\u54C8\u54C8\u54C8\u554A\u54C8\u54C8</em></p><h2 id="code-3" tabindex="-1"><a class="header-anchor" href="#code-3" aria-hidden="true">#</a> Code\uFF1A</h2><div class="language-c++ ext-c++ line-numbers-mode"><pre class="language-c++"><code>#include&lt;bits/stdc++.h&gt;
#define ll long long
#define ull unsigned long long
#define WA return 0;
#define ptn putchar(&#39;\\n&#39;)
using namespace std;

inline ll read() {ll x = 0, z = 1;char c = getchar();while (!isdigit(c)) {if (c == &#39;-&#39;)z = -1;c = getchar();}while (isdigit(c)) {x = (x &lt;&lt; 1) + (x &lt;&lt; 3) + (c ^ 48);c = getchar();}return z * x;}
inline void writ(ll x){if(x&lt;0) {putchar(&#39;-&#39;);x=(~x)+1;}if(x&gt;9)writ(x/10);putchar(x-x/10*10+48);}

ll n,m;


void Qingtuan(){
    n=read();
    bool ju=0;
    ll res=n/365;
    m=n%365;
    ll x,y=0;
    for (int i = 0; i &lt; 20&amp;&amp;31*i&lt;=m; i++)
    {
        if(!((m-31*i)%7)){
            y=i;ju=1;
        }
    }
    if(ju){
        x=(m-31*y)/7;
        writ(res+y+x);ptn;
        
    }else{
        if(res){
            m+=365;res--;
            for (int i = 0; i &lt; 20&amp;&amp;31*i&lt;=m; i++)
            {
                if(!((m-31*i)%7)){
                    y=i;
                }
            }
            x=(m-31*y)/7;
            writ(res+y+x);ptn;

        }else
            puts(&quot;-1&quot;);
    }


}



int main(){
    //cin.tie(nullptr)-&gt;sync_with_stdio(false);

    int T=read();while (T--)
    Qingtuan();
    WA
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,13);function k(_,M){const l=r("ExternalLinkIcon");return a(),t("div",null,[c,v,n("p",null,[s("Codeforce\u4E0A\u6709\u9053\u9898\u7C7B\u4F3C\uFF1A"),n("a",u,[s("Problem - C - Codeforces"),d(l)])]),h,p,o,b,g,x,f,y,w])}const T=e(m,[["render",k],["__file","\u676D\u7535\u676F\u7B2C\u4E8C\u573A.html.vue"]]);export{T as default};
