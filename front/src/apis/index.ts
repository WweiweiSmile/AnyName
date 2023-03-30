import { message } from "antd";
import axios, { AxiosResponse } from "axios";

export interface DefaultResponse {
  code: number;
  msg: string;
  data: unknown;
}

export const useAxios = () => {
  const http = axios.create();
  // 添加响应拦截器
  http.interceptors.response.use(
    (res) => {
      const { data } = res;
      try {
        // 只有 code 为 200 的时候为成功，其他都是失败
        if (data.code !== 200) {
          message.error({
            content: data.msg,
            key: data.msg,
          });
          throw data.msg;
        }
      } catch (err) {
        throw err;
      }
      return res;
    },
    (err) => {
      message.error((err as Error).message);
    }
  );
  return http;
};
