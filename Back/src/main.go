package main

import (
	"Back/src/components/auth"
	"Back/src/components/openai"
	"Back/src/components/videoplay"

	"github.com/labstack/echo"
)

func main() {
	e := echo.New()

	// 获取所有文件信息
	e.GET("/api/get/files/:isPrivate", videoplay.GetFilesInfo)
	// 请求视频
	e.GET("/video/:fileName/:isPrivate", videoplay.GetVideo)
	// 上传文件
	e.POST("/api/savefile", videoplay.SaveFile)
	// auth
	e.GET("/api/auth/:password", auth.ValidateAuth)
	// openai接口代理
	e.POST("/api/openai", openai.OpenaiHanddle)

	e.Logger.Fatal(e.Start(":8096"))
}
