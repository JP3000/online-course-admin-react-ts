import React, { useEffect, useState } from "react";
import MainLayout from "./layout";
import { Routes, Route } from "react-router-dom";
import Login from "./views/Login";
import "./App.css";
import { IMenuType } from "./router/inter";
import mainRoutes from "./router";
import RequireAuth from "./auth/RequireAuth";

function App() {
  const [realRoutes, setRealRoutes] = useState<Array<IMenuType>>([]); // 存放整理后的路由数据包

  useEffect(() => {
    let arr: IMenuType[] = [];
    mainRoutes.forEach((item) => {
      if (item.children) {
        // 有children，将数组展开，将子路由融入
        arr = [...arr, ...item.children];
      } else {
        arr.push(item);
      }
    });
    setRealRoutes(arr);
  }, []);

  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={
            <RequireAuth>
              <MainLayout />
            </RequireAuth>
          }
        >
          {realRoutes.map((item) => {
            return (
              <Route
                key={item.key}
                path={item.key}
                element={item.element}
              ></Route>
            );
          })}
        </Route>
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
