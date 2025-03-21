import { StrictMode } from "react";
import "normalize.css";
import "./index.css";
import App from "./App.tsx";
import { HashRouter } from "react-router-dom";
import { ConfigProvider } from "antd";
import Cloud from "leancloud-storage";
import { Provider } from "react-redux";
import store from "./store/index.tsx";
import { createRoot } from "react-dom/client";

// leanCloud的SDK初始化，让SDK知道往哪里存文件
Cloud.init({
  appId: "JdIMW4DdKVBPUgJ6xhZBqVLG-gzGzoHsz",
  appKey: "ECrANK5WsVTbHGCHd2wKLp1M",
  serverURL: "https://jdimw4dd.lc-cn-n1-shared.com",
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <HashRouter>
        <ConfigProvider
          theme={{
            token: {
              // Seed Token，影响范围大
              colorPrimary: "#6E48C2",
              borderRadius: 2,

              // 派生变量，影响范围小
              // colorBgContainer: "#f6ffed",
            },
          }}
        >
          <App />
        </ConfigProvider>
      </HashRouter>
    </Provider>
  </StrictMode>
);
