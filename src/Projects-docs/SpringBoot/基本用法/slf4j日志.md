# $slf4j$日志

使用$Lombox$的$@Slf4j$

```java
@Slf4j
public class GuoBiaoSynController {
    public void getInfo() {
        String temp = JSON.toJSONString(jsonObject);
        log.info("国标云请求体：{}", jsonObject);      //直接string + 对象
        log.info(JSON.toJSONString(jsonObject));
        log.info("00000000000000000");
        log.info(jsonObject.getString("Header"));
 
    }
}
```

