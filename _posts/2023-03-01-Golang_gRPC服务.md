---
title: 简单的gRPC服务
categories: [Golang]
comments: true
---
> 很早就打算入门golang的，但是当时属于非工作上的编程语言，一直没有真正意义上的掌握（即使现在也不太熟练哈哈，但比之前好很多），而现在c++上的需求基本没有，新的一些需求都在用go开发，给我分配到了一个模块，在压力的驱使下，一周不到恶补借鉴同事相关go代码把负责的模块服务搭建好，channel、协程也算能基本上手使用的程度。

内部服务器之间交互，还是得用RPC服务，简单高效；

如下教程讲使用go来简单的搭建一个gRPC服内部务，供其它服务调用；

## demo目录结构
代码还是模块化好点，目录结构如下：
> gRPC/
> * proto/service.proto
> * service/service.go
> * main_service.go //服务main入口
> * main_client.go  //客户端

## 服务端demo
先定义一个包含服务的pb文件```proto/service.proto```
```go
syntax = "proto3";

option go_package = ".;grpc_pb";//名称自定义，生成go的必须要包含这个字段

message Request {
    string Name = 1;
};

message Response {
    int32 Code = 1;
    string Msg = 2;
};

service Service {
    rpc Query(Request) returns (Response) {}
};

```
然后需要用protoc工具把proto目录下的pb文件生成go专用的，命令如下：
> protoc --go_out=. --go_opt=paths=source_relative --go-grpc_out=. --go-grpc_opt=paths=source_relative $1

生成如下文件（进入到proto目录执行生成的）：
* service_grpc.pb.go //新生成
* service.pb.go //新生成
* service.proto

上面例子$1是proto文件的路径，会把文件生成在 . 当前路径(go_out和go-grpc_out可改路径)，对应的opt配置建议都带上，反正pb有service类型就会编译为grpc相关的服务，不影响其它无服务类型pb生成

然后需要初始化一下go.mod，把gRPC目录当做项目根目录，需要在gRPC目录执行:
> go init mod gRPC

然后会让你执行一下，进行相关库的下载，这样很好的进行项目隔离：
> go mod tidy

会生成如下俩个新文件：
* go.mod
* go.sum

这样咱们调用proto里面的服务就比较方便了哈，该来编写```service/service.go```的代码了：

```go
//service.go
package gRPCService

import (
    "fmt"
    "os"
    "context"
    "net"
    "log"
    "google.golang.org/grpc"
    "gRPC/proto" //go.mod初始化根目录后直接引用
)

type (
    Request = grpc_pb.Request
    Response = grpc_pb.Response

    Service struct {
        ip_address       string
        logfile_path     string
        grpc_pb.UnimplementedServiceServer
    }
)

func (this *Service) Query(ctx context.Context, req *Request) (*Response, error) {
    var rsp Response
    rsp.Msg = "Hello " + req.Name
    return &rsp, nil
}

/*简单初始化一下监听端口，日志文件*/
func (this *Service) Init (args ...string) bool {
    argc := len(args)
    if argc > 0 {
        this.ip_address = args[0]
    }
    this.logfile_path = "log/service.log"
    if argc > 1 {
        this.logfile_path = args[1]
    }
    log.SetFlags(log.Llongfile | log.Lmicroseconds | log.Ldate)
    logFile, err := os.OpenFile(this.logfile_path, os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0644)
    if err != nil {
        fmt.Println("open log file failed, err: ", err)
        return false
    }
    log.SetOutput(logFile)
    log.Printf("get config, ip: %s\n", this.ip_address)

    return true
}

func (this *Service) Start() {
    log.Printf("listen on %s \n", this.ip_address)
    lis, err := net.Listen("tcp", this.ip_address)
    if err != nil {
        log.Fatalf("failed to listen: %v", err)
    }
    log.Println("gRPC server init success!")
    s := grpc.NewServer()
    grpc_pb.RegisterServiceServer(s, this)
    if err := s.Serve(lis); err != nil {
        log.Fatalf("failed to serve: %v", err)
    }
}
```
> 可以经常 go build service.go 因为没有main入口，build是不会生成二进制文件的，我经常用来检查代码有没得错误

接下来是```main_service.go```的代码，因为封装好了service，直接调用即可：
```go
//main_service.go
package main

import (
    "gRPC/service"
)

func main() {
    srv := &gRPCService.Service{}
    srv.Init(":40001", "log/main_service.log") //可能需要先创建log目录
    srv.Start()
}
```

到```gRPC/```路径build一下```main_service.go```，生成二进制文件
> go build main_service.go 

会生成一个```main_service```二进制文件，然后可以直接运行即可拉起服务
> ./main_service &

或者```go run```直接运行，当然代码是没有问题的情况（建议还是先用build构建二进制文件
> go run main_service.go

## 客户端demo
```go
package main

import (
    "context"
    "fmt"
    "time"
    "google.golang.org/grpc"
    "gRPC/proto"
)

func main() {
    // 连接grpc服务器
    conn, err := grpc.Dial("127.0.0.1:40001", grpc.WithInsecure())

    if err != nil {
        fmt.Printf("failed connect: %v", err)
    }
    // 延迟关闭连接
    defer conn.Close()

    c := grpc_pb.NewServiceClient(conn)

    // 初始化上下文，设置请求超时时间为1秒
    ctx, cancel := context.WithTimeout(context.Background(), time.Second)
    // 延迟关闭请求会话
    defer cancel()

    r, err := c.Query(ctx, &grpc_pb.Request{
        Name : "Syshaw",
    })
    if err != nil {
        fmt.Printf("failed! error: %v", err)
    } else {
        // 打印服务返回的消息
        fmt.Printf("return msg: %s\n", r.Msg)
    }
}
```
直接```go run```运行client，自测返回如下
> return msg: Hello Syshaw

简单的一个gRPC服务就这样搭建完毕，一般在生产环境中都会单独写一些模块，在服务中调用，当然也会利用channel、协程什么的啦；

<img src="/assets/src/img/black_asuka.jpg">