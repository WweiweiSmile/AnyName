import { Button, Input, Row, Col } from "antd";
import FileUpload from "./FileUpload";
import { useState } from "react";
import { useMemo } from "react";
import { useGetAuth } from "./apis/file";
function App() {
  const [password, setPassword] = useState("");
  const { data, runAsync: getAuthRun } = useGetAuth();
  const content = useMemo(() => {
    return data === 200 ? (
      <FileUpload isPrivate={true}></FileUpload>
    ) : data === 201 ? (
      <FileUpload isPrivate={false}></FileUpload>
    ) : (
      ""
    );
  }, [data]);

  return (
    <div className="App">
      <Row justify={"center"} align={"middle"}>
        <Col>输入暗号：</Col>
        <Col xs={12}>
          <Input onChange={(e) => setPassword(e?.target?.value)}></Input>
        </Col>
        <Button onClick={() => getAuthRun(password)}>确认</Button>
      </Row>
      {content}
    </div>
  );
}

export default App;
