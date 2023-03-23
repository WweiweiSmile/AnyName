import React, {
  useContext,
  createContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { useLocalStorageState } from "ahooks";
import { message } from "antd";
import Login from "../components/Login";
export type AuthType = "private" | "public" | "logout";
export type _Auth = {
  auth: AuthType;
};
export type AuthContextType = {
  auth: AuthType;
  setAuth: (auth: AuthType) => void;
  logout: VoidFunction;
};

export const AuthContext = createContext<AuthContextType | null>(null);
export const useAuthContext = () => useContext(AuthContext);

type WithAuthProps = {
  children: ReactNode;
};
const WithAuth: React.FC<WithAuthProps> = ({ children }) => {
  const [local, setLocal] = useLocalStorageState<_Auth>("_auth");
  const [auth, setAuth] = useState<AuthType>(local?.auth);
  // 如果没有权限,并且不是登陆页面, 跳转到 登陆页面
  useEffect(() => {
    if (
      local.auth !== "private" &&
      local.auth !== "public" &&
      window.location.pathname !== "/login"
    ) {
      window.location.href = "/login";
    }
  }, []);
  // 权限值
  const authValue: AuthContextType = {
    auth: auth,
    setAuth: (auth) => setAuth(auth),
    logout: () => {
      setLocal({
        auth: "logout",
      });
      setAuth("logout");
      message.success("退出成功！");
      window.location.reload();
    },
  };
  // 如果未登录，也不是登陆页面 不显示
  const visible =
    auth === "private" ||
    auth === "public" ||
    window.location.pathname === "/login";
    
  return (
    <AuthContext.Provider value={authValue}>
      {visible && children}
    </AuthContext.Provider>
  );
};

export default WithAuth;
