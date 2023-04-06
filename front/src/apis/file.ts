import { DefaultResponse, useAxios } from ".";
import axios from "axios";
import { useLocalStorageState, useRequest } from "ahooks";
import { useAuthContext } from "../hooks";
/**
 * 文件上传函数
 * @returns
 */
export const useFileUplaod = () => {
  const axios = useAxios();

  return useRequest(
    async (data: { file: File; path: string[] }) => {
      const formData = new FormData();
      formData.append("file", data.file);
      formData.append("path", data.path.join('_'));
      try {
        const res = await axios.post("/api/savefile", formData);
        return res;
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
};

/**
 * 获取所有文件的信息
 * @returns
 */
export const useGetFileInfos = () => {
  const { user } = useAuthContext();
  return useRequest(
    async (path: string[]) => {
      const res = await axios.get<FileInfo[]>(
        "/api/get/files" + `/${path.join("_")}`
      );
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
      const res = await axios.get("/api/createDir" + `/${path.join("_")}`);
      return res.data;
    },
    {
      manual: true,
    }
  );
};
