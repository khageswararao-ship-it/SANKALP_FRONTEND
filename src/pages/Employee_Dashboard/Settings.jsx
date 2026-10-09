import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import EmployeeSidebar from "../../components/EmployeeSidebar";
import "../../styles/layout.css";
import "../../styles/Dashboard.css";
import "../../styles/EmployeeSettings.css";
import { createUsernameRequest } from "../../api/usernameRequestApi";

import {
  getEmployeeSettings,
  updateEmployeeSettings,
} from "../../api/employeeSettingsApi";

import { createPasswordChangeRequest } from "../../api/passwordChangeRequestApi";
import { FaSyncAlt } from "react-icons/fa";
import { APP_VERSION, BUILD_NUMBER } from "../../config/version";

function Settings() {
  const employeeId = localStorage.getItem("employeeId");
  const [settings, setSettings] = useState({
    currentUsername: "",
    newUsername: "",
    password: "",
    confirmPassword: "",

    emailNotification: true,

  });

useEffect(() => {
  loadSettings();
}, []);

const loadSettings = async () => {
  try {
    const data = await getEmployeeSettings(employeeId);

    setSettings((prev) => ({
      ...prev,
      ...data,
      password: "",
      confirmPassword: "",
    }));
  } catch (error) {
    console.error(error);
  }
};



  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setSettings({
      ...settings,
      [name]: type === "checkbox" ? checked : value,
    });
  };

const handleSave = async () => {

  if (
    settings.password &&
    settings.password !== settings.confirmPassword
  ) {
    alert("Passwords do not match!");
    return;
  }




  try {

        const data = {
            employeeId: employeeId,
            emailNotification: settings.emailNotification,
            
        };

        await updateEmployeeSettings(employeeId, data);
    alert("Settings Updated Successfully!");
    

    loadSettings();

  } catch (error) {
    console.error(error);
    alert("Failed to update settings");
  }
};


const handleUsernameRequest = async () => {
  try {
const request = {
    employeeId: employeeId,
    currentUsername: settings.currentUsername,
    newUsername: settings.newUsername,
};

    await createUsernameRequest(request);

    alert("Username change request sent to Admin.");

 setSettings((prev) => ({
  ...prev,
  currentUsername: "",
  newUsername: "",
}));

  } catch (error) {
    console.error(error);
    alert("Failed to send request.");
  }
};


const handlePasswordRequest = async () => {

  if (!settings.password) {
    alert("Please enter a new password.");
    return;
  }

  if (settings.password !== settings.confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  try {

    const request = {
      employeeId: employeeId,
      newPassword: settings.password,
    };

    await createPasswordChangeRequest(request);

    alert("Password change request sent to Admin.");

    setSettings({
      ...settings,
      password: "",
      confirmPassword: "",
    });

  } catch (error) {
    console.error(error);
    alert("Failed to send password change request.");
  }
};



const handleReset = () => {
  setSettings((prev) => ({
    ...prev,
    newUsername: "",
    password: "",
    confirmPassword: "",
    emailNotification: true,
  }));
};

  return (
    <div className="layout">
      <EmployeeSidebar activePage="Settings" />

      <div className="main-content">
        <Header
          title="Settings"
          profilePath="/employee/profile"
          notificationPath="/employee/notifications"
        />

        <div className="page-content">

          <h1 className="page-title">Settings</h1>

          <div className="settings-card">

            <h2>Account Settings</h2>

            {/* Username Change */}

            <div className="setting-row">
              <span>Current Username</span>

              <input
                type="text"
                name="currentUsername"
                value={settings.currentUsername}
                onChange={handleChange}
                placeholder="Current Username"
              />
            </div>

            <div className="setting-row">
              <span>New Username</span>

              <input
                type="text"
                name="newUsername"
                value={settings.newUsername}
                onChange={handleChange}
                placeholder="Enter New Username"
              />
            </div>

            <div
              className="profile-buttons"
              style={{ marginBottom: "20px" }}
            >
              <button
                className="add-btn"
                onClick={handleUsernameRequest}
              >
                Request Username Change
              </button>
            </div>           

            {/* Change Password */}

            <div className="setting-row">
              <span>New Password</span>

              <input
                type="password"
                name="password"
                value={settings.password}
                onChange={handleChange}
                placeholder="Enter new password"
              />
            </div>

            <div className="setting-row">
              <span>Confirm Password</span>

              <input
                type="password"
                name="confirmPassword"
                value={settings.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
              />
            </div>


                  <div
                    className="profile-buttons"
                    style={{ marginBottom: "20px" }}
                  >
                    <button
                      className="add-btn"
                      onClick={handlePasswordRequest}
                    >
                      Request Password Change
                    </button>
                  </div>


           
            {/* Email Notification */}

            <div className="setting-row">
              <span>Email Notifications</span>

              <input
                type="checkbox"
                name="emailNotification"
                checked={settings.emailNotification}
                onChange={handleChange}
              />
            </div>

            

        

            {/* Buttons */}

            <div
              className="profile-buttons"
              style={{ marginTop: "25px" }}
            >
              <button
                className="add-btn"
                onClick={handleSave}
              >
                Save Settings
              </button>

              <button
                className="delete-btn"
                onClick={handleReset}
              >
                Reset
              </button>
            </div>

            {/* App Version & In-App Auto-Update System */}
            <div
              style={{
                marginTop: "30px",
                padding: "20px",
                borderRadius: "12px",
                background: "rgba(30, 136, 229, 0.05)",
                border: "1px solid rgba(30, 136, 229, 0.2)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "15px",
              }}
            >
              <div>
                <h4 style={{ margin: "0 0 5px 0", fontSize: "16px", color: "var(--text-color, #1e293b)" }}>
                  App Version & Updates
                </h4>
                <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>
                  Current Version: <strong>v{APP_VERSION} (Build {BUILD_NUMBER})</strong> • Auto-Update Enabled
                </p>
              </div>
              <button
                type="button"
                className="add-btn"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 18px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  if (typeof window.checkForAppUpdates === "function") {
                    window.checkForAppUpdates(true);
                  }
                }}
              >
                <FaSyncAlt /> Check for Updates
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default Settings;