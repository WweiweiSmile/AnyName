import { Button, Col, Divider, Input, message, Row } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import React, { useState,useRef,useEffect } from "react";
import { useGetAnswer } from "../../../apis/openai";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {  darcula } from "react-syntax-highlighter/dist/esm/styles/prism";
type Question = {
  text: string;
};
type Answer = {
  text: string;
};
// markdown文本
type MdPorps={
  textContent: string
  darkMode?: boolean; 
}

const AiContent: React.FC = () => {
  // 用于将滚动条滚动到最新消息
  const messagesEndRef = useRef<HTMLDivElement>(null);
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
    setQuestions([...questions, { text: questionText }]);
    setQuestionText("");
    const result = await getAnswerRun(questionText);
    if (result !== "未知错误") {
      setAnswers([...answers, { text: result! }]);
    } else {
      setAnswers([...answers, { text: "chatGpt 出现了未知错误！" }]);
      message.error("chatGpt 出现了未知错误！");
    }
  };
  //#region 
  // markdown相关设置
//   const them = {
//   dark: vscDarkPlus,
//   light: coy
// };
  const OmsViewMkd=(props: MdPorps)=>{
    const { textContent, darkMode } = props;
    // if (typeof darkMode === 'undefined') {
    //     them.light = darcula;
    //   }
    //   if (typeof darkMode === 'boolean') {
    //     them.light = coy;
    //   }
      return(
        <ReactMarkdown components={{
          code({ node, inline, className, children, ...props }) {
            const match:RegExpExecArray|null = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                  <SyntaxHighlighter
                    showLineNumbers={true}
                    style={darcula}
                    language={match[1]}
                    PreTag='div'
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>) : 
                (
                  <code className={className} {...props}>
                    {children}
                  </code>);
          }
        }}
    >
      {textContent}
    </ReactMarkdown>
        )
  }
  //#endregion


  /**
   * @description: 消息列表的展示
   * @param {*} questions
   * @return {*}
   */  
  const content = questions?.map((item, index) => {
    return (
      <div key={index} >
        {/* {index > 0 && <Divider />} */}
        <Row style={{ padding:"1.5rem 0"}}>
          <Col style={{ width: "100px" }}>question:</Col>
          <Col flex={1}>{item.text}</Col>
        </Row>
        {/* <Divider /> */}
        <Row wrap={false} style={{backgroundColor:"#f7f7f8",minHeight:"80px", padding:"1.5rem 0"}}>
          <Col style={{ width: "100px" }}>chat:</Col>
          <Col>
            {loading&&!answers[index] && (
              <span>
                <LoadingOutlined></LoadingOutlined>
                {" 正在加载中....."}
              </span>
            )}
          </Col>
          <Col  flex={1} span={23} style={{paddingRight:'20px'}}>
            {/* {!loading&&( */}
              {/* <ReactMarkdown > */}
              {/* {`${answers[index]?.text?.split("\n").map((i) => (
              <div>{i}</div>
              ))}`} */}
              {/* {answers[index]?.text}
            </ReactMarkdown> */}
            {/* )} */}
            <OmsViewMkd textContent={answers[index]?.text}></OmsViewMkd>
              
          </Col>
        </Row>
      </div>
    );
  });
  //
  useEffect(() => {
        const container:HTMLDivElement= messagesEndRef.current !;
        if (container.scrollHeight>container.clientHeight) {
            container.scrollTop=container.scrollHeight-container.clientHeight
        }
  }, [content]);

  return (
    <div>
      <div
        style={{
          // width: "90vw",
          margin: "0px auto",
          height: "calc(100vh - 200px)",
          overflowY: "auto",
          backgroundColor:"white",
          padding:"24px 16px 24px 10px",
        }}
        ref={messagesEndRef}
      >
        {content}
      </div>
      <div style={{position:"absolute",bottom:'0',width:"100%",padding:"20px 0",height:"100px"}}>
        <Row justify={'center'} align={'middle'}>
          <Col span={20} style={{marginRight:"20px"}}>
            <Input.TextArea
              style={{ height: "100px" }}
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
export default AiContent;
