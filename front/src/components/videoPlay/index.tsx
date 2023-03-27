import React, { useRef, useState } from "react";
import Video from "react-video-renderer";
import { Button, Col, Row, Space } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import VideoProgress from "./children/Progress";
import "./index.scss";
import { useParams } from "react-router-dom";
import { useLocalStorageState } from "ahooks";
import { _Auth } from "../Login";
type VideoPlayPropsType = {
  open: boolean;
  onClose: VoidFunction;
  src: string;
};
const VideoPlay: React.FC<VideoPlayPropsType> = (props) => {
  const { open, onClose } = props;
  const [toolbarVisible, setToolbarVisible] = useState(false);
  const { fileName } = useParams();
  const [state] = useLocalStorageState<_Auth>("_auth");
  const timouter = useRef<NodeJS.Timeout[]>([]);
  const locationStr =
    window.location.href.split(":")?.slice(0, 2)?.join(":") + ":8096";
  const src = `${locationStr}/video/${fileName}/${
    state.auth === "private" ? "true" : "false"
  }`;
  return (
    <>
      {open && (
        <Video src={src || ""} autoPlay={true}>
          {(video, state, actions) => (
            <div
              className={`videoPlay`}
              id={"videoPlayer"}
              onMouseDown={() => actions.setPlaybackSpeed(2)}
              onMouseUp={() => actions.setPlaybackSpeed(1)}
              onTouchStart={() => actions.setPlaybackSpeed(2)}
              onTouchEnd={() => actions.setPlaybackSpeed(1)}
              onClick={() => {
                timouter?.current?.push(
                  setTimeout(() => setToolbarVisible(!toolbarVisible), 300)
                );
              }}
              onDoubleClick={() => {
                if (timouter?.current) {
                  timouter?.current?.map((item) => clearTimeout(item));
                  timouter.current = [];
                }
                state.status === "paused" ? actions.play() : actions.pause();
              }}
            >
              {video}
              <div
                className="topToolbar"
                onMouseEnter={() => setToolbarVisible(true)}
                onMouseLeave={() => setToolbarVisible(false)}
                style={{ opacity: Number(toolbarVisible) }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <Space>
                  <ArrowLeftOutlined
                    style={{ color: "white", fontSize: "32px" }}
                    onClick={onClose}
                  />
                </Space>
              </div>
              <div
                className="bottomToolbarContainer"
                onMouseEnter={() => setToolbarVisible(true)}
                onMouseLeave={() => setToolbarVisible(false)}
                style={{ opacity: Number(toolbarVisible) }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                {
                  <div className="bottomToolbar">
                    <VideoProgress
                      actions={actions}
                      state={state}
                    ></VideoProgress>
                    <Row justify={"center"}>
                      <Space>
                        <Button onClick={actions.play}>Play</Button>
                        <Button onClick={actions.pause}>Pause</Button>
                        <Button
                          onClick={() => {
                            actions.pause();
                            actions.navigate(state?.currentTime - 1 / 60);
                          }}
                        >
                          上一帧
                        </Button>
                        <Button
                          onClick={() => {
                            actions.pause();
                            actions.navigate(state?.currentTime + 1 / 60);
                          }}
                        >
                          下一帧
                        </Button>
                        <Button
                          onClick={() => {
                            const el = document.getElementById("videoPlayer");
                            el?.requestFullscreen();
                          }}
                        >
                          全屏
                        </Button>
                      </Space>
                    </Row>
                  </div>
                }
              </div>
            </div>
          )}
        </Video>
      )}
    </>
  );
};

export default VideoPlay;
