# 有向图游戏与 SG 函数

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