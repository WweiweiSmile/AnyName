import {Button, Col, message, Upload} from 'antd';
import React, {useState} from 'react';
import fileApi from '../../apis/file';
import {UploadFile} from 'antd/es/upload';
import {useAuthContext} from '../../hooks';

type FileUploadProps = {
  directoryId: number;
}

const FileUpload: React.FC<FileUploadProps> = (props) => {
  const {directoryId} = props;
  const {runAsync: runFileUpload} = fileApi.useFileUpload();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const {user} = useAuthContext();

  console.log('fileList', fileList);

  const onUpload = async () => {
    try {
      const [file, ...newFiles] = fileList;
      await runFileUpload({file: file as any, path: user?.localPath!, directoryId});
      message.success('文件上传成功');
      setFileList(newFiles);
    } catch (err) {
      console.error(err);
    }

  };

  return <>
    <Col>
      <Upload
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
        }}
      >
        <Button>添加文件</Button>
      </Upload>
    </Col>
    <Col>
      <Button onClick={onUpload}>上传文件</Button>
    </Col>
  </>;
};

export default FileUpload;