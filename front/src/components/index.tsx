import { useLocalStorageState, useMount } from "ahooks";
import { Button, Col, Row } from "antd";
import { Content } from "antd/es/layout/layout";
import React, { ReactNode, useEffect } from "react";
import { useNavigate, useOutlet } from "react-router-dom";
import CacheComponent from "./Cache/CacheComponent";
import { _Auth } from "./Login";

const Index: React.FC = () => {
  const navigate = useNavigate();
  const [local, setLocal] = useLocalStorageState<_Auth>("_auth", {});
  const outlet = useOutlet();

  return <>{outlet}</>;
};

export default Index;
