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
import { FaSyncAlt, FaEye, FaEyeSlash, FaUser, FaLock, FaBell, FaCogs } from "react-icons/fa";
import { APP_VERSION, BUILD_NUMBER } from "../../config/version";
import { useTheme } from "../../context/ThemeContext";

function Settings() {
  const { theme } = useTheme();
  const employeeId = localStorage.getItem("employeeId");
  const [activeTab, setActiveTab] = useState("all");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

          {/* Mobile-Friendly Touch Slidebar Tabs */}
          <div className="employee-settings-slidebar">
            <button
              type="button"
              className={`settings-slide-tab ${activeTab === "all" ? "active" : ""}`}
              onClick={() => setActiveTab("all")}
            >
              <FaCogs /> All Settings
            </button>
            <button
              type="button"
              className={`settings-slide-tab ${activeTab === "username" ? "active" : ""}`}
              onClick={() => setActiveTab("username")}
            >
              <FaUser /> Username
            </button>
            <button
              type="button"
              className={`settings-slide-tab ${activeTab === "password" ? "active" : ""}`}
              onClick={() => setActiveTab("password")}
            >
              <FaLock /> Password
            </button>
            <button
              type="button"
              className={`settings-slide-tab ${activeTab === "notifications" ? "active" : ""}`}
              onClick={() => setActiveTab("notifications")}
            >
              <FaBell /> Notifications
            </button>
            <button
              type="button"
              className={`settings-slide-tab ${activeTab === "updates" ? "active" : ""}`}
              onClick={() => setActiveTab("updates")}
            >
              <FaSyncAlt /> Updates
            </button>
          </div>

          <div className="settings-card">
            {/* Section 1: Username Change */}
            {(activeTab === "all" || activeTab === "username") && (
              <div className="settings-section-block">
                <h2 style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "17px" }}>
                  <FaUser color="#1E88E5" /> Username Change Request
                </h2>

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

                <div className="profile-buttons" style={{ margin: "16px 0 24px 0" }}>
                  <button
                    className="add-btn"
                    onClick={handleUsernameRequest}
                  >
                    Request Username Change
                  </button>
                </div>
              </div>
            )}

            {/* Section 2: Change Password */}
            {(activeTab === "all" || activeTab === "password") && (
              <div className="settings-section-block">
                <h2 style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "17px" }}>
                  <FaLock color="#1E88E5" /> Password & Security
                </h2>

                <div className="setting-row">
                  <span>New Password</span>
                  <div style={{ position: "relative", width: "100%", maxWidth: "320px" }}>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={settings.password}
                      onChange={handleChange}
                      placeholder="Enter new password"
                      style={{ width: "100%", paddingRight: "40px" }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#64748b",
                      }}
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <div className="setting-row">
                  <span>Confirm Password</span>
                  <div style={{ position: "relative", width: "100%", maxWidth: "320px" }}>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={settings.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm new password"
                      style={{ width: "100%", paddingRight: "40px" }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#64748b",
                      }}
                      title={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <div className="profile-buttons" style={{ margin: "16px 0 24px 0" }}>
                  <button
                    className="add-btn"
                    onClick={handlePasswordRequest}
                  >
                    Request Password Change
                  </button>
                </div>
              </div>
            )}

            {/* Section 3: Email Notification */}
            {(activeTab === "all" || activeTab === "notifications") && (
              <div className="settings-section-block">
                <h2 style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "17px" }}>
                  <FaBell color="#1E88E5" /> Notification Preferences
                </h2>

                <div className="setting-row">
                  <span>Email Notifications</span>
                  <input
                    type="checkbox"
                    name="emailNotification"
                    checked={settings.emailNotification}
                    onChange={handleChange}
                  />
                </div>

                <div className="profile-buttons" style={{ margin: "16px 0 24px 0" }}>
                  <button
                    className="add-btn"
                    onClick={handleSave}
                  >
                    Save Preferences
                  </button>
                  <button
                    className="delete-btn"
                    onClick={handleReset}
                    style={{ marginLeft: "10px" }}
                  >
                    Reset
                  </button>
                </div>
              </div>
            )}

            {/* Section 4: App Version & In-App Auto-Update System */}
            {(activeTab === "all" || activeTab === "updates") && (
              <div
                style={{
                  marginTop: activeTab === "all" ? "20px" : "5px",
                  padding: "20px",
                  borderRadius: "12px",
                  background: theme === "dark" ? "rgba(30, 136, 229, 0.12)" : "rgba(30, 136, 229, 0.05)",
                  border: "1px solid rgba(30, 136, 229, 0.3)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "15px",
                }}
              >
                <div>
                  <h4 style={{ margin: "0 0 5px 0", fontSize: "16px", color: theme === "dark" ? "#f8fafc" : "#0f172a", fontWeight: "700" }}>
                    App Version & Updates
                  </h4>
                  <p style={{ margin: 0, fontSize: "13px", color: theme === "dark" ? "#cbd5e1" : "#475569" }}>
                    Current Version: <strong style={{ color: theme === "dark" ? "#60a5fa" : "#1d4ed8" }}>v{APP_VERSION} (Build {BUILD_NUMBER})</strong> • Auto-Update Enabled
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
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default Settings;