import { Routes, Route, Link } from "react-router-dom";
import "./App.css";
import HomePage from "./components/HomePage/HomePage";
import Footer from "./components/Layout/Footer";
import Header from "./components/Layout/Header";
import Musics from "./components/Pages/Musics";
import Music from "./components/Pages/Music";
import Favourites from "./components/Pages/Favourites";

/** Shown when the address does not match any page. */
const NotFound = () => (
  <div className="page">
    <div className="pageInner">
      <div className="statusBox">
        <span className="statusIcon" aria-hidden="true">🎧</span>
        <h1 className="pageTitle">Page not found</h1>
        <p>This page does not exist. Let&apos;s find you some music instead.</p>
        <Link to="/" className="btn">
          Go to search
        </Link>
      </div>
    </div>
  </div>
);

/**
 * Main app component.
 *
 * Routes:
 *   /             -> HomePage   (search box)
 *   /musics/:id   -> Musics     (songs for the search word ":id")
 *   /music/:id    -> Music      (player for one song, ":id" is the Deezer track id)
 *   /favourites   -> Favourites (songs saved with the heart button)
 *   anything else -> NotFound
 */
function App() {
  return (
    <div className="App">
      <Header />
      <main className="appMain">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/musics/:id" element={<Musics />} />
          <Route path="/music/:id" element={<Music />} />
          <Route path="/favourites" element={<Favourites />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
