import React from "react";
import Sidebar from "../SideBar/Sidebar";
import Musicbar from "../MusicList/MusicBar";

function Layout() {
  return (
    <div className="main-layout">
      <Sidebar />
      <Musicbar />
    </div>
  );
}

export default Layout;
