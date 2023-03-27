import { createBrowserRouter, RouteObject } from "react-router-dom";
import App from "../App";
import Login from "../components/Login";
import VideoPlay from "../components/videoPlay";
import FileUpload from "../components/FileList";
import Home from "../components/Home";
import CacheComponent from "../components/Cache/CacheComponent";
const routes: RouteObject[] = [
  {
    path: "/",
    children: [
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "fileList",
        element: <FileUpload />,
      },
      {
        path: "videoPlay/:fileName",
        element: (
          <VideoPlay open={true} onClose={() => {}} src={""}></VideoPlay>
        ),
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
