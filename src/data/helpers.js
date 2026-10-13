import { useCallback, useEffect, useState } from "react";
import { DEFAULT_VOLUME, FAVOURITES_KEY, LAST_SEARCH_KEY, VOLUME_KEY } from "./data";

/* ---------------------------------------------------------------------------
   Small helpers used by many components.
   localStorage can be blocked (private mode, strict settings),
   so every read/write is inside try/catch and the app keeps working.
--------------------------------------------------------------------------- */

const readJSON = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
};

const writeJSON = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage not available */
  }
};

/* ---------- Last search ---------- */

export const getLastSearch = () => {
  try {
    return localStorage.getItem(LAST_SEARCH_KEY) || "";
  } catch {
    return "";
  }
};

export const saveLastSearch = (text) => {
  try {
    localStorage.setItem(LAST_SEARCH_KEY, text);
  } catch {
    /* storage not available */
  }
};

/* ---------- Volume (number from 0 to 1) ---------- */

export const getVolume = () => {
  const v = readJSON(VOLUME_KEY, DEFAULT_VOLUME);
  return typeof v === "number" && v >= 0 && v <= 1 ? v : DEFAULT_VOLUME;
};

export const saveVolume = (v) => writeJSON(VOLUME_KEY, v);

/* ---------- Time format ---------- */

/** Turn seconds into "m:ss", for example 75 -> "1:15". */
export const formatDuration = (value) => {
  const safe = Number.isFinite(value) && value > 0 ? value : 0;
  const minute = Math.floor(safe / 60);
  const second = Math.floor(safe - minute * 60);
  return `${minute}:${second < 10 ? `0${second}` : second}`;
};

/* ---------- Favourites ---------- */

const FAVOURITES_EVENT = "bestmusic:favourites-change";

// Keep only the fields we need, so localStorage stays small.
const toFavourite = (song) => ({
  id: song.id,
  title: song.title,
  preview: song.preview,
  duration: song.duration,
  link: song.link,
  artist: { name: song.artist?.name },
  album: {
    title: song.album?.title,
    cover_medium: song.album?.cover_medium,
    cover_big: song.album?.cover_big,
  },
});

const readFavourites = () => {
  const list = readJSON(FAVOURITES_KEY, []);
  return Array.isArray(list) ? list : [];
};

/**
 * React hook for the favourites list.
 * Every component that uses it updates at the same time
 * (and even other open tabs, thanks to the "storage" event).
 */
export function useFavourites() {
  const [favourites, setFavourites] = useState(readFavourites);

  useEffect(() => {
    const sync = () => setFavourites(readFavourites());
    window.addEventListener(FAVOURITES_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(FAVOURITES_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const isFavourite = useCallback(
    (id) => favourites.some((song) => String(song.id) === String(id)),
    [favourites]
  );

  const toggleFavourite = useCallback((song) => {
    const current = readFavourites();
    const exists = current.some((s) => String(s.id) === String(song.id));
    const next = exists
      ? current.filter((s) => String(s.id) !== String(song.id))
      : [toFavourite(song), ...current];
    writeJSON(FAVOURITES_KEY, next);
    window.dispatchEvent(new Event(FAVOURITES_EVENT));
  }, []);

  return { favourites, isFavourite, toggleFavourite };
}
