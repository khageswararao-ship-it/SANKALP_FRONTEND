import React from "react";
import logo from "../assets/logo.svg";
import "../styles/Sidebar.css";
import { Link } from "react-router-dom";

function Sidebar({ activePage = "Dashboard" }) {
              const menu =  [
                { name: "Dashboard", path: "/admin/dashboard" },
                { name: "Employees", path: "/employees" },
                { name: "Attendance", path: "/attendance" },
                { name: "Leave", path: "/leave" },
                { name: "Payroll", path: "/payroll" },
                { name: "Reports", path: "/reports" },
                { name: "Settings", path: "/settings" },
                
              ];

          return (
            <aside className="sidebar">
              <div className="logo">
                <img src={logo} alt="Sankalp IP Logo" className="logo-img" />
                <h2>Sankalp IP</h2>
                <p>HRMS Portal</p>
              </div>

              <ul className="menu">
                {menu.map((item) => (
                  <li
                    key={item.name}
                    className={activePage === item.name ? "active" : ""}
                  >
                    <Link to={item.path}>
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </aside>
          );

  
}

export default Sidebar;