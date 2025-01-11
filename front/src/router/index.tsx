import React from "react";
import { createBrowserRouter, RouteObject } from "react-router-dom";
import Login from "../components/Login";
import VideoPlay from "../components/videoPlay";
import FileUpload from "../components/file_list";
import Home from "../components/Home";
import Index from "../components/index";
import OpenAi from "../components/openai";
import CacheComponent from "../components/Cache/CacheComponent";
import CacheContainer from "../components/Cache/CacheContainer";
// const FileUpload = React.lazy(() => import("../components/FileList/index"));

const routes: RouteObject[] = [
  {
    path: "/",
    element: (
      <CacheContainer>
        <Index></Index>
      </CacheContainer>
    ),
    children: [
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "fileList",
        element: (
          <>
            <CacheComponent onlyKey={"fileList"}>
              <FileUpload />
            </CacheComponent>
          </>
        ),
      },
      {
        path: "videoPlay",
        element: (
          <VideoPlay open={true} onClose={() => {}} src={""}></VideoPlay>
        ),
      },
      {
        path: "openai",
        element: <OpenAi></OpenAi>,
      },
    ],
  },

  {
    path: "/login",
    element: <Login />,
  },
];
const router = createBrowserRouter(routes);
export default router;
