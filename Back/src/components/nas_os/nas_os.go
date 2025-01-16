package nas_os

import (
	"errors"
	"github.com/gin-gonic/gin"
	"os/exec"
)

func FilesInfo(_ *gin.Context) {

}

func CreateDir(_ *gin.Context) {

}

func Download(url string, path string, fileName string) error {
	args := []string{"aria2c"}
	if path == "" {
		return errors.New("没有文件的存储地址")
	}
	if fileName != "" {
		args = append(args, "--out", fileName)
	}

	args = append(args, "-d", path)
	args = append(args, url)

	if err := exec.Command(args[0], args[1:]...).Run(); err != nil {
		return err
	}
	return nil
}
