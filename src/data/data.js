// Navigation links shown in the header.
export const navigationLinks = [
  { title: "Home", slug: "/" },
  { title: "Favourites", slug: "/favourites" },
];

// Quick search ideas shown under the search box on the home page.
export const SEARCH_SUGGESTIONS = ["Adele", "Coldplay", "Daft Punk", "Billie Eilish", "Queen", "Burna Boy"];

// ---------------------------------------------------------------------------
// Deezer API (through RapidAPI)
// All API settings live here, so every page uses the same values.
// The key is read from the .env file (see .env.example and README.md).
// ---------------------------------------------------------------------------
export const DEEZER_API_BASE = "https://deezerdevs-deezer.p.rapidapi.com";
export const DEEZER_SEARCH_URL = `${DEEZER_API_BASE}/search`;
export const DEEZER_TRACK_URL = `${DEEZER_API_BASE}/track`;

export const RAPIDAPI_HEADERS = {
  "X-RapidAPI-Key": import.meta.env.VITE_RAPIDAPI_KEY,
  "X-RapidAPI-Host": "deezerdevs-deezer.p.rapidapi.com",
};

// ---------------------------------------------------------------------------
// Things we save in the browser (localStorage)
// ---------------------------------------------------------------------------
export const LAST_SEARCH_KEY = "id"; // last search word
export const FAVOURITES_KEY = "bestmusic:favourites"; // list of saved songs
export const VOLUME_KEY = "bestmusic:volume"; // player volume (0 to 1)

export const DEFAULT_VOLUME = 0.6;

// Deezer previews are 30 seconds long.
export const PREVIEW_LENGTH_SECONDS = 30;
