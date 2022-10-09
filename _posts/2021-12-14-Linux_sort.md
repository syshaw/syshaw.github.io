---
title: sort的一些用法
categories: [Linux]
comments: true
---
### 常用参数
-r 逆序
-k [n] 第 n 列进行排序
-n 数字
-t 指定分隔符(默认空格分隔)
-g 以浮点数字类型比较字段
-f 将混用的字母都看作相同大小写，不区分大小写

 sort -t ',' -rnk4 author.csv