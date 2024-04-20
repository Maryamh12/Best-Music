
import React from "react";
import "./layout.css";
import { FaFacebook, FaInstagram, FaTelegram } from "react-icons/fa";

const Footer = () => {
  return (
    
    <footer>
      <div className="footer-container">
        <ul className="footer-nav">
          <li className="footer-item">
            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              <FaFacebook className="social-icon" />
            </a>
          </li>
          <li className="footer-item">
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              <FaInstagram className="social-icon" />
            </a>
          </li>
          <li className="footer-item">
            <a
              href="https://telegram.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              <FaTelegram className="social-icon" />
            </a>
          </li>
        </ul>
      </div>
    </footer>
    
  );
};

export default Footer;

