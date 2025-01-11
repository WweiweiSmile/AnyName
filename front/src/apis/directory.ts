import {http, ListResponse} from './index';
import {useRequest} from 'ahooks';


export interface Directory {
  id: number; // Unique identifier for the directory
  name: string; // Name of the directory
  parentId: number; // Identifier of the parent directory
  userId: number; // Identifier of the user associated with the directory
  createTime: Date; // Timestamp for when the directory was created
  updateTime: Date; // Timestamp for when the directory was last updated
}

const useList = () => {
  return useRequest(async (parentId: number, userId: number)   => {
    return await http.get<ListResponse<Directory>>('/api/directory/list', {
      params: {
        parentId, userId,
      },
    });
  },{
    manual:true
  });
};

const directoryApi = {
  userList: useList,
}

export default directoryApi;