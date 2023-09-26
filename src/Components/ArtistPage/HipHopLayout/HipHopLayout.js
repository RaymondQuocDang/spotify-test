import React from "react";
import LogSignIn from "../../Singup_login/Signup_login";
import Sidebar from "../../SideBar/Sidebar";
import ArtistPageHipHop from "../HipHopLayout/ArtistPageHipHop";

function HipHopLayout() {
  return (
    <div className="main-layout">
      <LogSignIn />
      <Sidebar />
      <ArtistPageHipHop />
    </div>
  );
}

export default HipHopLayout;
