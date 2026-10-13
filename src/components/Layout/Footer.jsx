import React from "react";
import { FaFacebook, FaInstagram, FaTelegram } from "react-icons/fa";
import "./layout.css";

// Social links shown in the footer. Add or change links here.
const SOCIAL_LINKS = [
  { name: "Facebook", url: "https://www.facebook.com/", Icon: FaFacebook },
  { name: "Instagram", url: "https://www.instagram.com/", Icon: FaInstagram },
  { name: "Telegram", url: "https://telegram.org/", Icon: FaTelegram },
];

/** Footer with credits and social media icons. */
const Footer = () => {
  return (
    <footer className="siteFooter">
      <div className="footer-container">
        <p>
          © {new Date().getFullYear()} Best Music · Music previews from{" "}
          <a href="https://www.deezer.com/" target="_blank" rel="noopener noreferrer" className="footerText-link">
            Deezer
          </a>
        </p>
        <ul className="footer-nav">
          {SOCIAL_LINKS.map(({ name, url, Icon }) => (
            <li className="footer-item" key={name}>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link"
                aria-label={name}
              >
                <Icon className="social-icon" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
