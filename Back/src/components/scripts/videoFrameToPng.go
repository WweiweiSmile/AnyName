package main

import (
	"Back/src/components/utils"
	"fmt"
	"io/ioutil"
	"os"
	"strings"
)

func main() {

	var dirPathArr = []string{"E:\\FFFF00/", "E:\\Heaven/"}

	for {
		if !(len(dirPathArr) > 0) {
			break
		}
		// 文件夹路径
		dirPath := dirPathArr[0]
		// 封面文件夹路径
		coverDirPath := dirPath + ".cover/"

		files, _ := ioutil.ReadDir(dirPath)
		coverFiles, err := ioutil.ReadDir(coverDirPath)

		// 如果没有封面文件夹，创建封面文件夹
		if err != nil {
			if os.MkdirAll(coverDirPath, os.ModePerm) != nil {
				fmt.Println("error: 封面文件夹创建失败。", "封面路径：", coverDirPath)
				return
			}
		}

		for _, file := range files {

			// 是文件夹，并且不是封面文件夹  添加路径
			if file.IsDir() && (file.Name() != ".cover") {
				dirPathArr = append(dirPathArr, dirPath+file.Name()+"/")
				continue
			}

			// 文件名 扩展
			fileSuffix := utils.GetFileSuffix(file.Name())
			// 封面文件名
			coverFileName := utils.ModifyFileSuffix(file.Name(), ".png")

			/*
				如果有封面，跳出
			*/
			coverIndex := -1
			for i, cover := range coverFiles {
				if cover.Name() == coverFileName {
					coverIndex = i
					break
				}
			}
			if coverIndex != -1 {
				continue
			}

			// 如果是 mp4文件格式
			if strings.Contains(".mp4.avi", strings.ToLower(fileSuffix)) {

				coverName, err := utils.VideoFrameToPng(dirPath, file.Name())
				// 如果有错误
				if err != nil {
					fmt.Println("error：创建封面文件失败，", "文件绝对路径：", dirPath+file.Name())
					break
				}
				fmt.Println("success：创建封面文件成功，", "封面文件绝对路径：", coverName)
			}
		}

		// 移去第一个 文件夹路径
		dirPathArr = dirPathArr[1:]
	}

}
