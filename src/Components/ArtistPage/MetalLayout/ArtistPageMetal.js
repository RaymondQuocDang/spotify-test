import React from "react";
import { useState, useEffect } from "react";
import { Card } from "react-bootstrap";
import axios from "axios";
import playbtn from "../../../Icons/play-button.png";
import Metallica from "../../../Images/Metallica.jpg";
import Gojira from "../../../Images/Gojira.jpg";
import Korn from "../../../Images/Korn.jpg";
import Vildhjarta from "../../../Images/Vildhjarta.jpg";

function ArtistPageMetal() {
  const [singers, setSingers] = useState([
    {
      id: 1,
      isHovered: false,
      image: Metallica,
      name: "Metallica",
      hoverImage: playbtn,
    },
    {
      id: 2,
      isHovered: false,
      image: Gojira,
      name: "Gojira",
      hoverImage: playbtn,
    },
    {
      id: 3,
      isHovered: false,
      image: Korn,
      name: "Korn",
      hoverImage: playbtn,
    },
    {
      id: 4,
      isHovered: false,
      image: Vildhjarta,
      name: "Vildhjarta",
      hoverImage: playbtn,
    },
  ]);

  const [artistDetails, setArtistDetails] = useState({});
  const [selectedArtist, setSelectedArtist] = useState(null);

  useEffect(() => {
    if (!selectedArtist) return;
    const getData = async () => {
      const response = await axios.get(
        `https://simple-spotify.onrender.com/artist?artist_name=${selectedArtist}`
      );
      setArtistDetails(response.data);
      setSelectedArtist(null);
    };

    getData();
  }, [selectedArtist]);

  const handleOnClick = (artist_name) => {
    setSelectedArtist(artist_name);
  };

  return (
    <div className="background_color_gradient">
      <div className="word_layout">
        <p className="word_layout_genre">Metal</p>
      </div>
      <div className="card_layout">
        {singers.map((singer) => (
          <Card
            key={singer.id}
            style={{ width: "18rem" }}
            className="card_layout_bgcolor"
            onMouseEnter={() =>
              setSingers(
                singers.map((c) =>
                  c.id === singer.id ? { ...c, isHovered: true } : c
                )
              )
            }
            onMouseLeave={() =>
              setSingers(
                singers.map((c) =>
                  c.id === singer.id ? { ...c, isHovered: false } : c
                )
              )
            }
            onClick={() => handleOnClick(singer.name)}
          >
            <div className="image-container">
              <div className={`base-image ${singer.isHovered ? "dimmed" : ""}`}>
                <Card.Img
                  variant="bottom"
                  src={singer.image}
                  className="card_img_genre"
                />
              </div>
              {singer.isHovered && (
                <div className="overlay-image">
                  <Card.Img
                    variant="top"
                    src={singer.hoverImage}
                    className="hover-image"
                  />
                </div>
              )}
            </div>
            <Card.Body>
              <Card.Title style={{ justifyContent: "center", color: "white" }}>
                {singer.name}
              </Card.Title>
            </Card.Body>
          </Card>
        ))}
      </div>
      <div>
        <li>
          <a
            href={
              (artistDetails.artist_page &&
                artistDetails.artist_page.artist_page) ??
              "#"
            }
            target="_blank"
            rel="noopener noreferrer"
          >
            <ul className="d-flex flex-row">
              <img
                className="top_track_image_size"
                style={{ marginRight: "2%", marginLeft: "2%" }}
                src={
                  (artistDetails.top_track &&
                    artistDetails.top_track.track_image) ??
                  ""
                }
                alt="top_track_img_Metal"
              />
              <p className="d-flex align-items-center mt-1, text-white">
                {(artistDetails.top_track &&
                  artistDetails.top_track.track_name) ??
                  ""}
              </p>
            </ul>
          </a>
        </li>
      </div>
    </div>
  );
}

export default ArtistPageMetal;
