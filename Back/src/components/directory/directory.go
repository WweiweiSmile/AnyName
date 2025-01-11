package directory

import (
	"database/sql"
	"github.com/gin-gonic/gin"
	log2 "github.com/labstack/gommon/log"
	"net/http"
	"time"
)

type Directory struct {
	Id         int    `json:"id"`
	Name       string `json:"name"`
	ParentId   int    `json:"parentId"`
	UserId     int    `json:"userId"`
	CreateTime time.Time
	UpdateTime time.Time
}

func Create(c *gin.Context, conn *sql.DB) {
	var dir Directory
	if err := c.Bind(&dir); err != nil {
		log2.Error(err)
		c.JSON(http.StatusBadGateway, gin.H{"code": 400, "message": "无法获取目录信息"})
		return
	}
	t := `insert into directory ( name, parent_id, user_id) values (?, ?, ?)`

	if _, err := conn.Query(t, dir.Name, dir.ParentId, dir.UserId); err != nil {
		log2.Error(err)
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "目录添加失败"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"code": 200, "message": "目录添加成功"})
}

func Modify(c *gin.Context, conn *sql.DB) {
	var dir Directory
	if err := c.Bind(&dir); err != nil {
		log2.Error(err)
		c.JSON(http.StatusBadGateway, gin.H{"code": 400, "message": "无法获取目录信息"})
		return
	}
	t := `update directory set name=? where id=?`

	if _, err := conn.Query(t, dir.Name, dir.Id); err != nil {
		log2.Error(err)
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "目录名更改失败"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"code": 200, "message": "目录名更改成功"})
}

func Delete(c *gin.Context, conn *sql.DB) {
	id := c.Param("id")
	t := `delete from nas_database.directory where id=?`
	if _, err := conn.Query(t, id); err != nil {
		log2.Error(err)
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "目录删除失败"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"code": 200, "message": "目录删除成功"})

}
