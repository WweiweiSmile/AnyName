import React, {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import {useLocalStorageState} from 'ahooks';
import {message} from 'antd';
import {User} from '../components/Login';

export type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: VoidFunction;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  logout: () => {},
  setUser: () => {},
});

export const useAuthContext = () => useContext(AuthContext);


type WithAuthProps = {
  children: ReactNode;
};
const WithAuth: React.FC<WithAuthProps> = ({children}) => {
  const [local, setLocal] = useLocalStorageState<User | null>('user');
  const [user, setUser] = useState<User | null>(local);
  // 如果没有权限,并且不是登陆页面, 跳转到 登陆页面
  useEffect(() => {
    if (
      !!local &&
      window.location.pathname !== '/login'
    ) {
      window.location.href = '/login';
    }
  }, [local]);

  // 权限值
  const authValue: AuthContextType = {
    user: user,
    setUser: (user) => {
      setUser(user);
      setLocal(user);
    },
    logout: () => {
      const defaultUser: User | null = null;
      setUser(defaultUser);
      setLocal(defaultUser);
      message.success('退出成功！');
      window.location.reload();
    },
  };

  return (
    <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
  );
};

export default WithAuth;
