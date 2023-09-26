import React from "react";
import { Link, useLocation } from "react-router-dom";
import spotifyImg from "../../Icons/spotifylogo.png";
import houseImg from "../../Icons/houseimg.png";
import magGlass from "../../Icons/magnifyingGlass.png";
import shuffle from "../../Icons/shuffle.png";

function Sidebar() {
  const changeCSS = useLocation();

  const CssChange = changeCSS.pathname === "/ArtistPageHipHop";

  return (
    <div className={`Sidebar ${CssChange ? "HomePage" : ""} list`}>
      <ul className="unorderedList">
        <li>
          <img src={spotifyImg} className="btnSizeOne" alt="Sidebar_img" />
        </li>
        <li>
          <Link to="/">
            <div className="option">
              <img src={houseImg} className="btnSizeTwo" alt="house_img" />
              <p className="text-white">Home</p>
            </div>
          </Link>
        </li>
        <li>
          <Link to="/searchbar">
            <div className="option">
              <img src={magGlass} className="btnSizeTwo" alt="MagGlass_img" />
              <p className="text-white">Search</p>
            </div>
          </Link>
        </li>
        <li>
          <Link to="/randomizer">
            <div className="option">
              <img src={shuffle} className="btnSizeTwo" alt="Shuffle_img" />
              <p className="text-white ml-2">Randomizer</p>
            </div>
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
