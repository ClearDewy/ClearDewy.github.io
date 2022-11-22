# 后端修改

## 更新镜像：

```shell
docker cp D:\OJDATA\HOJ\hoj-springboot\DataBackup\target\hoj-backend-4.5.jar hoj-backend:/app.jar

docker commit -m "Dewyoj-backend" -a "ClearDewy" 容器ID dewyoj-backend

docker images

docker login --username=qingtuan registry.cn-hangzhou.aliyuncs.com
docker tag [ImageId] registry.cn-hangzhou.aliyuncs.com/cleardewy/hoj:Dewyoj-backend
docker push registry.cn-hangzhou.aliyuncs.com/cleardewy/hoj:Dewyoj-backend
```

## 修改内容：

### 修改爬取其他$OJ$比赛的函数

-   在`hoj-springboot\DataBackup\src\main\java\top\hcode\hoj\schedule\ScheduleServiceImpl.java`中修改`getOjContestsList（）`函数

```java
	@Scheduled(cron = "0 0 0/2 * * *")
//    @Scheduled(cron = "0 0/2 * * * *")
    @Override
    public void getOjContestsList() {
        // 待格式化的API，需要填充年月查询
        String nowcoderContestAPI = "https://ac.nowcoder.com/acm/calendar/contest?token=&month=%d-%d";
        // 将获取的比赛列表添加进这里
        List<Map<String, Object>> contestsList = new ArrayList<>();
        // 获取当前年月
        DateTime dateTime = DateUtil.date();
        // offsetMonth 增加的月份，只枚举最近3个月的比赛
        for (int offsetMonth = 0; offsetMonth <= 2; offsetMonth++) {
            // 月份增加i个月
            DateTime newDate = DateUtil.offsetMonth(dateTime, offsetMonth);
            // 格式化API 月份从0-11，所以要加一
            String contestAPI = String.format(nowcoderContestAPI, newDate.year(), newDate.month() + 1);
            try {
                // 连接api，获取json格式对象
                JSONObject resultObject = JsoupUtils.getJsonFromConnection(JsoupUtils.getConnectionFromUrl(contestAPI, null, null));
                // 比赛列表存放在data字段中
                JSONArray contestsArray = resultObject.getJSONArray("data");
                // 牛客比赛列表按时间顺序排序，所以从后向前取可以减少不必要的遍历
                for (int i = contestsArray.size() - 1; i >= 0; i--) {
                    JSONObject contest = contestsArray.getJSONObject(i);
                    // 如果比赛已经结束了，则直接结束
                    if (contest.getLong("endTime", 0L) < dateTime.getTime()) {
                        break;
                    }
                    // 把比赛列表信息添加在List里
                    contestsList.add(MapUtil.builder(new HashMap<String, Object>())
                            .put("oj", contest.getStr("ojName"))
                            .put("url", contest.getStr("link"))
                            .put("title", contest.getStr("contestName"))
                            .put("beginTime", new Date(contest.getLong("startTime")))
                            .put("endTime", new Date(contest.getLong("endTime"))).map());
                }
            } catch (Exception e) {
                log.error("爬虫爬取Nowcoder比赛异常----------------------->{}", e.getMessage());
            }
        }

        /**
         * 获取codeforces上的比赛
         */
        String CodeforcesUrl = "https://codeforces.com/api/contest.list?gym=false";
        try {
            JSONObject data = JsoupUtils.getJsonFromConnection(JsoupUtils.getConnectionFromUrl(CodeforcesUrl, null, null));
            JSONArray ContestArray=data.getJSONArray("result");
            System.out.println(ContestArray);
            // 找到时间最近的一场比赛
            for (int i=0;i<ContestArray.size();i++){
                if (ContestArray.getJSONObject(i).getLong("relativeTimeSeconds")>0){
                    for (int j=i-1;j>=0&&i-j<=5;j--){
                        JSONObject contest = ContestArray.getJSONObject(j);
                        if (contest.getLong("startTimeSeconds")*1000<dateTime.getTime())break;

                        contestsList.add(MapUtil.builder(new HashMap<String,Object>())
                                .put("oj","Codeforces")
                                .put("url","https://codeforces.com/contest/"+contest.getStr("id"))
                                .put("title",contest.getStr("name"))
                                .put("beginTime", new Date(contest.getLong("startTimeSeconds")*1000))
                                .put("endTime", new Date((contest.getLong("startTimeSeconds")+contest.getLong("durationSeconds"))*1000)).map()
                        );
                    }
                    break;
                }
            }

        } catch (Exception e) {
            log.error("爬虫爬取Codeforces比赛异常----------------------->{}", e.getMessage());
        }


        // 把比赛列表按照开始时间排序，方便查看
        contestsList.sort((o1, o2) -> {

            long beginTime1 = ((Date) o1.get("beginTime")).getTime();
            long beginTime2 = ((Date) o2.get("beginTime")).getTime();

            return Long.compare(beginTime1, beginTime2);
        });

        // 获取对应的redis key
        String redisKey = Constants.Schedule.RECENT_OTHER_CONTEST.getCode();
        // 缓存时间一天
        redisUtils.set(redisKey, contestsList, 60 * 60 * 24);
        // 增加log提示
        log.info("获取牛客API的比赛列表成功！共获取数据" + contestsList.size() + "条");
    }
```

