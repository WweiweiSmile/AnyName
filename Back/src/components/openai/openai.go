package openai

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"

	"github.com/labstack/echo"

	"github.com/otiai10/openaigo"
)

type OpenAiContent struct {
	Text string `json:"text"`
}

// 代理 处理函数
func OpenaiHanddle(c echo.Context) error {
	body, _ := ioutil.ReadAll(c.Request().Body)
	var content OpenAiContent
	json.Unmarshal([]byte(string(body)), &content)

	client := openaigo.NewClient("")

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
	if err != nil {
		fmt.Println("请求chatgpt错误：", err.Error())
	}
	return c.String(http.StatusOK, response.Choices[0].Message.Content)
}
