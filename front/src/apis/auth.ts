import { useRequest } from "ahooks";
import { DefaultResponse, useAxios } from ".";
import axios from 'axios';

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
export const useGetAuth = () => {
  const axios = useAxios();
  return useRequest(
    async (password: string) => {
      const res: AuthResponse = await axios.get(
        "/api/auth/" + `${password || "not"}`
      );
      return res.data;
    },
    {
      manual: true,
    }
  );
};

export const useLogin =  () => {
  return useRequest(
    async (username:string,password: string) => {
      const res = await axios.post(
        "/api/user/login",{
          username: username,
          password: password,
        }
      );
      return res.data;
    },
    {
      manual: true,
      onError: (err) => {
        console.log(err);
      }
    }
  );

}
