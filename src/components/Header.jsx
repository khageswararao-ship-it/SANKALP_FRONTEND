import React from "react";
import { FaBell, FaSignInAlt, FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

function Header({ title = "Dashboard",  profilePath = "/profile", notificationPath = "/notifications",}) 
{
  return (
    <header className="header">
      <h1>{title}</h1>

      <div className="header-icons">

        {/* Admin Login */}
        <Link to="/admin-login" className="icon-btn">
          <FaSignInAlt />
        </Link>

        {/* Notifications */}
        <Link to={notificationPath} className="icon-btn">
          <FaBell />
        </Link>

        {/* Profile */}
        <Link to={profilePath} className="icon-btn">
          <FaUserCircle />
        </Link>

      </div>
    </header>
  );
}

export default Header;