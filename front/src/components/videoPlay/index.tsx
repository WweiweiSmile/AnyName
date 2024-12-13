import React, { useRef, useState } from "react";
import Video from "react-video-renderer";
import { Button, Col, Row, Space } from "antd";
import VideoProgress from "./children/Progress";
import "./index.scss";
import { useParams, useLocation } from "react-router-dom";
import { useLocalStorageState } from "ahooks";
import { _Auth } from "../Login";
import {downloadFile} from '../../utils/utils'
import Icon, {PauseCircleOutlined} from '@ant-design/icons';
type VideoPlayPropsType = {
  open: boolean;
  onClose: VoidFunction;
  src: string;
};
const VideoPlay: React.FC<VideoPlayPropsType> = (props) => {
  const { open, onClose } = props;
  const [toolbarVisible, setToolbarVisible] = useState(false);
  const location = useLocation();
  const { fileName } = useParams();
  const [state] = useLocalStorageState<_Auth>("_auth");
  const timouter = useRef<NodeJS.Timeout[]>([]);
  const [pause,setPause] = useState(true);
  //FIXME： 视频封面请求地址的端口是写死的
  const locationStr =
    window.location.href.split(":")?.slice(0, 2)?.join(":") + ":8080";
  const src = `${locationStr}${location.pathname}${location.search}`;

  return (
    <>
      {
        pause && <div className="fixed left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2  ">
          <PauseCircleOutlined   style={{fontSize:'10rem',color:'#b6b6b6'}}/>
         </div>
      }
      {open && (
        <Video src={src || ""} autoPlay={false}>
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
                state.status === "paused" ? setPause(false) : setPause(true);

              }}
            >
              {video}
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
                        <Button onClick={() =>  downloadFile(src, decodeURIComponent(src.split('=')[2]))}>下载</Button>
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
