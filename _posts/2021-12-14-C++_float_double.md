---
title: c++编程中的浮点数精度问题
categories: [C++]
comments: true
---

在代码中直接使用浮点数变量进行 `==` 或者 `!=` 判断时，
编译是会出现**$\color{red}{WARNING}$**的哦

**比如**：

我们要判断 `(1/3+1/3+1/3) == 1`（从数学上说，肯定相等）是否相等，
但是由于精度误差的存在，
左边计算出来值约为 `0.333333 + 0.333333 + 0.333333 = 0.999999`

这是因为浮点数在计算机中的存储方式导致浮点数存在误差，
直接使用 `==` 或 `!=` 可能会造成跟预期不一样的结果，

所以通常都需要一个精度误差值（$\color{red}{epslon}$），用来抵消浮点运算中因为误差造成的相等无法判断的情况。

> epslon通常是一个非常小的数字（具体多小要看实际所需要的运算误差）

### 单双精度误差范围说明

float、double分别遵循R32-24，R64-53的标准。

它们保留的小数位数分别是23、52位，即误差在2^-23，2^-52;

所以float的精度误差在1e-6，double的精度误差在1e-15;
> 1e-6表示1乘以10的负6次方

### 相关代码判断

回到俩个浮点数比较的问题上，了解完精度误差后，现在可以通过以下方式比较俩个浮点数的值：

```
原理：

通过俩个浮点数的差值的绝对值（两数差值可能有负值，所以用绝对值），判断是否大于精度误差即可

如果差值大于精度误差，不等；

如果差值小于精度误差，认为在误差允许范围内相等；
```

* C语言中

```c
//float和double的EPSILON值在float.h
#include <float.h>
FLT_EPSILON
DBL_EPSILON
```

* C++中

```c++
//可以通过numeric_limits模板类的epsilon方法获取到
#include <limits>
std::numeric_limits<float>::epsilon()
std::numeric_limits<double>::epsilon()
```

* 自定义误差范围

```c++
#include <math.h>     //fabs() 求绝对值

#define FLOAT_EPS (1e-6)    //单精度浮点误差
#define DOUBLE_EPS (1e-15)  //双精度浮点误差

//例子说明
double d1 = 0.0000010002;
double d2 = 0.0000010003;

//判断双精度浮点数是否等于0
if (fabs(d1) > DOUBLE_EPS) {
    //不等于0
} else {  
    //等于0
}

//判断是否相等
if (fabs(d1 - d2) > DOUBLE_EPS) {
    //不相等
} else {  
    //相等
}
```