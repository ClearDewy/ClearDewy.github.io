# KMP算法

```cpp
const int N = 2005;
char s[N];
int pi[N];
int vi[N];
int si;
//下标从1开始
void pre_kmp(char p[], int k) {
    for (int i = 2, j = 0; i <= k; i++){
        while (j && p[i] != p[j + 1])j = pi[j];
        if (p[i] == p[j + 1])j++;
        pi[i] = j;
    }
}

void kmp(char p[]) {
    for (int i = 1, j = 0; i <= si; i++){
        while (j && s[i] != p[j + 1])j = pi[j];
        if (s[i] == p[j + 1])j++;
        vi[i] = j;
    }
}
```

