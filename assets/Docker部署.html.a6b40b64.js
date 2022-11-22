import{_ as n}from"./_plugin-vue_export-helper.cdc0426e.js";import{o as s,c as a,d as e}from"./app.4e3b4a7c.js";const i={},c=e(`<h1 id="docker部署" tabindex="-1"><a class="header-anchor" href="#docker部署" aria-hidden="true">#</a> Docker部署</h1><h2 id="dockerfile" tabindex="-1"><a class="header-anchor" href="#dockerfile" aria-hidden="true">#</a> Dockerfile</h2><div class="language-docker line-numbers-mode" data-ext="docker"><pre class="language-docker"><code><span class="token comment"># 基于的基础镜像</span>
<span class="token instruction"><span class="token keyword">FROM</span> python:3.10.0</span>

<span class="token comment"># 设置app文件夹是工作目录</span>
<span class="token instruction"><span class="token keyword">ENV</span> WORK_PATH /usr/src/app</span>

<span class="token instruction"><span class="token keyword">WORKDIR</span> <span class="token variable">$WORK_PATH</span></span>

<span class="token instruction"><span class="token keyword">ENV</span> WORKFILE morning.py</span>
<span class="token instruction"><span class="token keyword">ENV</span> TZ=Asia/Shanghai</span>

<span class="token comment"># 拷贝当前目录的项目文件和代码</span>
<span class="token instruction"><span class="token keyword">COPY</span> morning.py morning.py</span>
<span class="token instruction"><span class="token keyword">COPY</span> requirements.txt requirements.txt</span>
<span class="token instruction"><span class="token keyword">COPY</span> data.json data.json</span>

<span class="token comment"># 建立python3映射</span>
<span class="token comment"># RUN ln -s /usr/bin/python3 /usr/bin/python</span>

<span class="token comment"># 执行指令，安装依赖</span>
<span class="token instruction"><span class="token keyword">RUN</span> pip install -r requirements.txt</span>


<span class="token comment"># 执行命令</span>
<span class="token comment">#CMD [ &quot;/usr/bin/python3&quot;, &quot;/usr/src/app/morning.py&quot;]</span>
<span class="token instruction"><span class="token keyword">ENTRYPOINT</span> [<span class="token string">&quot;python&quot;</span>]</span>
<span class="token instruction"><span class="token keyword">CMD</span> [<span class="token string">&quot;morning.py&quot;</span>]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="docker-compose-yml" tabindex="-1"><a class="header-anchor" href="#docker-compose-yml" aria-hidden="true">#</a> docker-compose.yml</h2><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">version</span><span class="token punctuation">:</span> <span class="token string">&quot;3&quot;</span>
<span class="token key atrule">services</span><span class="token punctuation">:</span>

  <span class="token key atrule">morning</span><span class="token punctuation">:</span>
    <span class="token comment"># image: registry.cn-hangzhou.aliyuncs.com/cleardewy/apps:morning</span>
    <span class="token key atrule">image</span><span class="token punctuation">:</span> morning
    <span class="token key atrule">container_name</span><span class="token punctuation">:</span> morning
    <span class="token key atrule">restart</span><span class="token punctuation">:</span> always
    <span class="token key atrule">environment</span><span class="token punctuation">:</span>
    <span class="token comment"># 设置时区</span>
      <span class="token punctuation">-</span> TZ=Asia/Shanghai
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,5),l=[c];function t(o,r){return s(),a("div",null,l)}const u=n(i,[["render",t],["__file","Docker部署.html.vue"]]);export{u as default};
