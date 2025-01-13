import {DefaultResponse, http, ListResponse} from '.';
import axios from 'axios';
import {useRequest} from 'ahooks';

// This code is a TypeScript representation of a data model.
export interface FileType {
  id: number;
  name: string;
  type: string;
  directoryId: number;
  userId: number;
  path: string;
  size: number;
  cover: string;
  createTime: string;
  updateTime: string;
}

/**
 * 文件上传函数
 * @returns
 */
const useUpload = () => {
  return useRequest(
    async (data: { file: File; path: string, directoryId: number, userId: number }) => {
      const formData = new FormData();
      formData.append('file', data.file);
      formData.append('path', data.path);
      formData.append('directoryId', String(data.directoryId));
      formData.append('userId', String(data.userId));
      try {
        const res = await http.post('/api/os/upload', formData);
        return res?.data?.data;
      } catch (err) {
        console.log(err);
      }
    },
    {
      manual: true,
    },
  );
};

/**
 * 获取文件列表
 * @returns
 */
const useList = () => {
  return useRequest(
    async (userId: number, directoryId: number) => {
      try {
        const res = await http.get<ListResponse<FileType>>('/api/file/list', {
          params: {
            userId: userId,
            directoryId: directoryId,
          },
        });

        return res?.data?.data;
      } catch (err) {
        console.log(err);
      }
    },
    {
      manual: true,
    },
  );
};

const useDelete = () => {
  return useRequest(async (id: number) => {
    const res = (await http.delete<DefaultResponse<FileType>>(`/api/file/delete/${id}`));

    return res?.data?.data;
  }, {
    manual: true,
  });
};

const useUpdate = () => {
  return useRequest(async (data: { id: number, name: string }) => {
    const res = (await http.put<DefaultResponse<FileType>>(`/api/file/update`, data));

    return res?.data?.data;
  }, {
    manual: true,
  });
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
      const res = await axios.get<FileInfo[]>(`/api/get/files/${path.join('_')}`);
      return res.data;
    },
    {
      manual: true,
    },
  );
};

/**
 * 创建文件夹
 */
export const useCreateDir = () => {
  return useRequest(
    async (path: string[]) => {
      const res = await axios.get(`/api/createDir/${path.join('_')}`);
      return res.data;
    },
    {
      manual: true,
    },
  );
};

const fileApi = {
  useUpload,
  useList,
  useDelete,
  useUpdate
};

export default fileApi;