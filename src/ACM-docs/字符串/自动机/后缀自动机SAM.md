# 后缀自动机SAM

建立一棵字符串 $s$ 所有后缀子串的字典树。

```cpp
const int N=1e6+5;

int ch[N<<1][26], len[N<<1], pa[N<<1], idx=0;
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
void build(string s) {
    pa[0] = -1;
    int last = 0;
    for(char &c:s){
        last = append(last, c - 'a');
    }
}
```

