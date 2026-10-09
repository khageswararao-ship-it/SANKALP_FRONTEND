import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import {
  getSettings,
  updateSettings,
} from "../../api/settingsApi";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import "../../styles/layout.css";
import "../../styles/Dashboard.css";
import { useTheme } from "../../context/ThemeContext";
import { FaSyncAlt } from "react-icons/fa";
import { APP_VERSION, BUILD_NUMBER } from "../../config/version";

function Settings() {
  const navigate = useNavigate();
  const { theme, setThemeMode } = useTheme();

  const [settings, setSettings] = useState({
  companyName: "",
  companyEmail: "",
  phone: "",
  address: "",
  theme: "",
  language: "",
});

useEffect(() => {
  fetchSettings();
}, []);

const fetchSettings = async () => {
  try {
    const response = await getSettings();
    setSettings(response.data);
  } catch (error) {
    console.error(error);
  }
};

const handleSave = async () => {
  if (
    !settings.companyName ||
    !settings.companyEmail ||
    !settings.phone ||
    !settings.address
  ) {
    alert("Please fill all fields");
    return;
  }

  try {
    await updateSettings(settings);
    alert("Settings Saved Successfully!");
  } catch (error) {
    console.error(error);
  }
};


const handleReset = async () => {
  fetchSettings();
};



  return (
    <div className="layout">
      <Sidebar activePage="Settings" />

      <div className="main-content">
        <Header title="Settings" />

        <div className="page-content">

          <h1 className="page-title">System Settings</h1>

          <div className="table-container" style={{ padding: "30px" }}>

            <div className="employee-toolbar">

              <input
                type="text"
                className="search-box"
                placeholder="Company Name"
                value={settings.companyName}
                  onChange={(e)=>
                  setSettings({
                  ...settings,
                  companyName:e.target.value,
                  })
                  }
              />

              <input
                type="email"
                className="search-box"
                placeholder="Company Email"
                value={settings.companyEmail}
                onChange={(e)=>
                setSettings({
                ...settings,
                companyEmail:e.target.value,
                })
                }
              />

            </div>

            <div className="employee-toolbar">

              <input
                type="text"
                className="search-box"
                placeholder="Phone Number"
                value={settings.phone}
                onChange={(e)=>
                setSettings({
                ...settings,
                phone:e.target.value,
                })
                }
              />

              <input
                type="text"
                className="search-box"
                placeholder="Company Address"
                value={settings.address}
                onChange={(e)=>
                setSettings({
                ...settings,
                address:e.target.value,
                })
                }
              />

            </div>

            <div className="employee-toolbar">

              <select
                className="filter-box"
                value={theme === "dark" ? "Dark Theme" : "Light Theme"}
                onChange={(e) => {
                  const val = e.target.value;
                  setSettings({ ...settings, theme: val });
                  setThemeMode(val);
                }}
              >
                <option>Light Theme</option>
                <option>Dark Theme</option>
              </select>

              <select
                  className="filter-box"
                  value={settings.language}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      language: e.target.value,
                    })
                  }
                >
                <option>English</option>
                <option>Telugu</option>
                <option>Hindi</option>
              </select>

            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "30px",
              }}
            >
                  <div
                    style={{
                      display: "flex",
                      gap: "15px",
                      justifyContent: "flex-end",
                      marginTop: "30px",
                    }}
                  >
                    <button
                      className="add-btn"
                      onClick={() => navigate("/settings/password")}
                    >
                      Change Password
                    </button>

                    <button
                      className="add-btn"
                      onClick={() => navigate("/settings/system")}
                    >
                      System Settings
                    </button>

                    <button
                      className="add-btn"
                      onClick={() => navigate("/settings/security")}
                    >
                      Security
                    </button>
                      <button
                      className="add-btn"
                      onClick={handleSave}
                      >
                      Save Settings
                      </button>

                    <button
                    className="action-btn"
                    onClick={handleReset}
                    >
                    Reset
                    </button>

                  </div>
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