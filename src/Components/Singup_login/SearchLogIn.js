import React from "react";
import LogSignIn from "../Singup_login/Signup_login";
import SearchBarFeat from "../SearchBar/SearchBarFeat";

function LoginSearchBar({ setSearchResults, setConfig }) {
  return (
    <>
      <SearchBarFeat
        setSearchResults={setSearchResults}
        setConfig={setConfig}
      />
      <LogSignIn />
    </>
  );
}

export default LoginSearchBar;
