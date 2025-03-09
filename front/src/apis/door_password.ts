import {useRequest} from 'ahooks';
import {DefaultResponse, http} from './index';

/**
 * 获取开门密码
 * @returns
 */
const useGet = () => {
  return useRequest(
    async () => {
      try {
        const res = await http.get<DefaultResponse<string>>('/api/door_password/get');
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

const DoorPasswordApi = {
  useGet: useGet,
};

export default DoorPasswordApi;
