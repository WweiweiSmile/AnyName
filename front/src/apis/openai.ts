import axios from 'axios';
import {useState} from 'react';

export const useGetAnswer = () => {
  // const axios = useAxios();
  const [data, setData] = useState("");
  return {
    loading: false,
    data: data,
    runAsync: async (text: string) => {
      try {
        setData("");
        axios
          .post(
            "/api/openai",
            {
              text: text,
            },
            {
              responseType: "stream",
            }
          )
          .then((response) => {
            // return res.data as string;
            const str = response.data as string;
            str.replace(/"|'/g, "");
            // str.replaceAll('"""', "");
            // str.replaceAll('"\n"', "");
            setData(str);

            console.log("每一行：", str);
            // console.log("流式数据：", res);

            // setData(data + (res.data.data as string));
          });
      } catch (err) {
        return "未知错误";
      }
    },
  };
};

//   return useRequest(
//     async (text: string) => {
//       try {
//         const res = await axios.post("/api/openai", {
//           text: text,
//         });
//         return res.data as string;
//       } catch (err) {
//         return "未知错误";
//       }
//     },
//     {
//       manual: true,
//     }
//   );
// }
