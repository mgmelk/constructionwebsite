import "./Navbar.css";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import logoImage from "../../assets/images/logo.png";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <img src={logoImage} alt="Wemaster logo" className="logo-icon" />
        <div className="logo-text">
          <h2>WEMASTER</h2>
          <span>CONSTRUCTION PLC</span>
        </div>
      </Link>

      <button
        className="menu-toggle"
        onClick={() => setMenuOpen((open) => !open)}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
      >
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>

      <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
        <li><a href="#home" onClick={() => setMenuOpen(false)}>Home</a></li>
        <li><a href="#about" onClick={() => setMenuOpen(false)}>About Us</a></li>
        <li><a href="#services" onClick={() => setMenuOpen(false)}>Services</a></li>
        <li><Link to="/projects" onClick={() => setMenuOpen(false)}>Projects</Link></li>
        <li><Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link></li>
        <li className="mobile-only-auth">
          <Link to="/quote" className="quote-btn mobile-quote-btn" onClick={() => setMenuOpen(false)}>
            GET A QUOTE
          </Link>
          <div className="mobile-auth-row">
            <Link to="/login" className="auth-btn-sub login-sub" onClick={() => setMenuOpen(false)}>
              Login
            </Link>
            <Link to="/register" className="auth-btn-sub signup-sub" onClick={() => setMenuOpen(false)}>
              Sign Up
            </Link>
          </div>
        </li>
      </ul>

      <div className="navbar-right-box">
        <Link to="/quote" className="quote-btn">
          GET A QUOTE
        </Link>
        <div className="below-quote-auth">
          <Link to="/login" className="auth-btn-sub login-sub">
            Login
          </Link>
          <Link to="/register" className="auth-btn-sub signup-sub">
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;