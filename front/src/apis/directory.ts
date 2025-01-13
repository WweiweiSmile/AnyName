import {DefaultResponse, http, ListResponse} from './index';
import {useRequest} from 'ahooks';


export interface Directory {
  id: number; // Unique identifier for the directory
  name: string; // Name of the directory
  parentId: number; // Identifier of the parent directory
  userId: number; // Identifier of the user associated with the directory
  createTime: string; // Timestamp for when the directory was created
  updateTime: string; // Timestamp for when the directory was last updated
}

const useList = () => {
  return useRequest(async (parentId: number, userId: number)   => {
    const res = (await http.get<ListResponse<Directory>>('/api/directory/list', {
      params: {
        parentId, userId,
      },
    }));
    return res?.data?.data;
  },{
    manual:true,
  });
};

const useCreate = () => {
  return useRequest(async (parentId: number, userId: number,name: string)   => {
    const res = (await http.post<DefaultResponse<Directory>>('/api/directory/create', {
      "userId":userId,
      "parentId":parentId,
      "name": name,
    }));

    return res?.data?.data;
  },{
    manual:true,
  });
};

const useEdit = () => {
  return useRequest(async (id: number,name: string)   => {
    const res = (await http.post<DefaultResponse<Directory>>('/api/directory/update', {
      "id":id,
      "name": name,
    }));

    return res?.data?.data;
  },{
    manual:true,
  });
};

const directoryApi = {
  useList,
  useCreate,
  useEdit
}

export default directoryApi;