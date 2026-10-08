import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.svg";
import "../styles/Sidebar.css";
import { FaTimes } from "react-icons/fa";
import { useSidebar } from "../context/SidebarContext";

function EmployeeSidebar({ activePage = "Dashboard" }) {
  const { isOpen, closeSidebar } = useSidebar();

  const menu = [
    { name: "Dashboard", path: "/employee/dashboard" },
    { name: "My Attendance", path: "/employee/attendance" },
    { name: "My Leave", path: "/employee/leave" },
    { name: "My Payroll", path: "/employee/payroll" },
    { name: "Settings", path: "/employee/settings" },
  ];

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      <div
        className={`sidebar-backdrop ${isOpen ? "active" : ""}`}
        onClick={closeSidebar}
        aria-hidden="true"
      />

      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        {/* Mobile Close Button */}
        <button
          className="sidebar-close-btn"
          onClick={closeSidebar}
          aria-label="Close navigation"
          type="button"
        >
          <FaTimes />
        </button>

        <div className="logo">
          <img src={logo} alt="Sankalp IP Logo" className="logo-img" />
          <h2>Sankalp IP</h2>
          <p>Employee Portal</p>
        </div>

        <ul className="menu">
          {menu.map((item) => (
            <li
              key={item.name}
              className={activePage === item.name ? "active" : ""}
            >
              <Link to={item.path} onClick={closeSidebar}>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
}

export default EmployeeSidebar;