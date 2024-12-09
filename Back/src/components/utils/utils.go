package utils

import (
	"errors"
	"fmt"
	"os/exec"
	"strings"
)

var basicPath string = "D:\\"

/*
path  当前文件夹路径，fileName  视频文件名 。 返回封面文件的绝对路径
*/
func VideoFrameToPng(path string, fileName string) (string, error) {
	coverName := ModifyFileSuffix(fileName, ".png")
	// -ss 开始时间  -i 输入 -vframes 帧 -f 文件类型
	cmd := exec.Command("ffmpeg",
		"-ss", "00:00:01",
		"-i", fileName,
		"-vframes", "1",
		"-f", "image2",
		path+".cover/"+coverName,
	)
	// 执行命令的目录
	cmd.Dir = path
	// 如果有错误
	if err := cmd.Run(); err != nil {
		fmt.Println("输入文件路径：", path+fileName, " -  错误：", err.Error())
		return path + ".cover/" + fileName, errors.New("创建Coover失败")
	}
	return path + ".cover/" + fileName, nil
}

/*
获取文件后缀，返回文件名后缀 .png、.mp4 等，没有后缀将会返回""
*/
func GetFileSuffix(fileName string) string {
	// 如果有.的文件，才会有后缀名
	if strings.ContainsAny(fileName, ".") {
		paths := strings.Split(fileName, ".")
		return "." + paths[len(paths)-1]
	}
	return ""

}

/*
修改文件名后缀，返回修改后的文件名，如果原文件名没有后缀，直接返回原文件名
*/
func ModifyFileSuffix(fileName string, suffix string) string {
	newFileName := ""
	if !(strings.ContainsAny(fileName, ".")) {
		return newFileName
	}
	paths := strings.Split(fileName, ".")
	newFileName = strings.Join(paths[:len(paths)-1], ".") + suffix
	return newFileName
}
