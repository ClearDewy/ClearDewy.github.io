# 腾讯 WXG 技术架构团队 （一面）

## 笔试（1h）

### 加减乘除计算器

#### 题面

给定一个字符串，包含数字，$+,-,*,/$ ，要求给出计算结果。

#### Code

```cpp
#include<bits/stdc++.h>
#define ll long long
#define ptn putchar('\n')
using namespace std;

inline ll read() {ll x = 0, z = 1;char c = getchar();while (!isdigit(c)) {if (c == '-')z = -1;c = getchar();}while (isdigit(c)) {x = (x << 1) + (x << 3) + (c ^ 48);c = getchar();}return z * x;}
template<typename T>
inline void writ(T x,char c=-1){if(x<0) {putchar('-');x=(~x)+1;}if(x>9)writ(x/10);putchar(x-x/10*10+48);if(~c)putchar(c);}




void ClearDewy(){
    string ss;
    getline(cin,ss);
    vector<char>s;

    for(char c:ss){
        if(isdigit(c)||c=='+'||c=='-'||c=='*'||c=='/'){
            s.push_back(c);
        }
    }
    int idx=-1;
    // 整数栈
    vector<ll>st;
    // 符号
    vector<char>sst;
    while(idx+1<s.size()){

        if(idx+1==s.size())break;

        if(isdigit(s[idx+1])){
            ll x=0;
            while (idx+1<s.size()&&isdigit(s[idx+1]))
            {
                x=x*10+s[++idx]-'0';
            }
            st.push_back(x);


            if(!sst.empty()&&(sst.back()=='*'||sst.back()=='/')){
                char cc=sst.back();sst.pop_back();
                if(cc=='*'){
                    x=st.back();st.pop_back();
                    ll y=st.back();st.pop_back();
                    st.push_back(x*y);
                }if(cc=='/'){
                    x=st.back();st.pop_back();
                    ll y=st.back();st.pop_back();
                    st.push_back(y/x);
                }
            }
        }else{
            sst.push_back(s[++idx]);
        }
        
    }
    ll res=st[0];
    for (int i = 0; i < sst.size(); i++)
    {
        if(sst[i]=='+'){
            res=res+st[i+1];
        }else{
            res=res-st[i+1];
        }
    }
    
    cout<<res;

}



int main(){
    //cin.tie(nullptr)->sync_with_stdio(false);

    //int T=read();while (T--)
    ClearDewy();
    return 0;
}
```

#### 扩展

##### 如果题目还有括号怎么处理？

再用一个括号栈，碰到一个右括号时，处理到最近一个左括号的加减法

## LRU

#### 题面

实现 $LRU$ 算法的 $get$ 和 $put$ 操作。

#### Code

```cpp
#include<bits/stdc++.h>
#define ll long long
#define ptn putchar('\n')
using namespace std;

inline ll read() {ll x = 0, z = 1;char c = getchar();while (!isdigit(c)) {if (c == '-')z = -1;c = getchar();}while (isdigit(c)) {x = (x << 1) + (x << 3) + (c ^ 48);c = getchar();}return z * x;}
template<typename T>
inline void writ(T x,char c=-1){if(x<0) {putchar('-');x=(~x)+1;}if(x>9)writ(x/10);putchar(x-x/10*10+48);if(~c)putchar(c);}


struct node
{
    int key,value;
    node *pre,*aft;
};

class LRUCache
{
private:
    node *head,*tail;
    map<int,node*>mp;
    int mx;
public:
    LRUCache(int x);
    ~LRUCache();

    int get(int x);
    void put(int x,int y);
};



LRUCache::LRUCache(int x)
{
    head=new node;
    tail=new node;
    head->aft=tail;
    tail->pre=head;
    mx=x;
}

LRUCache::~LRUCache()
{
    while (head!=nullptr)
    {
        node *p=head->aft;
        delete head;
        head=p;
    }
}

int LRUCache::get(int x)
{
    // 读锁
    if(mp.count(x)){
        return mp[x]->value;
    }
    return -1;
}

void LRUCache::put(int x,int y)
{
    // 加锁
    if(mp.count(x)){
        node *p=mp[x];
        p->value=y;
        p->pre->aft=p->aft;
        p->aft->pre=p->pre;

        p->aft=head->aft;
        p->pre=head;
        head->aft=p;
    }else{
        node *p=new node;
        p->key=x;
        p->value=y;

        if(mp.size()==mx){
            // 删除
            node *q=tail->pre;
            cout<<"删除的key为："<<q->key<<'\n';
            tail->pre=q->pre;
            q->pre->aft=tail;
            mp.erase(q->key);
            delete q;q=nullptr;
        }

        // 添加
        mp[x]=p;
        p->aft=head->aft;
        p->pre=head;
        p->aft->pre=p;
        head->aft=p;
    }
    // 释放
}



void ClearDewy(){
    LRUCache* cache=new LRUCache(2);
    cache->put(1,1);
    cache->put(2,2);
    cout<<cache->get(1)<<'\n';
    
    cache->put(3,3);
    cout<<cache->get(2)<<'\n';

    cache->put(4,4);
    cout<<cache->get(1)<<'\n';
    cout<<cache->get(3)<<'\n';
    cout<<cache->get(4)<<'\n';

}



int main(){
    //cin.tie(nullptr)->sync_with_stdio(false);

    //int T=read();while (T--)
    ClearDewy();
    return 0;
}
```

#### 扩展

##### 当多线程访问时怎么解决冲突？

最简单就是加锁，加一个读写锁。

使用消息队列或者通道逐个处理请求，这样 $put$ 操作可以异步，不用阻塞

类似 $MySQL$ 使用 $MVCC$ 在读数据创建一个快照

### LFU

*后面测 $LRU$* 把题面看错了，以为是 $LFU$ 最后又在写 $LFU$

写了一部分，面试官说正好也想问怎么实现。

我说用线段树 $log n$ 可以更新和查询最少使用次数。使用 $map$ 查询 $key$ 所在线段树叶子节点的位置。

还问有没有其他数据结构，说线段树空间太大了。

我说用链表，但是可能在某一次更新要遍历 $O(n)$ 个。


## 面试（30 min）

### 讲算法实现思路和提问

### 介绍比赛经历和项目实现经历

### 提问 $MySql$

#### $MySQL$ 索引有哪些

#### 索引怎么实现查询加速

$hash$ 索引用 $hash$ 表，用来加速 $=,<>$ 查询。其他索引排序后，用类似二分的方法查询

#### 多个（两个）索引怎么实现的加速

复合索引，从左到右依次使用二分查找

#### 索引存储的数据结构

$hash$ 索引用 $hash$ 表，其他索引用 $B+$ 树

#### 索引在 $B+$ 树中怎么实现排序的？或者存储的 $key$ 和 $value$ 是什么？

（不知道）

## 反问

### 我有什么需要改进的？

“项目深度叭，我们是做数据存储的，所以要了解一下数据底层存储方式”