package main

import (
	"Back/src/components/auth"
	"Back/src/components/nas_os"
	"Back/src/components/openai"
	"Back/src/components/user"
	"Back/src/components/videoplay"
	"github.com/gin-gonic/gin"
)

func main() {
	s := gin.Default()

	userRoutes := s.Group("/api/user")
	{
		userRoutes.POST("/create", user.CrateUser)
		userRoutes.PUT("/modifyName", user.ModifyName)
		userRoutes.PUT("/modifyPassword", user.ModifyPassword)
	}

	osRoutes := s.Group("/api/os")

	{
		osRoutes.GET("/filesInfo", nas_os.FilesInfo)
		osRoutes.GET("/download", nas_os.Download)
		osRoutes.POST("/upload", nas_os.Upload)
		osRoutes.POST("/CreateDir", nas_os.CreateDir)
	}

	s.POST("/api/videoCover", videoplay.CreateVideoCover)
	// 获取所有文件信息
	s.GET("/api/get/files/:path", videoplay.GetFilesInfo)
	// 创建文件夹
	s.GET("/api/createDir/:path", videoplay.CreateDir)
	// 请求视频
	s.GET("/videoPlay", videoplay.GetVideo)
	// 上传文件
	s.POST("/api/savefile", videoplay.SaveFile)
	// auth
	s.GET("/api/auth/:password", auth.ValidateAuth)
	// openai接口代理
	s.POST("/api/openai", openai.OpenaiHanddle)

	err := s.Run(":8080")
	if err != nil {
		return
	}
}
