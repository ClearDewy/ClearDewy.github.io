# AC自动机

```cpp
//统计原串中有多少个不同的模式串
const int N=2e6+5;
int tr[N][26],cnt=0;
int vi[N],fail[N];

inline void insert(string s){
    int idx=0;
    for(char &i:s){
        if(!tr[idx][i-'a'])tr[idx][i-'a']=++cnt;
        idx=tr[idx][i-'a'];
    }
    vi[idx]++;
}

inline void get_fail(){
    queue<int>q;
    for (int i = 0; i < 26; i++)if(tr[0][i])q.push(tr[0][i]),fail[tr[0][i]]=0;
    int h;
    while (!q.empty())
    {
        h=q.front();q.pop();
        for (int i = 0; i < 26; i++)if(tr[h][i])fail[tr[h][i]]=tr[fail[h]][i],q.push(tr[h][i]);
        else tr[h][i]=tr[fail[h]][i];
    }
}

int query(string s){
    int idx=0,res=0;
    for(char &i:s){
        idx=tr[idx][i-'a'];
        for (int j = idx; j && ~vi[j]; j=fail[j])
        {
            res+=vi[j];vi[j]=-1;
        }
    }
    return res;
}
```

---