package directory

import (
	"database/sql"
	"github.com/gin-gonic/gin"
	log2 "github.com/labstack/gommon/log"
	"net/http"
	"time"
)

type Directory struct {
	Id         int       `json:"id"`
	Name       string    `json:"name"`
	ParentId   int       `json:"parentId"`
	UserId     int       `json:"userId"`
	CreateTime time.Time `json:"createTime"`
	UpdateTime time.Time `json:"updateTime"`
}

func Create(c *gin.Context, conn *sql.DB) {
	var dir Directory
	if err := c.Bind(&dir); err != nil {
		log2.Error(err)
		c.JSON(http.StatusBadGateway, gin.H{"code": 400, "message": "无法获取目录信息"})
		return
	}

	queryStr := `select count(*) from directory where name = ? and  parent_id = ? and user_id = ?`
	var count int
	err := conn.QueryRow(queryStr, dir.Name, dir.ParentId, dir.UserId).Scan(&count)
	if err != nil {
		log2.Error(err)
		c.JSON(http.StatusBadGateway, gin.H{"code": 500, "message": "查询目录是否存在失败"})
		return
	}

	if count > 0 {
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "目录已存在"})
		return
	}

	t := `insert into directory (name, parent_id, user_id) values (?, ?, ?)`

	if _, err := conn.Exec(t, dir.Name, dir.ParentId, dir.UserId); err != nil {
		log2.Error(err)
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "目录添加失败"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"code": 200, "message": "目录添加成功"})
}

func Update(c *gin.Context, conn *sql.DB) {
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
	t := `delete from directory where id=?`
	if _, err := conn.Query(t, id); err != nil {
		log2.Error(err)
		c.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": "目录删除失败"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"code": 200, "message": "目录删除成功"})
}

func List(c *gin.Context, conn *sql.DB) {
	userId := c.Query("userId")
	parentId := c.Query("parentId")

	t := `select * from directory where  user_id=? and parent_id=?`

	rows, err := conn.Query(t, userId, parentId)
	if err != nil {
		log2.Error(err)
		c.JSON(http.StatusBadGateway, gin.H{"code": 500, "message": "查询时发生了错误"})
		return
	}

	defer rows.Close()

	var dirs []Directory
	for rows.Next() {
		var dir Directory
		if err := rows.Scan(&dir.Id, &dir.Name, &dir.ParentId, &dir.UserId, &dir.CreateTime, &dir.UpdateTime); err != nil {
			log2.Error(err)
			c.JSON(http.StatusBadGateway, gin.H{"code": 500, "message": "转换数据时发生了错误"})
			return
		}
		dirs = append(dirs, dir)
	}

	c.JSON(http.StatusOK, gin.H{"code": 200, "message": "ok", "data": dirs})
}
