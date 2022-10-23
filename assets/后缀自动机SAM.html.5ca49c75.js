import{_ as n}from"./_plugin-vue_export-helper.cdc0426e.js";import{o as i,c as e,d as t}from"./app.17fea3bf.js";const l={},s=t(`<h1 id="\u540E\u7F00\u81EA\u52A8\u673Asam" tabindex="-1"><a class="header-anchor" href="#\u540E\u7F00\u81EA\u52A8\u673Asam" aria-hidden="true">#</a> \u540E\u7F00\u81EA\u52A8\u673ASAM</h1><div class="language-c++ ext-c++ line-numbers-mode"><pre class="language-c++"><code>namespace SAM{
    int ch[N&lt;&lt;1][26], len[N&lt;&lt;1], pa[N&lt;&lt;1], idx;
    void init() {
		memset(ch, 0, sizeof ch);
		memset(len, 0, sizeof len);
		memset(pa, 0, sizeof pa);
		idx = 0;
		pa[0] = -1;
	}
	int append( int p, int c ) {
		int np = ++idx;
		len[np] = len[p] + 1;
		while( p != -1 &amp;&amp; !ch[p][c] )
			ch[p][c] = np, p = pa[p];
		if( p == -1 ) pa[np] = 0;
		else {
			int q = ch[p][c];
			if( len[q] == len[p] + 1 ) pa[np] = q;
			else {
				int nq = ++idx;
				memcpy(ch[nq], ch[q], sizeof ch[nq]);
				len[nq] = len[p] + 1;pa[nq] = pa[q];pa[q] = pa[np] = nq;
				while( p != -1 &amp;&amp; ch[p][c] == q )
					ch[p][c] = nq, p = pa[p];
			}
		}
		return np;
	}
	void solve() {
		init();
		int last = 0;
		for( int i = 1; i &lt;= n; ++i )
			last = append(last, s[i] - &#39;a&#39;);
	}
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,2),d=[s];function a(c,v){return i(),e("div",null,d)}const p=n(l,[["render",a],["__file","\u540E\u7F00\u81EA\u52A8\u673ASAM.html.vue"]]);export{p as default};
