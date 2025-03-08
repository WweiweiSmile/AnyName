package door_password

import (
	"Back/src/components/api"
	"Back/src/db"
	"github.com/gin-gonic/gin"
	"math/rand"
	"net/http"
	"strconv"
)

type DoorPassword struct {
	Password string `json:"password"`
}

func GetDoorPassword(c *gin.Context) {
	var doorPasswords []DoorPassword
	rows, err := db.Conn.Query("select * from door_password")
	if err != nil {
		c.JSON(http.StatusInsufficientStorage, gin.H{})
	}
	defer rows.Close()

	for rows.Next() {
		var doorPassword DoorPassword
		rows.Scan(&doorPassword.Password)
		doorPasswords = append(doorPasswords, doorPassword)
	}

	length := len(doorPasswords)
	doorPassword := doorPasswords[rand.Intn(length)]
	randomString := strconv.Itoa(rand.Intn(999999) + 1)
	randomInsertOrder := rand.Intn(6) + 1
	password := randomString[0:randomInsertOrder] + doorPassword.Password + randomString[randomInsertOrder:]

	c.JSON(http.StatusOK, api.CreateSuccessResponse(password))
}
