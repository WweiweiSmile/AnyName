import React, {useMemo, useState} from 'react';
import {Button, Input, message} from 'antd';
import {User} from '../login';
import authApi from '../../apis/auth';

const Register = () => {
  const [user, setUser] = useState<Pick<User, 'name' | 'username' | 'password'>>({
    username: '',
    name: '',
    password: '',
  });

  const {runAsync} = authApi.useRegister();

  const register = async () => {
    try {
      await runAsync(user.name, user.username, user.password);
      message.success('用户注册成功');
    } catch (err) {
      console.log(err);
    }

  };

  const registerEnabled = useMemo(() => {
    return user.name && user.username && user.password && user.username.length >= 6 && user.password.length >= 6;
  }, [user.name, user.username, user.password]);

  return <>
    <div className="w-full h-screen flex items-center justify-center">
      <div className="w-80  flex flex-col gap-2 p-10  bg-gray-100  rounded-lg">
        <Input placeholder="请输入名称" onChange={(e) => setUser({...user, name: e.target.value})}/>
        <Input placeholder="请输入用户名" onChange={(e) => setUser({...user, username: e.target.value})}/>
        <Input.Password placeholder="请输入密码" onChange={(e) => setUser({...user, password: e.target.value})}/>
        <div className="text-center"><Button disabled={!registerEnabled} onClick={register}>注册</Button></div>
      </div>
    </div>
  </>;
};

export default Register;