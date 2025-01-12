package main

import (
	"Back/src/components/auth"
	"Back/src/components/directory"
	"Back/src/components/nas_os"
	"Back/src/components/openai"
	"Back/src/components/user"
	"Back/src/components/videoplay"
	"Back/src/db"
	"encoding/json"
	"fmt"
	"github.com/gin-gonic/gin"
	_ "github.com/go-sql-driver/mysql"
	"log"
	"os"
)

func main() {
	s := gin.Default()
	file, err := os.Open("config.json")
	if err != nil {
		log.Fatal(err)
	}
	defer file.Close()

	decoder := json.NewDecoder(file)
	config := db.Config{}
	err = decoder.Decode(&config)
	if err != nil {
		log.Fatal(err)
	}

	connStr := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true", config.Username, config.Password, config.Host, config.Port, config.Name)
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
		directoryRoutes.POST("/modify", func(context *gin.Context) {
			directory.Modify(context, conn)
		})
		directoryRoutes.DELETE("/delete/:id", func(context *gin.Context) {
			directory.Delete(context, conn)
		})
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

	err = s.Run(":8080")
	if err != nil {
		log.Fatal(err)
	}
}
