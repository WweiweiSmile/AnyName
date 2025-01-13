import {EditOutlined, EyeOutlined, FileTextFilled, FolderFilled} from '@ant-design/icons';
import {Card, Col, message, Typography} from 'antd';
import React from 'react';
import  {Directory} from "../../apis/directory";
import {useNavigate} from 'react-router-dom';
import Meta from 'antd/es/card/Meta';

const { Text } = Typography;

interface FileItemProps {
  isDir: boolean;
  directory:Directory,
  onEdit?: () => void,
}

const FileItem: React.FC<FileItemProps> = (props) => {
  const {directory, isDir,onEdit} = props;
  const navigate = useNavigate()
  const name = directory?.name;

  const coverUrl = "https://avatars.githubusercontent.com/u/3416942"
  const path = "https://avatars.githubusercontent.com/u/3416942"
  const size = 100000000

    // const { cover: coverName } = fileInfo;
    // const coverUrl = `${locationStr}/videoPlay?path=${JSON.stringify([
    //   ...dirPath,
    //   ".cover",
    // ])}&fileName=${coverName}`;

    const cover = isDir ? (
      <FolderFilled style={{ fontSize: "10rem", color: "#ffd45e" }} />
    ) : name.split(".").pop() === "txt" ? (
      <FileTextFilled style={{ fontSize: "10rem", color: "#d8dade" }} />
    ) : (
      <img alt="example" src={coverUrl} />
    );
    return (
      <Col xs={12} xl={6} xxl={4} key={name}>
        <Card
          cover={cover}
          actions={[
            <EyeOutlined
              key={"view"}
              onClick={() => {
                const suffix = name.split(".").pop() || "";
                // 文件夹
                if (isDir) {
                  // setDirPath([...dirPath, fileInfo.name]);
                }
                // 视频文件
                else if (["mp4"].includes(suffix.toLowerCase())) {
                  navigate(path);
                }
                // 其他文件
                else {
                  message.error("该文件还不支持预览，请期待后续开发");
                }
              }}
            />,
            isDir ?  <EditOutlined onClick={onEdit}/> : undefined
          ]}
        >
          <Meta
            title={
              <Text ellipsis={{ tooltip: name }}>
                {name}
               </Text>
            }
            description={size}
          />
        </Card>
      </Col>
    );
}

export default FileItem;