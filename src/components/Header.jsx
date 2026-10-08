import React from "react";
import { FaBell, FaSignInAlt, FaUserCircle, FaBars } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSidebar } from "../context/SidebarContext";

function Header({
  title = "Dashboard",
  profilePath = "/profile",
  notificationPath = "/notifications",
}) {
  const { toggleSidebar } = useSidebar();

  return (
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
  );
}

export default Header;