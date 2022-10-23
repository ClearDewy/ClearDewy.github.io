# 后缀自动机SAM

```cpp
namespace SAM{
    int ch[N<<1][26], len[N<<1], pa[N<<1], idx;
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
		while( p != -1 && !ch[p][c] )
			ch[p][c] = np, p = pa[p];
		if( p == -1 ) pa[np] = 0;
		else {
			int q = ch[p][c];
			if( len[q] == len[p] + 1 ) pa[np] = q;
			else {
				int nq = ++idx;
				memcpy(ch[nq], ch[q], sizeof ch[nq]);
				len[nq] = len[p] + 1;pa[nq] = pa[q];pa[q] = pa[np] = nq;
				while( p != -1 && ch[p][c] == q )
					ch[p][c] = nq, p = pa[p];
			}
		}
		return np;
	}
	void solve() {
		init();
		int last = 0;
		for( int i = 1; i <= n; ++i )
			last = append(last, s[i] - 'a');
	}
}
```

