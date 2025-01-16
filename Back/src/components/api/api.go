package api

import "net/http"

type Response struct {
	Code    int         `json:"code"`
	Message string      `json:"message"`
	Data    interface{} `json:"data"`
}

func CreateSuccessResponse(data interface{}) Response {
	response := Response{
		Code:    http.StatusOK,
		Message: "ok",
		Data:    data,
	}
	return response
}

func CreatClientFailResponse(message string) Response {
	response := Response{
		Code:    http.StatusBadRequest,
		Message: message,
		Data:    nil,
	}
	return response
}

func CreatServerFailResponse(message string) Response {
	response := Response{
		Code:    http.StatusInternalServerError,
		Message: message,
		Data:    nil,
	}
	return response
}
