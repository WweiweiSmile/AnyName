import {Button, Input, Row, Col, message} from 'antd';
import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useLogin} from '../../apis/auth';
import {useAuthContext} from '../../hooks';

export type User = {
  id: number;
  name: string;
  username: string;
  password: string;
  avatar: string;
  localPath: string
};

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const {runAsync} = useLogin();
  const {setUser} = useAuthContext();
  const navigate = useNavigate();

  // 登陆函数
  const loginFn = async (username: string, pwd: string) => {
    const user = await runAsync(username, pwd);
    if (!!user) {
      setUser(user);
      message.success('确认过眼神，你是对的人~~~~~~~');
      setTimeout(() => {
        navigate('/home');
      }, 10);
      return;
    }
  };

  return (
    <div className="App">
      <div className={'w-full h-screen flex items-center justify-center  '}>
        <div className="w-80 h-80 flex flex-col gap-2">
          <Input placeholder="请输入用户名" onChange={(e) => setUsername(e?.target?.value)}></Input>
          <Input.Password placeholder="请输入密码" onChange={(e) => setPassword(e?.target?.value)}></Input.Password>
          <div className="text-center">
            <Button onClick={() => loginFn(username, password)}>确认</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
