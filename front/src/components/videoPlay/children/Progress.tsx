import { Col, Progress, Row } from "antd";
import React, { useRef } from "react";
import { VideoActions, VideoState } from "react-video-renderer";

import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import "./Progress.scss";
interface VideoProgressProps {
  actions: VideoActions;
  state: VideoState;
}
const VideoProgress: React.FC<VideoProgressProps> = (props) => {
  const { actions, state } = props;
  const progressRef = useRef<HTMLDivElement>(null);
  const progressClick: React.DOMAttributes<HTMLDivElement>["onClick"] = (e) => {
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
      clientX - x > width ? 100 : Number(((clientX - x) / width).toFixed(2));
    actions.navigate(percent * state?.duration);
  };
  dayjs.extend(duration);
  // 进度时间
  const progressTime = dayjs
    .duration(state.currentTime * 1000)
    .format("HH:mm:ss");
  // 视频持续时间
  const durationTime = dayjs.duration(state.duration * 1000).format("HH:mm:ss");
  // 当前进度百分比
  const progressRate = Number(
    ((state.currentTime / state.duration) * 100).toFixed(2)
  );

  return (
    <div ref={progressRef} onClick={progressClick} className={"Progress"}>
      <Row justify={"center"}>
        <Col>
          <span style={{ color: "white" }}>{progressTime}</span>
        </Col>
        <Col flex={1}>
          <Progress showInfo={false} percent={progressRate} />
        </Col>
        <Col>
          <span style={{ color: "white" }}>{durationTime}</span>
        </Col>
      </Row>
    </div>
  );
};

export default VideoProgress;
