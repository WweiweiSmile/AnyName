import { Button, Col, Row } from "antd";
import { Content } from "antd/es/layout/layout";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/auth";
const Home: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuthContext()!;
  return (
    <Content style={{ width: "90%", margin: "auto" }}>
      <Row align={"middle"} justify={"center"} gutter={[20, 20]}>
        <Col>
          <Button
            onClick={() => {
              navigate("/videoPlay");
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
    </Content>
  );
};

export default Home;
