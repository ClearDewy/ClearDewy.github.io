export const ProjectsSidebar=[
    {
        text:"Vue",
        prefix: "Vue/",
        collapsable: true,
        children: [
            "安装和使用",
            {
                text:"基本用法",
                prefix: "基本用法/",
                collapsable: true,
                children: [
                    "vue-router路由","axios请求","async异步请求",
                ],
            }
        ],
    },

    {
        text:"Electronic",
        prefix: "Electronic/",
        collapsable: true,
        children: [
            "安装和使用","配置文件",
            {
                text:"基本用法",
                prefix: "基本用法/",
                collapsable: true,
                children: [
                    "主进程与渲染进程通信",
                ],
            },
            {
                text:"Question",
                prefix: "Question/",
                collapsable: true,
                children: [

                ],
            },
        ],
    },

    {
        text:"SpringBoot",
        prefix: "SpringBoot/",
        collapsable: true,
        children: [
            "项目结构","配置文件",
            {
                text:"基本用法",
                prefix: "基本用法/",
                collapsable: true,
                children: [
                    "Controller","Mybatis","slf4j日志","注解",
                ],
            },
            {
                text:"Question",
                prefix: "Question/",
                collapsable: true,
                children: [

                ],
            },
        ],
    },


    {
        text:"SQL",
        prefix: "SQL/",
        collapsable: true,
        children: [
            "数据库","表","数据","约束","多表查询"
        ],
    },

    {
        text:"Docker",
        prefix: "Docker/",
        collapsable: true,
        children: [

        ],
    },
]