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

function Settings() {

 const navigate = useNavigate();

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
                      value={settings.theme}
                      onChange={(e)=>
                      setSettings({
                      ...settings,
                      theme:e.target.value,
                      })
                      }
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

          </div>

        </div>
      </div>
    </div>
  );
}

export default Settings;