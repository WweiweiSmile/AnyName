package auth

import (
	"net/http"

	"github.com/labstack/echo"
)

type Auth struct {
	Private bool     `json:"private"`
	Path    []string `json:"path"`
}

type AuthResponse struct {
	Code int    `json:"code"`
	Msg  string `json:"msg"`
	Data Auth   `json:"data"`
}

// 验证身份
func ValidateAuth(c echo.Context) error {
	password := c.Param("password")
	var response AuthResponse
	if password == "qwqwqw797979" {
		var pathArr []string
		pathArr = append(pathArr, "FFFF00")
		response = AuthResponse{
			Code: 200,
			Msg:  "成功登陆",
			Data: Auth{
				Private: true,
				Path:    pathArr,
			},
		}
	} else if password == "wutuobang" {
		var pathArr []string
		pathArr = append(pathArr, "Heaven")
		response = AuthResponse{
			Code: 200,
			Msg:  "成功登陆",
			Data: Auth{
				Private: false,
				Path:    pathArr,
			},
		}
	} else {
		response = AuthResponse{
			Code: 201,
			Msg:  "连这都不知道？多捞哟！",
			Data: Auth{},
		}
	}
	return c.JSON(http.StatusOK, response)
}
