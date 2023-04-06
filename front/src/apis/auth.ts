import { useRequest } from "ahooks";
import { DefaultResponse, useAxios } from ".";

/**
 * 验证权限
 * @returns
 */
interface AuthResponse extends DefaultResponse {
  data: {
    private: boolean;
    path: string[];
  };
}
export const useGetAuth = () => {
  const axios = useAxios();
  return useRequest(
    async (password: string) => {
      const res: AuthResponse = await axios.get(
        "/api/auth/" + `${password || "not"}`
      );
      return res.data;
    },
    {
      manual: true,
    }
  );
};
