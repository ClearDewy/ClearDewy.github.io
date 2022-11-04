import{_ as i}from"./_plugin-vue_export-helper.cdc0426e.js";import{o as n,c as e,d as s}from"./app.c47e3b2a.js";const l={},d=s(`<h1 id="项目结构" tabindex="-1"><a class="header-anchor" href="#项目结构" aria-hidden="true">#</a> 项目结构</h1><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>servicex                 // 项目名
    |- admin-ui          // 管理服务前端代码(一般将UI和SERVICE放到一个工程中，便于管理)
    |- servicex-auth     // 模块1
    |- servicex-common   // 模块2
    |- servicex-gateway  // 模块3
    |- servicex-system   // 模块4
        |- src
            |- main                  // 业务逻辑
                |- assembly          // 基于maven assembly插件的服务化打包方案
                    |- bin           // 模块脚本(启动、停止、重启)
                    |- sbin          // 管理员角色使用的脚本(环境检查、系统检测等等)
                    |- assembly.xml  // 配置文件
                |- java              // 源码
                    |- com
                        |- hadoopx
                            |- servicex
                                |- system
                                    |- annotation     // 注解
                                    |- aspect         // 面向切面编程
                                    |- config         // 配置文件POJO
                                    |- filter         // 过滤器
                                    |- constant       // 存放常量
                                    |- utils          // 工具
                                    |- exception      // 异常
                                    |- controller     // 控制层(将请求通过URL匹配，分配到不同的接收器/方法进行处理，然后返回结果)
                                    |- service        // 服务层接口
                                        |- impl       // 服务层实现
                                    |- mapper/repository // 数据访问层，与数据库交互为service提供接口
                                    |- entity/domain     // 实体对象
                                        |- dto // 持久层需要的实体对象(用于服务层与持久层之间的数据传输对象)
                                        |- vo // 视图层需要的实体对象(用于服务层与视图层之间的数据传输对象)
                                    |- *Application.java  // 入口启动类
                |- resources         // 资源
                    |- static        // 静态资源(html、css、js、图片等)
                    |- templates     // 视图模板(jsp、thymeleaf等)
                    |- mapper        // 存放数据访问层对应的XML配置
                        |- *Mapper.xml
                        |- ...
                    |- application.yml        // 公共配置
                    |- application-dev.yml    // 开发环境配置
                    |- application-prod.yml   // 生产环境配置
                    |- banner.txt    
                    |- logback.xml            // 日志配置
            |- test                  // 测试源码
               |- java               
                    |- com
                        |- hadoopx
                            |- servicex
                                |- system
                                    |- 根据具体情况按源码目录结构存放编写的测试用例
        |- target     // 编译打包输出目录(自动生成，不需要创建)
        |- pom.xml    // 该模块的POM文件
    |- sql            // 项目需要的SQL脚本
    |- doc            // 精简版的开发、运维手册
    |- .gitignore     // 哪些文件不用传到版本管控工具中
    |- pom.xml        // 工程总POM文件
    |- README.md      // 注意事项
External Libraries    // 相关JAR包依赖

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="" tabindex="-1"><a class="header-anchor" href="#" aria-hidden="true">#</a></h3>`,3),v=[d];function a(r,c){return n(),e("div",null,v)}const b=i(l,[["render",a],["__file","项目结构.html.vue"]]);export{b as default};
