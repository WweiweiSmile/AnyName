package videoplay

import (
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"os"
	"time"

	"github.com/labstack/echo"
)

// 获取视频
func GetVideo(c echo.Context) error {
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

// 上传文件
func SaveFile(c echo.Context) error {
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

type FileInfo struct {
	Name       string `json:"name" xml:"name"`             // base name of the file
	Size       int64  `json:"size" xml:"size"`             // length in bytes for regular files; system-dependent for others
	Mode       uint32 `json:"mode" xml:"mode"`             // file mode bits
	ModifyTime int64  `json:"modifyTime" xml:"modifyTime"` // modification time
	IsDir      bool   `json:"isDir" xml:"isDir"`           // abbreviation for Mode().IsDir()
}

/**/
func GetFilesInfo(c echo.Context) error {
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
}
