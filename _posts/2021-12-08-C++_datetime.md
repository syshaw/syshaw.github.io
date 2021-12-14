---
title: 日期时间戳互转
categories: [C++]
comments: true
---

## 时间戳转日期(C语言风格)
```c
#include <time.h>

char date_buff[32] = {0};
time_t time_stamp = 1212132599;
strftime(date_buff, sizeof(date_buff), "%Y-%m-%d %H:%M:%S", gmtime(&time_stamp));

//gmtime()  与 localtime() 区别：
// gmtime 时区为 0
// localtime 时区为当地时区
```
## 日期转时间戳(C语言风格)
```c
#include <time.h>
struct tm tm_time = {0};
char date_buff[32] = "2018-07-27 02:13:22";
strptime(date_buff, "%Y-%m-%d %H:%M:%S", &tm_time);
uint32_t time_stamp = mktime(&tm_time);
```