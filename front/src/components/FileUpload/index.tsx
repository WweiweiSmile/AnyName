import React, { useEffect, useState } from "react";
import { message, Upload } from "antd";
import { Col, Row, Button, Card, Typography } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { UploadFile } from "antd/es/upload";
import { useFileUplaod, get, useGetFileInfos } from "../../apis/file";
import VideoPlay from "../videoPlay";
import { useLocalStorageState } from "ahooks";
import { _Auth } from "../Login";
const { Meta } = Card;
const { Text } = Typography;
const getSizeSuffix = (number: number) => {
  const suffix: string[] = ["B", "MB", "GB", "TB", "PB"];
  const size: number[] = [1, 1024, 1024, 1024, 1024];
  let sumSize = 1;
  let index = 0;
  let num = number;
  while (num > size[index + 1]) {
    num /= size[index + 1];
    sumSize *= size[index + 1];
    index += 1;
  }
  const str = (number / sumSize).toFixed(2) + suffix[index - 1];
  return str;
};

const FileUpload: React.FC = (props) => {
  const [local, setLocal] = useLocalStorageState<_Auth>("_auth");
  const isPrivate = local.auth === "private";
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploadFileList, setUploadFileList] = useState<UploadFile[]>([]);
  const { runAsync: fileUPloadRun } = useFileUplaod();
  const { data: fileInfos, runAsync: fileInfosRun } = useGetFileInfos();
  const [videoPlayModal, setVideoPlayModal] = useState(false);
  const [videoSrc, setVideoSrc] = useState("");
  const [startUpload, setStartUpload] = useState<object>();
  const locationStr =
    window.location.href.split(":")?.slice(0, 2)?.join(":") + ":8096";
  const pngIsExist: Record<string, boolean> = {};

  const uploadFileRun = async () => {
    console.log("fileList->", fileList);

    if (fileList.length === 0) return;
    const [file, ...newFileList] = fileList;
    const fileName = file?.name;

    try {
      message.loading({
        content: "正在上传中",
        duration: 0,
        key: fileName,
      });
      await fileUPloadRun({
        file: file as any,
        isPrivate: isPrivate ? "true" : "false",
      });
      setFileList(fileList?.filter((file) => file?.name !== fileName));
      message.destroy(fileName);
      message.success(`${fileName} -- 上传成功！`);
      fileInfosRun(isPrivate);
      setFileList(newFileList);
      setStartUpload({});
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    uploadFileRun();
  }, [startUpload]);
  useEffect(() => {
    fileInfosRun(isPrivate);
  }, [isPrivate]);
  return (
    <>
      <Row justify={"center"}>
        <Col>
          <Button
            disabled={!(fileList.length > 0)}
            onClick={() => uploadFileRun()}
          >
            上传文件
          </Button>
        </Col>
        <Col span={24}>
          <Upload
            fileList={fileList}
            onRemove={(file) => {
              console.log("file->", file);
              setFileList(
                fileList?.filter((item) => {
                  return file.name != item.name;
                })
              );
            }}
            multiple
            beforeUpload={async (file, files) => {
              const fileName = file?.name;
              console.log("file->", file, "fileList->", fileList);
              setFileList([...fileList, ...files]);
            }}
          >
            <Button>添加文件</Button>{" "}
          </Upload>
        </Col>
      </Row>
      <Row style={{ width: "100%" }} gutter={[10, 20]} justify={"space-around"}>
        {(fileInfos || [])
          ?.filter((item) => {
            if (item?.name.lastIndexOf(".png") !== -1) {
              pngIsExist[item.name] = true;
            }
            return item?.name.lastIndexOf(".png") === -1;
          })
          ?.map((fileInfo) => {
            let fileName = fileInfo?.name;
            if (fileName?.lastIndexOf(".png")) {
              fileName = fileName?.replaceAll(".mp4", ".png");
            }
            const imgFileSplit: string[] = fileInfo?.name?.split(".");
            const imgFileName: string =
              imgFileSplit?.slice(0, imgFileSplit?.length - 1).join(".") +
              ".png";
            const imgUrl = pngIsExist[fileName]
              ? `${locationStr}/video/${fileName}`
              : "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png";
            return (
              <Col xs={12} xl={6} xxl={4}>
                <Card
                  // style={}
                  cover={<img alt="example" src={imgUrl} />}
                  actions={[
                    <EyeOutlined
                      key={"view"}
                      onClick={() => {
                        setVideoPlayModal(true);
                        setVideoSrc(
                          `${locationStr}/video/${fileInfo?.name}/${
                            isPrivate ? "true" : "false"
                          }`
                        );
                      }}
                    />,
                  ]}
                >
                  <Meta
                    title={
                      <Text ellipsis={{ tooltip: fileInfo.name }}>
                        {fileInfo.name}
                      </Text>
                    }
                    description={getSizeSuffix(fileInfo?.size)}
                  />
                </Card>
              </Col>
            );
          })}
      </Row>
      <VideoPlay
        open={videoPlayModal}
        onClose={() => setVideoPlayModal(false)}
        src={videoSrc}
      ></VideoPlay>
    </>
  );
};
export default FileUpload;
