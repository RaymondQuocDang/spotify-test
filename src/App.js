import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Components/Singup_login/Login.css";
import "./Components/SideBar/SideBar.css";
import "./Components/Layout/Layout.css";
import "./Components/MusicList/MusicBar.css";
import "./Components/SearchBar/SearchBar.css";
import "./Components/Randomizer/Randomizer.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./Components/HomePage";
import RandomizerLayout from "./Components/Randomizer/RandomizerLayout";
import HipHopLayout from "./Components/ArtistPage/HipHopLayout/HipHopLayout";
import JazzLayout from "./Components/ArtistPage/JazzLayout/JazzLayout";
import MetalLayout from "./Components/ArtistPage/MetalLayout/MetalLayout";
import PopLayout from "./Components/ArtistPage/PopLayout/PopLayout";
import SearchBar from "./Components/SearchBar/SearchBar";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} index />
        <Route path="/searchbar" element={<SearchBar />} />
        <Route path="/Randomizer" element={<RandomizerLayout />} />
        <Route path="HipHopLayout" element={<HipHopLayout />} />
        <Route path="JazzLayout" element={<JazzLayout />} />
        <Route path="MetalLayout" element={<MetalLayout />} />
        <Route path="PopLayout" element={<PopLayout />} />
      </Routes>
    </Router>
  );
}

export default App;
