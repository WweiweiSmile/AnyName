import React, {useEffect} from 'react';
import DoorPasswordApi from '../../apis/door_password';
import {Button} from 'antd';

const DoorPassword = () => {
  const {run, data, refresh} = DoorPasswordApi.useGet();

  useEffect(() => {
    run();
  }, []);

  return <>
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <Button onClick={refresh}>刷新</Button>
      <div className="text-xl">你的开锁密码为：</div>
      <div className="font-bold text-4xl">{data}</div>
    </div>
  </>;
};

export default DoorPassword;