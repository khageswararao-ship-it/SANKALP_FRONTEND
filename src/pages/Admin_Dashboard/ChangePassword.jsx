import React from "react";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import "../../styles/layout.css";
import "../../styles/Dashboard.css";

function ChangePassword() {
  return (
    <div className="layout">
      <Sidebar activePage="Settings" />

      <div className="main-content">
        <Header title="Change Password" />

        <div className="page-content">

          <h1 className="page-title">Change Password</h1>

          <div className="table-container" style={{ padding: "30px" }}>

            <input
              type="password"
              className="search-box"
              placeholder="Current Password"
            />

            <br /><br />

            <input
              type="password"
              className="search-box"
              placeholder="New Password"
            />

            <br /><br />

            <input
              type="password"
              className="search-box"
              placeholder="Confirm Password"
            />

            <br /><br />

            <button className="add-btn">
              Update Password
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}

export default ChangePassword;