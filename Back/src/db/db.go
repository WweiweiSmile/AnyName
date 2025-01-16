package db

import (
	"Back/src/components/config"
	"database/sql"
	"fmt"
	_ "github.com/go-sql-driver/mysql"
	"log"
)

var Conn *sql.DB

func init() {
	ConnStr := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true", config.Config.DBUsername, config.Config.DBPassword, config.Config.DBHost, config.Config.DBPort, config.Config.DBName)
	Conn = Connect(ConnStr)
}

func Connect(addr string) *sql.DB {
	db, err := sql.Open("mysql", addr)
	if err != nil {
		log.Fatal(err)
		return nil
	}
	return db
}

//func Query(db.Conn *sql.DB, user user.User) (User.User, error) {
//	//db.Conn, err := db.Connect("user:password@tcp(127.0.0.1:3306)/nas_database")
//
//	teml := `insert into user values ({{.name}},{{.username}},{{.password}},{{.avatar}})`
//	insertUser := template.Must(template.New("insertUser").Parse(teml))
//
//	insertUser.Execute()
//
//	db.Conn.Query("insert into user values ()")
//
//}
