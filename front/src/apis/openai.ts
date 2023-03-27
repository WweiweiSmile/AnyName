import { useRequest } from "ahooks";
import { Configuration, OpenAIApi } from "openai";

const config = new Configuration({
  apiKey: "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",
});

const oepnai = new OpenAIApi(config);

export const useGetAnswer = () => {
  return useRequest(
    async (text: string) => {
      try {
        const data = await oepnai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: [
            {
              content: text,
              role: "user",
            },
          ],
        });
        console.log(data);
        return data.data.choices[0].message?.content;
      } catch (err) {
        return "未知错误";
      }
    },
    {
      manual: true,
    }
  );
};
