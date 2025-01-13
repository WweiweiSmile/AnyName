package nas_os

import (
	"Back/src/components/api"
	file2 "Back/src/components/file"
	"Back/src/components/utils"
	"database/sql"
	"github.com/gin-gonic/gin"
	log2 "github.com/labstack/gommon/log"
	"io"
	"net/http"
	"os"
	"strconv"
)

func FilesInfo(_ *gin.Context) {

}

func CreateDir(_ *gin.Context) {

}

func Upload(c *gin.Context, conn *sql.DB) {
	res := api.Response{
		Code:    200,
		Message: "文件上传成功",
		Data:    nil,
	}

	file, err := c.FormFile("file")
	if file == nil || err != nil {
		res.Code = 400
		res.Message = "上传了空文件"
		c.JSON(http.StatusBadRequest, res)
		return
	}
	directoryIdStr := c.PostForm("directoryId")
	directoryId, err := strconv.ParseInt(directoryIdStr, 10, 64)

	if err != nil {
		res.Code = 400
		res.Message = "文件所属目录错误,缺少directoryId字段"
		c.JSON(http.StatusBadRequest, res)
		return
	}

	path := c.PostForm("path")
	if path == "" {
		res.Code = 400
		res.Message = "用户暂未设置上传路径"
		c.JSON(http.StatusBadRequest, res)
		return
	}
	filePrePath := path + "\\"
	filePath := path + "\\" + file.Filename

	src, err := file.Open()
	if err != nil {
		res.Code = 400
		res.Message = "无法读取上传文件"
		c.JSON(http.StatusBadRequest, res)
		return
	}
	defer src.Close()

	dst, err := os.Create(filePath)

	if err != nil {
		res.Code = 500
		res.Message = "服务器创建文件失败"
		c.JSON(http.StatusInternalServerError, res)
		return
	}
	defer dst.Close()

	if _, err = io.Copy(dst, src); err != nil {
		res.Code = 500
		res.Message = "复制文件到指定目录失败"
		c.JSON(http.StatusInternalServerError, res)
		return
	}

	coverPath, err := utils.VideoFrameToPng(filePrePath, file.Filename)
	if err != nil {
		res.Code = 500
		res.Message = "创建封面失败"
		c.JSON(http.StatusInternalServerError, res)
		return
	}

	err = file2.InsertFile(file2.File{
		Name:        file.Filename,
		Type:        file2.GetFileSuffix(file.Filename),
		DirectoryId: directoryId,
		Path:        filePath,
		Size:        file.Size,
		Cover:       coverPath,
	}, conn)
	if err != nil {
		res.Code = 500
		res.Message = "文件信息插入数据库失败"
		log2.Error(err)
		c.JSON(http.StatusInternalServerError, res)
		return
	}

	c.JSON(http.StatusOK, res)
}

func Download(_ *gin.Context) {

}
