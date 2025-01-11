import { message } from "antd";
import axios from "axios";


export interface DefaultResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface ListResponse<T> extends DefaultResponse<any> {
  data: T[];
}


export const http = axios.create();
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
    console.error('err->',err);
    message.error(err.response.data.message);
    throw err.response.data.message;
  }
);

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
      return data;
    },
    (err) => {
      message.error((err as Error).message);
    }
  );
  return http;
};
