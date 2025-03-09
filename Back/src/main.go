package main

import (
	"Back/src/components/auth"
	"Back/src/components/directory"
	"Back/src/components/door_password"
	"Back/src/components/file"
	"Back/src/components/nas_os"
	"Back/src/components/openai"
	"Back/src/components/user"
	"Back/src/components/videoplay"
	"Back/src/db"
	"github.com/gin-gonic/gin"
	_ "github.com/go-sql-driver/mysql"
	"log"
)

func main() {
	s := gin.Default()

	userRoutes := s.Group("/api/user")
	{
		userRoutes.POST("/login", user.Login)
		userRoutes.POST("/register", user.Register)
		userRoutes.PUT("/modifyName", user.ModifyName)
		userRoutes.PUT("/modifyPassword", user.ModifyPassword)
	}

	directoryRoutes := s.Group("/api/directory")
	{
		directoryRoutes.POST("/create", func(context *gin.Context) {
			directory.Create(context, db.Conn)
		})
		directoryRoutes.GET("/list", func(context *gin.Context) {
			directory.List(context, db.Conn)
		})
		directoryRoutes.POST("/update", func(context *gin.Context) {
			directory.Update(context, db.Conn)
		})
		directoryRoutes.DELETE("/delete/:id", func(context *gin.Context) {
			directory.Delete(context, db.Conn)
		})
	}

	fileRoutes := s.Group("/api/file")
	{
		fileRoutes.GET("/list", func(context *gin.Context) {
			file.List(context, db.Conn)
		})
		fileRoutes.PUT("/update", func(context *gin.Context) {
			file.Update(context, db.Conn)
		})
		fileRoutes.DELETE("/delete/:id", func(context *gin.Context) {
			file.Delete(context, db.Conn)
		})
		fileRoutes.GET("/play/:link", func(context *gin.Context) {
			file.Play(context, db.Conn)
		})
		fileRoutes.POST("/download", func(context *gin.Context) {
			file.Download(context, db.Conn)
		})
	}

	osRoutes := s.Group("/api/os")
	{
		osRoutes.GET("/filesInfo", nas_os.FilesInfo)
		osRoutes.POST("/upload", func(context *gin.Context) {
			file.Upload(context, db.Conn)
		})
		osRoutes.POST("/CreateDir", nas_os.CreateDir)
	}

	doorPasswordRoutes := s.Group("/api/door_password")
	{
		doorPasswordRoutes.GET("/get", door_password.GetDoorPassword)
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
