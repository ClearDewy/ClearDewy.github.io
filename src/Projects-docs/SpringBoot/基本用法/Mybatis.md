# $Mybatis$

- 启动类注解扫描

```java
@MapperScan("com/qingtuan/acmsis")
```

- 数据库语言文件 .xml

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="这里写数据操作层dao/mapper">
	<select id="MySelect" parameterType="Data" resultType="Data">
        
    </select>
    <update id="MyUpdate">
        
    </update>
    <delete id="MyDelete">
        
    </delete>
    <insert id="MyInsert">
        
    </insert>

</mapper>
```

- 创建$mapper$接口

```java
@Mapper
public interface MyMapper {
    Integer MyInsert (Data data)throws DataAccessException;
    List<Data> MySelect()throws DataAccessException;
    Integer MyUpdate(Data data)throws DataAccessException;
    Integer MyDelete(Data data)throws DataAccessException;
}
```

- $service$类使用

```java
	@Autowired
    private MyMapper myMapper;
```

