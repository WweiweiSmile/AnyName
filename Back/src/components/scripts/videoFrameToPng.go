package main

import (
	"fmt"
	"io/ioutil"
	"os/exec"
	"strings"
)

var dirPath string = "E:\\FFFF00/"

func main() {
	var files, _ = ioutil.ReadDir(dirPath)
	for i := 0; i < len(files); i++ {
		var file = files[i]
		//  将文件名 以 . 分割为数组
		strArr := strings.Split(file.Name(), ".")
		// 文件名 前缀
		filePrefix := strings.Join(strArr[0:len(strArr)-1], ".")
		// 文件名 扩展
		fileSuffix := strArr[len(strArr)-1]
		// 图片文件名
		targetFileName := filePrefix + ".png"
		// 如果是 mp4文件格式
		if fileSuffix == "MP4" || fileSuffix == "mp4" {
			// -ss 开始时间  -i 输入 -vframes 帧 -f 文件类型
			cmd := exec.Command("ffmpeg",
				"-ss", "00:00:10",
				"-i", file.Name(),
				"-vframes", "1",
				"-f", "image2",
				targetFileName,
			)
			// 执行命令的目录
			cmd.Dir = dirPath
			// 如果有错误
			if err := cmd.Run(); err != nil {
				fmt.Println("错误文件："+file.Name(), err.Error())
				// return
			}
		}
	}
}
