import React, { useState } from "react";
import SearchBarLayout from "./SearchBarLayout";
import LoginSearchBar from "../Singup_login/SearchLogIn";

function SearchBar() {
  const [searchResults, setSearchResults] = useState(null);
  const [config, setConfig] = useState(null);
  const OPTION_CONFIG = {
    artist: {
      titleField: "name",
      imageField: "image",
      linkField: "artist_page",
    },
    song: {
      titleField: "name",
      imageField: "image",
      linkField: "song_page",
    },
    album: {
      titleField: "name",
      imageField: "image",
      linkField: "album_page",
    },
  };

  return (
    <div className="background_color_gradient">
      <LoginSearchBar
        setSearchResults={setSearchResults}
        setConfig={setConfig}
      />
      <SearchBarLayout
        searchResults={searchResults}
        config={config}
        select_option={OPTION_CONFIG[config]}
      />
    </div>
  );
}

export default SearchBar;
