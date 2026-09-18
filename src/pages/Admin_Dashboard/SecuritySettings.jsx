import React from "react";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import "../../styles/layout.css";
import "../../styles/Dashboard.css";

function SecuritySettings() {
  return (
    <div className="layout">
      <Sidebar activePage="Settings" />

      <div className="main-content">
        <Header title="Security Settings" />

        <div className="page-content">

          <h1 className="page-title">Security Settings</h1>

          <div className="table-container" style={{ padding: "30px" }}>

            <label>
              <input type="checkbox" defaultChecked />
              Enable Two-Factor Authentication
            </label>

            <br /><br />

            <label>
              <input type="checkbox" defaultChecked />
              Email Login Alerts
            </label>

            <br /><br />

            <label>
              <input type="checkbox" />
              Auto Logout after 15 Minutes
            </label>

            <br /><br />

            <button className="add-btn">
              Save Security Settings
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}

export default SecuritySettings;