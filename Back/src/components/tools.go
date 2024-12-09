package main

import (
	"fmt"
	"os"
	"strings"
)

func main() {
	var filepath string = "D:\\FFFF/"
	files, _ := os.ReadDir(filepath)
	for i := 0; i < len(files); i++ {
		file := files[i]
		err := os.Rename(filepath+file.Name(), filepath+strings.ToLower(file.Name()))
		if err != nil {
			fmt.Println(err)
			return
		}
	}
}
