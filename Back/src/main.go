package main

import (
	"Back/src/components/auth"
	"Back/src/components/config"
	"Back/src/components/directory"
	"Back/src/components/nas_os"
	"Back/src/components/openai"
	"Back/src/components/user"
	"Back/src/components/videoplay"
	"Back/src/db"
	"fmt"
	"github.com/gin-gonic/gin"
	_ "github.com/go-sql-driver/mysql"
	"log"
)

func main() {
	s := gin.Default()

	connStr := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true", config.Config.DBUsername, config.Config.DBPassword, config.Config.DBHost, config.Config.DBPort, config.Config.DBName)
	conn := db.Connect(connStr)

	userRoutes := s.Group("/api/user")
	{
		userRoutes.POST("/login", func(context *gin.Context) {
			user.Login(context, conn)
		})
		userRoutes.POST("/create", func(context *gin.Context) {
			user.CrateUser(context, conn)
		})
		userRoutes.PUT("/modifyName", user.ModifyName)
		userRoutes.PUT("/modifyPassword", user.ModifyPassword)
	}

	directoryRoutes := s.Group("/api/directory")
	{
		directoryRoutes.POST("/create", func(context *gin.Context) {
			directory.Create(context, conn)
		})
		directoryRoutes.GET("/list", func(context *gin.Context) {
			directory.List(context, conn)
		})
		directoryRoutes.POST("/update", func(context *gin.Context) {
			directory.Update(context, conn)
		})
		directoryRoutes.DELETE("/delete/:id", func(context *gin.Context) {
			directory.Delete(context, conn)
		})
	}

	osRoutes := s.Group("/api/os")
	{
		osRoutes.GET("/filesInfo", nas_os.FilesInfo)
		osRoutes.GET("/download", nas_os.Download)
		osRoutes.POST("/upload", func(context *gin.Context) {
			nas_os.Upload(context, conn)
		})
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
		log.Fatal(err)
	}
}
