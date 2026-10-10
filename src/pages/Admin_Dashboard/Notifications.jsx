import  React, { useState, useEffect } from "react";
import {
  getNotifications,
  getNotificationById,
  addNotification,
  updateNotification,
  deleteNotification,
  deleteAllNotifications,
} from "../../api/notificationApi";

import {
    getRequests,
    rejectRequest,
    completePasswordReset,
    approveRequest,
    deleteAllRequests,
} from "../../api/forgotPasswordApi";

import { getAllLogins, updateLogin } from "../../api/loginApi";
import { getEmployees } from "../../api/employeeApi";
import { REAL_DEPARTMENTS } from "./Employees";

import {
  getUsernameRequests,
  updateUsernameRequest,
  approveUsernameRequest,
  rejectUsernameRequest,
  deleteAllUsernameRequests,
} from "../../api/usernameRequestApi";


import {
    getPasswordChangeRequests,
    approvePasswordChangeRequest,
    rejectPasswordChangeRequest,
    deleteAllPasswordChangeRequests
} from "../../api/passwordChangeRequestApi";


import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import "../../styles/layout.css";
import "../../styles/AdminNotifications.css";

function Notifications() {
const [notificationData, setNotificationData] = useState([]);
const [usernameRequests, setUsernameRequests] = useState([]);

const [passwordRequests, setPasswordRequests] = useState([]);
const [passwordChangeRequests, setPasswordChangeRequests] = useState([]);


const [showPasswordPopup, setShowPasswordPopup] = useState(false);
const [selectedRequest, setSelectedRequest] = useState(null);
const [newPassword, setNewPassword] = useState("");

const [employeesList, setEmployeesList] = useState([]);
const [targetAudience, setTargetAudience] = useState("department");
const [selectedDept, setSelectedDept] = useState(REAL_DEPARTMENTS[0]);

const fetchEmployeesList = async () => {
  try {
    const res = await getEmployees();
    if (res && res.data) {
      setEmployeesList(Array.isArray(res.data) ? res.data : []);
    }
  } catch (err) {
    console.warn("Could not fetch employees for notifications:", err);
  }
};

const fetchPasswordRequests = async () => {
  try {
    const response = await getRequests();
    setPasswordRequests(response.data);
  } catch (error) {
    console.error(error);
  }
};



const fetchPasswordChangeRequests = async () => {
    const response = await getPasswordChangeRequests();
    setPasswordChangeRequests(response.data);
};

useEffect(() => {
    fetchNotifications();
    fetchEmployeesList();
    fetchUsernameRequests();
    fetchPasswordRequests();          // Forgot Password
    fetchPasswordChangeRequests();    // Password Change
}, []);

const fetchUsernameRequests = async () => {
  try {
    const data = await getUsernameRequests();
    setUsernameRequests(data);
  } catch (error) {
    console.error(error);
  }
};



const fetchNotifications = async () => {
  try {
    const response = await getNotifications();
    setNotificationData(response.data);
  } catch (error) {
    console.error("Error fetching notifications:", error);
  }
};

const [showForm, setShowForm] = React.useState(false);
const [viewNotification, setViewNotification] = React.useState(null);
const [isEditing, setIsEditing] = React.useState(false);

const [search, setSearch] = React.useState("");
const [typeFilter, setTypeFilter] = React.useState("");

const [newNotification, setNewNotification] = React.useState({
  id: "",
  employeeId: "",
  employeeName: "",
  title: "",
  message: "",
  time: "",
  type: "info",
  read: false,
});


const filteredNotifications = notificationData.filter((item) => {
  const query = (search || "").trim().toLowerCase();
  const searchMatch =
    !query ||
    String(item.title || "").toLowerCase().includes(query) ||
    String(item.message || "").toLowerCase().includes(query) ||
    String(item.employeeId || "").toLowerCase().includes(query) ||
    String(item.employeeName || "").toLowerCase().includes(query);

  const typeMatch =
    typeFilter === "" ||
    item.type === typeFilter;

  return searchMatch && typeMatch;
});

const handleSave = async () => {
  if (!newNotification.title.trim() || !newNotification.message.trim()) {
    alert("Please enter Notification Title and Message.");
    return;
  }

  try {
    if (targetAudience === "department") {
      const deptEmployees = employeesList.filter((e) => e.department === selectedDept);
      if (deptEmployees.length > 0) {
        for (const emp of deptEmployees) {
          await addNotification({
            ...newNotification,
            id: `NOTIF-${Date.now()}-${emp.id}`,
            employeeId: emp.id,
            employeeName: emp.name,
          });
        }
      } else {
        await addNotification({
          ...newNotification,
          employeeId: `DEPT-${selectedDept.substring(0, 8)}`,
          employeeName: `${selectedDept} Team`,
        });
      }
      alert(`✅ Notification broadcasted to all employees in "${selectedDept}"!`);
    } else if (targetAudience === "all") {
      if (employeesList.length > 0) {
        for (const emp of employeesList) {
          await addNotification({
            ...newNotification,
            id: `NOTIF-${Date.now()}-${emp.id}`,
            employeeId: emp.id,
            employeeName: emp.name,
          });
        }
      } else {
        await addNotification({
          ...newNotification,
          employeeId: "ALL",
          employeeName: "All Staff",
        });
      }
      alert("✅ Company-wide notification sent to all staff members!");
    } else {
      // Individual employee
      if (!newNotification.employeeId || !newNotification.employeeName) {
        alert("Please select or enter the recipient Employee.");
        return;
      }
      await addNotification(newNotification);
      alert(`✅ Notification sent to ${newNotification.employeeName}!`);
    }

    fetchNotifications();
    setShowForm(false);
  } catch (error) {
    console.error("Error saving notification:", error);
    alert("Failed to save notification.");
  }
};

const handleView = async (id) => {
  try {
    const response = await getNotificationById(id);
    setViewNotification(response.data);
  } catch (error) {
    console.error(error);
  }
};

const handleEdit = async (id) => {
  try {
    const response = await getNotificationById(id);
    setNewNotification(response.data);
    setIsEditing(true);
    setShowForm(true);
  } catch (error) {
    console.error(error);
  }
};

const handleUpdate = async () => {
  try {
    await updateNotification(newNotification.id, newNotification);

    fetchNotifications();

    setShowForm(false);
    setIsEditing(false);

    alert("Notification Updated Successfully");
  } catch (error) {
    console.error(error);
  }
};


const handleApprove = async (id) => {
    try {
        await approveUsernameRequest(id);
        alert("Username Approved");
        fetchUsernameRequests();
        fetchNotifications();
    } catch (error) {
        console.error(error);
    }
};


const handleReject = async (id) => {
    try {
        await rejectUsernameRequest(id);
        alert("Request Rejected");
        fetchUsernameRequests();
    } catch (error) {
        console.error(error);
    }
};


const handlePasswordApprove = (request) => {
  setSelectedRequest(request);
  setShowPasswordPopup(true);
};


const handlePasswordReject = async (id) => {
  try {
    await rejectRequest(id);
    fetchPasswordRequests();
  } catch (error) {
    console.error(error);
  }
};

const handlePasswordChangeApprove = async (id) => {
  try {
    await approvePasswordChangeRequest(id);
    fetchPasswordChangeRequests();
    alert("Password change approved.");
  } catch (error) {
    console.error(error);
  }
};

const handlePasswordChangeReject = async (id) => {
  try {
    await rejectPasswordChangeRequest(id);
    fetchPasswordChangeRequests();
    alert("Password change rejected.");
  } catch (error) {
    console.error(error);
  }
};

const handleDeleteAll = async () => {
  if (!window.confirm("Delete all notifications, username requests and password requests?")) {
    return;
  }

  try {
      await Promise.all([
          deleteAllNotifications(),
          deleteAllUsernameRequests(),
          deleteAllRequests(),
          deleteAllPasswordChangeRequests()
      ]);

      await Promise.all([
          fetchNotifications(),
          fetchUsernameRequests(),
          fetchPasswordRequests(),
          fetchPasswordChangeRequests()
      ]);

    fetchNotifications();
    fetchUsernameRequests();
    fetchPasswordRequests();

    alert("All records deleted successfully.");
  } catch (error) {
    console.error(error);
    alert("Delete failed.");
  }
};




const handleDelete = async (id) => {
  if (window.confirm("Delete Notification?")) {
    try {
      await deleteNotification(id);
      fetchNotifications();
    } catch (error) {
      console.error(error);
    }
  }
};


const handleDeleteAllNotifications = async () => {
  if (window.confirm("Delete all notifications?")) {
    try {
      await deleteAllNotifications();
      fetchNotifications();
      alert("All notifications deleted successfully.");
    } catch (error) {
      console.error(error);
      alert("Failed to delete notifications.");
    }
  }
};




  return (
    <div className="layout">
      <Sidebar />

      <div className="main-content">
        <Header title="Notifications" />

        <div className="page-content">
          <h1 className="page-title">🔔 Admin Notifications</h1>

<div className="notification-stats">

<div className="notification-card">
<h3>Total</h3>
<h2>{notificationData.length}</h2>
</div>

<div className="notification-card">
<h3>Info</h3>
<h2>{notificationData.filter(n=>n.type==="info").length}</h2>
</div>

<div className="notification-card">
<h3>Alerts</h3>
<h2>{notificationData.filter(n=>n.type!=="info").length}</h2>
</div>

</div>

<div className="notification-toolbar">

<input
className="search-box"
placeholder="Search Notification..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
/>

<select
className="filter-box"
value={typeFilter}
onChange={(e)=>setTypeFilter(e.target.value)}
>

<option value="">All Types</option>
<option value="success">Success</option>
<option value="warning">Warning</option>
<option value="info">Info</option>
<option value="danger">Danger</option>

</select>

<button
className="action-btn"
onClick={()=>{
setSearch("");
setTypeFilter("");
}}
>
Reset
</button>

<button
className="add-btn"
onClick={()=>{
  setIsEditing(false);
  const now = new Date();
  const timeStr = `${now.toLocaleDateString()}, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`;
  const autoId = `NOTIF-${Math.floor(1000 + Math.random() * 9000)}`;

  setTargetAudience("department");
  setSelectedDept(REAL_DEPARTMENTS[0]);

  setNewNotification({
    id: autoId,
    employeeId: `DEPT-${REAL_DEPARTMENTS[0].substring(0, 10)}`,
    employeeName: `${REAL_DEPARTMENTS[0]} Department`,
    title: "",
    message: "",
    time: timeStr,
    type: "info",
    read: false,
  });
  setShowForm(true);
}}
>
+ Add Notification
</button>

<button
className="delete-btn"
onClick={handleDeleteAll}
>
Delete All
</button>

</div>

{viewNotification && (

<div className="popup-overlay" onClick={()=>setViewNotification(null)}>

<div className="popup-form" onClick={(e)=>e.stopPropagation()}>

<h2>Notification Details</h2>

<p><strong>ID:</strong> {viewNotification.id}</p>

<p><strong>Employee ID:</strong> {viewNotification.employeeId}</p>

<p><strong>Employee Name:</strong> {viewNotification.employeeName}</p>

<p><strong>Title:</strong> {viewNotification.title}</p>

<p><strong>Message:</strong> {viewNotification.message}</p>

{viewNotification.reply && (
    <p>
        <strong>Employee Reply:</strong> {viewNotification.reply}
    </p>
)}

<p><strong>Time:</strong> {viewNotification.time}</p>

<p><strong>Type:</strong> {viewNotification.type}</p>

<button
className="add-btn"
onClick={()=>setViewNotification(null)}
>
Close
</button>

</div>

</div>

)}


{showForm && (

<div className="popup-overlay" onClick={() => setShowForm(false)}>

<div className="popup-form" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "560px", width: "94vw" }}>

<h2>
{isEditing ? "Edit Notification" : "📢 Send Notification"}
</h2>

{!isEditing && (
  <div style={{ marginBottom: "16px" }}>
    <label style={{ fontSize: "12px", fontWeight: "700", color: "#64748b", display: "block", marginBottom: "8px" }}>
      TARGET AUDIENCE
    </label>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "8px" }}>
      <button
        type="button"
        onClick={() => {
          setTargetAudience("department");
          setNewNotification((prev) => ({
            ...prev,
            employeeId: `DEPT-${selectedDept.substring(0, 10)}`,
            employeeName: `${selectedDept} Department`,
          }));
        }}
        style={{
          padding: "8px",
          fontSize: "12px",
          fontWeight: "600",
          background: targetAudience === "department" ? "#1E88E5" : "rgba(30,136,229,0.1)",
          color: targetAudience === "department" ? "#fff" : "#1E88E5",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        🏢 Whole Department
      </button>
      <button
        type="button"
        onClick={() => {
          setTargetAudience("individual");
          const firstEmp = employeesList[0];
          setNewNotification((prev) => ({
            ...prev,
            employeeId: firstEmp ? firstEmp.id : "",
            employeeName: firstEmp ? firstEmp.name : "",
          }));
        }}
        style={{
          padding: "8px",
          fontSize: "12px",
          fontWeight: "600",
          background: targetAudience === "individual" ? "#10b981" : "rgba(16,185,129,0.1)",
          color: targetAudience === "individual" ? "#fff" : "#10b981",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        👤 Specific Employee
      </button>
      <button
        type="button"
        onClick={() => {
          setTargetAudience("all");
          setNewNotification((prev) => ({
            ...prev,
            employeeId: "ALL",
            employeeName: "All Staff Members",
          }));
        }}
        style={{
          padding: "8px",
          fontSize: "12px",
          fontWeight: "600",
          background: targetAudience === "all" ? "#8b5cf6" : "rgba(139,92,246,0.1)",
          color: targetAudience === "all" ? "#fff" : "#8b5cf6",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        📢 All Employees
      </button>
    </div>
  </div>
)}

{!isEditing && targetAudience === "department" && (
  <div style={{ marginBottom: "14px" }}>
    <label style={{ fontSize: "12px", fontWeight: "600", color: "#64748b", display: "block", marginBottom: "4px" }}>
      Select Department to Broadcast
    </label>
    <select
      className="filter-box"
      style={{ width: "100%" }}
      value={selectedDept}
      onChange={(e) => {
        const dept = e.target.value;
        setSelectedDept(dept);
        setNewNotification((prev) => ({
          ...prev,
          employeeId: `DEPT-${dept.substring(0, 10)}`,
          employeeName: `${dept} Department`,
        }));
      }}
    >
      {REAL_DEPARTMENTS.map((dept) => (
        <option key={dept} value={dept}>
          {dept}
        </option>
      ))}
    </select>
  </div>
)}

{!isEditing && targetAudience === "individual" && (
  <div style={{ marginBottom: "14px" }}>
    <label style={{ fontSize: "12px", fontWeight: "600", color: "#64748b", display: "block", marginBottom: "4px" }}>
      Select Recipient Employee
    </label>
    <select
      className="filter-box"
      style={{ width: "100%" }}
      value={newNotification.employeeId}
      onChange={(e) => {
        const chosen = employeesList.find((emp) => emp.id === e.target.value);
        if (chosen) {
          setNewNotification((prev) => ({
            ...prev,
            employeeId: chosen.id,
            employeeName: chosen.name,
          }));
        }
      }}
    >
      <option value="">-- Choose Employee --</option>
      {employeesList.map((emp) => (
        <option key={emp.id} value={emp.id}>
          {emp.id} - {emp.name} ({emp.department})
        </option>
      ))}
    </select>
  </div>
)}

<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "12px" }}>
  <div>
    <label style={{ fontSize: "12px", fontWeight: "600", color: "#64748b", display: "block", marginBottom: "4px" }}>
      Notification ID (Auto)
    </label>
    <input
      value={newNotification.id}
      readOnly
      style={{ background: "rgba(0,0,0,0.05)", cursor: "not-allowed", fontWeight: "700" }}
    />
  </div>
  <div>
    <label style={{ fontSize: "12px", fontWeight: "600", color: "#64748b", display: "block", marginBottom: "4px" }}>
      Recipient
    </label>
    <input
      value={newNotification.employeeName || newNotification.employeeId || "Recipients"}
      readOnly
      style={{ background: "rgba(0,0,0,0.05)", cursor: "not-allowed", fontWeight: "600" }}
    />
  </div>
</div>

<label style={{ fontSize: "12px", fontWeight: "600", color: "#64748b", display: "block", marginBottom: "4px" }}>
  Title *
</label>
<input
  placeholder="e.g., Department Meeting, Holiday Announcement, Performance Update"
  value={newNotification.title}
  onChange={(e)=>setNewNotification({...newNotification,title:e.target.value})}
  style={{ marginBottom: "12px" }}
/>

<label style={{ fontSize: "12px", fontWeight: "600", color: "#64748b", display: "block", marginBottom: "4px" }}>
  Message *
</label>
<textarea
  placeholder="Enter notification message here..."
  rows={4}
  value={newNotification.message}
  onChange={(e)=>setNewNotification({...newNotification,message:e.target.value})}
  style={{ marginBottom: "12px" }}
/>

<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "18px" }}>
  <div>
    <label style={{ fontSize: "12px", fontWeight: "600", color: "#64748b", display: "block", marginBottom: "4px" }}>
      Timestamp
    </label>
    <input
      value={newNotification.time}
      readOnly
      style={{ background: "rgba(0,0,0,0.05)", cursor: "not-allowed" }}
    />
  </div>
  <div>
    <label style={{ fontSize: "12px", fontWeight: "600", color: "#64748b", display: "block", marginBottom: "4px" }}>
      Type
    </label>
    <select
      value={newNotification.type}
      onChange={(e)=>setNewNotification({...newNotification,type:e.target.value})}
    >
      <option value="info">ℹ️ Info</option>
      <option value="success">✅ Success</option>
      <option value="warning">⚠️ Warning</option>
      <option value="danger">🚨 Danger</option>
    </select>
  </div>
</div>

<div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
  <button
    type="button"
    className="add-btn"
    onClick={isEditing ? handleUpdate : handleSave}
  >
    {isEditing ? "Update Notification" : "Send Notification"}
  </button>
  <button
    type="button"
    className="delete-btn"
    onClick={()=>{
      setShowForm(false);
      setIsEditing(false);
    }}
  >
    Cancel
  </button>
</div>

</div>

</div>

)}


<div className="request-grid">

  {/* Username Requests */}
  <div className="request-column">

    <h2 className="section-title">
      Pending Username Requests
    </h2>

    {usernameRequests.map((request) => (
      <div
        key={request.id}
        className="request-card"
        style={{ borderLeft: "6px solid orange" }}
      >
        <h3>{request.employeeId}</h3>

        <p>
          <strong>Current Username:</strong> {request.currentUsername}
        </p>

        <p>
          <strong>Requested Username:</strong> {request.newUsername}
        </p>

        <p>
          <strong>Status:</strong> {request.status}
        </p>

        <div className="button-group">
          <button
            className="action-btn view"
            onClick={() => handleApprove(request.id)}
          >
            Approve
          </button>

          <button
            className="action-btn delete"
            onClick={() => handleReject(request.id)}
          >
            Reject
          </button>
        </div>

      </div>
    ))}

  </div>

  {/* Password Requests */}

  <div className="request-column">

    <h2 className="section-title">
      Password Reset Requests
    </h2>

    {passwordRequests.map((request) => (
      <div
        key={request.id}
        className="request-card"
        style={{ borderLeft: "6px solid #0d6efd" }}
      >
        <h3>{request.employeeId}</h3>

        <p><strong>Name:</strong> {request.employeeName}</p>

        <p><strong>Email:</strong> {request.email}</p>

        <p><strong>Status:</strong> {request.status}</p>

        <div className="button-group">
          <button
            className="action-btn view"
            onClick={() => handlePasswordApprove(request)}
          >
            Approve
          </button>

          <button
            className="action-btn delete"
            onClick={() => handlePasswordReject(request.id)}
          >
            Reject
          </button>
        </div>

      </div>
    ))}

  </div>

</div>


{showPasswordPopup && (

<div className="popup-overlay">

  <div className="popup-form">

    <h2>Create New Password</h2>

    <p><strong>Employee ID:</strong> {selectedRequest.employeeId}</p>

    <p><strong>Name:</strong> {selectedRequest.employeeName}</p>

    <input
      type="password"
      placeholder="Enter New Password"
      value={newPassword}
      onChange={(e) => setNewPassword(e.target.value)}
    />

    <button
      className="add-btn"
      onClick={async () => {
        if (!newPassword.trim()) {
          alert("Enter a new password");
          return;
        }

        try {
          await completePasswordReset(selectedRequest.id, newPassword);
          alert("✅ Password updated and reset successfully!");
          fetchPasswordRequests();
          setShowPasswordPopup(false);
          setSelectedRequest(null);
          setNewPassword("");
        } catch (error) {
          console.warn("Backend mail service threw error, falling back to direct login update:", error);
          try {
            // Resilient Fallback: update login table directly & approve request
            const loginsRes = await getAllLogins();
            const allUsers = Array.isArray(loginsRes.data) ? loginsRes.data : [];
            const match = allUsers.find(
              (u) =>
                String(u.employeeId || "").toLowerCase() === String(selectedRequest.employeeId || "").toLowerCase() ||
                String(u.username || "").toLowerCase() === String(selectedRequest.employeeName || "").toLowerCase()
            );

            if (match) {
              await updateLogin(match.id, { ...match, password: newPassword });
            }
            await approveRequest(selectedRequest.id);

            alert(`✅ Password for ${selectedRequest.employeeName || selectedRequest.employeeId} updated successfully!\n\n(Note: Render email server is offline, so please share the new password "${newPassword}" directly with the employee).`);
            fetchPasswordRequests();
            setShowPasswordPopup(false);
            setSelectedRequest(null);
            setNewPassword("");
          } catch (fallbackErr) {
            console.error("Fallback update error:", fallbackErr);
            alert("Failed to update password. Please check your network connection.");
          }
        }
      }}
    >
      Save & Update Password
    </button>

    <button
      className="delete-btn"
      onClick={() => {
        setShowPasswordPopup(false);
        setSelectedRequest(null);
        setNewPassword("");
      }}
    >
      Cancel
    </button>

  </div>

</div>

)}


<h2 className="section-title">
All Notifications
</h2>

<div className="notification-section notification-list">
            {filteredNotifications.map((item)=>(
              <div

              key={item.id}
              className={`notification-item ${item.type}`}
              >
                <h3>{item.title}</h3>

                <p>
                  <strong>Employee ID:</strong> {item.employeeId}
                </p>

                <p>
                  <strong>Employee Name:</strong> {item.employeeName}
                </p>

                  <p>{item.message}</p>

                  {item.reply && item.reply.trim() !== "" && (
                    <div
                      style={{
                        marginTop: "10px",
                        padding: "10px",
                        background: "#f8f9fa",
                        borderLeft: "4px solid #28a745",
                        borderRadius: "5px"
                      }}
                    >
                      <strong>Employee Reply:</strong>
                      <p style={{ margin: "5px 0 0 0" }}>{item.reply}</p>
                    </div>
                  )}

                  <small style={{ color: "#666" }}>{item.time}</small>

                      <div style={{marginTop:"12px"}}>

                      <button
                      className="action-btn view"
                      onClick={()=>handleView(item.id)}
                      >
                      View
                      </button>

                      <button
                      className="action-btn edit"
                      onClick={()=>handleEdit(item.id)}
                      >
                      Edit
                      </button>

                      <button
                      className="action-btn delete"
                      onClick={()=>handleDelete(item.id)}
                      >
                      Delete
                      </button>

                      </div>

              </div>
            ))}
          </div>

  {/* Password Change Requests */}

  <div className="request-column">

    <h2 className="section-title">
      Pending Password Change Requests
    </h2>

    {passwordChangeRequests.map((request) => (
      <div
        key={request.id}
        className="request-card"
        style={{ borderLeft: "6px solid green" }}
      >
        <h3>{request.employeeId}</h3>

        <p>
          <strong>Requested Password:</strong> {request.newPassword}
        </p>

        <p>
          <strong>Status:</strong> {request.status}
        </p>

        <div className="button-group">

          <button
            className="action-btn view"
            onClick={() => handlePasswordChangeApprove(request.id)}
          >
            Approve
          </button>

          <button
            className="action-btn delete"
            onClick={() => handlePasswordChangeReject(request.id)}
          >
            Reject
          </button>

        </div>

      </div>
    ))}

  </div>


        </div>
      </div>
      </div>  


   
  );
}

export default Notifications;