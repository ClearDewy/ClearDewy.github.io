# $mathjax$公式常用语法

## 希腊字母

|    显示    |   命令   |   显示   |  命令  |
| :--------: | :------: | :------: | :----: |
|  $\alpha$  |  \alpha  | $\beta$  | \beta  |
|  $\gamma$  |  \gamma  | $\delta$ | \delta |
| $\epsilon$ | \epsilon | $\zeta$  | \zeta  |
|   $\eta$   |   \eta   | $\theta$ | \theta |
|  $\iota$   |  \iota   | $\kappa$ | \kappa |
| $\lambda$  | \lambda  |  $\mu$   |  \mu   |
|   $\nu$    |   \nu    |  $\xi$   |  \xi   |
|   $\pi$    |   \pi    |  $\rho$  |  \rho  |
|  $\sigma$  |  \sigma  |  $\tau$  |  \tau  |
| $\upsilon$ | \upsilon |  $\phi$  |  \phi  |
|   $\chi$   |   \chi   |  $\psi$  |  \psi  |
|  $\omega$  |  \omega  |          |        |

-   如果要大写希腊字母，则首字母大写即可，如`\Gamma`显示为$\Gamma$
-   如果要使希腊字母显示为斜体，则前面添加`var`即可，如`\varGamma`显示为$\varGamma$

## 字母修饰

|        显示         |       命令        |             显示             |            命令            |
| :-----------------: | :---------------: | :--------------------------: | :------------------------: |
|        $a^b$        |        a^b        |            $a\ b$            |            a\ b            |
|        $a_b$        |        a_b        |          $a\quad b$          |          a\quad b          |
|      $\vec a$       |      \vec a       |        $\binom{n}{m}$        |        \binom{a}{b}        |
| $\overrightarrow a$ | \overrightarrow a |    $\langle ... \rangle$     |    \langle ... \rangle     |
|      $\hat a$       |      \hat a       |      $\vert ... \vert$       |      \vert ... \vert       |
|    $\overline a$    |    \overline a    |      $\Vert ... \Vert$       |      \Vert ... \Vert       |
|   $\underline a$    |   \underline a    | $\left\{\frac{a}{b}\right\}$ | \left\{\frac{a}{b}\right\} |
|    $\mathtt {A}$    |    \mathtt {A}    |   $\overbrace{a+b+c+d}^4$    |         \overbrace         |
|    $\mathbb {A}$    |    \mathbb {A}    |     $\underbrace{a+d}_2$     |        \underbrace         |
|    $\mathsf {A}$    |    \mathsf {A}    |      $\lceil x \rceil$       |      \lceil x \rceil       |
|                     |                   |     $\lfloor x \rfloor$      |     \lfloor x \rfloor      |

## 常用数学运算符

### 基础符号

|   运算符    |    说明    |     应用举例      |       命令       |
| :---------: | :--------: | :---------------: | :--------------: |
|     $+$     |     加     |       $x+y$       |       x+y        |
|     $-$     |     减     |       $x-y$       |       x-y        |
|  $\times$   |    叉乘    |   $x \times y$    |    x \times y    |
|   $\cdot$   |    点乘    |    $x \cdot y$    |    x \cdot y     |
|  $\ast(*)$  |    星乘    | $x \ast y(x * y)$ | x \ast y (x * y) |
|   $\div$    |     除     |    $x \div y$     |     x \div y     |
|    $\pm$    |    加减    |     $x \pm y$     |     x \pm y      |
|    $\mp$    |    减加    |     $x \mp y$     |     x \mp y      |
|     $=$     |    等于    |       $x=y$       |       x=y        |
|   $\leq$    |  小于等于  |    $x \leq y$     |     x \leq y     |
|   $\geq$    |  大于等于  |    $x \geq y$     |     x \geq y     |
|  $\approx$  |   约等于   |   $x \approx y$   |   x \approx y    |
|  $\equiv$   |   恒等于   |   $x \equiv y$    |    x \equiv y    |
| $\bigodot$  | 定义运算符 |  $x \bigodot y$   |   x \bigodot y   |
| $\bigtimes$ | 定义运算符 | $x \bigotimes y$  |  x \bigotimes y  |
| $\frac{}{}$ |    分式    |   $\frac{x}{y}$   |   \frac{x}{y}    |
| $\sqrt{}{}$ |    根式    |   $\sqrt[a]{b}$   |   \sqrt[a]{b}    |

### 集合符号

|   运算符    |  说明  |    应用举例     |     命令      |
| :---------: | :----: | :-------------: | :-----------: |
|     \in     |  属于  |    $x \in y$    |    x \in y    |
|   \subset   |  子集  |  $x \subset y$  |  x \subset y  |
|  \subseteq  | 真子集 | $x \subseteq y$ | x \subseteq y |
|   \supset   |  超集  |  $x \supset y$  |  x \supset y  |
|  \supseteq  |  超集  | $x \supseteq y$ | x \supseteq y |
| \varnothing |  空集  |  $\varnothing$  |  \varnothing  |
|    \cup     |   并   |   $x \cup y$    |   x \cup y    |
|    \cap     |   交   |   $x \cap y$    |   x \cap y    |

### 杂项

|   运算符    |       说明       |            应用举例             |             命令              |
| :---------: | :--------------: | :-----------------------------: | :---------------------------: |
|  \partial   |      偏导数      | $\frac{\partial z}{\partial x}$ | \frac{\partial z}{\partial x} |
|   \ldots    | 底端对齐的省略号 |         $1,2,\ldots,n$          |         1,2,\ldots,n          |
|   \cdots    | 中线对齐的省略号 |         $1,2,\cdots,n$          |         1,2,\cdots,n          |
|   \vdots    |     竖省略号     |            $\vdots$             |            \vdots             |
|   \ddots    |     斜省略号     |            $\ddots$             |            \ddots             |
|  \uparrow   |      上箭头      |           $\uparrow$            |           \uparrow            |
|  \Uparrow   |     双上箭头     |           $\Uparrow$            |           \Uparrow            |
| \downarrow  |      下箭头      |          $\downarrow$           |          \downarrow           |
| \Downarrow  |     双下箭头     |          $\Downarrow$           |          \Downarrow           |
| \leftarrow  |      左箭头      |          $\leftarrow$           |          \leftarrow           |
| \Leftarrow  |     双左箭头     |          $\Leftarrow$           |          \Leftarrow           |
| \rightarrow |      右箭头      |          $\rightarrow$          |          \rightarrow          |
| \Rightarrow |     双右箭头     |          $\Rightarrow$          |          \Rightarrow          |

### 特殊符号

|  命令   |   显示    |   命令    |    显示     |
| :-----: | :-------: | :-------: | :---------: |
| \infty  | $\infty$  | \partial  | $\partial$  |
| \nabla  | $\nabla$  | \triangle | $\triangle$ |
| \forall | $\forall$ |  \exists  |  $\exists$  |
|  \lnot  |  $\lnot$  |           |             |

### 矩阵

#### 基本语法

-   起始标记:`\begin{matrix}`,结束标记:`\end{matrix}`

-   每一行末尾标记`\\`，行间元素之间以`&`分隔

```
$$\begin{matrix}
1&0&0\\
0&1&0\\
0&0&1\\
\end{matrix}$$
```

$$
\begin{matrix}
1&0&0\\
0&1&0\\
0&0&1\\
\end{matrix}
$$

#### 矩阵边框

|    类型    |  命令   |                   矩阵边框显示效果                    |
| :--------: | :-----: | :---------------------------------------------------: |
| 小括号边框 | pmatrix | $$\begin{pmatrix}1&0&0\\0&1&0\\0&0&1\\\end{pmatrix}$$ |
| 中括号边框 | bmatrix | $$\begin{bmatrix}1&0&0\\0&1&0\\0&0&1\\\end{bmatrix}$$ |
| 大括号边框 | Bmatrix | $$\begin{Bmatrix}1&0&0\\0&1&0\\0&0&1\\\end{Bmatrix}$$ |
| 单竖线边框 | vmatrix | $$\begin{vmatrix}1&0&0\\0&1&0\\0&0&1\\\end{vmatrix}$$ |
| 双竖线边框 | Vmatrix | $$\begin{Vmatrix}1&0&0\\0&1&0\\0&0&1\\\end{Vmatrix}$$ |

## 多行式子

### 方程组

```
$$\begin{cases}
a_1x+b_1y+c_1z=d_1\\
a_2x+b_2y+c_2z=d_2\\
a_3x+b_3y+c_3z=d_3\\
\end{cases}
$$
```

$$
\begin{cases}
a_1x+b_1y+c_1z=d_1\\
a_2x+b_2y+c_2z=d_2\\
a_3x+b_3y+c_3z=d_3\\
\end{cases}
$$

### 对齐

```
\begin{align}
a&=b+c\\
b+c&=a
\end{align}
```

$$
\begin{align}
a&=b+c\\
b+c&=a
\end{align}
$$

