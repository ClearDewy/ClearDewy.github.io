# Docker部署

## Dockerfile

```dockerfile
# 基于的基础镜像
FROM python:3.10.0

# 设置app文件夹是工作目录
ENV WORK_PATH /usr/src/app

WORKDIR $WORK_PATH

ENV WORKFILE morning.py
ENV TZ=Asia/Shanghai

# 拷贝当前目录的项目文件和代码
COPY morning.py morning.py
COPY requirements.txt requirements.txt
COPY data.json data.json

# 建立python3映射
# RUN ln -s /usr/bin/python3 /usr/bin/python

# 执行指令，安装依赖
RUN pip install -r requirements.txt


# 执行命令
#CMD [ "/usr/bin/python3", "/usr/src/app/morning.py"]
ENTRYPOINT ["python"]
CMD ["morning.py"]
```

## docker-compose.yml

```yaml
version: "3"
services:

  morning:
    # image: registry.cn-hangzhou.aliyuncs.com/cleardewy/apps:morning
    image: morning
    container_name: morning
    restart: always
    environment:
    # 设置时区
      - TZ=Asia/Shanghai
```

