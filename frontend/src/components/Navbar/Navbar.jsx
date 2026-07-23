import "./Navbar.css";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import logoImage from "../../assets/images/logo.png";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="logo">
        <img src={logoImage} alt="Wemaster logo" className="logo-icon" />
        <div className="logo-text">
          <h2>WEMASTER</h2>
          <span>CONSTRUCTION PLC</span>
        </div>
      </div>

      <button
        className="menu-toggle"
        onClick={() => setMenuOpen((open) => !open)}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
      >
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>

      <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
        <li className="active"><a href="#home" onClick={() => setMenuOpen(false)}>Home</a></li>
        <li><a href="#about" onClick={() => setMenuOpen(false)}>About Us</a></li>
        <li><a href="#services" onClick={() => setMenuOpen(false)}>Services</a></li>
        <li><Link to="/projects" onClick={() => setMenuOpen(false)}>Projects</Link></li>
        <li><Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link></li>
        <li className="mobile-quote-item">
          <Link to="/quote" className="quote-btn mobile-quote-btn" onClick={() => setMenuOpen(false)}>
            GET A QUOTE
          </Link>
        </li>
      </ul>

      <div className="navbar-actions">
        <Link to="/quote" className="quote-btn">
          GET A QUOTE
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;