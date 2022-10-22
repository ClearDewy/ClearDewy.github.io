# 最近公共祖先

```cpp
const int N = 5e5 + 5;
int f[N][31] = { 0 }, dep[N] = { 0 };

void dfs(int root, int fa) {
	f[root][0] = fa;
	dep[root] = dep[fa] + 1;
	for (int i = 1; i < 31; i++)
	{
		f[root][i] = f[f[root][i - 1]][i - 1];
	}
	for (int i = head[root]; i; i = e[i].next)
	{
		if (e[i].to == fa) continue;
		dfs(e[i].to, root);
	}
}

inline int lca(int x, int y) {
	if (dep[x] > dep[y])swap(x, y);
	int tmp = dep[y] - dep[x];
	int ans = 0;
	for (int i = 0; tmp; i++, tmp >>= 1)
	{
		if (tmp & 1) y = f[y][i];
	}
	if (x == y)return x;
	for (int i = 30; i >= 0 && y != x; i--)
	{
		if (f[x][i] != f[y][i])x = f[x][i],y = f[y][i];
	}
	return f[x][0];
}
```

### 最近祖先权值

```cpp
const int N = 5e5 + 5;
int f[N][31] = { 0 }, dep[N] = { 0 };
int cost[N][31] = { 0 };
int w[N] = { 0 };//第[i]个节点的权

void dfs(int root, int fa) {
	f[root][0] = fa;
	dep[root] = dep[fa] + 1;
	for (int i = 1; i < 31; i++)
	{
		f[root][i] = f[f[root][i - 1]][i - 1];
		cost[root][i] = cost[f[root][i-1]][i - 1] + cost[root][i - 1];
	}

	for (int i = head[root]; i; i = e[i].next)
	{
		if (e[i].to == fa) 
			continue;
		cost[i][0] = w[i];
		dfs(e[i].to, root);
	}
}

inline int lca(int x, int y) {
	if (dep[x] > dep[y])
	{
		swap(x, y);
	}
	int tmp = dep[y] - dep[x];
	int ans = 0;
	for (int i = 0; tmp; i++, tmp >>= 1)
	{
		if (tmp & 1) {
			ans += cost[y][i];
			y = f[y][i];
		}
	}
	if (x == y)
	{
		//return x;
		return ans;	//花费
	}
	for (int i = 30; i >= 0 && y != x; i--)
	{
		if (f[x][i] != f[y][i])
		{
			ans+=cost[x][i]+cost[y][i];
			x = f[x][i];
			y = f[y][i];
		}

	}
	ans+=cost[x][0]+cost[y][0];
	return ans;
	//return f[x][0];
}
```



