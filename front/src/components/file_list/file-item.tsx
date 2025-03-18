import {DeleteOutlined, EditOutlined, EyeOutlined, FileTextFilled, FolderFilled} from '@ant-design/icons';
import {Card, Col, message, Typography} from 'antd';
import React from 'react';
import {Directory} from '../../apis/directory';
import Meta from 'antd/es/card/Meta';
import {FileType} from '../../apis/file';
import {DeleteConfirm} from '../../common/delte_confirm';

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
  const name = directory?.name || file?.name;

  const coverUrl = `${process.env.REACT_APP_SERVER}/api/file/play/${file?.link}?type=cover`;

  const cover = isDir ? (
    <FolderFilled style={{fontSize: '10rem', color: '#ffd45e'}}/>
  ) : file?.type === 'txt' ? (
    <FileTextFilled style={{fontSize: '10rem', color: '#d8dade'}}/>
  ) : (
    <img alt="example" className="w-40 h-40 overflow-hidden contain-content" src={coverUrl}/>
  );

  const getOnClick = () => () => {
    if (isDir) {
      onView?.();
      return;
    } else if (['mp4'].includes((file?.type!).toLowerCase())) {
      onView?.();
    } else {
      message.error('该文件还不支持预览，请期待后续开发');
    }
  };

  const description = `你确定删除 ${name} ${isDir ? "目录" : "文件"}吗？`;

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
          <DeleteConfirm onConfirm={onDelete} title={'删除'} description={description}>
            <DeleteOutlined/>,
          </DeleteConfirm>,

        ]}
      >
        <Meta
          title={
            <div className="text-center">
              <Text ellipsis={{tooltip: name}}>
                {name}
              </Text>
            </div>

          }
          // description={file?.size || 19000}
        />
      </Card>
    </Col>
  );
};

export default FileItem;