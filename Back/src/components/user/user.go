package user

import (
	"database/sql"
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
)

type User struct {
	Name     string `json:"name"`
	Username string `json:"username"`
	Password string `json:"password"`
	Avatar   string `json:"avatar"`
}

func CrateUser(c *gin.Context, conn *sql.DB) {
	var user User
	if err := c.Bind(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "未能正确解析用户信息"})
		return
	}

	t := `insert into user (name,username,password,avatar) values (?,?,?,?)`
	if _, err := conn.Query(t, user.Name, user.Username, user.Password, user.Avatar); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "用户注册失败"})
		log.Fatal(err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "用户注册成功"})
}

func ModifyPassword(_ *gin.Context) {
}

func ModifyName(_ *gin.Context) {
}
