import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card } from "react-bootstrap";

function SongList({ songslists }) {
  const [songs, setSongs] = useState(songslists || []);

  useEffect(() => {
    if (songslists) return;

    const fetchData = async () => {
      const response = await axios.post("/songs");
      const songsWithHover = response.data.map((song) => ({
        ...song,
        isHovered: false,
      }));
      setSongs(songsWithHover);
    };

    fetchData();
  }, [songslists]);

  return (
    <div className="background_color_gradient">
      <div className="word_layout">
        <p className="word_layout_genre">Songs</p>
      </div>
      <div className="card_layout">
        {songs.map((song, index) => (
          <Card
            key={index}
            style={{ width: "18rem" }}
            className="card_layout_bgcolor"
            onMouseEnter={() =>
              setSongs(
                songs.map((s, i) =>
                  i === index ? { ...s, isHovered: true } : s
                )
              )
            }
            onMouseLeave={() =>
              setSongs(
                songs.map((s, i) =>
                  i === index ? { ...s, isHovered: false } : s
                )
              )
            }
          >
            <div
              className={`image-container ${song.isHovered ? "dimmed" : ""}`}
            >
              <Card.Img
                variant="top"
                src={song.image}
                className="card_img_genre"
              />
            </div>
            <Card.Body>
              <Card.Title style={{ justifyContent: "center", color: "white" }}>
                {song.name}
              </Card.Title>
              <Card.Text className="text_alter">
                Artist: {song.artist}
              </Card.Text>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default SongList;
