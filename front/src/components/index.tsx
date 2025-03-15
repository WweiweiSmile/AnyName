import React from "react";
import { useOutlet } from "react-router-dom";
const Index: React.FC = () => {
  const outlet = useOutlet();

  return <>{outlet}</>;
};

export default Index;
