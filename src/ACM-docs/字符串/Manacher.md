# Manacher

```c++
const int N = 1e5 + 5;
const char g = '&';
char s[N];
int n = 0;
int pi[N << 1] = { 0 };  //以i为中心的半径为pi[i]的回文字符串

void Manacher() {
    char c;
    s[0] = '$';   //使头和尾不相同 
    while (1)
    {
        c = getchar();
        if (c == '\n')
        {
            break;
        }
        s[++n] = c;
        s[++n] = g;
    }
    s[n] = '^';

    for (int i = 0, l = 0, r = -1; i <= n; i++)
    {
        int k = (i > r) ? 1 : min(pi[l + r - i], r - i + 1);
        while (s[i - k] == s[i + k])
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

