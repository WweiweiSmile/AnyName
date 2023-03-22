import { createBrowserRouter } from "react-router-dom";
import App from "../App";
const routes = [
  {
    path: "/",
    element: <App></App>,
  },
];
const router = createBrowserRouter(routes);
export default router;
