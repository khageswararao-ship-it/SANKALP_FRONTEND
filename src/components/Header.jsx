import React, { useState } from "react";
import { FaBell, FaSignInAlt, FaUserCircle, FaBars, FaSun, FaMoon, FaInfoCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSidebar } from "../context/SidebarContext";
import { useTheme } from "../context/ThemeContext";
import AboutModal from "./AboutModal";

function Header({
  title = "Dashboard",
  profilePath = "/profile",
  notificationPath = "/notifications",
}) {
  const { toggleSidebar } = useSidebar();
  const { theme, toggleTheme } = useTheme();
  const [showAbout, setShowAbout] = useState(false);

  return (
    <>
      <header className="header">
        <div className="header-left">
          <button
            className="mobile-menu-btn"
            onClick={toggleSidebar}
            aria-label="Toggle navigation menu"
            type="button"
          >
            <FaBars />
          </button>
          <h1 className="header-title">{title}</h1>
        </div>

        <div className="header-icons">
          {/* Dark / Light Mode Toggle */}
          <button
            type="button"
            className="icon-btn theme-toggle-btn"
            onClick={toggleTheme}
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle Dark and Light Mode"
          >
            {theme === "dark" ? <FaSun style={{ color: "#ffd54f" }} /> : <FaMoon />}
          </button>

          {/* About App & Developer */}
          <button
            type="button"
            className="icon-btn about-btn"
            onClick={() => setShowAbout(true)}
            title="About App & Developer"
            aria-label="About App and Developer"
          >
            <FaInfoCircle />
          </button>

          {/* Admin Login */}
          <Link to="/admin-login" className="icon-btn" title="Login">
            <FaSignInAlt />
          </Link>

          {/* Notifications */}
          <Link to={notificationPath} className="icon-btn" title="Notifications">
            <FaBell />
          </Link>

          {/* Profile */}
          <Link to={profilePath} className="icon-btn" title="Profile">
            <FaUserCircle />
          </Link>
        </div>
      </header>

      <AboutModal isOpen={showAbout} onClose={() => setShowAbout(false)} />
    </>
  );
}

export default Header;