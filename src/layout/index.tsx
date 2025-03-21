import React from "react";
import { Layout } from "antd";
import SideMenu from "./components/SideMenu";
import AppHeader from "./components/AppHeader";
import AppMain from "./components/AppMain";
import AppFooter from "./components/AppFooter";

const MainLayout: React.FC = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <SideMenu />
      <Layout>
        <AppHeader />
        <AppMain />
        <AppFooter />
      </Layout>
    </Layout>
  );
};

export default MainLayout;
