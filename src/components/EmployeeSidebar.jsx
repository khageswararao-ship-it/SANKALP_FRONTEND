import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.svg";
import "../styles/Sidebar.css";

function EmployeeSidebar({ activePage = "Dashboard" }) {
  const menu = [
    { name: "Dashboard", path: "/employee/dashboard" },
    { name: "My Attendance", path: "/employee/attendance" },
    { name: "My Leave", path: "/employee/leave" },
    { name: "My Payroll", path: "/employee/payroll" },
    
    { name: "Settings", path: "/employee/settings" },
  ];

  return (
    <aside className="sidebar">
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
            <Link to={item.path}>{item.name}</Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default EmployeeSidebar;