# SpringDoc

## 作用

自动生成在线$API$文档，启动项目后访问：

>   http://localhost:8080/swagger-ui/index.html

## 引入依赖

```xml
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.0.3</version>
</dependency>
```

## 配置

```yml
######## swagger configuration ###############
springdoc:
  packages-to-scan: ##需要扫描的包,可以配置多个
    - com.hmy.azure.controller
  paths-to-exclude:  ##配置不包含在swagger文档中的api
    - /api/test/**
    - /api/mockito/data
  swagger-ui:
    enabled: true  #开启/禁止swagger,prod可以设置为false
    path: /swagger-ui.html  #swagger页面
  api-docs:
    enabled: true #开启/禁止api-docs, prod可以设置为false
    path: /api-docs #api的json文档
  use-management-port: false
  ### 设置为true时, management也需要设置
#  use-management-port: true
#  show-actuator: true

#management:
#  server:
#    port: 9090
#  endpoints:
#    web:
#      exposure:
#        include: openapi,swagger-ui

```

### 构建 SpringDoc配置类

```java
package com.hmy.azure.config;

import io.swagger.v3.oas.models.ExternalDocumentation;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SpringDocConfiguration {
    @Bean
    public OpenAPI openAPI(){
        return new OpenAPI()
                .info(apiInfo())
                .externalDocs(new ExternalDocumentation()
                        .description("SpringDoc Wiki Documentation")
                        .url("https://springdoc.org/v2"));
    }

    private Info apiInfo() {
        return new Info()
                .title("Azure Demo API Doc")
                .description("springfox swagger 3.0 demo")
                .version("1.0.0")
                .contact(new Contact()
                        .name("<Your name>")
                        .url("<Your url>")
                        .email("<Your email>")
                )
                .license(new License()
                        .name("Apache 2.0")
                        .url("http://www.apache.org/licenses/LICENSE-2.0.txt")
                );
    }
}


```

## 用法

### 实体类

```java
@Schema(description = "文章")
@NotNull(message = "不能为空")
public class Article extends Serializable {
    @Schema(description = "标题")
    private String title;
}
```

### 接口

-   类注释：`@Tag(name = "ArticleController", description = "文章接口")`
-   方法注释：`@Operation(summary = "根据文章ID获取文章对象")`
-   参数注释：`@Parameter(description = "文章ID", required = true)`
-   返回值: `@ApiResponses(value = {@ApiResponse(description = "文章对象")})`

