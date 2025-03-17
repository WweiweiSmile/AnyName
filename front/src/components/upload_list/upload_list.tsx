import React, {useState} from 'react';
import {Drawer, message, Upload, Button} from 'antd';
import {InboxOutlined} from '@ant-design/icons';
import {UploadFile} from 'antd/es/upload';
import fileApi from '../../apis/file';
import {useAuthContext} from '../../context/auth';

const {Dragger} = Upload;

type UploadListProps = {
  open: boolean;
  onClose: () => void;
  directoryId: number;  // 文件夹id
  afterUpload?: () => void; //  上传完成以后
}
const UploadList: React.FC<UploadListProps> = (props) => {
  const {open, onClose, directoryId, afterUpload} = props;
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const {runAsync: runFileUpload} = fileApi.useUpload();
  const {user} = useAuthContext();

  // TODO: 上传多个文件
  const onUpload = async () => {
    try {
      const [file, ...newFiles] = fileList;
      await runFileUpload({file: file as any, path: user?.localPath!, directoryId, userId: user?.id!});
      message.success('文件上传成功');
      setFileList(newFiles);
      afterUpload?.();
    } catch (err) {
      console.error(err);
    }
  };

  const uploadButton = <Button disabled={!(fileList.length > 0)} type="primary" onClick={onUpload}>上传</Button>;

  return <>
    <Drawer open={open} onClose={onClose} extra={uploadButton}>
      <div>
        <Dragger
        fileList={fileList}
        onRemove={(file) => {
          setFileList(
            fileList?.filter((item) => {
              return file.name !== item.name;
            }),
          );
        }}
        multiple
        beforeUpload={async (_, files) => {
          setFileList([...fileList, ...files]);
        }}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined/>
        </p>
        <p className="ant-upload-text">请点击上传</p>
      </Dragger>
      </div>
    </Drawer>
  </>;
};

export default UploadList;