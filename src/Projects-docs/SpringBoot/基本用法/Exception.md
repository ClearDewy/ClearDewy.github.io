# Exception

**全局异常处理**

## 注入异常

此类作用为注入异常，当出现异常时自动返回异常结果

```java
@ControllerAdvice
public class GlobalExceptionAdvice {
    /**
     * @description:T为自定义异常类，Result为统一返回格式
     **/
    @ResponseBody
    @ExceptionHandler(T.class)
    public Result handleException(T e){
        return Result.error(e.getCode(),e.getMessage());
    }
}
```

## 自定义异常

```java
@Getter
public class ServiceException extends RuntimeException{
    private Integer code;
    public ServiceException(Integer code,String msg){
        super(msg);
        this.code=code;
    }
}
```

