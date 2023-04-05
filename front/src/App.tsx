import { useLocalStorageState } from "ahooks";
import { useState } from "react";
import Home from "./components/Home";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import WithAuth from "./hooks/auth";
import CacheContainer from "./components/Cache/CacheContainer";
function App() {
  return (
    <div className="App">
      <WithAuth>
        <RouterProvider router={router} />
      </WithAuth>
    </div>
  );
}

export default App;
