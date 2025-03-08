import React from 'react';

const DoorPassword = () => {
  const [password, setPassword] = React.useState<string>('531245795213');

  return <>
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <div className="text-xl">你的开锁密码为：</div>
      <div className="font-bold text-4xl">{password}</div>
    </div>
  </>
}

export default DoorPassword