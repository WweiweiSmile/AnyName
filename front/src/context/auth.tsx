import React, {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import {useLocalStorageState} from 'ahooks';
import {message} from 'antd';
import {User} from '../components/login';

export type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: VoidFunction;
  hasAuth: () => boolean
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  logout: () => {
    console.error('logout函数未在 AuthContext 范围内，请注意检查');
  },
  setUser: () => {
    console.error('setUser函数未在 AuthContext 范围内，请注意检查');
  },
  hasAuth: () => {
    console.error('hasAuth函数未在 AuthContext 范围内，请注意检查');
    return false;
  },
});

export const useAuthContext = () => useContext(AuthContext);

type WithAuthProps = {
  children: ReactNode;
};
const WithAuth: React.FC<WithAuthProps> = ({children}) => {
  const [localUser, setLocalUser] = useLocalStorageState<User | null>('user');
  const [user, setUser] = useState<User | null>(localUser);

  // 如果没有权限,并且不是登陆页面, 跳转到 登陆页面
  useEffect(() => {
    if (!user && window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }, [user]);

  // 权限值
  const authValue: AuthContextType = {
    user: user,
    setUser: (user) => {
      setUser(user);
      setLocalUser(user);
    },
    logout: () => {
      const defaultUser: User | null = null;
      setUser(defaultUser);
      setLocalUser(defaultUser);
      message.success('退出成功！');
      window.location.reload();
    },
    hasAuth: () => {
      return !!user;
    },
  };

  return (
    <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
  );
};

export default WithAuth;
