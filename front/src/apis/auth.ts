import { useRequest } from "ahooks";
import { DefaultResponse, useAxios } from ".";

/**
 * 验证权限
 * @returns
 */
interface AuthResponse extends DefaultResponse {
  data: {
    private: boolean;
  };
}
export const useGetAuth = () => {
  const axios = useAxios()
  return useRequest(
    async (password: string) => {
      const res = await axios.get<AuthResponse>(
        "/api/auth/" + `${password || "not"}`
      );
      return res.data.data;
    },
    {
      manual: true,
    }
  );
};