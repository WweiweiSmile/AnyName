import {Breadcrumb, Button, Col, Input, message, Modal, Row} from 'antd';
import {Content} from 'antd/es/layout/layout';
import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAuthContext} from '../../hooks';
import directoryApi, {Directory} from '../../apis/directory';
import FileItem from '../file_list/fileItem';
import FileUpload from '../file_list/fileUpload';
import fileApi, {FileType} from '../../apis/file';
import AddDownloadTaskModal from './add_download_task_modal/AddDownloadTaskModal';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const {logout} = useAuthContext()!;
  const {user} = useAuthContext();
  const [parentDirs, setParentDirs] = useState<Directory[]>([
    {
      id: 0,
      name: 'Home',
    } as any]);
  const [dirName, setDirName] = useState<string>('');
  const [createDirVisible, setCreateDirVisible] = useState<boolean>(false);
  const [editDirVisible, setEditDirVisible] = useState<boolean>(false);
  const [updateFileVisible, setUpdateFileVisible] = useState<boolean>(false);
  const [addDownloadTaskModalVisible, setAddDownloadTaskModalVisible] = useState(false);
  const [dir, setDir] = useState<Directory | null>(null);
  const [file, setFile] = useState<FileType | null>(null);
  const {run: runList, data: directoryList, refresh: refreshList} = directoryApi.useList();
  const {runAsync: runCreate} = directoryApi.useCreate();
  const {runAsync: runEdit} = directoryApi.useEdit();
  const {runAsync: runDelete} = directoryApi.useDelete();
  const {run: runListFile, data: fileList, refresh: refreshListFile} = fileApi.useList();
  const {runAsync: runUpdateFile} = fileApi.useUpdate();
  const {runAsync: runDeleteFile} = fileApi.useDelete();
  const {runAsync: runDownload} = fileApi.useDownload();

  useEffect(() => {
    runList(parentDirs[parentDirs.length - 1].id, user?.id!);
    runListFile(user?.id!, parentDirs[parentDirs.length - 1].id);
  }, [runList, runListFile]);

  const openCreateDirModal = () => {setCreateDirVisible(true);};
  const closeCreateDirModal = () => {setCreateDirVisible(false);};

  const openEditDirModal = () => {setEditDirVisible(true);};
  const closeEditDirModal = () => {setEditDirVisible(false);};
  const updateDirName = (v: string) => { setDir({...dir!, name: v}); };

  const openUpdateFileModal = () => {setUpdateFileVisible(true);};
  const closeUpdateFileModal = () => {setUpdateFileVisible(false);};
  const updateFileName = (v: string) => {setFile({...file as any, name: v});};

  const createDir = async () => {
    try {
      await runCreate(parentDirs[parentDirs.length - 1].id, user?.id!, dirName);
      message.success('目录创建成功');
      setDirName('');
      closeCreateDirModal();
      refreshList();
    } catch (e) {
      console.error(e);
    }
  };

  const editDir = async () => {
    try {
      await runEdit(dir?.id!, dir?.name!);
      message.success('目录修改成功');
      updateDirName('');
      closeEditDirModal();
      refreshList();
    } catch (e) {
      console.error(e);
    }
  };

  const deleteDir = (id: number) => async () => {
    try {
      await runDelete(id);
      message.success('目录已被删除');
      refreshList();
    } catch (e) {
      console.error(e);
    }
  };

  const deleteFile = (id: number) => async () => {
    try {
      await runDeleteFile(id);
      message.success('文件已被删除');
      refreshListFile();
    } catch (e) {
      console.error(e);
    }
  };

  const onEdit = (item: Directory) => () => {
    setDir(item);
    openEditDirModal();
  };

  const onUpdateFile = (file: FileType) => () => {
    setFile(file);
    openUpdateFileModal();
  };

  const onView = (directory: Directory) => () => {
    setParentDirs([...parentDirs, directory]);
    runList(directory.id, user?.id!);
    runListFile(user?.id!, directory.id);
  };

  const jumpToDirectoryDeep = (index: number) => () => {
    const newParentDirs = parentDirs.slice(0, index + 1);
    const currentDir = newParentDirs[newParentDirs.length - 1];
    setParentDirs(newParentDirs);
    runList(currentDir.id, user?.id!);
    runListFile(user?.id!, currentDir.id);
  };

  const updateFile = async () => {
    try {
      await runUpdateFile({
        id: file?.id!,
        name: file?.name!,
      });
      message.success('文件名更改成功');
      refreshListFile();
      closeUpdateFileModal();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Content style={{width: '90%', margin: 'auto'}}>

      <Row align={'middle'} justify={'center'} gutter={[20, 20]}>
        <Col>
          <Button onClick={() => {navigate('/fileList');}}>视频页面</Button>
        </Col>
        <Col>
          <Button onClick={() => {navigate('/login');}}>登陆页面</Button>
        </Col>
        <Col>
          <Button onClick={() => {navigate("/door_password")}}>查看密码</Button>
        </Col>
        <Col>
          <Button onClick={logout}>登出页面</Button>
        </Col>
        <Col>
          <Button onClick={openCreateDirModal}>新建目录</Button>
        </Col>
        <Col>
          <Button onClick={() => setAddDownloadTaskModalVisible(true)}>远程下载</Button>
        </Col>
        <FileUpload directoryId={parentDirs[parentDirs.length - 1].id} afterUpload={refreshListFile}></FileUpload>
      </Row>

      <Row>
        <Breadcrumb>
          {
            parentDirs.map(
              (item: Directory, index: number) => (<Breadcrumb.Item key={item.id} onClick={jumpToDirectoryDeep(index)}>
                {item.name}
              </Breadcrumb.Item>))
          }
        </Breadcrumb>
      </Row>

      <Row gutter={[20, 20]}>
        {
          directoryList?.map(item => {
            return <FileItem key={item.id} directory={item} isDir={true} onView={onView(item)}
                             onDelete={deleteDir(item.id)}
                             onEdit={onEdit(item)}/>;
          })
        }
        {
          fileList?.map(item => {
            return <FileItem key={item.id} file={item} isDir={false}
                             onView={() => navigate(`/videoPlay/${item.link}`)}
                             onDelete={deleteFile(item.id)}
                             onEdit={onUpdateFile(item)}/>;
          })
        }
      </Row>

      <Modal title="创建目录" open={createDirVisible} onCancel={closeCreateDirModal} onOk={createDir}>
        <Input placeholder="请输入目录名称" value={dirName} onChange={(v) => setDirName(v.target.value)}/>
      </Modal>

      <Modal title="编辑目录" open={editDirVisible} onCancel={closeEditDirModal} onOk={editDir}>
        <Input placeholder="请输入目录名称" value={dir?.name} onChange={(v) => updateDirName(v.target.value)}/>
      </Modal>

      <Modal title="编辑文件" open={updateFileVisible} onCancel={closeUpdateFileModal} onOk={updateFile}>
        <Input placeholder="请输入文件名" value={file?.name} onChange={(v) => updateFileName(v.target.value)}/>
      </Modal>

      <AddDownloadTaskModal open={addDownloadTaskModalVisible} onOk={async (value) => {
        try {
          await runDownload({
            url: value.url,
            userId: user?.id!,
            directoryId: parentDirs[parentDirs.length - 1].id,
            fileName: value.fileName,
          });
          message.success('下载完成');
          setAddDownloadTaskModalVisible(false);
        } catch (error) {
          console.error(error);
        }
      }}
                            onCancel={() => setAddDownloadTaskModalVisible(false)}/>
    </Content>
  );
};

export default Home;
