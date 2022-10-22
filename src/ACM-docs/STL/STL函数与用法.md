# STL函数与用法

## 二分查找

- `lower_bound(begin(),end(),val)` //返回一个非递减序列[first, last)中的第一个大于等于值val的位置
- `upper_bound(begin(),end(),val)` //返回一个非递减序列[first, last)中的第一个大于值val的位置

## 集合函数

- 并集

`set_union(a.begin(),a.end(),b.begin(),b.end(),c.begin())` //将a，b集合中的元素并集存入到c中

- 交集

`set_intersection(a.begin(),a.end(),b.begin(),b.end(),c.begin())` //将a，b集合中的元素交集存入到c中

- 差集

`set_difference(a.begin(),a.end(),b.begin(),b.end(),c.begin())` //将a，b集合中的元素差集存入到c中

## 全排列

- `next_permutation(a.begin(),a.end())` //得到序列a的下一个排列