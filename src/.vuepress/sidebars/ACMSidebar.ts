/**
{
    text:"STL",
        // 可选的, 分组标题对应的图标
        // icon: "tip",
        // 可选的, 分组标题对应的链接
        // link: "STL/",
        // 可选的，会添加到每个 item 链接地址之前
        prefix: "STL/",
    // 可选的, 设置分组是否可以折叠，默认值是 false,
    collapsable: true,
    // 必要的，分组的子项目
    children: [
    // "README.md"
    "STL容器与用法","STL函数与用法"
],
},
**/
export const ACMSidebar=[
    {
        text:"STL",
        prefix: "STL/",
        collapsable: true,
        children: [
            "STL容器与用法","STL函数与用法"
        ],
    },


    {
        text:"动态规划",
        prefix: "动态规划/",
        collapsable: true,
        children: [
            "背包DP","区间DP","树形DP","状压DP","数位DP","插头DP","计数DP","动态DP","概率DP",
            {
                text:"DP优化",
                prefix: "DP优化/",
                collapsable: true,
                children: [

                ]
            }
        ],
    },


    {
        text:"字符串",
        prefix: "字符串/",
        collapsable: true,
        children: [
            "Hash哈希","KMP算法","Z函数（扩展KMP）","Manacher",
            {
                text:"自动机",
                prefix: "自动机",
                collapsable: true,
                children: [
                    "AC自动机","后缀自动机SAM"
                ]
            }
        ],
    },


    {
        text:"数学",
        prefix: "数学/",
        collapsable: true,
        children: [
            "位运算",
            {
                text:"数论",
                prefix: "数论/",
                collapsable: true,
                children: [
                    "gcd和lcm","整除分块","欧拉筛","欧拉函数","欧几里得(exgcd)","裴蜀定理","类欧几里得算法","乘法逆元","中国剩余定理","威尔逊定理","升幂定理","卢卡斯定理","莫比乌斯反演",
                ],
            },
            {
                text:"多项式与生成函数",
                prefix: "多项式与生成函数/",
                collapsable: true,
                children: [
                    "快速傅里叶变换-FFT","快速数论变换-NTT","多项式的逆","多项式的对数函数","多项式的指数函数","多项式快速幂","多项式运算封装"
                ],
            },
            {
                text:"组合数学",
                prefix: "组合数学/",
                collapsable: true,
                children: [
                    "排列组合","容斥原理","康托展开","错位排列","不相邻问题","小球装盒模型","卡特兰数","斯特林数","贝尔数"
                ],
            },
            {
                text:"线性代数",
                prefix: "线性代数/",
                collapsable: true,
                children: [
                    "矩阵","线性基"
                ],
            },
            {
                text:"概率论",
                prefix: "概率论/",
                collapsable: true,
                children: [

                ],
            },
            {
                text:"博弈论",
                prefix: "博弈论/",
                collapsable: true,
                children: [
                    "经典博弈","SG函数"
                ],
            },
        ],
    },


    {
        text:"数据结构",
        prefix: "数据结构/",
        collapsable: true,
        children: [
            "并查集","树状数组","线段树",
            {
                text:"可持久化数据结构",
                prefix: "可持久化数据结构/",
                collapsable: true,
                children: [
                    "可持久化线段树",
                ],
            },
        ],
    },

    {
        text:"图论",
        prefix: "图论/",
        collapsable: true,
        children: [
            {
                text:"树上问题",
                prefix: "树上问题/",
                collapsable: true,
                children: [
                    "最近公共祖先LCA","树链剖分"
                ],
            },
            "拓扑排序","最小生成树","最短路","差分约束","k短路","同余最短路",
            {
                text:"连通性",
                prefix: "连通性/",
                collapsable: true,
                children: [
                    {
                        text: "有向图的连通性",
                        prefix: "有向图的连通性/",
                        collapsable: true,
                        children: [
                            "Tarjan算法"
                        ],
                    }
                ],
            },
            "2-SAT",
            {
                text:"网络流",
                prefix: "网络流/",
                collapsable: true,
                children: [

                ],
            },
        ],
    },


    {
        text:"计算几何",
        prefix: "计算几何/",
        collapsable: true,
        children: [
            "二维计算几何","三维计算几何","距离","凸包","扫描线","旋转卡壳","半平面交","平面最近点对","最小圆覆盖",
        ],
    },


    {
        text:"其他算法",
        prefix: "其他算法/",
        collapsable: true,
        children: [
            "莫队算法",
        ],
    },

    {
        text:"杂项",
        prefix: "杂项/",
        collapsable: true,
        children: [
            "代码模板","文件输入与输出",
        ],
    },
    {
        text:"黑科技",
        prefix: "黑科技/",
        collapsable: true,
        children: [
            "快读快写","随机unordered_map种子",
        ],
    },
]
