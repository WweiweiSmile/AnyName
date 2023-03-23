import { useAxios } from ".";
import axios from "axios";
import { useRequest } from "ahooks";
/**
 * 文件上传函数
 * @returns
 */
export const useFileUplaod = () => {
  const axios = useAxios();

  return useRequest(
    async (data: { file: File; isPrivate: string }) => {
      const formData = new FormData();
      formData.append("file", data.file);
      formData.append("isPrivate", data.isPrivate);
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
export const useGetFileInfos = () => {
  return useRequest(
    async (isPrivate: boolean) => {
      const res = await axios.get<FileInfo[]>(
        "/api/get/files" + `/${isPrivate ? "true" : "false"}`
      );
      return res.data;
    },
    {
      manual: true,
    }
  );
};

/**
 * 验证权限
 * @returns
 */
export type AuthResponeStatus = 200 | 201 | 400;
export const useGetAuth = () => {
  return useRequest(
    async (password: string) => {
      const res = await axios.get<AuthResponeStatus>(
        "/api/auth/" + `${password || "not"}`
      );
      return res.data;
    },
    {
      manual: true,
    }
  );
};
