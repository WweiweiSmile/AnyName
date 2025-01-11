import React, {useEffect, useState} from 'react';
import {Breadcrumb, Button, Card, Col, Input, message, Popover, Row, Space, Typography, Upload} from 'antd';
import {EyeOutlined, FileTextFilled, FolderFilled} from '@ant-design/icons';
import {UploadFile} from 'antd/es/upload';
import {useCreateDir, useFileUplaod, useGetFileInfos} from '../../apis/file';
import {useNavigate} from 'react-router-dom';

const {Meta} = Card;
const {Text} = Typography;
const getSizeSuffix = (number: number) => {
  const suffix: string[] = ['B', 'MB', 'GB', 'TB', 'PB'];
  const size: number[] = [1, 1024, 1024, 1024, 1024];
  let sumSize = 1;
  let index = 0;
  let num = number;
  while (num > size[index + 1]) {
    num /= size[index + 1];
    sumSize *= size[index + 1];
    index += 1;
  }
  return (number / sumSize).toFixed(2) + suffix[index - 1];
};

const FileUpload: React.FC = () => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const navigate = useNavigate();
  const [dirName, setDirName] = useState('');
  const [dirPath, setDirPath] = useState<string[]>([]);
  const [createDirOpen, setCreateDirOpen] = useState(false);
  const {runAsync: fileUPloadRun} = useFileUplaod();
  const {
    data: fileInfos,
    run: fileInfosRun,
    refresh: fileInfosRefresh,
  } = useGetFileInfos();
  const {runAsync: creaetDirRun} = useCreateDir();
  const [startUpload, setStartUpload] = useState<object>();
  //FIXME： 视频封面请求地址的端口是写死的
  const locationStr =
    window.location.href.split(':')?.slice(0, 2)?.join(':') + ':8080';

  // 上传文件 函数
  const uploadFileRun = async () => {
    if (fileList.length === 0) return;
    const [file, ...newFileList] = fileList;
    const fileName = file?.name;

    try {
      message.loading({
        content: '正在上传中',
        duration: 0,
        key: fileName,
      });
      await fileUPloadRun({
        file: file as any,
        path: dirPath,
      });
      setFileList(fileList?.filter((file) => file?.name !== fileName));
      message.destroy(fileName);
      message.success(`${fileName} -- 上传成功！`);
      fileInfosRun(dirPath);
      setFileList(newFileList);
      setStartUpload({});
    } catch (err) {
      console.error(err);
    }
  };

  //  创建文件夹函数
  const createDirFn = async () => {
    const paths = [...dirPath, dirName];
    try {
      await creaetDirRun(paths);
      fileInfosRefresh();
      setCreateDirOpen(false);
      message.success('文件夹创建成功！');
    } catch (err) {}
  };

  useEffect(() => {
    uploadFileRun();
  }, [startUpload]);
  useEffect(() => {
    fileInfosRun(dirPath);
  }, [dirPath]);
  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item>文件管理</Breadcrumb.Item>
        {dirPath.map((path, index) => (
          <Breadcrumb.Item
            onClick={() => setDirPath(dirPath.slice(0, index + 1))}
          >
            {path}
          </Breadcrumb.Item>
        ))}
      </Breadcrumb>
      <Row
        justify={'center'}
        gutter={[20, 20]}
        style={{width: '90%', margin: 'auto'}}
      >
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
            <Button>添加文件</Button>{' '}
          </Upload>
        </Col>
        <Col>
          <Button
            disabled={!(fileList.length > 0)}
            onClick={() => uploadFileRun()}
          >
            上传文件
          </Button>
        </Col>
        <Col>
          <Popover
            open={createDirOpen}
            title={undefined}
            content={
              <Space>
                <Input
                  value={dirName}
                  onChange={(e) => setDirName(e.target.value)}
                ></Input>
                <Button onClick={createDirFn}>{'新增'}</Button>
              </Space>
            }
          >
            <Button onClick={() => setCreateDirOpen(!createDirOpen)}>
              {'新增文件夹'}
            </Button>
          </Popover>
        </Col>
      </Row>
      <Row style={{width: '100%'}} gutter={[10, 20]} justify={'space-around'}>
        {(fileInfos || []).sort((a) => {
          return a.isDir ? -1 : 1;
        })?.map((fileInfo) => {
          let fileName = fileInfo?.name;
          const {cover: coverName} = fileInfo;
          const coverUrl = `${locationStr}/videoPlay?path=${JSON.stringify([
            ...dirPath,
            '.cover',
          ])}&fileName=${coverName}`;

          const cover = fileInfo.isDir ? (
            <FolderFilled style={{fontSize: '10rem', color: '#ffd45e'}}/>
          ) : fileInfo.name.split('.').pop() === 'txt' ? (
            <FileTextFilled style={{fontSize: '10rem', color: '#d8dade'}}/>
          ) : (
            <img alt="example" src={coverUrl}/>
          );
          return (
            <Col xs={12} xl={6} xxl={4} key={fileInfo.name}>
              <Card
                cover={cover}
                actions={[
                  <EyeOutlined
                    key={'view'}
                    onClick={() => {
                      const suffix = fileInfo.name.split('.').pop() || '';
                      // 文件夹
                      if (fileInfo.isDir) {
                        setDirPath([...dirPath, fileInfo.name]);
                      }
                      // 视频文件
                      else if (['mp4'].includes(suffix.toLowerCase())) {
                        navigate(
                          `/videoPlay?path=${JSON.stringify(
                            dirPath,
                          )}&fileName=${fileName}`,
                        );
                      }
                      // 其他文件
                      else {
                        message.error('该文件还不支持预览，请期待后续开发');
                      }
                    }}
                  />,
                ]}
              >
                <Meta
                  title={
                    <Text ellipsis={{tooltip: fileInfo.name}}>
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
    </>
  );
};
export default FileUpload;
