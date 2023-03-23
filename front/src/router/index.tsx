import { createBrowserRouter, RouteObject } from "react-router-dom";
import App from "../App";
import Login from "../components/Login";
import VideoPlay from "../components/videoPlay";
import FileUpload from "../components/FileUpload";
import Home from "../components/Home";
const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/videoPlay",
    element: <FileUpload />,
  },
  {
    path: "/login",
    element: <Login />,
  },
];
const router = createBrowserRouter(routes);
export default router;
