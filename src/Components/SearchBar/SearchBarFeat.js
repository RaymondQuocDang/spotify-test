import React, { useState } from "react";
import axios from "axios";

function SearchBarFeat({ setSearchResults, setConfig }) {
  const [selectedOption, setSelectedOption] = useState("artist");
  const [searchQuery, setSearchQuery] = useState("");

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchClick = async () => {
    const response = await axios.get(
      `https://simple-spotify.onrender.com/${selectedOption.toLowerCase()}?${selectedOption}_name=${searchQuery}`
    );
    setSearchResults(response.data);
    setConfig(selectedOption);
  };

  return (
    <div className="containerStyle">
      <select
        className="selectStyle"
        value={selectedOption}
        onChange={handleOptionChange}
      >
        <option value="artist">Artist</option>
        <option value="album">Album</option>
        <option value="song">Song</option>
      </select>
      <input
        className="inputStyle"
        type="text"
        placeholder="Search"
        aria-label="Search"
        onChange={handleSearchChange}
      />
      <button className="buttonStyle" type="button" onClick={handleSearchClick}>
        Search
      </button>
    </div>
  );
}

export default SearchBarFeat;
