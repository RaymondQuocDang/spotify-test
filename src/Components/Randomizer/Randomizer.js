import React, { useState, useEffect } from "react";
import { Card, Alert, Spinner } from "react-bootstrap";
import playbtn from "../../Icons/play-button.png";
import axios from "axios";

function Randomizer() {
  const [cards, setCards] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Component mounted");
    setLoading(true);
    axios
      .get("https://simple-spotify.onrender.com/randomArtists")
      .then((response) => {
        console.log("Component will unmount");
        const data = response.data.map((item, index) => {
          return {
            id: item.id || index, // Use ID from data or fallback to index
            name: item.response_name,
            picture: item.response_image,
            Link: item.response_link,
            hoverImage: playbtn, // assuming you have hoverImage in data
            isHovered: false,
          };
        });
        setCards(data);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleCardClick = (id) => {
    // Here you can make another axios call to get the song related to the clicked artist
    // and then set that song to the selectedSong state
    // For now, I'll just set the id as the selected song
    setSelectedSong(id);
  };

  if (isLoading) {
    return <Spinner animation="border" className="loadingCSS" />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <div className="card_layout_randomizer">
      {cards.map((data) => (
        <Card
          key={data.id}
          onClick={() => handleCardClick(data.id)} // a function that handles card click
          style={{ width: "15rem" }}
          className="card_layout_bgcolor"
          onMouseEnter={() =>
            setCards(
              cards.map((c) =>
                c.id === data.id ? { ...c, isHovered: true } : c
              )
            )
          }
          onMouseLeave={() =>
            setCards(
              cards.map((c) =>
                c.id === data.id ? { ...c, isHovered: false } : c
              )
            )
          }
        >
          <a
            href={data.Link}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none" }}
          >
            <div className="image-container">
              <div className={`base-image ${data.isHovered ? "dimmed" : ""}`}>
                <Card.Img
                  variant="bottom"
                  src={data.picture}
                  className="card_img_genre"
                />
              </div>
              {data.isHovered && (
                <div className="overlay-image">
                  <Card.Img
                    variant="top"
                    src={data.hoverImage}
                    className="hover-image"
                  />
                </div>
              )}
            </div>
            <Card.Body className="card-body-layout">
              <Card.Title style={{ justifyContent: "center", color: "white" }}>
                {data.name}
              </Card.Title>
            </Card.Body>
          </a>
        </Card>
      ))}
      {selectedSong && <div>Selected song ID: {selectedSong}</div>}
    </div>
  );
}

export default Randomizer;
