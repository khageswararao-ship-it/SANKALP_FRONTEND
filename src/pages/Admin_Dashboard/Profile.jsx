import React, { useState, useEffect, useRef } from "react";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import "../../styles/layout.css";
import "../../styles/Profile.css";
import admin from "../../assets/admin.png";
import { getProfile, updateProfile, getAllAdmins, addAdmin, deleteAdmin, updateAdminAccount } from "../../api/profileApi";

function Profile() {
  const adminsTableRef = useRef(null);

  const scrollAdminsTable = (direction) => {
    if (adminsTableRef.current) {
      adminsTableRef.current.scrollBy({
        left: direction === "left" ? -280 : 280,
        behavior: "smooth",
      });
    }
  };

  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [adminPasswordTarget, setAdminPasswordTarget] = useState(null);
  const [adminNewPassword, setAdminNewPassword] = useState("");
  const [adminConfirmPassword, setAdminConfirmPassword] = useState("");

  const [profile, setProfile] = useState({
    id: null,
    employeeId: "",
    username: "",
    email: "",
    mobileNumber: "",
    role: "ADMIN",
    image: admin,
  });

  const [allAdmins, setAllAdmins] = useState([]);

  const [newAdmin, setNewAdmin] = useState({
    employeeId: "",
    username: "",
    email: "",
    mobileNumber: "",
    password: "",
  });

  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [adminTabFilter, setAdminTabFilter] = useState("ALL"); // "ALL", "SUPERIOR", "STANDARD"

  const isSuperiorAdmin =
    profile.employeeId === "ADMIN001" ||
    (profile.role && profile.role.toUpperCase().includes("SUPER")) ||
    (profile.username && profile.username.toLowerCase().includes("khageswar")) ||
    (allAdmins.length <= 1);

  const generateNextAdminId = () => {
    const existingNums = (allAdmins || [])
      .map((a) => {
        const match = String(a.employeeId).match(/\d+/);
        return match ? parseInt(match[0], 10) : 0;
      })
      .filter((n) => !isNaN(n));
    const maxNum = existingNums.length > 0 ? Math.max(...existingNums, 1) : 1;
    return `ADMIN${String(maxNum + 1).padStart(3, "0")}`;
  };

  const handleOpenAddAdmin = () => {
    setNewAdmin({
      employeeId: generateNextAdminId(),
      username: "",
      email: "",
      mobileNumber: "",
      password: "",
      role: "ADMIN",
    });
    setShowAddAdmin(true);
  };

  useEffect(() => {
    fetchProfile();
    fetchAdmins();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await getProfile();
      if (response && response.data) {
        setProfile({
          id: response.data.id,
          employeeId: response.data.employeeId || "",
          username: response.data.username || "",
          email: response.data.email || "",
          mobileNumber: response.data.mobileNumber || "",
          role: response.data.role || "ADMIN",
          image: admin,
        });
      }
    } catch (error) {
      console.error("Error fetching admin profile:", error);
    }
  };

  const fetchAdmins = async () => {
    try {
      const response = await getAllAdmins();
      if (response && response.data) {
        setAllAdmins(response.data);
      }
    } catch (error) {
      console.warn("Error fetching admins list:", error);
    }
  };

  const handleSave = async () => {
    if (!profile.username || !profile.email) {
      alert("Please fill in at least Name and Email.");
      return;
    }

    try {
      await updateProfile(profile);
      alert("Admin Profile Updated Successfully!");
      setIsEditing(false);
      fetchProfile();
      fetchAdmins();
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  const handleImage = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfile({
        ...profile,
        image: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handlePassword = async () => {
    if (!password.new || !password.confirm) {
      alert("Please enter the new password.");
      return;
    }

    if (password.new !== password.confirm) {
      alert("New passwords do not match!");
      return;
    }

    try {
      await updateProfile({
        ...profile,
        password: password.new,
      });

      alert("Password Changed Successfully!");
      setShowPassword(false);
      setPassword({ current: "", new: "", confirm: "" });
    } catch (error) {
      console.error("Error changing password:", error);
      alert("Failed to change password.");
    }
  };

  const handleCreateAdmin = async () => {
    if (!newAdmin.username || !newAdmin.email || !newAdmin.password) {
      alert("Please fill in Name, Email, and Password.");
      return;
    }

    try {
      const adminPayload = {
        employeeId: newAdmin.employeeId || generateNextAdminId(),
        username: newAdmin.username.trim(),
        email: newAdmin.email.trim(),
        mobileNumber: newAdmin.mobileNumber.trim(),
        password: newAdmin.password,
        role: isSuperiorAdmin ? (newAdmin.role || "ADMIN") : "ADMIN",
        accountStatus: "ACTIVE",
      };

      await addAdmin(adminPayload);
      alert("New Administrator Added Successfully!");

      setShowAddAdmin(false);
      setNewAdmin({
        employeeId: "",
        username: "",
        email: "",
        mobileNumber: "",
        password: "",
        role: "ADMIN",
      });

      fetchAdmins();
    } catch (error) {
      console.error("Error adding new admin:", error);
      alert("Failed to add administrator. Username might already exist.");
    }
  };

  const handleResetAdminPassword = async () => {
    if (!adminNewPassword || !adminConfirmPassword) {
      alert("Please enter the new password in both fields.");
      return;
    }
    if (adminNewPassword !== adminConfirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      await updateAdminAccount(adminPasswordTarget.id, {
        ...adminPasswordTarget,
        password: adminNewPassword,
      });

      alert(`Password for administrator "${adminPasswordTarget.username}" updated successfully!`);
      setAdminPasswordTarget(null);
      setAdminNewPassword("");
      setAdminConfirmPassword("");
      fetchAdmins();
    } catch (error) {
      console.error("Error resetting admin password:", error);
      alert("Failed to update administrator password.");
    }
  };

  const handleDeleteAdmin = async (adm) => {
    if (!isSuperiorAdmin) {
      alert("Access Denied: Only the Superior Administrator can delete administrator accounts.");
      return;
    }

    if (adm.employeeId === "ADMIN001") {
      alert("Cannot delete the primary Superior Administrator account (ADMIN001).");
      return;
    }

    if (allAdmins.length <= 1) {
      alert("Cannot delete the only remaining administrator account.");
      return;
    }

    if (!window.confirm(`Are you sure you want to delete administrator "${adm.username}" (${adm.employeeId})?\n\nThis will permanently revoke their access.`)) {
      return;
    }

    try {
      await deleteAdmin(adm.id);
      alert(`Administrator "${adm.username}" deleted successfully.`);
      fetchAdmins();
    } catch (error) {
      console.error("Error deleting administrator:", error);
      alert("Failed to delete administrator.");
    }
  };

  return (
    <div className="layout">
      <Sidebar activePage="Profile" />

      <div className="main-content">
        <Header title="My Profile" />

        <div className="page-content">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h1 className="page-title" style={{ margin: 0 }}>Admin Profile & Settings</h1>
            <button
              className="add-admin-btn"
              onClick={() => setShowAddAdmin(true)}
            >
              + Add Another Admin
            </button>
          </div>

          {/* Profile Card */}
          <div className="profile-card">
            <div className="profile-left">
              <img
                src={profile.image}
                alt="Admin"
                className="profile-image"
              />

              {isEditing && (
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImage}
                  style={{ marginTop: "10px", fontSize: "12px" }}
                />
              )}

              <h2 style={{ marginTop: "12px", marginBottom: "4px" }}>{profile.username || "Admin"}</h2>
              <p style={{ color: "#64748b", margin: 0 }}>System Administrator</p>
            </div>

            <div className="profile-right">
              {/* Employee ID */}
              <div className="profile-row">
                <strong>Employee ID:</strong>
                {isEditing ? (
                  <input
                    className="profile-input"
                    value={profile.employeeId}
                    placeholder="e.g. ADMIN001"
                    onChange={(e) =>
                      setProfile({ ...profile, employeeId: e.target.value })
                    }
                  />
                ) : (
                  <span>{profile.employeeId || "N/A"}</span>
                )}
              </div>

              {/* Full Name / Username */}
              <div className="profile-row">
                <strong>Name / Username:</strong>
                {isEditing ? (
                  <input
                    className="profile-input"
                    value={profile.username}
                    placeholder="Enter full name / username"
                    onChange={(e) =>
                      setProfile({ ...profile, username: e.target.value })
                    }
                  />
                ) : (
                  <span>{profile.username}</span>
                )}
              </div>

              {/* Email */}
              <div className="profile-row">
                <strong>Email Address:</strong>
                {isEditing ? (
                  <input
                    type="email"
                    className="profile-input"
                    value={profile.email}
                    placeholder="Enter email"
                    onChange={(e) =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                  />
                ) : (
                  <span>{profile.email}</span>
                )}
              </div>

              {/* Mobile Phone */}
              <div className="profile-row">
                <strong>Phone Number:</strong>
                {isEditing ? (
                  <input
                    type="tel"
                    className="profile-input"
                    value={profile.mobileNumber}
                    placeholder="Enter phone number"
                    onChange={(e) =>
                      setProfile({ ...profile, mobileNumber: e.target.value })
                    }
                  />
                ) : (
                  <span>{profile.mobileNumber || "N/A"}</span>
                )}
              </div>

              {/* Role */}
              <div className="profile-row">
                <strong>Access Level:</strong>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    background: isSuperiorAdmin
                      ? "linear-gradient(135deg, #f59e0b, #d97706)"
                      : "#1E88E5",
                    color: "#ffffff",
                    padding: "4px 12px",
                    borderRadius: "20px",
                    fontSize: "13px",
                    fontWeight: "700",
                    boxShadow: isSuperiorAdmin
                      ? "0 3px 10px rgba(245, 158, 11, 0.35)"
                      : "none",
                  }}
                >
                  {isSuperiorAdmin ? (
                    <>
                      <span className="crown-badge-anim">👑</span> Superior Admin (Owner)
                    </>
                  ) : (
                    "Standard Administrator"
                  )}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="profile-buttons">
                {!isEditing ? (
                  <button
                    className="add-btn"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </button>
                ) : (
                  <>
                    <button className="add-btn" onClick={handleSave}>
                      Save Changes
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => {
                        setIsEditing(false);
                        fetchProfile();
                      }}
                    >
                      Cancel
                    </button>
                  </>
                )}

                <button
                  className="action-btn edit"
                  onClick={() => setShowPassword(true)}
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>

          {/* All Administrators List */}
          <div className="admins-section">
            <div className="admins-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
              <div>
                <h2 style={{ margin: 0 }}>All Administrators ({allAdmins.length > 0 ? allAdmins.length : 1})</h2>
                <span style={{ fontSize: "12px", color: isSuperiorAdmin ? "#d97706" : "#64748b", fontWeight: "600" }}>
                  {isSuperiorAdmin ? "👑 Logged in as Superior Admin (Full Authority)" : "Standard Administrator Access"}
                </span>
              </div>
              <button
                type="button"
                className="add-admin-btn"
                onClick={handleOpenAddAdmin}
              >
                + Add Admin
              </button>
            </div>

            {/* Mobile Filter Slidebar Tabs */}
            <div className="admin-filter-slidebar">
              <button
                type="button"
                className={`admin-slide-tab ${adminTabFilter === "ALL" ? "active" : ""}`}
                onClick={() => setAdminTabFilter("ALL")}
              >
                👥 All Admins ({allAdmins.length > 0 ? allAdmins.length : 1})
              </button>
              <button
                type="button"
                className={`admin-slide-tab ${adminTabFilter === "SUPERIOR" ? "active" : ""}`}
                onClick={() => setAdminTabFilter("SUPERIOR")}
              >
                👑 Superior Admin (Owner)
              </button>
              <button
                type="button"
                className={`admin-slide-tab ${adminTabFilter === "STANDARD" ? "active" : ""}`}
                onClick={() => setAdminTabFilter("STANDARD")}
              >
                🛡️ Standard Admins (
                {
                  allAdmins.filter(
                    (a) =>
                      a.employeeId !== "ADMIN001" &&
                      allAdmins.length > 1 &&
                      !String(a.role || "").toUpperCase().includes("SUPER") &&
                      !String(a.username || "").toLowerCase().includes("khageswar")
                  ).length
                }
                )
              </button>
            </div>

            <div className="slidebar-hint">
              👉 Touch & slide horizontally to view all administrator details and controls
            </div>

            {/* Responsive Touch-Friendly Slidebar Container */}
            <div className="table-container mobile-slidebar-container" ref={adminsTableRef}>
              <table className="employee-table admins-table" style={{ minWidth: "800px", width: "100%" }}>
                <thead>
                  <tr>
                    <th>Admin ID</th>
                    <th>Username / Name</th>
                    <th>Email</th>
                    <th>Mobile Number</th>
                    <th>Authority Level</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedAdmins.length > 0 ? (
                    displayedAdmins.map((adm) => {
                      const isRowSuperior =
                        adm.employeeId === "ADMIN001" ||
                        allAdmins.length <= 1 ||
                        String(adm.role || "").toUpperCase().includes("SUPER") ||
                        String(adm.username || "").toLowerCase().includes("khageswar");
                      return (
                        <tr key={adm.id || adm.employeeId}>
                          <td><strong>{adm.employeeId}</strong></td>
                          <td>{adm.username}</td>
                          <td>{adm.email}</td>
                          <td>{adm.mobileNumber || "-"}</td>
                          <td>
                            {isRowSuperior ? (
                              <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", background: "rgba(245,158,11,0.15)", color: "#b45309", padding: "4px 10px", borderRadius: "20px", fontWeight: "700", fontSize: "12px" }}>
                                👑 Superior Admin
                              </span>
                            ) : (
                              <span style={{ background: "rgba(30,136,229,0.1)", color: "#1E88E5", padding: "4px 10px", borderRadius: "20px", fontWeight: "600", fontSize: "12px" }}>
                                Standard Admin
                              </span>
                            )}
                          </td>
                          <td>
                            <span className="status-badge">
                              {adm.accountStatus || "ACTIVE"}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: "flex", gap: "6px", flexWrap: "nowrap" }}>
                              <button
                                type="button"
                                className="action-btn edit"
                                onClick={() => {
                                  setAdminPasswordTarget(adm);
                                  setAdminNewPassword("");
                                  setAdminConfirmPassword("");
                                }}
                                title="Set New Password for this Admin"
                                style={{ fontSize: "12px", padding: "6px 10px" }}
                              >
                                🔑 New Password
                              </button>

                              {/* Only Superior Admin can delete accounts; primary Superior Admin and own account cannot be deleted */}
                              {isSuperiorAdmin && adm.employeeId !== "ADMIN001" && adm.id !== profile.id && (
                                <button
                                  type="button"
                                  className="action-btn delete"
                                  onClick={() => handleDeleteAdmin(adm)}
                                  title="Delete Administrator"
                                  style={{ fontSize: "12px", padding: "6px 10px" }}
                                >
                                  🗑️ Delete
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="7" style={{ textAlign: "center", padding: "25px", color: "#64748b" }}>
                        No administrators found matching this tab filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Dedicated Interactive Slidebar Under The Table */}
            <div className="table-slidebar-controller">
              <button
                type="button"
                className="table-slide-btn"
                onClick={() => scrollAdminsTable("left")}
                title="Slide left to view ID and Name"
              >
                ◀ Slide Left
              </button>
              <div className="table-slide-track">
                <span className="table-slide-text">
                  👉 Touch & slide table or use buttons to view all Admin columns 👈
                </span>
              </div>
              <button
                type="button"
                className="table-slide-btn"
                onClick={() => scrollAdminsTable("right")}
                title="Slide right to view Status and Actions"
              >
                Slide Right ▶
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Popup: Add Another Admin */}
      {showAddAdmin && (
        <div className="popup-overlay" onClick={() => setShowAddAdmin(false)}>
          <div className="popup-form" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "500px", width: "92vw" }}>
            <h2>Add New Administrator</h2>
            <p style={{ color: "#64748b", fontSize: "14px", marginTop: "-10px", marginBottom: "15px" }}>
              Create an additional administrator account with portal access.
            </p>

            <label style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", marginBottom: "4px", display: "block" }}>
              Admin ID (Auto-Generated)
            </label>
            <input
              type="text"
              value={newAdmin.employeeId}
              readOnly
              style={{
                background: "rgba(30,136,229,0.08)",
                cursor: "not-allowed",
                fontWeight: "700",
                color: "#1E88E5",
              }}
            />

            <label style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", marginBottom: "4px", display: "block" }}>
              Full Name / Username *
            </label>
            <input
              type="text"
              placeholder="Full Name / Username"
              value={newAdmin.username}
              onChange={(e) =>
                setNewAdmin({ ...newAdmin, username: e.target.value })
              }
            />

            <label style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", marginBottom: "4px", display: "block" }}>
              Email Address *
            </label>
            <input
              type="email"
              placeholder="Email Address"
              value={newAdmin.email}
              onChange={(e) =>
                setNewAdmin({ ...newAdmin, email: e.target.value })
              }
            />

            <label style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", marginBottom: "4px", display: "block" }}>
              Mobile Number
            </label>
            <input
              type="tel"
              placeholder="Mobile Number"
              value={newAdmin.mobileNumber}
              onChange={(e) =>
                setNewAdmin({ ...newAdmin, mobileNumber: e.target.value })
              }
            />

            <label style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", marginBottom: "4px", display: "block" }}>
              Admin Password *
            </label>
            <input
              type="password"
              placeholder="Admin Password"
              value={newAdmin.password}
              onChange={(e) =>
                setNewAdmin({ ...newAdmin, password: e.target.value })
              }
            />

            <label style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", marginBottom: "4px", display: "block" }}>
              Admin Role Level
            </label>
            {isSuperiorAdmin ? (
              <select
                className="filter-box"
                style={{ width: "100%", marginBottom: "15px" }}
                value={newAdmin.role || "ADMIN"}
                onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value })}
              >
                <option value="ADMIN">Standard Administrator</option>
                <option value="SUPER_ADMIN">Superior Administrator (Full Control)</option>
              </select>
            ) : (
              <input
                type="text"
                value="Standard Administrator"
                readOnly
                style={{ background: "rgba(0,0,0,0.04)", cursor: "not-allowed", marginBottom: "15px" }}
              />
            )}

            <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
              <button className="add-btn" onClick={handleCreateAdmin}>
                Save Admin
              </button>
              <button
                className="delete-btn"
                onClick={() => {
                  setShowAddAdmin(false);
                  setNewAdmin({
                    employeeId: "",
                    username: "",
                    email: "",
                    mobileNumber: "",
                    password: "",
                  });
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup: Change Password */}
      {showPassword && (
        <div className="popup-overlay">
          <div className="popup-form">
            <h2>Change Password</h2>

            <input
              type="password"
              placeholder="New Password"
              value={password.new}
              onChange={(e) =>
                setPassword({
                  ...password,
                  new: e.target.value,
                })
              }
            />

            <input
              type="password"
              placeholder="Confirm New Password"
              value={password.confirm}
              onChange={(e) =>
                setPassword({
                  ...password,
                  confirm: e.target.value,
                })
              }
            />

            <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
              <button className="add-btn" onClick={handlePassword}>
                Save Password
              </button>
              <button
                className="delete-btn"
                onClick={() => {
                  setShowPassword(false);
                  setPassword({ current: "", new: "", confirm: "" });
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup: Reset Specific Admin Password */}
      {adminPasswordTarget && (
        <div className="popup-overlay">
          <div className="popup-form">
            <h2>Set Password for {adminPasswordTarget.username}</h2>
            <p style={{ color: "#64748b", fontSize: "13px", marginTop: "-6px", marginBottom: "14px" }}>
              Employee ID: <strong>{adminPasswordTarget.employeeId}</strong> • Email: <strong>{adminPasswordTarget.email}</strong>
            </p>

            <input
              type="password"
              placeholder="Enter New Password"
              value={adminNewPassword}
              onChange={(e) => setAdminNewPassword(e.target.value)}
            />

            <input
              type="password"
              placeholder="Confirm New Password"
              value={adminConfirmPassword}
              onChange={(e) => setAdminConfirmPassword(e.target.value)}
            />

            <div style={{ display: "flex", gap: "10px", marginTop: "15px", justifyContent: "flex-end" }}>
              <button className="add-btn" onClick={handleResetAdminPassword}>
                Save Password
              </button>
              <button
                className="action-btn delete"
                onClick={() => {
                  setAdminPasswordTarget(null);
                  setAdminNewPassword("");
                  setAdminConfirmPassword("");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
