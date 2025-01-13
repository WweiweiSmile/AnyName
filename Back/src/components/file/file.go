package file

import (
	"database/sql"
	"errors"
	"github.com/gin-gonic/gin"
	log2 "github.com/labstack/gommon/log"
	"net/http"
	"strings"
)

type File struct {
	ID          int64  `json:"id"`
	Name        string `json:"name"`
	Type        string `json:"type"`
	DirectoryId int64  `json:"directoryId"`
	UserId      int64  `json:"userId"`
	Path        string `json:"path"`
	Size        int64  `json:"size"`
	Cover       string `json:"cover"`
	CreateTime  int64  `json:"createTime"`
	UpdateTime  int64  `json:"updateTime"`
}

func Insert(file File, conn *sql.DB) error {
	t := `insert into file (name,type,directory_id,user_id,path,size,cover) values (?,?,?,?,?,?,?)`

	result, err := conn.Exec(t, file.Name, file.Type, file.DirectoryId, file.UserId, file.Path, file.Size, file.Cover)

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
		_ = rows.Scan(&file.ID, &file.Name, &file.Type, &file.DirectoryId, &file.UserId, &file.Path, &file.Size, &file.Cover, &file.CreateTime, &file.UpdateTime)
		files = append(files, file)
	}

	c.JSON(http.StatusOK, gin.H{"code": 200, "message": "ok", "data": files})
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
