import React from "react";
import LogSignIn from "../../Singup_login/Signup_login";
import Sidebar from "../../SideBar/Sidebar";
import ArtistPageMetal from "./ArtistPageMetal";

function MetalLayout() {
  return (
    <div className="main-layout">
      <LogSignIn />
      <Sidebar />
      <ArtistPageMetal />
    </div>
  );
}

export default MetalLayout;
