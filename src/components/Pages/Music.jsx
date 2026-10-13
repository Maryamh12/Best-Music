import * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Slider from "@mui/material/Slider";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import PauseRounded from "@mui/icons-material/PauseRounded";
import PlayArrowRounded from "@mui/icons-material/PlayArrowRounded";
import SkipNextRounded from "@mui/icons-material/SkipNextRounded";
import SkipPreviousRounded from "@mui/icons-material/SkipPreviousRounded";
import VolumeUpRounded from "@mui/icons-material/VolumeUpRounded";
import VolumeDownRounded from "@mui/icons-material/VolumeDownRounded";
import VolumeOffRounded from "@mui/icons-material/VolumeOffRounded";
import FavoriteRounded from "@mui/icons-material/FavoriteRounded";
import FavoriteBorderRounded from "@mui/icons-material/FavoriteBorderRounded";
import ArrowBackRounded from "@mui/icons-material/ArrowBackRounded";
import { DEEZER_TRACK_URL, PREVIEW_LENGTH_SECONDS, RAPIDAPI_HEADERS } from "../../data/data";
import { formatDuration, getVolume, saveVolume, useFavourites } from "../../data/helpers";
import "./Music.css";

// How many seconds the arrow keys skip.
const SEEK_STEP = 5;

// ---------- Styled parts of the player card ----------

const Widget = styled("div")(({ theme }) => ({
  padding: 28,
  borderRadius: 24,
  width: "100%",
  margin: "auto",
  position: "relative",
  zIndex: 1,
  backgroundColor: "rgba(18, 20, 26, 0.72)",
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "0 30px 80px rgba(0,0,0,0.45)",
  backdropFilter: "blur(30px)",
  [theme.breakpoints.down("sm")]: {
    padding: 18,
    borderRadius: 20,
  },
}));

const CoverImage = styled("div")({
  width: "100%",
  aspectRatio: "1 / 1",
  overflow: "hidden",
  borderRadius: 16,
  backgroundColor: "rgba(255,255,255,0.06)",
  boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
  transition: "transform 0.5s ease",
  "&.is-playing": {
    transform: "scale(1.02)",
  },
  "& > img": {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
});

const TinyText = styled(Typography)({
  fontSize: "0.75rem",
  opacity: 0.5,
  fontWeight: 500,
  letterSpacing: 0.2,
  fontVariantNumeric: "tabular-nums",
});

/** Is the user typing in a field or using a control? Then keyboard shortcuts must not run. */
const isInteractive = (el) =>
  el instanceof Element && !!el.closest("input, textarea, select, button, a, [role='slider']");

/**
 * Player page (/music/:id).
 * ":id" is the Deezer track id. We load the song and play its 30-second preview.
 * If the user came from a list, they can go to the previous / next song.
 */
const Music = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const { isFavourite, toggleFavourite } = useFavourites();

  // One Audio object for the whole life of this page.
  const [audio] = useState(() => new Audio());

  const [tapa, setTapa] = useState(null); // song information from Deezer
  const [position, setPosition] = useState(0); // current time in seconds
  const [duration, setDuration] = useState(PREVIEW_LENGTH_SECONDS);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(getVolume); // 0 to 1, remembered
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  // ---------- Previous / next song ----------
  const queue = Array.isArray(location.state?.queue) ? location.state.queue : [];
  const index = queue.findIndex((trackId) => String(trackId) === String(id));
  const prevId = index > 0 ? queue[index - 1] : null;
  const nextId = index >= 0 && index < queue.length - 1 ? queue[index + 1] : null;

  const goTo = useCallback(
    (trackId) => navigate(`/music/${trackId}`, { state: { queue, autoplay: true }, replace: true }),
    [navigate, queue]
  );

  // Refs give the audio events the newest values without re-adding the listeners.
  const autoplayRef = useRef(false);
  autoplayRef.current = Boolean(location.state?.autoplay);
  const nextRef = useRef(null);
  nextRef.current = nextId ? () => goTo(nextId) : null;

  // 1) Load the song every time the id in the URL changes.
  useEffect(() => {
    const controller = new AbortController();

    // Reset the player for the new song.
    audio.pause();
    setPosition(0);
    setDuration(PREVIEW_LENGTH_SECONDS);

    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await axios.get(`${DEEZER_TRACK_URL}/${id}`, {
          headers: RAPIDAPI_HEADERS,
          signal: controller.signal,
        });

        if (!data || data.error || !data.preview) {
          throw new Error("This song has no preview.");
        }

        setTapa(data);
        document.title = `${data.title} · ${data.artist?.name ?? ""} · Best Music`;
        audio.src = data.preview;

        // Coming from "next" / "previous" or the end of a song: start playing.
        if (autoplayRef.current) {
          audio.play().catch(() => {
            /* the browser blocked autoplay - the user can press play */
          });
        }
      } catch (err) {
        if (axios.isCancel(err)) return;
        console.error("Could not load the song:", err);
        setTapa(null);
        setError("We could not load this song. It may have no preview, or the connection failed.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    fetchData();
    return () => controller.abort();
  }, [id, audio, retry]);

  // 2) Listen to the audio element and keep React state in sync with it.
  useEffect(() => {
    const onTime = () => setPosition(audio.currentTime);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onMeta = () => {
      if (Number.isFinite(audio.duration) && audio.duration > 0) setDuration(audio.duration);
    };
    const onEnd = () => {
      setIsPlaying(false);
      if (nextRef.current) {
        nextRef.current(); // go to the next song automatically
      } else {
        audio.currentTime = 0;
        setPosition(0);
      }
    };

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("ended", onEnd);

    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("ended", onEnd);
    };
  }, [audio]);

  // 3) Apply and remember the volume.
  useEffect(() => {
    audio.volume = volume;
    saveVolume(volume);
  }, [audio, volume]);

  // 4) Stop the music when the user leaves this page.
  useEffect(() => {
    return () => {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    };
  }, [audio]);

  const togglePlay = useCallback(async () => {
    if (!audio.paused) {
      audio.pause();
      return;
    }
    try {
      await audio.play();
    } catch (err) {
      console.error("Could not play the audio:", err);
    }
  }, [audio]);

  const seekTo = useCallback(
    (value) => {
      const time = Math.min(Math.max(value, 0), duration);
      audio.currentTime = time;
      setPosition(time);
    },
    [audio, duration]
  );

  // 5) Keyboard shortcuts: Space = play/pause, ← / → = skip 5 seconds.
  useEffect(() => {
    const onKey = (e) => {
      if (!tapa || isInteractive(e.target) || e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.code === "Space") {
        e.preventDefault();
        togglePlay();
      } else if (e.key === "ArrowRight") {
        seekTo(audio.currentTime + SEEK_STEP);
      } else if (e.key === "ArrowLeft") {
        seekTo(audio.currentTime - SEEK_STEP);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [audio, tapa, togglePlay, seekTo]);

  const accent = theme.palette.primary.main;
  const favourite = tapa ? isFavourite(tapa.id) : false;
  const cover = tapa?.album?.cover_big;

  return (
    <div className="pageMusic" style={cover ? { "--cover": `url("${cover}")` } : undefined}>
      <div className="playerTop">
        <button type="button" className="backLink" onClick={() => (location.key === "default" ? navigate("/") : navigate(-1))}>
          <ArrowBackRounded fontSize="small" /> Back
        </button>
      </div>

      <Box id="widgetPage">
        <Widget>
          {loading && (
            <div className="playerLayout" aria-busy="true" aria-label="Loading song">
              <div className="skeleton skeletonCover" />
              <div>
                <div className="skeleton skeletonLine" style={{ height: 28, width: "70%" }} />
                <div className="skeleton skeletonLine short" />
                <div className="skeleton skeletonLine" style={{ marginTop: 40 }} />
              </div>
            </div>
          )}

          {!loading && error && (
            <div className="playerError" role="alert">
              <p>{error}</p>
              <div className="playerErrorActions">
                <button type="button" className="btn" onClick={() => setRetry((n) => n + 1)}>
                  Try again
                </button>
                <Link to="/" className="btn btn--ghost">
                  New search
                </Link>
              </div>
            </div>
          )}

          {!loading && !error && tapa && (
            <div className="playerLayout">
              <CoverImage className={isPlaying ? "is-playing" : ""}>
                <img alt={`${tapa.album?.title ?? tapa.title} album cover`} src={cover} />
              </CoverImage>

              <div className="playerInfo">
                <div className="playerHeading">
                  <div className="playerText">
                    <p className="eyebrow">{isPlaying ? "Now playing" : "Preview"}</p>
                    <h1 className="playerTitle">{tapa.title}</h1>
                    <p className="playerArtist">
                      {tapa.artist?.name}
                      {tapa.album?.title && <span> · {tapa.album.title}</span>}
                    </p>
                  </div>
                  <IconButton
                    onClick={() => toggleFavourite(tapa)}
                    aria-pressed={favourite}
                    aria-label={favourite ? "Remove from favourites" : "Add to favourites"}
                    sx={{ color: favourite ? "#ff5c8a" : "rgba(255,255,255,0.6)", mt: 1 }}
                  >
                    {favourite ? <FavoriteRounded /> : <FavoriteBorderRounded />}
                  </IconButton>
                </div>

                {/* Time slider */}
                <Slider
                  aria-label="Song position"
                  size="small"
                  value={Math.min(position, duration)}
                  min={0}
                  step={0.1}
                  max={duration}
                  onChange={(_, value) => seekTo(value)}
                  sx={{
                    color: accent,
                    height: 4,
                    mt: 2,
                    "& .MuiSlider-thumb": {
                      width: 12,
                      height: 12,
                      transition: "0.3s cubic-bezier(.47,1.64,.41,.8)",
                      "&:hover, &.Mui-focusVisible": {
                        boxShadow: "0px 0px 0px 8px rgba(255,176,32,0.16)",
                      },
                      "&.Mui-active": { width: 20, height: 20 },
                    },
                    "& .MuiSlider-rail": { opacity: 0.25, color: "#fff" },
                  }}
                />
                <Box sx={{ display: "flex", justifyContent: "space-between", mt: -1 }}>
                  <TinyText>{formatDuration(position)}</TinyText>
                  <TinyText>-{formatDuration(duration - position)}</TinyText>
                </Box>

                {/* Previous / Play / Next */}
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2, my: 1 }}>
                  <IconButton
                    aria-label="Previous song"
                    onClick={() => goTo(prevId)}
                    disabled={!prevId}
                    sx={{ color: "#fff" }}
                  >
                    <SkipPreviousRounded sx={{ fontSize: "2.2rem" }} />
                  </IconButton>

                  <IconButton
                    aria-label={isPlaying ? "Pause" : "Play"}
                    onClick={togglePlay}
                    sx={{
                      width: 68,
                      height: 68,
                      bgcolor: accent,
                      color: "#1b1300",
                      boxShadow: "0 10px 30px rgba(255,176,32,0.35)",
                      transition: "transform 0.15s ease, background-color 0.2s ease",
                      "&:hover": { bgcolor: "#ffc54f" },
                      "&:active": { transform: "scale(0.94)" },
                    }}
                  >
                    {isPlaying ? (
                      <PauseRounded sx={{ fontSize: "2.4rem" }} />
                    ) : (
                      <PlayArrowRounded sx={{ fontSize: "2.4rem" }} />
                    )}
                  </IconButton>

                  <IconButton
                    aria-label="Next song"
                    onClick={() => goTo(nextId)}
                    disabled={!nextId}
                    sx={{ color: "#fff" }}
                  >
                    <SkipNextRounded sx={{ fontSize: "2.2rem" }} />
                  </IconButton>
                </Box>

                {/* Volume */}
                <Stack spacing={2} direction="row" sx={{ px: 1 }} alignItems="center">
                  <IconButton
                    size="small"
                    aria-label={volume === 0 ? "Unmute" : "Mute"}
                    onClick={() => setVolume((v) => (v === 0 ? 0.6 : 0))}
                    sx={{ color: "rgba(255,255,255,0.55)" }}
                  >
                    {volume === 0 ? <VolumeOffRounded /> : <VolumeDownRounded />}
                  </IconButton>
                  <Slider
                    aria-label="Volume"
                    value={Math.round(volume * 100)}
                    min={0}
                    step={1}
                    max={100}
                    onChange={(_, value) => setVolume(value / 100)}
                    sx={{
                      color: "#fff",
                      "& .MuiSlider-track": { border: "none" },
                      "& .MuiSlider-rail": { opacity: 0.25 },
                      "& .MuiSlider-thumb": {
                        width: 16,
                        height: 16,
                        backgroundColor: "#fff",
                        "&:hover, &.Mui-focusVisible, &.Mui-active": { boxShadow: "none" },
                      },
                    }}
                  />
                  <VolumeUpRounded htmlColor="rgba(255,255,255,0.55)" />
                </Stack>

                <div className="playerFooter">
                  <p className="playerHint">
                    <kbd>Space</kbd> play / pause · <kbd>←</kbd> <kbd>→</kbd> skip 5s
                  </p>
                  {tapa.link && (
                    <a className="deezerLink" href={tapa.link} target="_blank" rel="noopener noreferrer">
                      Full song on Deezer ↗
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </Widget>
      </Box>
    </div>
  );
};

export default Music;
