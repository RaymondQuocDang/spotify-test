import React, { useState, useEffect } from "react";
import axios from "axios";
import SongList from "../SongList/SongList";
import { Card, Button } from "react-bootstrap";

function ArtistList({ genrelists }) {
  const [cards, setCards] = useState(genrelists);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await axios.get("/songs");
        setCards(response.data);
      } catch (error) {
        console.error("Failed to fetch songs:", error);
      }
    };

    fetchSongs();
  }, []);

  const handleSongClick = async (songId) => {
    try {
      const response = await axios.get(`/songs/${songId}`);
      const spotifyLink = response.data.spotifyLink;
      window.open(spotifyLink, "_blank");
    } catch (error) {
      console.error("Failed to fetch Spotify link:", error);
    }
  };

  return (
    <div className="background_color_gradient">
      <div className="word_layout">
        <p className="word_layout_genre">Artists</p>
      </div>
      <div
        className="table_layout"
        onClick={() => handleSongClick(cards.songId)}
      >
        {cards.map((card, index) => (
          <Card
            key={index}
            style={{ display: "flex", flexDirection: "row", width: "100%" }}
            className={`card_layout_bgcolor ${
              card.isHovered ? "lightened" : ""
            }`}
            onMouseEnter={() =>
              setCards(
                cards.map((c, i) =>
                  i === index ? { ...c, isHovered: true } : c
                )
              )
            }
            onMouseLeave={() =>
              setCards(
                cards.map((c, i) =>
                  i === index ? { ...c, isHovered: false } : c
                )
              )
            }
          >
            <Card.Img
              variant="left"
              src={card.image}
              style={{ width: "150px", objectFit: "cover" }}
            />
            <Card.Body style={{ flex: 1 }}>
              <Card.Title>{card.name}</Card.Title>
              <Card.Text>
                Popularity: {card.popularity}, Followers: {card.followers}
              </Card.Text>
            </Card.Body>
            <Button style={{ alignSelf: "center", marginRight: "10px" }}>
              Song Name
            </Button>
          </Card>
        ))}
      </div>
      {cards && <SongList songlists={cards} />}
    </div>
  );
}

export default ArtistList;
