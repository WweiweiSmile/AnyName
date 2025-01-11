import { useRequest } from "ahooks";
import {DefaultResponse, http, useAxios} from '.';
import axios from 'axios';
import {User} from '../components/Login';

/**
 * 验证权限
 * @returns
 */
interface AuthResponse extends DefaultResponse {
  data: {
    private: boolean;
    path: string[];
  };
}

export const useLogin =  () => {
  return useRequest(
    async (username:string,password: string) => {
      try{
        const res = await http.post<User>(
          "/api/user/login",{
            username: username,
            password: password,
          }
        );
        return res.data;
      }catch (err){
        console.error(err);
        return null
      }

    },
    {
      manual: true,
      onError: (err) => {
        console.log(err);
      }
    }
  );
}
