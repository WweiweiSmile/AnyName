package videoplay

import (
	"Back/src/components/utils"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/labstack/echo"
)

var basicPath string = "E:\\"

// 获取视频
func GetVideo(c echo.Context) error {
	queryParams := c.QueryParams()
	var filePaths []string
	fileName := queryParams.Get("fileName")
	err := json.Unmarshal([]byte(queryParams.Get("path")), &filePaths)

	if err != nil {
		fmt.Println("GetVideo ： 解析参数失败")
	}
	println("fileName->", fileName)
	var filePrePath = basicPath + strings.Join(filePaths, "/") + "/" + fileName
	currentTime := time.Now()
	fmt.Println("fileName:", fileName, "， 当前时间：", currentTime.Format("2006-01-02 15:04:05"))
	println("filePaht->", filePrePath)
	return c.File(filePrePath)
}

type Response struct {
	Code int    `json:"code"`
	Msg  string `json:"msg"`
	Data string `json:"data"`
}

// 上传文件
func SaveFile(c echo.Context) error {
	res := Response{
		Code: 200,
		Msg:  "文件上传成功",
		Data: "",
	}

	file, err := c.FormFile("file")
	path := c.FormValue("path")

	paths := strings.Split(path, "_")

	if err != nil {
		res.Code = 201
		res.Msg = "读取文件失败"
		return c.JSON(http.StatusOK, res)
	}

	src, err := file.Open()
	if err != nil {
		res.Code = 201
		res.Msg = "打开文件失败"
		return c.JSON(http.StatusOK, res)

	}
	defer src.Close()

	var filePrePath string = basicPath + strings.Join(paths, "/") + "/"

	dst, err := os.Create(filePrePath + file.Filename)

	if err != nil {
		res.Code = 201
		res.Msg = "创建文件失败"
		return c.JSON(http.StatusOK, res)
	}
	defer dst.Close()

	if _, err = io.Copy(dst, src); err != nil {
		res.Code = 201
		res.Msg = "复制文件失败"
		return c.JSON(http.StatusOK, res)
	}
	_, err = utils.VideoFrameToPng(filePrePath, file.Filename)

	if err != nil {
		res.Code = 201
		res.Msg = "创建封面失败"
		return c.JSON(http.StatusOK, res)
	}
	return c.JSON(http.StatusOK, res)

}

type FileInfo struct {
	Name       string `json:"name" xml:"name"`             // base name of the file
	Size       int64  `json:"size" xml:"size"`             // length in bytes for regular files; system-dependent for others
	Mode       uint32 `json:"mode" xml:"mode"`             // file mode bits
	ModifyTime int64  `json:"modifyTime" xml:"modifyTime"` // modification time
	IsDir      bool   `json:"isDir" xml:"isDir"`           // abbreviation for Mode().IsDir()
	Cover      string `json:"cover"`
}

/*
获取文件信息
*/
func GetFilesInfo(c echo.Context) error {
	path := c.Param("path")
	paths := strings.Split(path, "_")
	// 文件夹路径
	filePrePath := basicPath + strings.Join(paths, "/") + "/"
	// 封面文件夹路径
	coverPrePath := filePrePath + ".cover/"
	files, _ := ioutil.ReadDir(filePrePath)
	covers, _ := ioutil.ReadDir(coverPrePath)

	// 封面文件名数组
	var coverNames []string
	for _, cover := range covers {
		coverNames = append(coverNames, cover.Name())
	}

	var fileInfos []FileInfo
	for _, file := range files {
		var fileInfo FileInfo
		if file.Name() == ".cover" && file.IsDir() {
			continue
		}

		// 文件名片段数组  ["xxx","xxx","mp4"]
		fileSplitNames := strings.Split(file.Name(), ".")
		// 封面文件名
		coverName := strings.Join(fileSplitNames[:len(fileSplitNames)-1], ".") + ".png"

		coverPath := ""
		for _, cover := range coverNames {
			if strings.Contains(cover, coverName) {
				coverPath = coverName
				break
			}
		}

		fileInfo.Name = file.Name()
		fileInfo.Size = file.Size()
		fileInfo.Mode = uint32(file.Mode())
		fileInfo.ModifyTime = file.ModTime().Unix()
		fileInfo.IsDir = file.IsDir()
		fileInfo.Cover = coverPath
		fileInfos = append(fileInfos, fileInfo)
	}
	return c.JSON(http.StatusOK, fileInfos)
}

/*
创建文件夹
*/
type DirResponse struct {
	Code int    `json:"code"`
	Msg  string `json:"msg"`
	Data string `json:"data"`
}

func CreateDir(c echo.Context) error {
	path := c.Param("path")
	paths := strings.Split(path, "_")
	filePrePath := basicPath + strings.Join(paths, "/") + "/"
	fileCoverPath := filePrePath + ".cover/"
	respose := DirResponse{
		Code: 200,
		Msg:  "创建成功",
		Data: "",
	}

	err := os.MkdirAll(filePrePath, os.ModePerm)
	errCover := os.MkdirAll(fileCoverPath, os.ModePerm)

	if err != nil || errCover != nil {
		respose.Code = 201
		respose.Msg = "创建失败"
		return c.JSON(http.StatusOK, respose)
	}

	return c.JSON(http.StatusOK, respose)
}
