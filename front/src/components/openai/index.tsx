import { Button, Col, Divider, Input, message, Row } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import { useGetAnswer } from "../../apis/openai";
type Question = {
  text: string;
};
type Answer = {
  text: string;
};
const OpenAi: React.FC = () => {
  const [questionText, setQuestionText] = useState("");
  // 问题数组
  const [questions, setQuestions] = useState<Question[]>([
    { text: "你是谁？" },
  ]);
  // 答案数组
  const [answers, setAnswers] = useState<Answer[]>([
    {
      text: "我是chat，可以随便问我问题！目前不支持上下文",
    },
  ]);

  // 获取chatgpt答案 hook
  const { runAsync: getAnswerRun, loading } = useGetAnswer();
  // 获取chatgpt答案 函数
  const getAnswerFn = async () => {
    const result = await getAnswerRun(questionText);
    setQuestions([...questions, { text: questionText }]);
    setQuestionText("");

    if (result !== "未知错误") {
      setAnswers([...answers, { text: result! }]);
    } else {
      setAnswers([...answers, { text: "chatGpt 出现了未知错误！" }]);
      message.error("chatGpt 出现了未知错误！");
    }
  };

  const content = questions?.map((item, index) => {
    return (
      <>
        {index > 0 && <Divider></Divider>}
        <Row>
          <Col style={{ width: "100px" }}>question:</Col>
          <Col flex={1}>{item.text}</Col>
        </Row>
        <Divider></Divider>
        <Row wrap={false}>
          <Col style={{ width: "100px" }}>chat:</Col>
          <Col flex={1} span={23}>
            {answers[index]?.text?.split("\n").map((i) => (
              <div>{i}</div>
            ))}
          </Col>
        </Row>
      </>
    );
  });

  return (
    <div>
      <div
        style={{
          width: "90vw",
          margin: "0px auto",
          height: "calc(100vh - 200px)",
          overflowY: "auto",
        }}
      >
        {content}
      </div>
      <Row justify={"center"} style={{ height: "50px" }}>
        <Col>
          {loading && (
            <span>
              <LoadingOutlined></LoadingOutlined>
              {" 正在加载中....."}
            </span>
          )}
        </Col>
      </Row>
      <div>
        <Row>
          <Col span={20}>
            <Input.TextArea
              style={{ height: "150px" }}
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              rows={4}
              // onPressEnter={getAnswerFn}
            ></Input.TextArea>
          </Col>
          <Col>
            <Button onClick={getAnswerFn} disabled={loading}>
              发送
            </Button>
          </Col>
        </Row>
      </div>
    </div>
  );
};
export default OpenAi;
