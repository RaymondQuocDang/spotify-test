import React from "react";
import ArtistPageHipHop from "./ArtistPageHipHop";
import ArtistPageJazz from "./ArtistPageJazz";
import ArtistPageMetal from "./ArtistPageMetal";
import ArtistPagePop from "./ArtistPagePop";

function ArtistPageLayout() {
  return (
    <div>
      <ArtistPageHipHop />
      <ArtistPageJazz />
      <ArtistPageMetal />
      <ArtistPagePop />
    </div>
  );
}

export default ArtistPageLayout;
