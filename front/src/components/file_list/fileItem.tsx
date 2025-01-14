import {DeleteOutlined, EditOutlined, EyeOutlined, FileTextFilled, FolderFilled} from '@ant-design/icons';
import {Card, Col, message, Typography} from 'antd';
import React from 'react';
import {Directory} from '../../apis/directory';
// import {useNavigate} from 'react-router-dom';
import Meta from 'antd/es/card/Meta';
import {FileType} from '../../apis/file';

const {Text} = Typography;

interface FileItemProps {
  isDir: boolean;
  directory?: Directory,
  file?: FileType,
  onView?: () => void,
  onEdit?: () => void,
  onDelete?: () => void,
}

const FileItem: React.FC<FileItemProps> = (props) => {
  const {directory, isDir, file, onEdit, onDelete, onView} = props;
  // const navigate = useNavigate();
  const name = directory?.name || file?.name;

  const coverUrl = 'https://avatars.githubusercontent.com/u/3416942';
  const size = 100000000;

  // const { cover: coverName } = fileInfo;
  // const coverUrl = `${locationStr}/videoPlay?path=${JSON.stringify([
  //   ...dirPath,
  //   ".cover",
  // ])}&fileName=${coverName}`;

  const cover = isDir ? (
    <FolderFilled style={{fontSize: '10rem', color: '#ffd45e'}}/>
  ) : file?.type === 'txt' ? (
    <FileTextFilled style={{fontSize: '10rem', color: '#d8dade'}}/>
  ) : (
    <img alt="example" src={coverUrl}/>
  );

  const getOnClick = () => () => {
    if (isDir) {
      onView?.();
      return;
    } else if (['mp4'].includes((file?.type!).toLowerCase())) {
      onView?.();
      // navigate("");
    } else {
      message.error('该文件还不支持预览，请期待后续开发');
    }
  };

  return (
    <Col xs={12} xl={6} xxl={4} key={name}>
      <Card
        cover={cover}
        actions={[
          <EyeOutlined
            key={'view'}
            onClick={getOnClick()}
          />,
          <EditOutlined onClick={onEdit}/>,
          <DeleteOutlined onClick={onDelete}/>,
        ]}
      >
        <Meta
          title={
            <Text ellipsis={{tooltip: name}}>
              {name}
            </Text>
          }
          description={size}
        />
      </Card>
    </Col>
  );
};

export default FileItem;