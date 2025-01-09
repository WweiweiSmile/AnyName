package main

import (
	"Back/src/components/auth"
	"Back/src/components/openai"
	"Back/src/components/user"
	"Back/src/components/videoplay"

	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
	"os"
)

func main() {
	e := echo.New()

	userRoutes := e.Group("/api/user")

	userRoutes.POST("/create", user.CrateUser)
	userRoutes.PUT("/modifyName", user.ModifyName)
	userRoutes.PUT("/modifyPassword", user.ModifyPassword)

	// 创建视频封面
	e.POST("/api/videoCover", videoplay.CreateVideoCover)
	// 获取所有文件信息
	e.GET("/api/get/files/:path", videoplay.GetFilesInfo)
	// 创建文件夹
	e.GET("/api/createDir/:path", videoplay.CreateDir)
	// 请求视频
	e.GET("/videoPlay", videoplay.GetVideo)
	// 上传文件
	e.POST("/api/savefile", videoplay.SaveFile)
	// auth
	e.GET("/api/auth/:password", auth.ValidateAuth)
	// openai接口代理
	e.POST("/api/openai", openai.OpenaiHanddle)

	// 自定义日志输出
	e.Use(middleware.LoggerWithConfig(middleware.LoggerConfig{
		Format: `{"time":"${time_rfc3339}","remote_ip":"${remote_ip}","host":"${host}",` +
			`"method":"${method}","uri":"${uri}","status":${status},` +
			`"error":"${error}","latency":${latency},"bytes_in":${bytes_in},` +
			`"bytes_out":${bytes_out}}\n`,
		Output: os.Stdout,
	}))

	e.Logger.Fatal(e.Start(":8080"))
}
