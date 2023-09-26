import React from "react";
import LogSignIn from "../../Singup_login/Signup_login";
import Sidebar from "../../SideBar/Sidebar";
import ArtistPageJazz from "./ArtistPageJazz";

function JazzLayout() {
  return (
    <div className="main-layout">
      <LogSignIn />
      <Sidebar />
      <ArtistPageJazz />
    </div>
  );
}

export default JazzLayout;
