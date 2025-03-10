package user

import (
	"Back/src/components/api"
	"Back/src/db"
	"github.com/gin-gonic/gin"
	log2 "github.com/labstack/gommon/log"
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

func Register(c *gin.Context) {
	var user User
	if err := c.Bind(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "未能正确解析用户信息"})
		return
	}

	// 是否已存在
	var count int
	t := `SELECT COUNT(*) from user where username = ?`
	err := db.Conn.QueryRow(t, user.Username).Scan(&count)
	if err != nil {
		c.JSON(http.StatusInternalServerError, api.CreatServerFailResponse("用户注册失败"))
		log2.Error(err)
		return
	}
	if count > 0 {
		c.JSON(http.StatusBadRequest, api.CreatClientFailResponse("该用户名已存在"))
		return
	}

	// 添加用户信息
	t = `INSERT INTO user (name,username,password,avatar) values (?,?,?,?)`

	if _, err := db.Conn.Exec(t, user.Name, user.Username, user.Password, user.Avatar); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "用户注册失败"})
		log2.Error(err)
		return
	}
	c.JSON(http.StatusOK, api.CreateSuccessResponse(""))
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
