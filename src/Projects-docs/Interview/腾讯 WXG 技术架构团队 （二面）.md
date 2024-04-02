# 腾讯 WXG 技术架构团队 （二面）

面试官说有事推迟 $10$ 分钟开始面试，然后等了十几分钟，给我发 $3$ 个题写半个小时，写完后一个微信电话搞过来，，给我整蒙了，然后就是电话面。全程不到 $50min$ （包括做题半小时）。感觉 $G$ 啦！！！

## 题目

1、给一个实数x大于0，求y使得y^7+0.5*y=x。
输入样例：129
输出样例（四舍五入到小数点后第二位小数）：2.00
请求C++代码解决以上问题

```cpp
#include<bits/stdc++.h>
#define ll long long
#define ptn putchar('\n')
using namespace std;

inline ll read() {ll x = 0, z = 1;char c = getchar();while (!isdigit(c)) {if (c == '-')z = -1;c = getchar();}while (isdigit(c)) {x = (x << 1) + (x << 3) + (c ^ 48);c = getchar();}return z * x;}
template<typename T>
inline void writ(T x,char c=-1){if(x<0) {putchar('-');x=(~x)+1;}if(x>9)writ(x/10);putchar(x-x/10*10+48);if(~c)putchar(c);}

const double eps=1e-3;


void ClearDewy(){
    double x=read();
    double l=0,r=1000,mid;

    auto check=[&](double y){
        return y*y*y*y*y*y*y+0.5*y>x;
    };
    
    while (l+eps<r)
    {
        mid=(l+r)/2;
        if(check(mid)){
            r=mid;
        }else{
            l=mid+eps;
        }
    }
    
    printf("%.2f",l);
}


int main(){
    //cin.tie(nullptr)->sync_with_stdio(false);

    //int T=read();while (T--)
    ClearDewy();
    return 0;
}
```




2、给一棵二叉树，每个结点上有一个不同的整数值val，一个子树上所有节点数值的总和称为字数和，求最大子树和。
例如树节点数值如下图，最大子树和为1+4+7=12。
     3
   /  \
  1   -5
  / \
4    7

数据结构：
Strutc Tree {
    Tree* lch;
    Tree* rch;
    int val;
};
实现函数：int MaxSubTreeSum(Tree* root);

```cpp
#include<bits/stdc++.h>
#define ll long long
#define ptn putchar('\n')
using namespace std;

inline ll read() {ll x = 0, z = 1;char c = getchar();while (!isdigit(c)) {if (c == '-')z = -1;c = getchar();}while (isdigit(c)) {x = (x << 1) + (x << 3) + (c ^ 48);c = getchar();}return z * x;}
template<typename T>
inline void writ(T x,char c=-1){if(x<0) {putchar('-');x=(~x)+1;}if(x>9)writ(x/10);putchar(x-x/10*10+48);if(~c)putchar(c);}

struct Tree {
    Tree* lch;
    Tree* rch;
    int val;
};

#define pii pair<int,int>

pii dfs(Tree* root){
    pii l,r;
    if(root->lch){
        l=dfs(root->lch);
    }

    if(root->rch){
        r=dfs(root->rch);
    }
    return {max({l.first,r.first,l.second+r.second+root->val}),l.second+r.second+root->val};
}


int MaxSubTreeSum(Tree* root){
    return dfs(root).first;
}



void ClearDewy(){
    Tree *t3=new Tree();
    t3->val=3;

    Tree *t1=new Tree();
    t1->val=1;

    Tree *t_5=new Tree();
    t_5->val=-5;

    Tree *t4=new Tree();
    t4->val=4;

    Tree *t7=new Tree();
    t7->val=7;


    t3->lch=t1;t3->rch=t_5;

    t1->lch=t4;t1->rch=t7;


    cout<<MaxSubTreeSum(t3);
}



int main(){
    //cin.tie(nullptr)->sync_with_stdio(false);

    //int T=read();while (T--)
    ClearDewy();
    return 0;
}
```



3、给一个数组a[n]，数组大小不超过1e3，数据范围0~1e8，找到三个数（可重复）使得它们的和为指定值T，如果有多个解输出一个即可。
输入样例（n a[0] a[1] ... a[n-1] T）：4 2 7 3 8 17
输出样例：2 7 8

```cpp
#include<bits/stdc++.h>
#define ll long long
#define ptn putchar('\n')
using namespace std;

inline ll read() {ll x = 0, z = 1;char c = getchar();while (!isdigit(c)) {if (c == '-')z = -1;c = getchar();}while (isdigit(c)) {x = (x << 1) + (x << 3) + (c ^ 48);c = getchar();}return z * x;}
template<typename T>
inline void writ(T x,char c=-1){if(x<0) {putchar('-');x=(~x)+1;}if(x>9)writ(x/10);putchar(x-x/10*10+48);if(~c)putchar(c);}

#define arr array<int,3>


void ClearDewy(){
    int n=read(),T;
    vector<int>a(n);
    set<int>st;
    for (int i = 0; i < n; i++)
    {
        a[i]=read();
        st.insert(a[i]);
    }
    T=read();

    arr res;
    for (int i = 0; i < n; i++)
    {
        for (int j = i; j < n; j++)
        {
            if(st.count(T-a[i]-a[j])){
                res={a[i],a[j],T-a[i]-a[j]};
            }
        }
    }
    
    

    for (int i = 0; i < 3; i++)
    {
        writ(res[i],' ');
    }
    
}



int main(){
    //cin.tie(nullptr)->sync_with_stdio(false);

    //int T=read();while (T--)
    ClearDewy();
    return 0;
}
```



*讲题也是很快，第一题讲了遍代码，第二题他就问了时间复杂度，我说 $O(n)$ 。第三题提都没提*

## 八股

1.   c++ 11新特性

*直接懵逼，一面说他们做数据储存，我狂补数据库。就答了个智能指针*

2.   虚函数和纯虚函数
2.   tcp 三次握手，四次挥手，挥手过程中的单位时间
2.   场景题：$100G$ 数据，给 $10G$ 内存，统计不同词汇的个数

答：将$100 G$ 至少分成 $10$ 块，这里 $30$ 块为例，每块单词进行排序和去重。然后用 $30$ 个文件指针，先找到最小的，然后把其他文件中相同的都去掉

问：怎么找这个最小的？

答：最简单就是遍历一边，30复杂度可以接受。

问：假如有很多，有没有优化的方法？

答：线段树查询最小值

问：线段树太麻烦了，有没有更简单的，比如 $STL$  中的？

答：优先队列（小根堆）



## 反问

改进的地方？

“基础还不多，但是有个明显短板就是 c++，这一块要补一下”