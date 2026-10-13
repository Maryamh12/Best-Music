import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useFavourites } from "../../data/helpers";
import { SongList } from "./SongCard";
import "./Music.css";

/**
 * Favourites page (/favourites).
 * Shows the songs the user saved with the heart button.
 * They are saved in the browser, so they stay after closing the tab.
 */
const Favourites = () => {
  const { favourites } = useFavourites();

  useEffect(() => {
    document.title = "Favourites · Best Music";
  }, []);

  return (
    <div className="page">
      <div className="pageInner">
        <header className="pageHeader">
          <p className="eyebrow">Your library</p>
          <h1 className="pageTitle">Favourites</h1>
          {favourites.length > 0 && (
            <p className="pageSub">
              {favourites.length} saved {favourites.length === 1 ? "song" : "songs"}
            </p>
          )}
        </header>

        {favourites.length === 0 ? (
          <div className="statusBox">
            <span className="statusIcon" aria-hidden="true">♡</span>
            <p>No favourites yet. Tap the heart on any song to save it here.</p>
            <Link to="/" className="btn">
              Find music
            </Link>
          </div>
        ) : (
          <SongList songs={favourites} />
        )}
      </div>
    </div>
  );
};

export default Favourites;
