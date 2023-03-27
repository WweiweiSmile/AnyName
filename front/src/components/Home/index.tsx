import { Button, Col, Row } from "antd";
import { Content } from "antd/es/layout/layout";
import React, { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/auth";
import { useOutlet } from "react-router-dom";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuthContext()!;
  const outlet = useOutlet();
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
      {outlet}
    </Content>
  );
};

export default Home;
