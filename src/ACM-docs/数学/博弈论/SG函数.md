# 有向图游戏与 SG 函数

## 定义

定义 $mex$ 函数的值为不属于集合 中的最小非负整数，即：
$$
\operatorname{mex}(S)=\min\{x\} \quad (x \notin S,x\in N)
$$
例如$\operatorname{mex}(\{0,2,4\})=1$ ，$\operatorname{mex}(\{1,2\})=0$。

对于状态 $x$ 和它的所有 $k$ 个后继状态 $y_1,y_2,\dots ,y_k$ ，定义 $SG$ 函数：
$$
\operatorname{SG}(x)=\operatorname{mex}\{\operatorname{SG}(y_1),\operatorname{SG}(y_2),\dots,\operatorname{SG}(y_k) \}
$$
而对于由 $n$ 个有向图游戏组成的组合游戏，设它们的起点分别为 $s_1,s_2,\dots,s_n$ ，则有定理：**当且仅当 $\operatorname{SG}(s_1) \oplus \operatorname{SG}(s_2) \oplus \dots \oplus \operatorname{SG}(s_k) \neq 0$ 时，这个游戏是先手必胜的。同时，这是这一个组合游戏的游戏状态 $x$ 的 SG 值。**

## 例子

### 取石子问题

>   有$1$堆$n$个的石子，每次只能取{$ 1, 3, 4$ }个石子，先取完石子者胜利，那么各个数的$SG$值为多少？

-   $SG[0]=0，f[]=\{1,3,4\}$;

-   $x=1$ 时，可以取走$1 - f\{1\}$个石子，剩余$\{0\}$个，所以 $SG[1] = mex\{ SG[0] \}= mex\{0\} = 1$;
-   $x=2$ 时，可以取走$2 - f\{1\}$个石子，剩余$\{1\}$个，所以 $SG[2] = mex\{ SG[1] \}= mex\{1\} = 0$;
-   $x=3$ 时，可以取走$3 - f\{1,3\}$个石子，剩余$\{2,0\}$个，所以 $SG[3] = mex\{SG[2],SG[0]\} = mex\{0,0\} =1$;
-   $x=4$ 时，可以取走$4-  f\{1,3,4\}$个石子，剩余$\{3,1,0\}$个，所以 $SG[4] = mex\{SG[3],SG[1],SG[0]\} = mex\{1,1,0\} = 2$;
-   $x=5$ 时，可以取走$5 - f\{1,3,4\}$个石子，剩余$\{4,2,1\}$个，所以$SG[5] = mex\{SG[4],SG[2],SG[1]\} =mex\{2,0,1\} = 3$;

以此类推.....

### 代码

```cpp
//f[N]:可改变当前状态的方式，N为方式的种类，f[N]要在getSG之前先预处理
//SG[]:0~n的SG函数值
//S[]:为x后继状态的集合
int f[N],SG[MAXN],S[MAXN];
void  getSG(int n){
    int i,j;
    memset(SG,0,sizeof(SG));
    //因为SG[0]始终等于0，所以i从1开始
    for(i = 1; i <= n; i++){
        //每一次都要将上一状态 的 后继集合 重置
        memset(S,0,sizeof(S));
        for(j = 0; f[j] <= i && j <= N; j++)
            S[SG[i-f[j]]] = 1;  //将后继状态的SG函数值进行标记
        for(j = 0;; j++) if(!S[j]){   //查询当前后继状态SG值中最小的非零值
            SG[i] = j;
            break;
        }
    }
}
```

