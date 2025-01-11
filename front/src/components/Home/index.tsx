import { Button, Col, Row } from "antd";
import { Content } from "antd/es/layout/layout";
import React, {useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import { useAuthContext } from '../../hooks';
import directoryApi from '../../apis/directory';
import FileItem from '../file_list/fileItem';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuthContext()!;
  // const outlet = useOutlet();
  const {run,data} = directoryApi.userList()

  useEffect(() => {
    run(0,1)
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
          data?.data?.data?.map(item => {
            return <FileItem key={item.id} directory={item} isDir={true} />
          })
        }
      </Row>

    </Content>
  );
};

export default Home;
