---
title: shell相关
categories: [Linux]
comments: true
---

shell平常没怎么用，正用的时候语法又忘记了，所以记录一下哈

## shell语法
单括号
```shell
a=$(date); //等同于 a=`date`
```
双括号
```shell
a=$(($1 + $2)); //等同于 a=`expr $1 + $2`
```
for的整数循环
```shell
for i in $(seq 0 31)
do
	file_seq=`printf "%02u" $i`;
done

for((i=0;i<32;++i))
do
done
```

while逐行读文件
```shell
while read line
do
	echo $line
done < file
```

## date日期处理
```shell
#shell字符串的处理
#参数$1 20220211
date=${1:0:4}-${1:4:2}-${1:6:2} 00:00:00  #2022-02-11 00:00:00

#月末一天
date -d"$(date -d'20220101 1 month' +'%Y%m01') -1 days" +"%Y%m%d"

#计算间隔天数
interval_day=$((($(date +%s -d '20120103') - $(date +%s -d '20120101'))/86400));



#!/bin/sh

cd /home/developer/apps/work_center/calculate/inc_data

day=`date '+%d'`
port=37021
web02="172.31.62.16"

#每个月2号拷贝数据
#if [ "$day" == "02" ];then
    name_array=`ssh -p${port} ${web02} "ls -1 /home/q/system/partner_task/runtime/task/bookChannelIncome/"`
    for old_name in ${name_array[@]}
    do
        new_name=`echo $old_name | sed 's/-//g'`
        scp -P${port} ${web02}:/home/q/system/partner_task/runtime/task/bookChannelIncome/$old_name $new_name
    done
#fi

```