import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import "../../styles/layout.css";
import "../../styles/Profile.css";
import admin from "../../assets/admin.png";
import { getProfile, updateProfile, getAllAdmins, addAdmin, deleteAdmin, updateAdminAccount } from "../../api/profileApi";

function Profile() {
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
        employeeId: newAdmin.employeeId.trim() || `ADMIN${Math.floor(100 + Math.random() * 900)}`,
        username: newAdmin.username.trim(),
        email: newAdmin.email.trim(),
        mobileNumber: newAdmin.mobileNumber.trim(),
        password: newAdmin.password,
        role: "ADMIN",
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
                <strong>Role:</strong>
                <span>Administrator (Super Admin)</span>
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
            <div className="admins-header">
              <h2>All Administrators ({allAdmins.length})</h2>
              <button
                className="add-admin-btn"
                onClick={() => setShowAddAdmin(true)}
              >
                + Add Admin
              </button>
            </div>

            <table className="admins-table">
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Username / Name</th>
                  <th>Email</th>
                  <th>Mobile Number</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {allAdmins.length > 0 ? (
                  allAdmins.map((adm) => (
                    <tr key={adm.id}>
                      <td><strong>{adm.employeeId}</strong></td>
                      <td>{adm.username}</td>
                      <td>{adm.email}</td>
                      <td>{adm.mobileNumber || "-"}</td>
                      <td>{adm.role}</td>
                      <td>
                        <span className="status-badge">
                          {adm.accountStatus || "ACTIVE"}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: "6px", flexWrap: "nowrap" }}>
                          <button
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
                          <button
                            className="action-btn delete"
                            onClick={() => handleDeleteAdmin(adm)}
                            title="Delete Administrator"
                            style={{ fontSize: "12px", padding: "6px 10px" }}
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td><strong>{profile.employeeId || "ADMIN001"}</strong></td>
                    <td>{profile.username}</td>
                    <td>{profile.email}</td>
                    <td>{profile.mobileNumber || "-"}</td>
                    <td>ADMIN</td>
                    <td><span className="status-badge">ACTIVE</span></td>
                    <td><span style={{ color: "#94a3b8", fontSize: "12px" }}>Primary</span></td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Popup: Add Another Admin */}
      {showAddAdmin && (
        <div className="popup-overlay">
          <div className="popup-form">
            <h2>Add New Administrator</h2>
            <p style={{ color: "#64748b", fontSize: "14px", marginTop: "-10px", marginBottom: "15px" }}>
              Create an additional administrator account with full portal access.
            </p>

            <input
              type="text"
              placeholder="Admin Employee ID (e.g. ADMIN002)"
              value={newAdmin.employeeId}
              onChange={(e) =>
                setNewAdmin({ ...newAdmin, employeeId: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Full Name / Username"
              value={newAdmin.username}
              onChange={(e) =>
                setNewAdmin({ ...newAdmin, username: e.target.value })
              }
            />

            <input
              type="email"
              placeholder="Email Address"
              value={newAdmin.email}
              onChange={(e) =>
                setNewAdmin({ ...newAdmin, email: e.target.value })
              }
            />

            <input
              type="tel"
              placeholder="Mobile Number"
              value={newAdmin.mobileNumber}
              onChange={(e) =>
                setNewAdmin({ ...newAdmin, mobileNumber: e.target.value })
              }
            />

            <input
              type="password"
              placeholder="Admin Password"
              value={newAdmin.password}
              onChange={(e) =>
                setNewAdmin({ ...newAdmin, password: e.target.value })
              }
            />

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
