import { useParams } from "react-router-dom";
import React from "react";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import "../../styles/layout.css";
import "../../styles/Dashboard.css";

function SystemSettings() {
  return (
    <div className="layout">
      <Sidebar activePage="Settings" />

      <div className="main-content">
        <Header title="System Settings" />

        <div className="page-content">

          <h1 className="page-title">System Settings</h1>

          <div className="table-container" style={{ padding: "30px" }}>

            <label>Theme</label>

            <select className="filter-box">
              <option>Light</option>
              <option>Dark</option>
            </select>

            <br /><br />

            <label>Language</label>

            <select className="filter-box">
              <option>English</option>
              <option>Telugu</option>
              <option>Hindi</option>
            </select>

            <br /><br />

            <button className="add-btn">
              Save Changes
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}

export default SystemSettings;