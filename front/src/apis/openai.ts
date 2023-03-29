import { useRequest } from "ahooks";
import axios from "axios";

export const useGetAnswer = () => {
  return useRequest(
    async (text: string) => {
      try {
        const res = await axios.post("/api/openai", {
          text: text,
        });
        return res.data as string;
      } catch (err) {
        return "未知错误";
      }
    },
    {
      manual: true,
    }
  );
};
