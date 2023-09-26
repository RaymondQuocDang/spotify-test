import React from "react";
import Randomizer from "./Randomizer";
import Sidebar from "../SideBar/Sidebar";
import LogSignIn from "../Singup_login/Signup_login";

function RandomizerLayout() {
  return (
    <div className="d-flex">
      <LogSignIn />
      <Sidebar />
      <div className="background_color_gradient">
        <Randomizer />
      </div>
    </div>
  );
}

export default RandomizerLayout;
