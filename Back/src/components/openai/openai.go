package openai

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"net/url"

	"github.com/labstack/echo"
	"github.com/sashabaranov/go-openai"
)

type OpenAiContent struct {
	Text string `json:"text"`
}

// 代理 处理函数
func OpenaiHanddle(c echo.Context) error {
	body, _ := ioutil.ReadAll(c.Request().Body)
	var content OpenAiContent
	json.Unmarshal([]byte(string(body)), &content)

	// 添加代理
	config := openai.DefaultConfig("")
	proxyUrl, err := url.Parse("http://127.0.0.1:7890")
	if err != nil {
		panic(err)
	}
	transport := &http.Transport{
		Proxy: http.ProxyURL(proxyUrl),
	}
	config.HTTPClient = &http.Client{
		Transport: transport,
	}

	// 创建请求客户端
	client := openai.NewClientWithConfig(config)
	resp, err := client.CreateChatCompletionStream(
		context.Background(),
		openai.ChatCompletionRequest{
			Model: openai.GPT3Dot5Turbo,
			Messages: []openai.ChatCompletionMessage{
				{
					Role:    openai.ChatMessageRoleUser,
					Content: content.Text,
				},
			},
			Stream: true,
		},
	)

	defer resp.Close()
	for {
		res, error := resp.Recv()
		if errors.Is(error, io.EOF) {
			return c.String(http.StatusOK, "完成")
		}
		if err != nil {
			fmt.Println("请求chatgpt错误：", err.Error())
		}
		err := json.NewEncoder(c.Response()).Encode(res.Choices[0].Delta.Content)
		if err != nil {
			fmt.Println("流输出失败：", err.Error())
			return c.String(http.StatusOK, "失败")
		}

	}
	// return c.String(http.StatusOK, resp.Choices[0].Message.Content)
}
