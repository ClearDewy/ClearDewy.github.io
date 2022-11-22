# JudgeServer

## 更新镜像：

```shell
docker cp D:\OJDATA\HOJ\hoj-springboot\JudgeServer\target\hoj-judgeServer-4.5.jar hoj-judgeserver:/judge/server/app.jar

docker commit -m "Dewyoj-judgeserver" -a "ClearDewy" 容器ID dewyoj-judgeserver

docker images

docker login --username=qingtuan registry.cn-hangzhou.aliyuncs.com
docker tag [ImageId] registry.cn-hangzhou.aliyuncs.com/cleardewy/hoj:Dewyoj-judgeserver
docker push registry.cn-hangzhou.aliyuncs.com/cleardewy/hoj:Dewyoj-judgeserver
```

## 修改内容：

### $c++$标准

-   `JudgeServer\src\main\java\top\hcode\hoj\util\Constants.java`中的`c++14`改为`c++17`

