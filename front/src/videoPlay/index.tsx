import React, { useRef } from "react";
import Video from "react-video-renderer";
import { Button, Col, Row, Space } from "antd";
import "./index.scss";
import { Progress } from "antd";
type VideoPlayPropsType = {
  src: string;
  width: string;
  height: string;
};
const VideoPlay: React.FC<VideoPlayPropsType> = (props) => {
  const { src, width, height } = props;
  const progressRef = useRef<HTMLDivElement>(null);
  return (
    <Video src={src}>
      {(video, state, actions) => (
        <div className={`videoPlay`}>
          <Row justify={"center"}>
            <Col style={{ height: "calc(100vh - 50px) " }}>{video}</Col>
          </Row>
          <div
            style={{
              cursor: "pointer",
              position: "absolute",
              bottom: 0,
              zIndex: 999,
              width: "calc(100% - 40px) ",
            }}
          >
            <div
              ref={progressRef}
              onClick={(e) => {
                // 鼠标位置
                const { clientX } = e;
                // 元素位置
                const { x } = (e?.target as any)?.getBoundingClientRect();
                const inner = progressRef.current?.getElementsByClassName(
                  "ant-progress-inner"
                )[0] as any;
                // 目标元素宽度
                const width = inner?.clientWidth;

                const percent =
                  clientX - x > width
                    ? 100
                    : Number(((clientX - x) / width).toFixed(2));
                actions.navigate(percent * state?.duration);
              }}
            >
              <Row justify={"center"}>
                <Col>
                  <span>{state.currentTime.toFixed(2)}秒</span>
                </Col>
                <Col flex={1}>
                  <Progress
                    showInfo={false}
                    percent={Number(
                      ((state.currentTime / state.duration) * 100).toFixed(2)
                    )}
                  />
                </Col>
                <Col>
                  <span>{state.duration.toFixed(2)}秒</span>
                </Col>
              </Row>
            </div>
            <Row justify={"center"}>
              <Col>
                <Button onClick={actions.play}>Play</Button>
              </Col>
              <Col>
                <Button onClick={actions.pause}>Pause</Button>
              </Col>
              <Col>
                <Button
                  onClick={() => {
                    console.log(state?.currentTime);
                    actions.pause();
                    actions.navigate(state?.currentTime - 1 / 60);
                  }}
                >
                  上一帧
                </Button>
              </Col>
              <Col>
                <Button
                  onClick={() => {
                    console.log(state?.currentTime);
                    actions.pause();
                    actions.navigate(state?.currentTime + 1 / 60);
                  }}
                >
                  下一帧
                </Button>
              </Col>
              <Col>
                <Button
                  onClick={() => {
                    actions.requestFullscreen();
                  }}
                >
                  全屏
                </Button>
              </Col>
            </Row>
          </div>
        </div>
      )}
    </Video>
  );
};

export default VideoPlay;
