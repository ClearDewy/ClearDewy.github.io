export const ProjectsSidebar=[
    {
        text:"Vue",
        prefix: "Vue/",
        collapsible: true,
        children: [
            "安装和使用",
            {
                text:"基本用法",
                prefix: "基本用法/",
                collapsible: true,
                children: [
                    "vue-router路由","axios请求","async异步请求",
                ],
            }
        ],
    },

    {
        text:"Electronic",
        prefix: "Electronic/",
        collapsible: true,
        children: [
            "安装和使用","配置文件",
            {
                text:"基本用法",
                prefix: "基本用法/",
                collapsible: true,
                children: [
                    "主进程与渲染进程通信",
                ],
            },
            {
                text:"Question",
                prefix: "Question/",
                collapsible: true,
                children: [

                ],
            },
        ],
    },

    {
        text:"SpringBoot",
        prefix: "SpringBoot/",
        collapsible: true,
        children: [
            "项目结构","配置文件",
            {
                text:"基本用法",
                prefix: "基本用法/",
                collapsible: true,
                children: [
                    "Controller","Mybatis","slf4j日志","注解","SpringDoc","Exception","Redis","Cache","Exception","Jwt"
                ],
            },
            {
                text:"Question",
                prefix: "Question/",
                collapsible: true,
                children: [

                ],
            },
        ],
    },


    {
        text:"SQL",
        prefix: "SQL/",
        collapsible: true,
        children: [
            "数据库","表","数据","约束","多表查询"
        ],
    },

    {
        text:"Docker",
        prefix: "Docker/",
        collapsible: true,
        children: [

        ],
    },
    {
        text:"Interview",
        prefix: "Interview/",
        collapsible: true,
        children: [
            "腾讯 WXG 技术架构团队 （一面）","腾讯笔试（2024春）","腾讯 WXG 技术架构团队 （二面）","美团软件开发（一面）"
        ],
    },
]