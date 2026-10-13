import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { DEEZER_SEARCH_URL, RAPIDAPI_HEADERS } from "../../data/data";
import { saveLastSearch } from "../../data/helpers";
import { SongList, SongListSkeleton } from "./SongCard";
import "./Music.css";

/**
 * Search results page (/musics/:id).
 * ":id" is the song name the user typed. We ask Deezer for matching
 * songs and show them as cards.
 */
const Musics = () => {
  const { id } = useParams();
  const [tapa, setTapa] = useState([]); // list of songs from Deezer
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0); // change this number to load again

  useEffect(() => {
    // Remember this search, so the "Last search" link in the header can come back here.
    saveLastSearch(id);
    document.title = `${id} · Best Music`;

    // Cancel the request if the user leaves the page or searches again.
    const controller = new AbortController();

    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await axios.get(DEEZER_SEARCH_URL, {
          params: { q: id },
          headers: RAPIDAPI_HEADERS,
          signal: controller.signal,
        });
        setTapa(Array.isArray(data?.data) ? data.data : []);
      } catch (err) {
        if (axios.isCancel(err)) return;
        console.error("Search failed:", err);
        setTapa([]);
        setError("We could not load the songs. Please check your internet connection or API key.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    fetchData();
    return () => controller.abort();
  }, [id, retry]);

  const hasResults = !loading && !error && tapa.length > 0;

  return (
    <div className="page">
      <div className="pageInner">
        <header className="pageHeader">
          <p className="eyebrow">Search results</p>
          <h1 className="pageTitle">“{id}”</h1>
          {hasResults && (
            <p className="pageSub">
              {tapa.length} songs · press ▶ on a cover to hear a preview
            </p>
          )}
        </header>

        {loading && <SongListSkeleton />}

        {!loading && error && (
          <div className="statusBox" role="alert">
            <span className="statusIcon" aria-hidden="true">⚠️</span>
            <p>{error}</p>
            <button type="button" className="btn" onClick={() => setRetry((n) => n + 1)}>
              Try again
            </button>
          </div>
        )}

        {!loading && !error && tapa.length === 0 && (
          <div className="statusBox">
            <span className="statusIcon" aria-hidden="true">🔍</span>
            <p>No songs found for “{id}”. Check the spelling or try another name.</p>
            <Link to="/" className="btn btn--ghost">
              Back to search
            </Link>
          </div>
        )}

        {hasResults && <SongList songs={tapa} />}
      </div>
    </div>
  );
};

export default Musics;
