package file

import (
	"Back/src/components/api"
	"Back/src/components/nas_os"
	"Back/src/components/utils"
	"database/sql"
	"errors"
	"github.com/gin-gonic/gin"
	log2 "github.com/labstack/gommon/log"
	"io"
	"net/http"
	"os"
	path2 "path"
	"slices"
	"strconv"
	"strings"
	"time"
)

type File struct {
	ID          int64  `json:"id"`
	Name        string `json:"name"`
	Type        string `json:"type"`
	DirectoryId int64  `json:"directoryId"`
	UserId      int64  `json:"userId"`
	Link        string `json:"link"`
	Path        string `json:"path"`
	Size        int64  `json:"size"`
	Cover       string `json:"cover"`
	CreateTime  int64  `json:"createTime"`
	UpdateTime  int64  `json:"updateTime"`
}

func Insert(file File, conn *sql.DB) error {
	link := utils.Hash16(file.Path)

	t := `insert into file (name,type,directory_id,user_id,link,path,size,cover) values (?,?,?,?,?,?,?,?)`

	result, err := conn.Exec(t, file.Name, file.Type, file.DirectoryId, file.UserId, link, file.Path, file.Size, file.Cover)

	if err != nil {
		return err
	}
	count, _ := result.RowsAffected()
	if count == 0 {
		return errors.New("insert error")
	} else {
		return nil
	}
}

func List(c *gin.Context, conn *sql.DB) {
	userId := c.Query("userId")
	directoryId := c.Query("directoryId")
	var files []File

	t := `select * from file where directory_id = ? and user_id =?`
	rows, err := conn.Query(t, directoryId, userId)
	if err != nil {
		log2.Error(err)
		c.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": "数据库查询文件信息失败", "data": nil})
		return

	}
	defer rows.Close()

	for rows.Next() {
		var file File
		_ = rows.Scan(&file.ID, &file.Name, &file.Type, &file.DirectoryId, &file.UserId, &file.Link, &file.Path, &file.Size, &file.Cover, &file.CreateTime, &file.UpdateTime)
		files = append(files, file)
	}

	c.JSON(http.StatusOK, gin.H{"code": 200, "message": "ok", "data": files})
}

func Delete(c *gin.Context, conn *sql.DB) {
	id := c.Param("id")

	t := `delete from file where id = ? `
	result, err := conn.Exec(t, id)
	if err != nil {
		log2.Error(err)
		c.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": "删除文件失败", "data": nil})
		return

	}
	count, _ := result.RowsAffected()
	if count == 0 {
		c.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": "删除文件失败", "data": nil})
	} else {
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "ok", "data": nil})
	}
}

func Update(c *gin.Context, conn *sql.DB) {
	var file File
	if err := c.Bind(&file); err != nil {
		log2.Error(err)
		c.JSON(http.StatusBadGateway, gin.H{"code": 400, "message": "无法获取文件信息化", "data": nil})
		return
	}

	t := `update file set name=? where id=?`

	result, err := conn.Exec(t, file.Name, file.ID)
	if err != nil {
		log2.Error(err)
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "文件名更改失败", "data": nil})
		return
	}

	count, _ := result.RowsAffected()
	if count == 0 {
		log2.Error(err)
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "文件名更改失败", "data": nil})
		return
	} else {
		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "ok", "data": nil})
	}
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
	userIdStr := c.PostForm("userId")
	userId, err := strconv.ParseInt(userIdStr, 10, 64)

	if err != nil {
		res.Code = 400
		res.Message = "缺少directoryId或者userId字段"
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

	err = Insert(File{
		Name:        file.Filename,
		Type:        GetFileSuffix(file.Filename),
		DirectoryId: directoryId,
		UserId:      userId,
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

// TODO: 文件能够分段读取
func Play(c *gin.Context, conn *sql.DB) {
	link := c.Param("link")
	t := c.Query("type")
	var path string
	var row *sql.Row
	var contentType string

	videoStr := `select path from file where link=?`
	coverStr := `select cover from file where link=?`
	if t == "video" {
		row = conn.QueryRow(videoStr, link)
		contentType = "video/mp4"
	} else {
		row = conn.QueryRow(coverStr, link)
		contentType = "image/png"
	}

	_ = row.Scan(&path)

	file, err := os.ReadFile(path)
	if err != nil {
		log2.Error(err)
		c.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": "文件打开失败", "data": nil})
		return
	}
	c.Data(http.StatusOK, contentType, file)
}

// TODO: 文件下载后，添加文件信息到file表中
func Download(c *gin.Context, conn *sql.DB) {
	var data struct {
		Url         string `json:"url"`
		FileName    string `json:"fileName"`
		UserId      int64  `json:"userId"`
		DirectoryId int64  `json:"directoryId"`
	}
	fileName := data.FileName
	tempDir := time.Now().UnixMilli()

	if err := c.Bind(&data); err != nil {
		log2.Error(err)
		c.JSON(http.StatusBadRequest, api.CreatClientFailResponse("无法获取数据"))
		return
	}

	var localPath string
	t := `select local_path from user where  id = ?`
	row := conn.QueryRow(t, data.UserId)
	if err := row.Scan(&localPath); err != nil {
		log2.Error(err)
		c.JSON(http.StatusInternalServerError, api.CreatServerFailResponse("无法获取用户存储地址"))
		return
	}

	tempDirPath := path2.Join(localPath, strconv.Itoa(int(tempDir)))
	if err := os.Mkdir(tempDirPath, os.ModePerm); err != nil {
		log2.Error(err)
		c.JSON(http.StatusInternalServerError, api.CreatServerFailResponse("创建临时文件夹失败"))
		return
	}

	if err := nas_os.Download(data.Url, tempDirPath, fileName); err != nil {
		log2.Error(err)
		c.JSON(http.StatusInternalServerError, api.CreatServerFailResponse(err.Error()))
		return
	}

	files, _ := os.ReadDir(tempDirPath)
	file := files[0]
	fileInfo, _ := file.Info()
	if fileName == "" {
		fileName = file.Name()
	}

	fileType := GetFileSuffix(fileName)

	var coverPath string
	videoTypeList := []string{"mp4", "MP4"}
	if slices.Contains(videoTypeList, fileType) {
		var err error
		coverPath, err = utils.VideoFrameToPng(tempDirPath, file.Name())
		if err != nil {
			c.JSON(http.StatusInternalServerError, api.CreatServerFailResponse("创建封面失败"))
			return
		}
	}

	sourceFS := os.DirFS(tempDirPath)
	if err := os.CopyFS(localPath, sourceFS); err != nil {
		log2.Error(err)
		c.JSON(http.StatusInternalServerError, api.CreatServerFailResponse("复制临时文件在指定目录失败"))
		return
	}

	if err := os.RemoveAll(tempDirPath); err != nil {
		log2.Error("移出临时目录失败")
	}

	if err := Insert(File{
		Name:        file.Name(),
		Type:        GetFileSuffix(file.Name()),
		DirectoryId: data.DirectoryId,
		UserId:      data.UserId,
		Link:        utils.Hash16(path2.Join(localPath, file.Name())),
		Path:        path2.Join(localPath, file.Name()),
		Size:        fileInfo.Size(),
		Cover:       coverPath,
	}, conn); err != nil {
		log2.Error(err)
		c.JSON(http.StatusInternalServerError, api.CreatServerFailResponse("文件信息插入数据库失败"))
		return
	}

	c.JSON(http.StatusOK, api.CreateSuccessResponse(nil))
}

/*
获取文件后缀，返回文件名后缀 .png、.mp4 等，没有后缀将会返回""
传入: aaa.mp4，返回: mp4
*/
func GetFileSuffix(fileName string) string {
	// 如果有.的文件，才会有后缀名
	if strings.ContainsAny(fileName, ".") {
		paths := strings.Split(fileName, ".")
		return paths[len(paths)-1]
	}
	return ""
}
