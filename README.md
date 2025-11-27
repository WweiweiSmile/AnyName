# 一个自己想要的NAS

## 环境配置

go 版本 1.23.4
node 版本 v18.16.0
pnpm 版本 8.4.0

## 配置数据库

请在 Back/config.json 中配置数据库连接信息，config.json文件默认是不存在的，请自己创建

```json
{
  "dbName": "数据库名称",
  "dbUsername": "用户名",
  "dbPassword": "用户密码",
  "dbHost": "数据库地址",
  "dbPort": "端口",

  "ffmpegPath": "本地FFmpeg可执行文件地址"
}
```