import {http, useAxios} from '.';
import axios from 'axios';
import {useRequest} from 'ahooks';

/**
 * 文件上传函数
 * @returns
 */
export const useFileUpload = () => {
  return useRequest(
    async (data: { file: File; path:string,directoryId:number,userId:number }) => {
      const formData = new FormData();
      formData.append("file", data.file);
      formData.append("path", data.path);
      formData.append("directoryId", String(data.directoryId) )
      formData.append("userId", String(data.userId) )
      try {
        const res = await http.post("/api/os/upload", formData);
        return res?.data?.data
      } catch (err) {
        console.log(err);
      }
    },
    {
      manual: true,
    }
  );
};

export const get = async () => {
  const res = await axios.post("/api/hello");
  return res;
};

 type FileInfo = {
  name: string;
  size: number;
  mode: number;
  modifyTime: number;
  isDir: boolean;
  cover: string;
};

/**
 * 获取所有文件的信息
 * @returns
 */
export const useGetFileInfos = () => {
  return useRequest(
    async (path: string[]) => {
      const res = await axios.get<FileInfo[]>(`/api/get/files/${path.join("_")}`);
      return res.data;
    },
    {
      manual: true,
    }
  );
};

/**
 * 创建文件夹
 */
export const useCreateDir = () => {
  return useRequest(
    async (path: string[]) => {
      const res = await axios.get(`/api/createDir/${path.join("_")}`);
      return res.data;
    },
    {
      manual: true,
    }
  );
};


const fileApi = {
  useFileUpload
}

export default fileApi;