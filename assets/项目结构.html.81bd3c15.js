import{_ as i}from"./_plugin-vue_export-helper.cdc0426e.js";import{o as n,c as e,d as s}from"./app.e64eb5b7.js";const l={},d=s(`<h1 id="\u9879\u76EE\u7ED3\u6784" tabindex="-1"><a class="header-anchor" href="#\u9879\u76EE\u7ED3\u6784" aria-hidden="true">#</a> \u9879\u76EE\u7ED3\u6784</h1><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>servicex                 // \u9879\u76EE\u540D
    |- admin-ui          // \u7BA1\u7406\u670D\u52A1\u524D\u7AEF\u4EE3\u7801(\u4E00\u822C\u5C06UI\u548CSERVICE\u653E\u5230\u4E00\u4E2A\u5DE5\u7A0B\u4E2D\uFF0C\u4FBF\u4E8E\u7BA1\u7406)
    |- servicex-auth     // \u6A21\u57571
    |- servicex-common   // \u6A21\u57572
    |- servicex-gateway  // \u6A21\u57573
    |- servicex-system   // \u6A21\u57574
        |- src
            |- main                  // \u4E1A\u52A1\u903B\u8F91
                |- assembly          // \u57FA\u4E8Emaven assembly\u63D2\u4EF6\u7684\u670D\u52A1\u5316\u6253\u5305\u65B9\u6848
                    |- bin           // \u6A21\u5757\u811A\u672C(\u542F\u52A8\u3001\u505C\u6B62\u3001\u91CD\u542F)
                    |- sbin          // \u7BA1\u7406\u5458\u89D2\u8272\u4F7F\u7528\u7684\u811A\u672C(\u73AF\u5883\u68C0\u67E5\u3001\u7CFB\u7EDF\u68C0\u6D4B\u7B49\u7B49)
                    |- assembly.xml  // \u914D\u7F6E\u6587\u4EF6
                |- java              // \u6E90\u7801
                    |- com
                        |- hadoopx
                            |- servicex
                                |- system
                                    |- annotation     // \u6CE8\u89E3
                                    |- aspect         // \u9762\u5411\u5207\u9762\u7F16\u7A0B
                                    |- config         // \u914D\u7F6E\u6587\u4EF6POJO
                                    |- filter         // \u8FC7\u6EE4\u5668
                                    |- constant       // \u5B58\u653E\u5E38\u91CF
                                    |- utils          // \u5DE5\u5177
                                    |- exception      // \u5F02\u5E38
                                    |- controller     // \u63A7\u5236\u5C42(\u5C06\u8BF7\u6C42\u901A\u8FC7URL\u5339\u914D\uFF0C\u5206\u914D\u5230\u4E0D\u540C\u7684\u63A5\u6536\u5668/\u65B9\u6CD5\u8FDB\u884C\u5904\u7406\uFF0C\u7136\u540E\u8FD4\u56DE\u7ED3\u679C)
                                    |- service        // \u670D\u52A1\u5C42\u63A5\u53E3
                                        |- impl       // \u670D\u52A1\u5C42\u5B9E\u73B0
                                    |- mapper/repository // \u6570\u636E\u8BBF\u95EE\u5C42\uFF0C\u4E0E\u6570\u636E\u5E93\u4EA4\u4E92\u4E3Aservice\u63D0\u4F9B\u63A5\u53E3
                                    |- entity/domain     // \u5B9E\u4F53\u5BF9\u8C61
                                        |- dto // \u6301\u4E45\u5C42\u9700\u8981\u7684\u5B9E\u4F53\u5BF9\u8C61(\u7528\u4E8E\u670D\u52A1\u5C42\u4E0E\u6301\u4E45\u5C42\u4E4B\u95F4\u7684\u6570\u636E\u4F20\u8F93\u5BF9\u8C61)
                                        |- vo // \u89C6\u56FE\u5C42\u9700\u8981\u7684\u5B9E\u4F53\u5BF9\u8C61(\u7528\u4E8E\u670D\u52A1\u5C42\u4E0E\u89C6\u56FE\u5C42\u4E4B\u95F4\u7684\u6570\u636E\u4F20\u8F93\u5BF9\u8C61)
                                    |- *Application.java  // \u5165\u53E3\u542F\u52A8\u7C7B
                |- resources         // \u8D44\u6E90
                    |- static        // \u9759\u6001\u8D44\u6E90(html\u3001css\u3001js\u3001\u56FE\u7247\u7B49)
                    |- templates     // \u89C6\u56FE\u6A21\u677F(jsp\u3001thymeleaf\u7B49)
                    |- mapper        // \u5B58\u653E\u6570\u636E\u8BBF\u95EE\u5C42\u5BF9\u5E94\u7684XML\u914D\u7F6E
                        |- *Mapper.xml
                        |- ...
                    |- application.yml        // \u516C\u5171\u914D\u7F6E
                    |- application-dev.yml    // \u5F00\u53D1\u73AF\u5883\u914D\u7F6E
                    |- application-prod.yml   // \u751F\u4EA7\u73AF\u5883\u914D\u7F6E
                    |- banner.txt    
                    |- logback.xml            // \u65E5\u5FD7\u914D\u7F6E
            |- test                  // \u6D4B\u8BD5\u6E90\u7801
               |- java               
                    |- com
                        |- hadoopx
                            |- servicex
                                |- system
                                    |- \u6839\u636E\u5177\u4F53\u60C5\u51B5\u6309\u6E90\u7801\u76EE\u5F55\u7ED3\u6784\u5B58\u653E\u7F16\u5199\u7684\u6D4B\u8BD5\u7528\u4F8B
        |- target     // \u7F16\u8BD1\u6253\u5305\u8F93\u51FA\u76EE\u5F55(\u81EA\u52A8\u751F\u6210\uFF0C\u4E0D\u9700\u8981\u521B\u5EFA)
        |- pom.xml    // \u8BE5\u6A21\u5757\u7684POM\u6587\u4EF6
    |- sql            // \u9879\u76EE\u9700\u8981\u7684SQL\u811A\u672C
    |- doc            // \u7CBE\u7B80\u7248\u7684\u5F00\u53D1\u3001\u8FD0\u7EF4\u624B\u518C
    |- .gitignore     // \u54EA\u4E9B\u6587\u4EF6\u4E0D\u7528\u4F20\u5230\u7248\u672C\u7BA1\u63A7\u5DE5\u5177\u4E2D
    |- pom.xml        // \u5DE5\u7A0B\u603BPOM\u6587\u4EF6
    |- README.md      // \u6CE8\u610F\u4E8B\u9879
External Libraries    // \u76F8\u5173JAR\u5305\u4F9D\u8D56

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="" tabindex="-1"><a class="header-anchor" href="#" aria-hidden="true">#</a></h3>`,3),v=[d];function a(r,c){return n(),e("div",null,v)}const b=i(l,[["render",a],["__file","\u9879\u76EE\u7ED3\u6784.html.vue"]]);export{b as default};
