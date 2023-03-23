import { Button, Input, Row, Col, message } from "antd";
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { useGetAuth } from "../../apis/file";
import { useLocalStorageState } from "ahooks";
import { AuthResponeStatus } from "../../apis/file";
export type _Auth = {
  auth: "private" | "public";
};

const Login: React.FC = () => {
  const [password, setPassword] = useState("");
  const { data, runAsync: getAuthRun } = useGetAuth();
  const [local, setLocal] = useLocalStorageState<_Auth>("_auth", {});
  const navigate = useNavigate();

  // 登陆函数
  const loginFn = async (pwd: string) => {
    const res: AuthResponeStatus = await getAuthRun(pwd);
    const auth = res === 200 ? "private" : res === 201 ? "public" : "";
    if (auth) {
      setLocal({ auth });
      message.success("确认过眼神，你是对的人~~~~~~~");
      setTimeout(() => {
        navigate("/");
      });
      return;
    }
    message.error("连这都不知道？多捞哟！");
  };

  return (
    <div className="App">
      <Row justify={"center"} align={"middle"}>
        <Col>输入暗号：</Col>
        <Col xs={12}>
          <Input onChange={(e) => setPassword(e?.target?.value)}></Input>
        </Col>
        <Button onClick={() => loginFn(password)}>确认</Button>
      </Row>
    </div>
  );
};

export default Login;
