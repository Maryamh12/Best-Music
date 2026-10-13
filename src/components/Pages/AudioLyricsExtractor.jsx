import React, { useEffect, useState } from "react";
import { parseBlob } from "music-metadata-browser";

/**
 * EXPERIMENTAL - not used in the app yet.
 *
 * Tries to read lyrics that are saved inside an audio file (ID3 tags).
 * `audio` must be a Blob or File (for example from <input type="file">).
 *
 * Note: Deezer preview files normally do NOT include lyrics,
 * so with Deezer this will usually show "Lyrics not found".
 */
const AudioLyricsExtractor = ({ audio }) => {
  const [lyrics, setLyrics] = useState("");

  useEffect(() => {
    if (!audio) return;
    let cancelled = false;

    const readLyrics = async () => {
      try {
        const metadata = await parseBlob(audio);
        const extracted = metadata.common.lyrics;
        const text = Array.isArray(extracted) ? extracted.join("\n") : extracted;
        if (!cancelled) setLyrics(text || "Lyrics not found");
      } catch (error) {
        console.error("Could not read lyrics:", error.message);
        if (!cancelled) setLyrics("Lyrics not found");
      }
    };

    readLyrics();
    return () => {
      cancelled = true;
    };
  }, [audio]);

  return (
    <div>
      <p style={{ whiteSpace: "pre-line" }}>{lyrics}</p>
    </div>
  );
};

export default AudioLyricsExtractor;
