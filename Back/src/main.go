package main

import (
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"os"

	"github.com/labstack/echo"
)

// 上传文件
func saveFile(c echo.Context) error {
	file, err := c.FormFile("file")
	isPrivate := c.FormValue("isPrivate")

	if err != nil {
		return err
	}

	src, err := file.Open()
	if err != nil {
		return err
	}
	defer src.Close()

	var filePrePath string = ""

	if isPrivate == "true" {
		filePrePath = "E:\\FFFF00/"
	} else {
		filePrePath = "E:\\Heaven/"
	}

	dst, err := os.Create(filePrePath + file.Filename)

	if err != nil {
		return err
	}
	defer dst.Close()

	if _, err = io.Copy(dst, src); err != nil {
		return err
	}

	return c.HTML(http.StatusOK, "ok 啦")

}

// 获取视频
func getVideo(c echo.Context) error {
	fileName := c.Param("fileName")
	isPrivate := c.Param("isPrivate")
	var filePrePath = ""
	fmt.Print("fileName->", fileName)
	if isPrivate == "true" {
		filePrePath = "E:\\FFFF00/"
	} else {
		filePrePath = "E:\\Heaven/"
	}
	return c.File(filePrePath + fileName)
}

// 验证身份
func auth(c echo.Context) error {
	password := c.Param("password")
	var value string = ""
	if password == "qwqwqw797979" {
		// 秦某人的私人
		value = "200"
	} else if password == "wutuobang" {
		//  乌托邦 公用
		value = "201"
	} else {
		value = "400"
	}
	return c.String(http.StatusOK, value)
}

type FileInfo struct {
	Name       string `json:"name" xml:"name"`             // base name of the file
	Size       int64  `json:"size" xml:"size"`             // length in bytes for regular files; system-dependent for others
	Mode       uint32 `json:"mode" xml:"mode"`             // file mode bits
	ModifyTime int64  `json:"modifyTime" xml:"modifyTime"` // modification time
	IsDir      bool   `json:"isDir" xml:"isDir"`           // abbreviation for Mode().IsDir()
}

func main() {
	e := echo.New()

	// 获取所有文件信息
	e.GET("/api/get/files/:isPrivate", func(c echo.Context) error {
		isPrivate := c.Param("isPrivate")
		filePrePath := ""
		if isPrivate == "true" {
			filePrePath = "E:\\FFFF00/"
		} else {
			filePrePath = "E:\\Heaven/"
		}
		files, _ := ioutil.ReadDir(filePrePath)
		var fileInfos []FileInfo
		for _, file := range files {
			var fileInfo FileInfo
			fileInfo.Name = file.Name()
			fileInfo.Size = file.Size()
			fileInfo.Mode = uint32(file.Mode())
			fileInfo.ModifyTime = file.ModTime().Unix()
			fileInfo.IsDir = file.IsDir()
			fileInfos = append(fileInfos, fileInfo)
		}
		return c.JSON(http.StatusOK, fileInfos)
	})

	// 请求视频
	e.GET("/video/:fileName/:isPrivate", getVideo)

	// 上传文件
	e.POST("/api/savefile", saveFile)

	// auth
	e.GET("/api/auth/:password", auth)

	e.Logger.Fatal(e.Start(":8096"))
}
