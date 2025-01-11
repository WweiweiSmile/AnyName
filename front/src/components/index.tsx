import React, { useEffect } from "react";
import { useNavigate, useOutlet, useLocation } from "react-router-dom";
import { useAuthContext } from "../hooks";

const Index: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const outlet = useOutlet();
  const { user } = useAuthContext();

  useEffect(() => {
    // 已登录，当前页面 === '/'，跳转到home页面
    if (!!user && location.pathname === "/") {
      navigate("/home");
    }
  }, [location.pathname]);

  return <>{outlet}</>;
};

export default Index;
