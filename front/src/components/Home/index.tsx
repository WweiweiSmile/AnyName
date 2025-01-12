import {Button, Col, Input, message, Modal, Row} from 'antd';
import { Content } from "antd/es/layout/layout";
import React, {useEffect, useState} from 'react';
import { useNavigate } from "react-router-dom";
import { useAuthContext } from '../../hooks';
import directoryApi from '../../apis/directory';
import FileItem from '../file_list/fileItem';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuthContext()!;
  const {user} = useAuthContext()
  const [parentDirIds] = useState<number[]>([0]);
  const [dirName, setDirName] = useState<string>('');
  const [createDirVisible, setCreateDirVisible] = useState<boolean>(false);
  const {run:runList,data: directoryList,refresh:refreshList} = directoryApi.useList()
  const {runAsync:runCreate} = directoryApi.useCreate()



  useEffect(() => {
    runList(parentDirIds[parentDirIds.length - 1],user?.id!)
  },[runList])

  const openCreateDirModal =  () => {setCreateDirVisible(true);};
  const closeCreateDirModal = () => {setCreateDirVisible(false);};
  const createDir = async () => {
    try {
      await runCreate(parentDirIds[parentDirIds.length - 1],user?.id!,dirName)
      message.success("目录创建成功")
      setDirName("");
      closeCreateDirModal()
      refreshList()
    }catch (e){
      console.error(e);
    }
  }

  return (
    <Content style={{ width: "90%", margin: "auto" }}>

      <Row align={"middle"} justify={"center"} gutter={[20, 20]}>
        <Col>
          <Button
            onClick={() => {
              navigate("/fileList");
            }}
          >
            视频页面
          </Button>
        </Col>
        <Col>
          <Button
            onClick={() => {
              navigate("/login");
            }}
          >
            登陆页面
          </Button>
        </Col>
        <Col>
          <Button
            onClick={() => {
              logout();
            }}
          >
            登出页面
          </Button>
        </Col>
        <Col>
          <Button
            onClick={openCreateDirModal}
          >
            新建目录
          </Button>
        </Col>
      </Row>

      <Row gutter={[20, 20]}>
        {
          directoryList?.map(item => {
            return <FileItem key={item.id} directory={item} isDir={true} />
          })
        }
      </Row>

      <Modal title="创建目录" open={createDirVisible} onCancel={closeCreateDirModal} onOk={createDir}>
        <Input placeholder="请输入目录名称"  value={dirName}  onChange={(v) => setDirName(v.target.value)} />
      </Modal>
    </Content>
  );
};

export default Home;
