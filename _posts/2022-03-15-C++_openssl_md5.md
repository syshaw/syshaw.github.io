---
title: openssl库的MD5用法
categories: [C++]
comments: true
---
## 记录一下，方便回忆
```c++
#include "openssl/md5.h" //编译选项 -lcrypto
bool GetMD5(const unsigned char *data, size_t data_len, unsigned char *md)
{
    if (!data || !md) {
        return false;
    }
    MD5_CTX ctx;
    if (!MD5_Init(&ctx)) {
        return false;
    }
    MD5_Update(&ctx, data, data_len);
    MD5_Final(md, &ctx);
    return true;
}

string GetMD5HexString(const string& content)
{
    unsigned char digest[MD5_DIGEST_LENGTH];
    GetMD5(reinterpret_cast<const unsigned char*>((content.c_str())), content.size(), digest);
    char tmp[33] = {0};
    for (int i = 0; i < MD5_DIGEST_LENGTH; i++) {
        sprintf(&tmp[i * 2], "%02x", (unsigned int)digest[i]);
    }
    return tmp;
}
uint64_t GetMD5Uint64(const string& content)
{
    unsigned char digest[MD5_DIGEST_LENGTH];
    GetMD5(reinterpret_cast<const unsigned char*>((content.c_str())), content.size(), digest);
    char tmp[33] = {0};
    for (int i = 0; i < MD5_DIGEST_LENGTH; i++) {
        sprintf(&tmp[i * 2], "%02x", (unsigned int)digest[i]);
    }
    /*取中间16位*/
    tmp[24] = '\0';
    return stoul(tmp + 8, NULL, 16);
}

```