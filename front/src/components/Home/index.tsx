import {Avatar, Breadcrumb, Button, Col, Input, message, Modal, Row} from 'antd';
import {Content} from 'antd/es/layout/layout';
import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAuthContext} from '../../hooks';
import directoryApi, {Directory} from '../../apis/directory';
import FileItem from '../file_list/fileItem';
import FileUpload from '../file_list/fileUpload';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const {logout} = useAuthContext()!;
  const {user} = useAuthContext();
  const [parentDirs,setParentDirs] = useState<Directory[]>([{
    id:0,
    name:'Home'
  } as any]);
  const [dirName, setDirName] = useState<string>('');
  const [createDirVisible, setCreateDirVisible] = useState<boolean>(false);
  const [editDirVisible, setEditDirVisible] = useState<boolean>(false);
  const [dir, setDir] = useState<Directory | null>(null);
  const {run: runList, data: directoryList, refresh: refreshList} = directoryApi.useList();
  const {runAsync: runCreate} = directoryApi.useCreate();
  const {runAsync: runEdit} = directoryApi.useEdit();
  const {runAsync: runDelete} = directoryApi.useDelete();

  useEffect(() => {
    runList(parentDirs[parentDirs.length - 1].id, user?.id!);
  }, [runList]);

  const openCreateDirModal = () => {setCreateDirVisible(true);};
  const closeCreateDirModal = () => {setCreateDirVisible(false);};
  const openEditDirModal = () => {setEditDirVisible(true);};
  const closeEditDirModal = () => {setEditDirVisible(false);};
  const updateDirName = (v: string) => { setDir({...dir!, name: v}); };

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

  const onEdit = (item: Directory) => () => {
    setDir(item);
    openEditDirModal();
  };

  const onView = (item:Directory) => () => {
    setParentDirs([...parentDirs, item]);
    runList(item.id, user?.id!);
  };

  const jumpToDirectoryDeep = (index: number) => () => {
    const newParentDirs = parentDirs.slice(0, index + 1);
    setParentDirs(newParentDirs);
    runList(newParentDirs[newParentDirs.length - 1].id, user?.id!);
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
          <Button onClick={logout}>登出页面</Button>
        </Col>
        <Col>
          <Button onClick={openCreateDirModal}>新建目录</Button>
        </Col>
        <Col>
          <FileUpload directoryId={parentDirs[parentDirs.length - 1].id}></FileUpload>
        </Col>
      </Row>

      <Row>
        <Breadcrumb>
          {
            parentDirs.map((item: Directory, index:number) => (<Breadcrumb.Item key={item.id} onClick={jumpToDirectoryDeep(index)} >
              {item.name}
            </Breadcrumb.Item>))
          }
        </Breadcrumb>
      </Row>

      <Row gutter={[20, 20]}>
        {
          directoryList?.map(item => {
            return <FileItem key={item.id} directory={item} isDir={true} onView={onView(item)} onDelete={deleteDir(item.id)}
                             onEdit={onEdit(item)}/>;
          })
        }
      </Row>

      <Modal title="创建目录" open={createDirVisible} onCancel={closeCreateDirModal} onOk={createDir}>
        <Input placeholder="请输入目录名称" value={dirName} onChange={(v) => setDirName(v.target.value)}/>
      </Modal>

      <Modal title="编辑目录" open={editDirVisible} onCancel={closeEditDirModal} onOk={editDir}>
        <Input placeholder="请输入目录名称" value={dir?.name} onChange={(v) => updateDirName(v.target.value)}/>
      </Modal>
    </Content>
  );
};

export default Home;
