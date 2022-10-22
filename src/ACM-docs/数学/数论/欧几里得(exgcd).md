# 欧几里得(exgcd)

## 求解 $ax+by=gcd(a,b)$

```cpp
inline void exgcd(ll a, ll b, ll& x, ll& y) {
	if (b == 0) {
		x = 1, y = 0;
		return;
	}
	exgcd(b, a % b, y, x);
	y -= a / b * x;
}
```

## 求解 $ax+by=n$

- 有解条件$gcd(a,b)|n$;
- 此时x，y分别为$ax+by=gcd(a,b)$解的相应倍数;