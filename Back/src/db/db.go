package db

import (
	"database/sql"
	_ "github.com/go-sql-driver/mysql"
	"log"
)

func Connect(addr string) *sql.DB {
	db, err := sql.Open("mysql", addr)
	if err != nil {
		log.Fatal(err)
		return nil
	}
	return db
}

//func Query(conn *sql.DB, user user.User) (User.User, error) {
//	//conn, err := connect("user:password@tcp(127.0.0.1:3306)/nas_database")
//
//	teml := `insert into user values ({{.name}},{{.username}},{{.password}},{{.avatar}})`
//	insertUser := template.Must(template.New("insertUser").Parse(teml))
//
//	insertUser.Execute()
//
//	conn.Query("insert into user values ()")
//
//}
