package main

import (
	"fmt"
	"time"

	"Back/src/components/auth"
	"Back/src/components/openai"
	"Back/src/components/videoplay"

	"github.com/labstack/echo"
)

// 获取视频
func getVideo(c echo.Context) error {
	fileName := c.Param("fileName")
	isPrivate := c.Param("isPrivate")
	var filePrePath = ""
	currentTime := time.Now()
	fmt.Println("fileName:", fileName, "， 当前时间：", currentTime.Format("2006-01-02 15:04:05"))
	if isPrivate == "true" {
		filePrePath = "E:\\FFFF00/"
	} else {
		filePrePath = "E:\\Heaven/"
	}
	return c.File(filePrePath + fileName)
}

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
