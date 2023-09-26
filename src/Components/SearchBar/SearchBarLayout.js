import React from "react";
import Sidebar from "../SideBar/Sidebar";
import SearchBarResults from "./SearchBarResults";

function SearchBarLayout({ searchResults, config, select_option }) {
  return (
    <div className="main-layout">
      <Sidebar />
      <SearchBarResults
        searchResults={searchResults}
        config={config}
        select_option={select_option}
      />
    </div>
  );
}

export default SearchBarLayout;
