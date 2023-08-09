# Manacher

```cpp
const int N = 1e5 + 5;
char s[N <<1];
int snt = 0;
int pi[N << 1];  //以i为中心的半径为pi[i]的回文字符串

void Manacher(string t) {
    s[0]='$';
    for(char &c:t){
        s[++snt]=c;
        s[++snt]='^';
    }

    for (int i = 0, l = 0, r = -1; i <= snt; i++)
    {
        int k = (i > r) ? 1 : min(pi[l + r - i], r - i + 1);
        while (0 <= i - k && i + k <= snt &&s[i - k] == s[i + k])
        {
            k++;
        }
        pi[i] = --k;
        if (i + k > r)
        {
            r = i + k;
            l = i - k;
        }
    }
}
```

