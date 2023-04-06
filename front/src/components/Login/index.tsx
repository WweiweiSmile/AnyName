import { Button, Input, Row, Col, message } from "antd";
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { useLocalStorageState } from "ahooks";
import { useGetAuth } from "../../apis/auth";
import { useAuthContext } from "../../hooks";
export type _Auth = {
  auth: "private" | "public";
  path: string[];
};

const Login: React.FC = () => {
  const [password, setPassword] = useState("");
  const { runAsync: getAuthRun } = useGetAuth();
  const { setUser } = useAuthContext();
  const navigate = useNavigate();

  // 登陆函数
  const loginFn = async (pwd: string) => {
    const res = await getAuthRun(pwd);
    try {
      const { path } = res;
      const auth = res.private ? "private" : "public";
      if (auth) {
        setUser({
          auth: auth,
          path: path,
        });
        message.success("确认过眼神，你是对的人~~~~~~~");
        setTimeout(() => {
          navigate("/home");
        });
        return;
      }
    } catch (err) {}
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
