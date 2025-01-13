package config

import (
	"encoding/json"
	"github.com/labstack/gommon/log"
	"os"
)

type Type struct {
	DBName     string `json:"dbName"`
	DBUsername string `json:"dbUsername"`
	DBPassword string `json:"dbPassword"`
	DBHost     string `json:"dbHost"`
	DBPort     string `json:"dbPort"`

	FfmpegPath string `json:"ffmpegPath"`
}

var Config Type

func init() {
	file, err := os.Open("config.json")
	if err != nil {
		log.Fatal(err)
	}
	defer file.Close()

	decoder := json.NewDecoder(file)
	err = decoder.Decode(&Config)
}
