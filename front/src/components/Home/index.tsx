import { Button, Col, Row } from "antd";
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
  const [parentDirIds, setParentDirIds] = useState<number[]>([0]);
  const {run,data} = directoryApi.userList()

  useEffect(() => {
    if(user){
      run(parentDirIds[parentDirIds.length - 1],user.id)
    }
  },[run])

  console.log("data->",data);

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
      </Row>

      <Row gutter={[20, 20]}>
        {
          data?.data?.map(item => {
            return <FileItem key={item.id} directory={item} isDir={true} />
          })
        }
      </Row>

    </Content>
  );
};

export default Home;
