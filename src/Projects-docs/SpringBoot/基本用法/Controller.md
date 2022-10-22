# $Controller$

定义$Controller$类

```java
@RestController
@RequestMapping("/api")
@ResponseBody
public class api{
    @Autowired
    private Service service;
    
    @RequestMapping("/getalluser")
    JsonResult getalluser(){
        return service.GetAllUser();
    }
}
```

