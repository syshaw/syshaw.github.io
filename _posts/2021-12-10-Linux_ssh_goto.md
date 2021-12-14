---
title: ssh免输入密码连接
categories: [Linux]
comments: true
---

## ssh快捷连接

新建一个shell脚本文件

```shell
touch goto
chmod +x goto
```

定义常用的ssh服务器地址，如下

```shell
#!/bin/sh
declare -A HOST
PORT=9215

HOST["test"]="10.10.10.105"
HOST["test02"]="10.10.10.102"
HOST["test03"]="10.10.10.105"
HOST["data01"]="172.31.61.41"
HOST["data02"]="172.31.61.42"
HOST["data03"]="172.31.61.43"
HOST["data04"]="172.31.61.44"
HOST["data05"]="172.31.61.45"
HOST["data06"]="172.31.61.46"

ssh -p${PORT} ${HOST[$1]}
```

然后把该脚本放到有配置环境变量的路径下（常用路径~/bin），然后如下进行ssh连接

```shell
goto data01
goto data05
```

（以上方式是通过免输入ssh密码后的才能进行的操作）

## ssh免输入密码连接

通过ssh连接，可以免输入密码，首先需要对机器添加信任：

假如有俩台设备：`机器A，机器B`
`A`要拷贝复制`B`的文件（`B`需要添加`A`的信任，就可以不需要输入`B`的密码）

**`B`添加`A`信任，方式如下**：

* 将A的 `~/.ssh/id_rsa.pub` 文件中的内容，复制到机器`B`的 `~/.ssh/authorized_keys` 文件中。
* `A`不存在` ~/.ssh/id_rsa.pub` 文件，执行如下命令：
  `cd ~/.ssh/; ssh-keygen -t rsa`（这里需要三次回车）
* 如果还是需要输入密码，在`B`上执行：`chmod -R 700 ~/.ssh/`
* 如果还是需要输入密码，将`B`的信息复制到`A`的 `~/.ssh/known_hosts` 文件中。