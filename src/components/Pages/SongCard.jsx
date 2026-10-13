import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaPause, FaPlay, FaRegHeart } from "react-icons/fa";
import { formatDuration, getVolume, useFavourites } from "../../data/helpers";
import "./Music.css";

/**
 * Hook: play short previews directly from the song cards.
 * Only one preview plays at a time. Music stops when the page closes.
 */
export function usePreviewPlayer() {
  const [audio] = useState(() => new Audio());
  const [playingId, setPlayingId] = useState(null);

  useEffect(() => {
    const onEnd = () => setPlayingId(null);
    audio.addEventListener("ended", onEnd);
    return () => {
      audio.removeEventListener("ended", onEnd);
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    };
  }, [audio]);

  const togglePreview = useCallback(
    async (song) => {
      if (playingId === song.id) {
        audio.pause();
        setPlayingId(null);
        return;
      }
      audio.src = song.preview;
      audio.volume = getVolume();
      setPlayingId(song.id);
      try {
        await audio.play();
      } catch (err) {
        console.error("Could not play the preview:", err);
        setPlayingId(null);
      }
    },
    [audio, playingId]
  );

  return { playingId, togglePreview };
}

/** One song card. */
const SongCard = ({ song, queue, isPlaying, onTogglePreview, isFavourite, onToggleFavourite }) => (
  <li className={`musicclass${isPlaying ? " is-playing" : ""}`}>
    <div className="cardCover">
      <img src={song.album?.cover_medium} alt="" className="music-image" loading="lazy" />

      {song.preview && (
        <button
          type="button"
          className="cardPlay"
          onClick={() => onTogglePreview(song)}
          aria-label={`${isPlaying ? "Pause" : "Play"} preview of ${song.title}`}
        >
          {isPlaying ? <FaPause /> : <FaPlay className="playIcon" />}
        </button>
      )}

      {isPlaying && (
        <span className="eq" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
      )}
    </div>

    <div className="cardBody">
      <div className="cardText">
        <p className="musicTitle" title={song.title}>
          {song.title}
        </p>
        <p className="musicArtist">{song.artist?.name}</p>
      </div>
      <button
        type="button"
        className={`heartButton${isFavourite ? " is-active" : ""}`}
        onClick={() => onToggleFavourite(song)}
        aria-pressed={isFavourite}
        aria-label={isFavourite ? `Remove ${song.title} from favourites` : `Add ${song.title} to favourites`}
      >
        {isFavourite ? <FaHeart /> : <FaRegHeart />}
      </button>
    </div>

    <div className="cardFooter">
      <span className="cardDuration">{song.duration ? formatDuration(song.duration) : ""}</span>
      <Link to={`/music/${song.id}`} state={{ queue }} className="musicCard">
        Open player
      </Link>
    </div>
  </li>
);

/** A grid of song cards, with preview playback and favourites built in. */
export const SongList = ({ songs }) => {
  const { playingId, togglePreview } = usePreviewPlayer();
  const { isFavourite, toggleFavourite } = useFavourites();
  // The list of ids lets the player go to the previous / next song.
  const queue = songs.map((song) => song.id);

  return (
    <ul className="Musiccontain">
      {songs.map((song) => (
        <SongCard
          key={song.id}
          song={song}
          queue={queue}
          isPlaying={playingId === song.id}
          onTogglePreview={togglePreview}
          isFavourite={isFavourite(song.id)}
          onToggleFavourite={toggleFavourite}
        />
      ))}
    </ul>
  );
};

/** Grey animated cards shown while songs are loading. */
export const SongListSkeleton = ({ count = 10 }) => (
  <ul className="Musiccontain" aria-hidden="true">
    {Array.from({ length: count }, (_, i) => (
      <li key={i} className="musicclass skeletonCard">
        <div className="skeleton skeletonCover" />
        <div className="skeleton skeletonLine" />
        <div className="skeleton skeletonLine short" />
      </li>
    ))}
  </ul>
);

export default SongCard;
