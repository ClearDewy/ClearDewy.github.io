# gcd和lcm

## 最大公约数

```cpp
int gcd(int x,int y){
    return !y?x:gcd(y,x%y);
}
```

## 最小公倍数

```cpp
int lcm(int x, int y) {
    return x * y / gcd(x, y);
}
```

