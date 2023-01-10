import React, { useState } from "react";
import Sidebar from "../../partials/Sidebar";
import Header from "../../partials/Header";
import WelcomeBanner from "../../partials/dashboard/WelcomeBanner";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { ToastContainer } from "react-toastify";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const token = useSelector((state) => state.auth.token);
  const router = useRouter();

  if (!token) {
    if (router.pathname !== "/login") {
      router.push("/login");
      return <></>;
    }
    return (
      <>
        {children}
        <ToastContainer />
      </>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden font-[Lato]">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main>
          <div className="py-2 w-full max-w-9xl mx-auto">
            {/* Welcome banner */}
            {router.pathname === "/" ? <WelcomeBanner /> : ""}
            {children}
          </div>
        </main>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Layout;
