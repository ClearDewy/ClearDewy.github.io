import{_ as a}from"./_plugin-vue_export-helper.cdc0426e.js";import{o as t,c as p,d as s,a as n,b as e}from"./app.693a8ebc.js";const c={},o=s(`<h1 id="部署" tabindex="-1"><a class="header-anchor" href="#部署" aria-hidden="true">#</a> 部署</h1><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">docker-compose</span> up <span class="token parameter variable">-d</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div>`,2),u=n("p",null,[n("span",{class:"katex"},[n("span",{class:"katex-mathml"},[n("math",{xmlns:"http://www.w3.org/1998/Math/MathML"},[n("semantics",null,[n("mrow",null,[n("mi",null,"d"),n("mi",null,"o"),n("mi",null,"c"),n("mi",null,"k"),n("mi",null,"e"),n("mi",null,"r"),n("mo",null,"−"),n("mi",null,"c"),n("mi",null,"o"),n("mi",null,"m"),n("mi",null,"p"),n("mi",null,"o"),n("mi",null,"s"),n("mi",null,"e"),n("mi",{mathvariant:"normal"},"."),n("mi",null,"y"),n("mi",null,"m"),n("mi",null,"l")]),n("annotation",{encoding:"application/x-tex"},"docker-compose.yml")])])]),n("span",{class:"katex-html","aria-hidden":"true"},[n("span",{class:"base"},[n("span",{class:"strut",style:{height:"0.7778em","vertical-align":"-0.0833em"}}),n("span",{class:"mord mathnormal"},"d"),n("span",{class:"mord mathnormal"},"oc"),n("span",{class:"mord mathnormal",style:{"margin-right":"0.03148em"}},"k"),n("span",{class:"mord mathnormal",style:{"margin-right":"0.02778em"}},"er"),n("span",{class:"mspace",style:{"margin-right":"0.2222em"}}),n("span",{class:"mbin"},"−"),n("span",{class:"mspace",style:{"margin-right":"0.2222em"}})]),n("span",{class:"base"},[n("span",{class:"strut",style:{height:"0.8889em","vertical-align":"-0.1944em"}}),n("span",{class:"mord mathnormal"},"co"),n("span",{class:"mord mathnormal"},"m"),n("span",{class:"mord mathnormal"},"p"),n("span",{class:"mord mathnormal"},"ose"),n("span",{class:"mord"},"."),n("span",{class:"mord mathnormal",style:{"margin-right":"0.03588em"}},"y"),n("span",{class:"mord mathnormal"},"m"),n("span",{class:"mord mathnormal",style:{"margin-right":"0.01968em"}},"l")])])]),e("文件内容：")],-1),l=s(`<div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">version</span><span class="token punctuation">:</span> <span class="token string">&quot;3&quot;</span>
<span class="token key atrule">services</span><span class="token punctuation">:</span>

  <span class="token key atrule">hoj-redis</span><span class="token punctuation">:</span>
    <span class="token key atrule">image</span><span class="token punctuation">:</span> redis<span class="token punctuation">:</span>5.0.9<span class="token punctuation">-</span>alpine
    <span class="token key atrule">container_name</span><span class="token punctuation">:</span> hoj<span class="token punctuation">-</span>redis
    <span class="token key atrule">restart</span><span class="token punctuation">:</span> always
    <span class="token key atrule">volumes</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> $<span class="token punctuation">{</span>HOJ_DATA_DIRECTORY<span class="token punctuation">}</span>/data/redis/data<span class="token punctuation">:</span>/data
    <span class="token key atrule">networks</span><span class="token punctuation">:</span>
      <span class="token key atrule">hoj-network</span><span class="token punctuation">:</span>
        <span class="token key atrule">ipv4_address</span><span class="token punctuation">:</span> $<span class="token punctuation">{</span>REDIS_HOST<span class="token punctuation">:</span><span class="token punctuation">-</span>172.20.0.2<span class="token punctuation">}</span>
    <span class="token key atrule">ports</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> $<span class="token punctuation">{</span>REDIS_PORT<span class="token punctuation">:</span><span class="token number">-6379</span><span class="token punctuation">}</span><span class="token punctuation">:</span><span class="token number">6379</span>
    <span class="token comment"># --requirepass 后面为redis访问密码</span>
    <span class="token key atrule">command</span><span class="token punctuation">:</span> redis<span class="token punctuation">-</span>server <span class="token punctuation">-</span><span class="token punctuation">-</span>requirepass $<span class="token punctuation">{</span>REDIS_PASSWORD<span class="token punctuation">:</span><span class="token punctuation">-</span>hoj123456<span class="token punctuation">}</span> <span class="token punctuation">-</span><span class="token punctuation">-</span>appendonly yes
        
  <span class="token key atrule">hoj-mysql</span><span class="token punctuation">:</span>
    <span class="token key atrule">image</span><span class="token punctuation">:</span> registry.cn<span class="token punctuation">-</span>shenzhen.aliyuncs.com/hcode/hoj_database
    <span class="token key atrule">container_name</span><span class="token punctuation">:</span> hoj<span class="token punctuation">-</span>mysql
    <span class="token key atrule">restart</span><span class="token punctuation">:</span> always
    <span class="token key atrule">volumes</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> $<span class="token punctuation">{</span>HOJ_DATA_DIRECTORY<span class="token punctuation">}</span>/data/mysql/data<span class="token punctuation">:</span>/var/lib/mysql
    <span class="token key atrule">environment</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> MYSQL_ROOT_PASSWORD=$<span class="token punctuation">{</span>MYSQL_ROOT_PASSWORD<span class="token punctuation">:</span><span class="token punctuation">-</span>hoj123456<span class="token punctuation">}</span> <span class="token comment"># mysql数据库root账号的密码</span>
      <span class="token punctuation">-</span> TZ=Asia/Shanghai
      <span class="token punctuation">-</span> NACOS_USERNAME=$<span class="token punctuation">{</span>NACOS_USERNAME<span class="token punctuation">:</span><span class="token punctuation">-</span>root<span class="token punctuation">}</span> <span class="token comment"># 后续nacos所用管理员账号</span>
      <span class="token punctuation">-</span> NACOS_PASSWORD=$<span class="token punctuation">{</span>NACOS_PASSWORD<span class="token punctuation">:</span><span class="token punctuation">-</span>hoj123456<span class="token punctuation">}</span> <span class="token comment"># 后续nacos所用管理员密码</span>
    <span class="token key atrule">ports</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> $<span class="token punctuation">{</span>MYSQL_PUBLIC_PORT<span class="token punctuation">:</span><span class="token number">-3306</span><span class="token punctuation">}</span><span class="token punctuation">:</span><span class="token number">3306</span>
    <span class="token key atrule">networks</span><span class="token punctuation">:</span>
      <span class="token key atrule">hoj-network</span><span class="token punctuation">:</span>
        <span class="token key atrule">ipv4_address</span><span class="token punctuation">:</span> $<span class="token punctuation">{</span>MYSQL_HOST<span class="token punctuation">:</span><span class="token punctuation">-</span>172.20.0.3<span class="token punctuation">}</span>
      
  <span class="token key atrule">hoj-nacos</span><span class="token punctuation">:</span>
    <span class="token key atrule">image</span><span class="token punctuation">:</span> nacos/nacos<span class="token punctuation">-</span>server<span class="token punctuation">:</span>1.4.2
    <span class="token key atrule">container_name</span><span class="token punctuation">:</span> hoj<span class="token punctuation">-</span>nacos
    <span class="token key atrule">restart</span><span class="token punctuation">:</span> always
    <span class="token key atrule">depends_on</span><span class="token punctuation">:</span> 
      <span class="token punctuation">-</span> hoj<span class="token punctuation">-</span>mysql
    <span class="token key atrule">environment</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> JVM_XMX=384m
      <span class="token punctuation">-</span> JVM_XMS=384m
      <span class="token punctuation">-</span> JVM_XMN=192m
      <span class="token punctuation">-</span> MODE=standalone
      <span class="token punctuation">-</span> SPRING_DATASOURCE_PLATFORM=mysql
      <span class="token punctuation">-</span> MYSQL_SERVICE_HOST=$<span class="token punctuation">{</span>MYSQL_HOST<span class="token punctuation">:</span><span class="token punctuation">-</span>172.20.0.3<span class="token punctuation">}</span>
      <span class="token punctuation">-</span> MYSQL_SERVICE_PORT=3306
      <span class="token punctuation">-</span> MYSQL_SERVICE_USER=root
      <span class="token punctuation">-</span> MYSQL_SERVICE_PASSWORD=$<span class="token punctuation">{</span>MYSQL_ROOT_PASSWORD<span class="token punctuation">:</span><span class="token punctuation">-</span>hoj123456<span class="token punctuation">}</span> <span class="token comment"># 与上面数据库密码一致</span>
      <span class="token punctuation">-</span> MYSQL_SERVICE_DB_NAME=nacos 
      <span class="token punctuation">-</span> NACOS_AUTH_ENABLE=true <span class="token comment"># 开启鉴权</span>
    <span class="token key atrule">ports</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> $<span class="token punctuation">{</span>NACOS_PORT<span class="token punctuation">:</span><span class="token number">-8848</span><span class="token punctuation">}</span><span class="token punctuation">:</span><span class="token number">8848</span>
    <span class="token key atrule">healthcheck</span><span class="token punctuation">:</span>
      <span class="token key atrule">test</span><span class="token punctuation">:</span> curl <span class="token punctuation">-</span>f http<span class="token punctuation">:</span>//$<span class="token punctuation">{</span>NACOS_HOST<span class="token punctuation">:</span><span class="token punctuation">-</span>172.20.0.4<span class="token punctuation">}</span><span class="token punctuation">:</span>8848/nacos/index.html <span class="token punctuation">|</span><span class="token punctuation">|</span> exit 1
      <span class="token key atrule">interval</span><span class="token punctuation">:</span> 6s
      <span class="token key atrule">timeout</span><span class="token punctuation">:</span> 10s
      <span class="token key atrule">retries</span><span class="token punctuation">:</span> <span class="token number">10</span>
    <span class="token key atrule">networks</span><span class="token punctuation">:</span>
      <span class="token key atrule">hoj-network</span><span class="token punctuation">:</span>
        <span class="token key atrule">ipv4_address</span><span class="token punctuation">:</span> $<span class="token punctuation">{</span>NACOS_HOST<span class="token punctuation">:</span><span class="token punctuation">-</span>172.20.0.4<span class="token punctuation">}</span>
    
  <span class="token key atrule">hoj-backend</span><span class="token punctuation">:</span>
    <span class="token key atrule">image</span><span class="token punctuation">:</span> registry.cn<span class="token punctuation">-</span>hangzhou.aliyuncs.com/cleardewy/hoj<span class="token punctuation">:</span>Dewyoj<span class="token punctuation">-</span>backend
    <span class="token key atrule">container_name</span><span class="token punctuation">:</span> hoj<span class="token punctuation">-</span>backend
    <span class="token key atrule">restart</span><span class="token punctuation">:</span> always
    <span class="token key atrule">depends_on</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> hoj<span class="token punctuation">-</span>redis
      <span class="token punctuation">-</span> hoj<span class="token punctuation">-</span>mysql
      <span class="token punctuation">-</span> hoj<span class="token punctuation">-</span>nacos
    <span class="token key atrule">volumes</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> $<span class="token punctuation">{</span>HOJ_DATA_DIRECTORY<span class="token punctuation">}</span>/file<span class="token punctuation">:</span>/hoj/file
      <span class="token punctuation">-</span> $<span class="token punctuation">{</span>HOJ_DATA_DIRECTORY<span class="token punctuation">}</span>/testcase<span class="token punctuation">:</span>/hoj/testcase
      <span class="token punctuation">-</span> $<span class="token punctuation">{</span>HOJ_DATA_DIRECTORY<span class="token punctuation">}</span>/log/backend<span class="token punctuation">:</span>/hoj/log/backend
    <span class="token key atrule">environment</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> TZ=Asia/Shanghai
      <span class="token punctuation">-</span> JAVA_OPTS=<span class="token punctuation">-</span>Xms192m <span class="token punctuation">-</span>Xmx384m
      <span class="token punctuation">-</span> BACKEND_SERVER_PORT=$<span class="token punctuation">{</span>BACKEND_PORT<span class="token punctuation">:</span><span class="token number">-6688</span><span class="token punctuation">}</span>
      <span class="token punctuation">-</span> NACOS_URL=$<span class="token punctuation">{</span>NACOS_HOST<span class="token punctuation">:</span><span class="token punctuation">-</span>172.20.0.4<span class="token punctuation">}</span><span class="token punctuation">:</span><span class="token number">8848</span>
      <span class="token punctuation">-</span> NACOS_USERNAME=$<span class="token punctuation">{</span>NACOS_USERNAME<span class="token punctuation">:</span><span class="token punctuation">-</span>root<span class="token punctuation">}</span> <span class="token comment"># 登录 http://ip:8848/nacos 分布式配置中心与注册中心的后台的账号</span>
      <span class="token punctuation">-</span> NACOS_PASSWORD=$<span class="token punctuation">{</span>NACOS_PASSWORD<span class="token punctuation">:</span><span class="token punctuation">-</span>hoj123456<span class="token punctuation">}</span> <span class="token comment"># 密码</span>
      <span class="token punctuation">-</span> JWT_TOKEN_SECRET=$<span class="token punctuation">{</span>JWT_TOKEN_SECRET<span class="token punctuation">:</span><span class="token punctuation">-</span>default<span class="token punctuation">}</span> <span class="token comment"># token加密秘钥 默认则生成32位随机密钥</span>
      <span class="token punctuation">-</span> JWT_TOKEN_EXPIRE=$<span class="token punctuation">{</span>JWT_TOKEN_EXPIRE<span class="token punctuation">:</span><span class="token number">-86400</span><span class="token punctuation">}</span> <span class="token comment"># token过期时间默认为24小时 86400s</span>
      <span class="token punctuation">-</span> JWT_TOKEN_FRESH_EXPIRE=$<span class="token punctuation">{</span>JWT_TOKEN_FRESH_EXPIRE<span class="token punctuation">:</span><span class="token number">-43200</span><span class="token punctuation">}</span> <span class="token comment"># token默认12小时可自动刷新</span>
      <span class="token punctuation">-</span> JUDGE_TOKEN=$<span class="token punctuation">{</span>JUDGE_TOKEN<span class="token punctuation">:</span><span class="token punctuation">-</span>default<span class="token punctuation">}</span> <span class="token comment"># 调用判题服务器的token 默认则生成32位随机密钥</span>
      <span class="token punctuation">-</span> MYSQL_HOST=$<span class="token punctuation">{</span>MYSQL_HOST<span class="token punctuation">:</span><span class="token punctuation">-</span>172.20.0.3<span class="token punctuation">}</span>
      <span class="token punctuation">-</span> MYSQL_PUBLIC_HOST=$<span class="token punctuation">{</span>MYSQL_PUBLIC_HOST<span class="token punctuation">}</span> <span class="token comment"># 如果判题服务是分布式，请提供当前mysql所在服务器的公网ip</span>
      <span class="token punctuation">-</span> MYSQL_PUBLIC_PORT=$<span class="token punctuation">{</span>MYSQL_PUBLIC_PORT<span class="token punctuation">:</span><span class="token number">-3306</span><span class="token punctuation">}</span>
      <span class="token punctuation">-</span> MYSQL_PORT=3306
      <span class="token punctuation">-</span> MYSQL_DATABASE_NAME=hoj <span class="token comment"># 改动需要修改hoj-mysql镜像,默认为hoj</span>
      <span class="token punctuation">-</span> MYSQL_USERNAME=root
      <span class="token punctuation">-</span> MYSQL_ROOT_PASSWORD=$<span class="token punctuation">{</span>MYSQL_ROOT_PASSWORD<span class="token punctuation">:</span><span class="token punctuation">-</span>hoj123456<span class="token punctuation">}</span>
      <span class="token punctuation">-</span> EMAIL_SERVER_HOST=$<span class="token punctuation">{</span>EMAIL_SERVER_HOST<span class="token punctuation">:</span><span class="token punctuation">-</span>smtp.qq.com<span class="token punctuation">}</span> <span class="token comment"># 请使用邮件服务的域名或ip</span>
      <span class="token punctuation">-</span> EMAIL_SERVER_PORT=$<span class="token punctuation">{</span>EMAIL_SERVER_PORT<span class="token punctuation">:</span><span class="token number">-465</span><span class="token punctuation">}</span> <span class="token comment"># 请使用邮件服务的端口号</span>
      <span class="token punctuation">-</span> EMAIL_USERNAME=$<span class="token punctuation">{</span>EMAIL_USERNAME<span class="token punctuation">:</span><span class="token punctuation">-</span>your_email_username<span class="token punctuation">}</span> <span class="token comment"># 请使用对应邮箱账号</span>
      <span class="token punctuation">-</span> EMAIL_PASSWORD=$<span class="token punctuation">{</span>EMAIL_PASSWORD<span class="token punctuation">:</span><span class="token punctuation">-</span>your_email_password<span class="token punctuation">}</span> <span class="token comment"># 请使用对应邮箱密码</span>
      <span class="token punctuation">-</span> REDIS_HOST=$<span class="token punctuation">{</span>REDIS_HOST<span class="token punctuation">:</span><span class="token punctuation">-</span>172.20.0.2<span class="token punctuation">}</span>
      <span class="token punctuation">-</span> REDIS_PORT=6379
      <span class="token punctuation">-</span> REDIS_PASSWORD=$<span class="token punctuation">{</span>REDIS_PASSWORD<span class="token punctuation">:</span><span class="token punctuation">-</span>hoj123456<span class="token punctuation">}</span>
      <span class="token punctuation">-</span> OPEN_REMOTE_JUDGE=true <span class="token comment"># 是否开启各个remote judge</span>
      <span class="token comment"># 开启虚拟判题请提供对应oj的账号密码 格式为 </span>
      <span class="token comment"># username1,username2,...</span>
      <span class="token comment"># password1,password2,...</span>
      <span class="token punctuation">-</span> HDU_ACCOUNT_USERNAME_LIST=$<span class="token punctuation">{</span>HDU_ACCOUNT_USERNAME_LIST<span class="token punctuation">}</span>
      <span class="token punctuation">-</span> HDU_ACCOUNT_PASSWORD_LIST=$<span class="token punctuation">{</span>HDU_ACCOUNT_PASSWORD_LIST<span class="token punctuation">}</span>
      <span class="token punctuation">-</span> CF_ACCOUNT_USERNAME_LIST=$<span class="token punctuation">{</span>CF_ACCOUNT_USERNAME_LIST<span class="token punctuation">}</span>
      <span class="token punctuation">-</span> CF_ACCOUNT_PASSWORD_LIST=$<span class="token punctuation">{</span>CF_ACCOUNT_PASSWORD_LIST<span class="token punctuation">}</span>
      <span class="token punctuation">-</span> POJ_ACCOUNT_USERNAME_LIST=$<span class="token punctuation">{</span>POJ_ACCOUNT_USERNAME_LIST<span class="token punctuation">}</span>
      <span class="token punctuation">-</span> POJ_ACCOUNT_PASSWORD_LIST=$<span class="token punctuation">{</span>POJ_ACCOUNT_PASSWORD_LIST<span class="token punctuation">}</span>
      <span class="token punctuation">-</span> ATCODER_ACCOUNT_USERNAME_LIST=$<span class="token punctuation">{</span>ATCODER_ACCOUNT_USERNAME_LIST<span class="token punctuation">}</span>
      <span class="token punctuation">-</span> ATCODER_ACCOUNT_PASSWORD_LIST=$<span class="token punctuation">{</span>ATCODER_ACCOUNT_PASSWORD_LIST<span class="token punctuation">}</span>
      <span class="token punctuation">-</span> SPOJ_ACCOUNT_USERNAME_LIST=$<span class="token punctuation">{</span>SPOJ_ACCOUNT_USERNAME_LIST<span class="token punctuation">}</span>
      <span class="token punctuation">-</span> SPOJ_ACCOUNT_PASSWORD_LIST=$<span class="token punctuation">{</span>SPOJ_ACCOUNT_PASSWORD_LIST<span class="token punctuation">}</span>
      <span class="token comment"># 是否强制使用配置文件的remote judge账号覆盖原有系统的账号列表</span>
      <span class="token punctuation">-</span> FORCED_UPDATE_REMOTE_JUDGE_ACCOUNT=$<span class="token punctuation">{</span>FORCED_UPDATE_REMOTE_JUDGE_ACCOUNT<span class="token punctuation">:</span><span class="token punctuation">-</span><span class="token boolean important">false</span><span class="token punctuation">}</span>
    <span class="token key atrule">ports</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> $<span class="token punctuation">{</span>BACKEND_PORT<span class="token punctuation">:</span><span class="token number">-6688</span><span class="token punctuation">}</span><span class="token punctuation">:</span>$<span class="token punctuation">{</span>BACKEND_PORT<span class="token punctuation">:</span><span class="token number">-6688</span><span class="token punctuation">}</span>
    <span class="token key atrule">networks</span><span class="token punctuation">:</span>
      <span class="token key atrule">hoj-network</span><span class="token punctuation">:</span>
        <span class="token key atrule">ipv4_address</span><span class="token punctuation">:</span> $<span class="token punctuation">{</span>BACKEND_HOST<span class="token punctuation">:</span><span class="token punctuation">-</span>172.20.0.5<span class="token punctuation">}</span>
  
  <span class="token key atrule">hoj-frontend</span><span class="token punctuation">:</span>
    <span class="token key atrule">image</span><span class="token punctuation">:</span> registry.cn<span class="token punctuation">-</span>hangzhou.aliyuncs.com/cleardewy/hoj<span class="token punctuation">:</span>Dewyoj<span class="token punctuation">-</span>front
    <span class="token key atrule">container_name</span><span class="token punctuation">:</span> hoj<span class="token punctuation">-</span>frontend
    <span class="token key atrule">restart</span><span class="token punctuation">:</span> always
    <span class="token comment"># 开启https，请提供证书</span>
    <span class="token key atrule">volumes</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> ./server.crt<span class="token punctuation">:</span>/etc/nginx/etc/crt/server.crt
      <span class="token punctuation">-</span> ./server.key<span class="token punctuation">:</span>/etc/nginx/etc/crt/server.key
    <span class="token comment"># 修改前端logo</span>
    <span class="token comment">#  - ./logo.a0924d7d.png:/usr/share/nginx/html/assets/img/logo.a0924d7d.png</span>
    <span class="token comment">#  - ./backstage.8bce8c6e.png:/usr/share/nginx/html/assets/img/backstage.8bce8c6e.png</span>
    <span class="token key atrule">environment</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> SERVER_NAME=localhost <span class="token comment"># # 域名或localhost(本地)</span>
      <span class="token punctuation">-</span> BACKEND_SERVER_HOST=$<span class="token punctuation">{</span>BACKEND_HOST<span class="token punctuation">:</span><span class="token punctuation">-</span>172.20.0.5<span class="token punctuation">}</span> <span class="token comment"># backend后端服务地址</span>
      <span class="token punctuation">-</span> BACKEND_SERVER_PORT=$<span class="token punctuation">{</span>BACKEND_PORT<span class="token punctuation">:</span><span class="token number">-6688</span><span class="token punctuation">}</span> <span class="token comment"># backend后端服务端口号</span>
      <span class="token punctuation">-</span> USE_HTTPS=true <span class="token comment"># 使用https请设置为true</span>
    <span class="token key atrule">ports</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token string">&quot;80:80&quot;</span>
      <span class="token punctuation">-</span> <span class="token string">&quot;443:443&quot;</span>
    <span class="token key atrule">networks</span><span class="token punctuation">:</span>
      <span class="token key atrule">hoj-network</span><span class="token punctuation">:</span>
        <span class="token key atrule">ipv4_address</span><span class="token punctuation">:</span> 172.20.0.6
  
  <span class="token key atrule">hoj-judgeserver</span><span class="token punctuation">:</span>
    <span class="token key atrule">image</span><span class="token punctuation">:</span> registry.cn<span class="token punctuation">-</span>shenzhen.aliyuncs.com/hcode/hoj_judgeserver
    <span class="token key atrule">container_name</span><span class="token punctuation">:</span> hoj<span class="token punctuation">-</span>judgeserver
    <span class="token key atrule">restart</span><span class="token punctuation">:</span> always
    <span class="token key atrule">depends_on</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> hoj<span class="token punctuation">-</span>mysql
      <span class="token punctuation">-</span> hoj<span class="token punctuation">-</span>nacos
    <span class="token key atrule">volumes</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> $<span class="token punctuation">{</span>HOJ_DATA_DIRECTORY<span class="token punctuation">}</span>/testcase<span class="token punctuation">:</span>/judge/test_case
      <span class="token punctuation">-</span> $<span class="token punctuation">{</span>HOJ_DATA_DIRECTORY<span class="token punctuation">}</span>/judge/log<span class="token punctuation">:</span>/judge/log
      <span class="token punctuation">-</span> $<span class="token punctuation">{</span>HOJ_DATA_DIRECTORY<span class="token punctuation">}</span>/judge/run<span class="token punctuation">:</span>/judge/run
      <span class="token punctuation">-</span> $<span class="token punctuation">{</span>HOJ_DATA_DIRECTORY<span class="token punctuation">}</span>/judge/spj<span class="token punctuation">:</span>/judge/spj
      <span class="token punctuation">-</span> $<span class="token punctuation">{</span>HOJ_DATA_DIRECTORY<span class="token punctuation">}</span>/judge/interactive<span class="token punctuation">:</span>/judge/interactive
      <span class="token punctuation">-</span> $<span class="token punctuation">{</span>HOJ_DATA_DIRECTORY<span class="token punctuation">}</span>/log/judgeserver<span class="token punctuation">:</span>/judge/log/judgeserver
    <span class="token key atrule">environment</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> TZ=Asia/Shanghai
      <span class="token punctuation">-</span> JAVA_OPTS=<span class="token punctuation">-</span>Xms192m <span class="token punctuation">-</span>Xmx384m <span class="token comment"># 修正JVM参数以便适应单机部署</span>
      <span class="token punctuation">-</span> JUDGE_SERVER_IP=$<span class="token punctuation">{</span>JUDGE_SERVER_IP<span class="token punctuation">:</span><span class="token punctuation">-</span>172.20.0.7<span class="token punctuation">}</span>
      <span class="token punctuation">-</span> JUDGE_SERVER_PORT=$<span class="token punctuation">{</span>JUDGE_SERVER_PORT<span class="token punctuation">:</span><span class="token number">-8088</span><span class="token punctuation">}</span>
      <span class="token punctuation">-</span> JUDGE_SERVER_NAME=$<span class="token punctuation">{</span>JUDGE_SERVER_NAME<span class="token punctuation">:</span><span class="token punctuation">-</span>judger<span class="token punctuation">-</span>alone<span class="token punctuation">}</span> <span class="token comment"># 判题服务的名字</span>
      <span class="token punctuation">-</span> NACOS_URL=$<span class="token punctuation">{</span>NACOS_HOST<span class="token punctuation">:</span><span class="token punctuation">-</span>172.20.0.4<span class="token punctuation">}</span><span class="token punctuation">:</span><span class="token number">8848</span>
      <span class="token punctuation">-</span> NACOS_USERNAME=$<span class="token punctuation">{</span>NACOS_USERNAME<span class="token punctuation">:</span><span class="token punctuation">-</span>root<span class="token punctuation">}</span>
      <span class="token punctuation">-</span> NACOS_PASSWORD=$<span class="token punctuation">{</span>NACOS_PASSWORD<span class="token punctuation">:</span><span class="token punctuation">-</span>hoj123456<span class="token punctuation">}</span>
      <span class="token punctuation">-</span> MAX_TASK_NUM=$<span class="token punctuation">{</span>MAX_TASK_NUM<span class="token punctuation">:</span><span class="token punctuation">-</span><span class="token number">-1</span><span class="token punctuation">}</span> <span class="token comment"># -1表示最大可接收判题任务数为cpu核心数+1</span>
      <span class="token punctuation">-</span> REMOTE_JUDGE_OPEN=$<span class="token punctuation">{</span>REMOTE_JUDGE_OPEN<span class="token punctuation">:</span><span class="token punctuation">-</span><span class="token boolean important">true</span><span class="token punctuation">}</span> <span class="token comment"># 当前判题服务器是否开启远程虚拟判题功能</span>
      <span class="token punctuation">-</span> REMOTE_JUDGE_MAX_TASK_NUM=$<span class="token punctuation">{</span>REMOTE_JUDGE_MAX_TASK_NUM<span class="token punctuation">:</span><span class="token punctuation">-</span><span class="token number">-1</span><span class="token punctuation">}</span> <span class="token comment"># -1表示最大可接收远程判题任务数为cpu核心数*2+1</span>
      <span class="token punctuation">-</span> PARALLEL_TASK=$<span class="token punctuation">{</span>PARALLEL_TASK<span class="token punctuation">:</span><span class="token punctuation">-</span>default<span class="token punctuation">}</span> <span class="token comment"># 默认沙盒并行判题程序数为cpu核心数</span>
    <span class="token key atrule">ports</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> $<span class="token punctuation">{</span>JUDGE_SERVER_PORT<span class="token punctuation">:</span><span class="token number">-8088</span><span class="token punctuation">}</span><span class="token punctuation">:</span>$<span class="token punctuation">{</span>JUDGE_SERVER_PORT<span class="token punctuation">:</span><span class="token number">-8088</span><span class="token punctuation">}</span>
      <span class="token comment"># - &quot;0.0.0.0:5050:5050&quot; # 一般不开放安全沙盒端口</span>
    <span class="token key atrule">healthcheck</span><span class="token punctuation">:</span>
      <span class="token key atrule">test</span><span class="token punctuation">:</span> curl <span class="token punctuation">-</span>f http<span class="token punctuation">:</span>//$<span class="token punctuation">{</span>JUDGE_SERVER_IP<span class="token punctuation">:</span><span class="token punctuation">-</span>172.20.0.7<span class="token punctuation">}</span><span class="token punctuation">:</span>$<span class="token punctuation">{</span>JUDGE_SERVER_PORT<span class="token punctuation">:</span><span class="token number">-8088</span><span class="token punctuation">}</span>/version <span class="token punctuation">|</span><span class="token punctuation">|</span> exit 1
      <span class="token key atrule">interval</span><span class="token punctuation">:</span> 30s
      <span class="token key atrule">timeout</span><span class="token punctuation">:</span> 10s
      <span class="token key atrule">retries</span><span class="token punctuation">:</span> <span class="token number">3</span>
    <span class="token key atrule">privileged</span><span class="token punctuation">:</span> <span class="token boolean important">true</span> <span class="token comment"># 设置容器的权限为root</span>
    <span class="token key atrule">shm_size</span><span class="token punctuation">:</span> 512mb
    <span class="token key atrule">networks</span><span class="token punctuation">:</span>
      <span class="token key atrule">hoj-network</span><span class="token punctuation">:</span>
        <span class="token key atrule">ipv4_address</span><span class="token punctuation">:</span> 172.20.0.7


  <span class="token key atrule">hoj-mysql-checker</span><span class="token punctuation">:</span>
    <span class="token key atrule">image</span><span class="token punctuation">:</span> registry.cn<span class="token punctuation">-</span>shenzhen.aliyuncs.com/hcode/hoj_database_checker
    <span class="token key atrule">container_name</span><span class="token punctuation">:</span> hoj<span class="token punctuation">-</span>mysql<span class="token punctuation">-</span>checker
    <span class="token key atrule">depends_on</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> hoj<span class="token punctuation">-</span>mysql
    <span class="token key atrule">links</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> hoj<span class="token punctuation">-</span>mysql<span class="token punctuation">:</span>mysql
    <span class="token key atrule">environment</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> MYSQL_ROOT_PASSWORD=$<span class="token punctuation">{</span>MYSQL_ROOT_PASSWORD<span class="token punctuation">:</span><span class="token punctuation">-</span>hoj123456<span class="token punctuation">}</span>
    <span class="token key atrule">networks</span><span class="token punctuation">:</span>
      <span class="token key atrule">hoj-network</span><span class="token punctuation">:</span>
        <span class="token key atrule">ipv4_address</span><span class="token punctuation">:</span> 172.20.0.8
    
  <span class="token key atrule">hoj-autohealth</span><span class="token punctuation">:</span>  <span class="token comment"># 监控不健康的容器进行重启</span>
    <span class="token key atrule">restart</span><span class="token punctuation">:</span> always
    <span class="token key atrule">container_name</span><span class="token punctuation">:</span> hoj<span class="token punctuation">-</span>autohealth
    <span class="token key atrule">image</span><span class="token punctuation">:</span> willfarrell/autoheal
    <span class="token key atrule">environment</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> AUTOHEAL_CONTAINER_LABEL=all
    <span class="token key atrule">volumes</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> /var/run/docker.sock<span class="token punctuation">:</span>/var/run/docker.sock
    
<span class="token key atrule">networks</span><span class="token punctuation">:</span>
   <span class="token key atrule">hoj-network</span><span class="token punctuation">:</span>
     <span class="token key atrule">driver</span><span class="token punctuation">:</span> bridge
     <span class="token key atrule">ipam</span><span class="token punctuation">:</span>
       <span class="token key atrule">config</span><span class="token punctuation">:</span>
         <span class="token punctuation">-</span> <span class="token key atrule">subnet</span><span class="token punctuation">:</span> $<span class="token punctuation">{</span>SUBNET<span class="token punctuation">:</span><span class="token punctuation">-</span>172.20.0.0/16<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,1),i=[o,u,l];function k(r,d){return t(),p("div",null,i)}const _=a(c,[["render",k],["__file","部署.html.vue"]]);export{_ as default};
