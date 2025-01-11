import { Button, Input, Row, Col, message } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin} from '../../apis/auth';
import { useAuthContext } from "../../hooks";

export type User = {
  id: number;
  name: string;
  username: string;
  password: string;
  avatar: string;
};

const Login: React.FC = () => {
  const [username,setUsername] = useState("")
  const [password, setPassword] = useState("");
  // const [user,setUser] = useLocalStorageState<User>("user")
  const {runAsync} = useLogin()
  const { setUser } = useAuthContext();
  const navigate = useNavigate();

  // 登陆函数
  const loginFn = async ( username: string,pwd: string) => {
     const user =  await runAsync(username, pwd);
     if(!!user){
       setUser(user);
       message.success("确认过眼神，你是对的人~~~~~~~");
       setTimeout(() => {
         navigate("/home");
       },10);
       return;
     }
  };

  return (
    <div className="App">
      <Row justify={"center"} align={"middle"}>
        <Col>用户名：</Col>
        <Col xs={12}>
          <Input onChange={(e) => setUsername(e?.target?.value)}></Input>
        </Col>
      </Row>
      <Row justify={"center"} align={"middle"}>
        <Col>密码：</Col>
        <Col xs={12}>
          <Input.Password  onChange={(e) => setPassword(e?.target?.value)}></Input.Password>
        </Col>
      </Row>
      <Row justify="center" align="middle">
        <Button onClick={() => loginFn(username,password)}>确认</Button>
      </Row>
    </div>
  );
};

export default Login;
