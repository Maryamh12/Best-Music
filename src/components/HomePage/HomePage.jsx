import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { SEARCH_SUGGESTIONS } from "../../data/data";
import "./homepage.css";

const BACKGROUND_VIDEO =
  "https://videos.pexels.com/video-files/2112426/2112426-sd_640_360_30fps.mp4";

/**
 * Home page: video background, big title, search box and quick suggestions.
 * When the user searches, we go to /musics/<song name>.
 */
const HomePage = () => {
  const [formData, setFormData] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Best Music";
  }, []);

  const onChange = (e) => {
    setFormData(e.target.value);
    setErrorMessage("");
  };

  // Runs when the user clicks "Search" or presses Enter.
  const handleSubmit = (e) => {
    e.preventDefault();
    const songName = formData.trim();

    if (!songName) {
      setErrorMessage("Please enter the name of your song");
      return;
    }

    navigate(`/musics/${encodeURIComponent(songName)}`);
  };

  return (
    <section id="hpage">
      <video
        id="video-background"
        src={BACKGROUND_VIDEO}
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      />
      <div className="heroOverlay" aria-hidden="true" />

      <div className="heroContent">
        <p className="eyebrow">Free 30-second previews</p>
        <h1 className="heroTitle">
          Find the song <span>stuck in your head.</span>
        </h1>
        <p className="heroText">
          Search millions of songs, listen to a preview in one click, and save the ones you love.
        </p>

        <form className="searchForm" onSubmit={handleSubmit} role="search">
          <FaSearch className="searchIcon" aria-hidden="true" />
          <input
            className="inputsign"
            type="text"
            value={formData}
            placeholder="Song name or artist"
            aria-label="Song name or artist"
            onChange={onChange}
            autoFocus
          />
          <button className="buttonsign" type="submit">
            Search
          </button>
        </form>

        {errorMessage && (
          <p className="formError" role="alert">
            {errorMessage}
          </p>
        )}

        <div className="suggestions">
          <span>Try:</span>
          {SEARCH_SUGGESTIONS.map((name) => (
            <Link key={name} to={`/musics/${encodeURIComponent(name)}`} className="chip">
              {name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomePage;
