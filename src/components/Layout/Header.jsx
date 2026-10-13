import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { FaBars, FaSearch, FaTimes } from "react-icons/fa";
import ppicture from "../Pages/public/ppicture.png";
import { getLastSearch, useFavourites } from "../../data/helpers";
import "./layout.css";

/** Get the search word from an address like "/musics/adele". */
const searchFromPath = (pathname) => {
  if (!pathname.startsWith("/musics/")) return "";
  try {
    return decodeURIComponent(pathname.slice("/musics/".length));
  } catch {
    return "";
  }
};

/**
 * Header (on every page):
 * - logo + name (goes home)
 * - a small search box (on every page except the home page)
 * - links: Home, Last search, Favourites (with a counter)
 * - on small screens the links are inside a menu (☰)
 */
const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { favourites } = useFavourites();

  const isHome = location.pathname === "/";
  const [query, setQuery] = useState(searchFromPath(location.pathname));
  const [lastSearch, setLastSearch] = useState(getLastSearch);
  const [menuOpen, setMenuOpen] = useState(false);

  // When the page changes: update the search box, last search, and close the menu.
  useEffect(() => {
    setQuery(searchFromPath(location.pathname));
    setLastSearch(getLastSearch());
    setMenuOpen(false);
  }, [location.pathname]);

  // Close the mobile menu with the Escape key.
  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (e) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const onSearch = (e) => {
    e.preventDefault();
    const text = query.trim();
    if (text) navigate(`/musics/${encodeURIComponent(text)}`);
  };

  return (
    <header className={`siteHeader${isHome ? " is-transparent" : ""}`}>
      <div className="headercontainer">
        <Link to="/" className="brand" aria-label="Best Music home">
          <img src={ppicture} alt="" className="brandLogo" />
          <span className="brandName">Best Music</span>
        </Link>

        {!isHome && (
          <form className="headerSearch" role="search" onSubmit={onSearch}>
            <FaSearch aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search songs or artists"
              aria-label="Search songs or artists"
            />
          </form>
        )}

        <button
          type="button"
          className="menuToggle"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mainNav"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <nav id="mainNav" className={`mainNav${menuOpen ? " is-open" : ""}`} aria-label="Main">
          <NavLink to="/" end className="navLink">
            Home
          </NavLink>
          {lastSearch && (
            <NavLink to={`/musics/${encodeURIComponent(lastSearch)}`} className="navLink">
              Last search
            </NavLink>
          )}
          <NavLink to="/favourites" className="navLink">
            Favourites
            {favourites.length > 0 && (
              <span className="navBadge" aria-label={`${favourites.length} saved`}>
                {favourites.length}
              </span>
            )}
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Header;
