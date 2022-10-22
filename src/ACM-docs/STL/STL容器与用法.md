# STL容器与用法

## string容器

### 构造

- `string()`; //创建一个空的字符串 例如: string str
- `string(const char* s);`//使用字符串s初始化
- `string(const string& str);` //使用一个string对象初始化另一个string对象
- `string(int n, char c);` //使用n个字符c初始化

### 赋值

- `string& operator=(const char* s);` //char*类型字符串 赋值给当前的字符串
- `string& operator=(const string &s);` //把字符串s赋给当前的字符串
- `string& operator=(char c);` //字符赋值给当前的字符串
- `string& assign(const char *s);` //把字符串s赋给当前的字符串
- `string& assign(const char *s, int n);` //把字符串s的前n个字符赋给当前的字符串
- `string& assign(const string &s);` //把字符串s赋给当前字符串
- `string& assign(int n, char c);` //用n个字符c赋给当前字符串

### 拼接

- `string& operator+=(const char* str);` //重载+=操作符

- `string& operator+=(const char c);` //重载+=操作符

- `string& operator+=(const string& str);` //重载+=操作符

- `string& append(const char *s, int n);` //把字符串s的前n个字符连接到当前字符串结尾

- `string& append(const char *s, int n); `//把字符串s的前n个字符连接到当前字符串结尾

- `string& append(const string &s);` //同operator+=(const string& str)

- `string& append(const string &s, int pos, int n);`//字符串s中从pos开始的n个字符连接到字符串结尾

### 查找和替换

- `int find(const string& str, int pos = 0) const;` //查找str第一次出现位置,从pos开始查找
- `int find(const char* s, int pos = 0) const;` //查找s第一次出现位置,从pos开始查找
- `int find(const char* s, int pos, int n) const;` //从pos位置查找s的前n个字符第一次位置
- `int find(const char c, int pos = 0) const;` //查找字符c第一次出现位置
- `int rfind(const string& str, int pos = npos) const;` //查找str最后一次位置,从pos开始查找
- `int rfind(const char* s, int pos = npos) const; `//查找s最后一次出现位置,从pos开始查找
- `int rfind(const char* s, int pos, int n) const;` //从pos查找s的前n个字符最后一次位置
- `int rfind(const char c, int pos = 0) const;` //查找字符c最后一次出现位置
- `string& replace(int pos, int n, const string& str);` //替换从pos开始n个字符为字符串str
- `string& replace(int pos, int n,const char* s);` //替换从pos开始的n个字符为字符串s

### 插入和删除

- `string& insert(int pos, const char* s);` //插入字符串
- `string& insert(int pos, const string& str);` //插入字符串
- `string& insert(int pos, int n, char c);` //在指定位置插入n个字符c
- `string& erase(int pos, int n = npos);` //删除从Pos开始的n个字符

### 子串

- `string substr(int pos = 0, int n = npos) const;` //返回由pos开始的n个字符组成的字符串

## vector容器

### 构造

- `vector<T> v;` //采用模板实现类实现，默认构造函数
- `vector(v.begin(), v.end());` //将v[begin(), end())区间中的元素拷贝给本身
- `vector(n, elem); `//构造函数将n个elem拷贝给本身
- `vector(const vector &vec);` //拷贝构造函数

### 赋值

- `vector& operator=(const vector &vec);`//重载等号操作符
- `assign(beg, end);` //将[beg, end)区间中的数据拷贝赋值给本身
- `assign(n, elem);` //将n个elem拷贝赋值给本身

### 容量和大小

- `empty();` //判断容器是否为空
- `capacity();` //容器的容量
- `size();` //返回容器中元素的个数
- `resize(int num);` //重新指定容器的长度为num，若容器变长，则以默认值填充新位置

 //如果容器变短，则末尾超出容器长度的元素被删除

- `resize(int num, elem);` //重新指定容器的长度为num，若容器变长，则以elem值填充新位置。				//如果容器变短，则末尾超出容器长度的元素被删除

### 插入和删除

- `push_back(ele);` //尾部插入元素ele
- `pop_back(); `//删除最后一个元素
- `insert(const_iterator pos, ele);` //迭代器指向位置pos插入元素ele
- `insert(const_iterator pos, int count,ele);`//迭代器指向位置pos插入count个元素ele
- `erase(const_iterator pos);`//删除迭代器指向的元素
- `erase(const_iterator start, const_iterator end);`//删除迭代器从start到end之间的元素
- `clear()`; //删除容器中所有元素

### 预留空间

- `reserve(int len);`//容器预留len个元素长度，预留位置不初始化，元素不可访问

## queue容器

### 构造

- `queue<T> que;` //queue采用模板类实现，queue对象的默认构造形式
- `queue(const queue &que);` //拷贝构造函数

### 赋值

- `queue& operator=(const queue &que);` //重载等号操作符

### 数据存取

- `push(elem);` //往队尾添加元素
- `pop();` //从队头移除第一个元素
- `back();` //返回最后一个元素
- `front();` //返回第一个元素

### 大小操作

- `empty();` //判断堆栈是否为空
- `size();` //返回栈的大小

## 优先队列 priority_queue

### 定义

- `priority_queue<T>;` //int等有默认比较大小
- `priority_queue<T,vector<T>,Functional>;` //Functional为大小比较

### 操作

- `top();` //访问队头元素
- `empty();` //队列是否为空
- `size();` //返回队列内元素个数
- `push();` //插入元素到队尾并排序
- `emplace();` //原地构造一个元素并插入队列
- `pop();` //弹出队头元素
- `swap();` //交换队列元素

### 大小

- pari的比较，先比较第一个元素，第一个相等比较第二个
- 运算符重载

```cpp
struct node 
{
    int x;
    node(int a) { x = a; }
    bool operator<(const node& a) const  //运算符重载<
    {
        return x < a.x; //大顶堆
    }
	
	 bool operator() (tmp1 a, tmp1 b) //重写仿函
    {
        return a.x < b.x; //大顶堆
    }
};
```

## set/multiset容器

### 构造

- `set<T> st;` //默认构造函数

- `set(const set &st);` //拷贝构造函数

### 赋值

- `set& operator=(const set &st);` //重载等号操作符

### 大小和交换

- `size();` //返回容器中元素的数目
- `empty();` //判断容器是否为空
- `swap(st);` //交换两个集合容器

### 插入和删除

- `insert(elem);` //在容器中插入元素
- `clear();` //清除所有元素
- `erase(pos);` //删除pos迭代器所指的元素，返回下一个元素的迭代器
- `erase(beg, end);` //删除区间[beg,end)的所有元素 ，返回下一个元素的迭代器
- `erase(elem);` //删除容器中值为elem的元素

### 查找和统计

- `find(key);` //查找key是否存在,若存在，返回该键的元素的迭代器；若不存在，返回set.end()
- `count(key);` //统计key的元素个数

### set和multiset区别

- set不可以插入重复数据，而multiset可以
- set插入数据的同时会返回插入结果，表示插入是否成功
- multiset不会检测数据，因此可以插入重复数据

## pair对组

- `pair<type, type> p ( value1, value2 );`
- `pair<type, type> p = make_pair( value1, value2 );`

## map/multimap容器

### 构造

- `map<T1, T2> mp;` //map默认构造函数
- `map(const map &mp);` //拷贝构造函数

### 赋值

- `map& operator=(const map &mp);` //重载等号操作符

### 大小和交换

- `size();` //返回容器中元素的数目
- `empty();` //判断容器是否为空
- `swap(st);` //交换两个集合容器

### 插入和删除

- `insert(elem);` //在容器中插入元素
- `clear();` //清除所有元素
- `erase(pos);` //删除pos迭代器所指的元素，返回下一个元素的迭代器
- `erase(beg, end);` //删除区间[beg,end)的所有元素 ，返回下一个元素的迭代器
- `erase(key);` //删除容器中值为key的元素

### 查找和统计

- `find(key);` //查找key是否存在,若存在，返回该键的元素的迭代器；若不存在，返回set.end()
- `count(key);` //统计key的元素个数

### 容器排序

- 利用仿函数，可以改变排序规则

```
map<T,T,MyCompare>;
```

## Hash Map unordered_map

- 查找快，遍历慢
- 用法与map相同