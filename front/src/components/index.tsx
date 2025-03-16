import React from 'react';
import {useNavigate, useOutlet} from 'react-router-dom';
import {useMount} from 'ahooks';
import {useAuthContext} from '../context/auth';

const Index: React.FC = () => {
  const outlet = useOutlet();
  const navigate = useNavigate();
  const {hasAuth} = useAuthContext();

  useMount(() => {
    if (hasAuth() && window.location.pathname === '/') {
      navigate('/home');
    }
  });

  return <>{outlet}</>;
};

export default Index;
