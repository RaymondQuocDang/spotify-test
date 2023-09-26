import React from "react";
import LogSignIn from "../../Singup_login/Signup_login";
import Sidebar from "../../SideBar/Sidebar";
import ArtistPagePop from "./ArtistPagePop";

function PopLayout() {
  return (
    <div className="main-layout">
      <LogSignIn />
      <Sidebar />
      <ArtistPagePop />
    </div>
  );
}

export default PopLayout;
