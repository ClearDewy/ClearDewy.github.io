# Redis

缓存，减少数据库查询次数等

## 引入依赖

```xml
<!-- 集成redis依赖  -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
```

## 配置

```yml
spring:    
  data:                       #直接连接redis
    redis:
      host: localhost         # 地址
      port: 6379              # 端口
      password: 040110        # 密码
```

## 用法

```java
	@Autowired
    RedisTemplate redisTemplate;    // 以对象方式操作redis
    @Autowired
    StringRedisTemplate stringRedisTemplate;    // 以字符串形式操作redis，和客户端操作相同
```