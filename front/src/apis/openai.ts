import { useRequest } from "ahooks";

import axios from "axios"
import { Configuration, OpenAIApi } from "openai";

const config = new Configuration({
  apiKey: "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",
})

const oepnai = new OpenAIApi(config);



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
