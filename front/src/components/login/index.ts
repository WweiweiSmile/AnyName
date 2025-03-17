import Login from './login';

export type User = {
  id: number;
  name: string;
  username: string;
  password: string;
  avatar: string;
  localPath: string
};

export default Login