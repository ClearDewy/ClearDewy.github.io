# $axios$请求

- 安装

```powershell
# 安装
npm install axios
```

- 导入

```typescript
import axios from 'axios'
```

- 基本用法

```typescript
axios({
    method: 'post',
    url:url,
    data:data
}).then(()=>{
    
}).catch((error)=>{
    
})
```

- 设置前缀$url$

```typescript
axios.defaults.baseURL="http://43.142.187.104:1107/api"
```

- $post$请求的$data$数据

```typescript
var data=new formData()
data.append("key","value")
```

- 封装$get$请求

```typescript
const GET=(url:string)=>{
    return new Promise((resolve)=>{
        axios.get(url).then((res)=>{
            if (res.status!=200){
                alerterror(res.statusText)
            }
            resolve(res)
        }).catch((error)=>{
            alerterror(error.message)
        })
    })
}
```

- 封装$post$请求

```typescript
const POST=(url:string,data:object)=>{
    return new Promise((resolve)=>{
        axios({
            method: 'post',
            url:url,
            data:data
        }).then((res)=>{
            if (res.status!=200){
                alerterror(res.statusText)
            }
            resolve(res)
        }).catch((error)=>{
            alerterror(error.message)
        })
    })
}
```
