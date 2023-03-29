package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
	"time"

	"github.com/labstack/echo"
	openaigo "github.com/otiai10/openaigo"
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
	currentTime := time.Now()
	fmt.Println("fileName:", fileName, "， 当前时间：", currentTime.Format("2006-01-02 15:04:05"))
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

type OpenAiContent struct {
	Text string `json:"text"`
}

// 代理 处理函数
func openaiHanddle(c echo.Context) error {
	body, _ := ioutil.ReadAll(c.Request().Body)
	var content OpenAiContent
	json.Unmarshal([]byte(string(body)), &content)
	fmt.Println("文本内容：", content)

	client := openaigo.NewClient("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")

	// 代理请求到本地clash上
	proxy := func(_ *http.Request) (*url.URL, error) {
		return url.Parse("http://127.0.0.1:7890")
	}
	transport := &http.Transport{Proxy: proxy}
	client.HTTPClient = &http.Client{Transport: transport}

	// 发送请求
	request := openaigo.ChatCompletionRequestBody{
		Model: "gpt-3.5-turbo",
		Messages: []openaigo.ChatMessage{
			{Role: "user", Content: content.Text},
		},
	}
	ctx := context.Background()
	response, err := client.Chat(ctx, request)

	fmt.Println(response, err)
	return c.String(http.StatusOK, response.Choices[0].Message.Content)
}

type FileInfo struct {
	Name       string `json:"name" xml:"name"`             // base name of the file
	Size       int64  `json:"size" xml:"size"`             // length in bytes for regular files; system-dependent for others
	Mode       uint32 `json:"mode" xml:"mode"`             // file mode bits
	ModifyTime int64  `json:"modifyTime" xml:"modifyTime"` // modification time
	IsDir      bool   `json:"isDir" xml:"isDir"`           // abbreviation for Mode().IsDir()
}

func ReverseProxy(target string) echo.MiddlewareFunc {
	url, _ := url.Parse(target)
	proxy := httputil.NewSingleHostReverseProxy(url)

	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			proxy.ServeHTTP(c.Response().Writer, c.Request())
			return nil
		}
	}
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

	// openai接口代理
	e.POST("/api/openai", openaiHanddle)

	e.Logger.Fatal(e.Start(":8096"))
}
