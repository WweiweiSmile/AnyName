import {useRequest} from 'ahooks';
import {DefaultResponse, http} from '.';
import {User} from '../components/Login';

export const useLogin =  () => {
  return useRequest(
    async (username:string,password: string) => {
      try{
        const res = await http.post<DefaultResponse<User>>(
          "/api/user/login",{
            username: username,
            password: password,
          }
        );
        return res.data.data;
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

export const useRegister =  () => {
  return useRequest(
    async (name:string,username:string,password: string) => {
      try{
        const res = await http.post<DefaultResponse<User>>(
          "/api/user/register",{
            name:name,
            username: username,
            password: password,
          }
        );
        return res.data.data;
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

const authApi = {
  useLogin,
  useRegister,
}

export default authApi;