package user

import (
	"Back/src/db"
	"github.com/gin-gonic/gin"
	log2 "github.com/labstack/gommon/log"
	"log"
	"net/http"
	"time"
)

type User struct {
	Id         int       `json:"id"`
	Name       string    `json:"name"`
	Username   string    `json:"username"`
	Password   string    `json:"password"`
	Avatar     string    `json:"avatar"`
	LocalPath  string    `json:"localPath"`
	CreateTime time.Time `json:"createIme"`
	UpdateTime time.Time `json:"updateIme"`
}

func CrateUser(c *gin.Context) {
	var user User
	if err := c.Bind(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "未能正确解析用户信息"})
		return
	}

	t := `insert into user (name,username,password,avatar) values (?,?,?,?)`
	if _, err := db.Conn.Query(t, user.Name, user.Username, user.Password, user.Avatar); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "用户注册失败"})
		log.Fatal(err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "用户注册成功"})
}

func Login(c *gin.Context) {
	var user User
	if err := c.Bind(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "未能正确解析用户信息"})
		return
	}

	t := `select id,username,name,avatar,local_path from user where username=? and password=?`

	rows, err := db.Conn.Query(t, user.Username, user.Password)
	if err != nil {
		log2.Error(err)
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "用户或者密码错误"})
		return
	}
	defer rows.Close()

	if rows.Next() {
		var user User
		err := rows.Scan(&user.Id, &user.Name, &user.Username, &user.Avatar, &user.LocalPath)

		if err != nil {
			log2.Error(err)
			c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "用户登录获取用户信息失败"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"code": 200, "message": "ok", "data": user})
	} else {
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "用户或者密码错误"})
	}

}

func ModifyPassword(_ *gin.Context) {
}

func ModifyName(_ *gin.Context) {
}
