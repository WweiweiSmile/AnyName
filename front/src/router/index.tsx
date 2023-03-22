import { createBrowserRouter } from "react-router-dom";
import App from "../App";
const routes = [
  {
    path: "/",
    element: <App></App>,
  },
  {
    path: "videoPlay:user",
  },
  {
    path: "login",
  },
];
const router = createBrowserRouter(routes);
export default router;
