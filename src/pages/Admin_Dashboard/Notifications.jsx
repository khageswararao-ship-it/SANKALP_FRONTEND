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
    deleteAllRequests,
} from "../../api/forgotPasswordApi";



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

const searchMatch =
item.title.toLowerCase().includes(search.toLowerCase()) ||
item.message.toLowerCase().includes(search.toLowerCase()) ||
item.employeeId.toLowerCase().includes(search.toLowerCase()) ||
item.employeeName.toLowerCase().includes(search.toLowerCase());

const typeMatch =
typeFilter === "" ||
item.type === typeFilter;

return searchMatch && typeMatch;

});

const handleSave = async () => {

  if (
    !newNotification.id ||
    !newNotification.employeeId ||
    !newNotification.employeeName ||
    !newNotification.title ||
    !newNotification.message ||
    !newNotification.time

  ) {
    alert("Please fill all fields");
    return;
  }

  try {
    await addNotification(newNotification);

    fetchNotifications();

    setNewNotification({
      id: "",
      employeeId: "",
      employeeName: "",
      title: "",
      message: "",
      time: "",
      type: "info",
      read: false,
    });
    setShowForm(false);

    alert("Notification Added Successfully");
  } catch (error) {
    console.error(error);
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
setShowForm(true);
setIsEditing(false);
}}
>
Add Notification
</button>

<button
className="delete-btn"
onClick={handleDeleteAll}
>
Delete All
</button>

</div>

{viewNotification && (

<div className="popup-overlay">

<div className="popup-form">

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

<div className="popup-overlay">

<div className="popup-form">

<h2>
{isEditing ? "Edit Notification" : "Add Notification"}
</h2>

<input
placeholder="Notification ID"
value={newNotification.id}
onChange={(e)=>setNewNotification({...newNotification,id:e.target.value})}
/>


<input
  placeholder="Employee ID (Example: EMP1)"
  value={newNotification.employeeId}
  onChange={(e) =>
    setNewNotification({
      ...newNotification,
      employeeId: e.target.value,
    })
  }
/>

<input
  placeholder="Employee Name"
  value={newNotification.employeeName}
  onChange={(e) =>
    setNewNotification({
      ...newNotification,
      employeeName: e.target.value,
    })
  }
/>


<input
placeholder="Title"
value={newNotification.title}
onChange={(e)=>setNewNotification({...newNotification,title:e.target.value})}
/>

<textarea
placeholder="Message"
value={newNotification.message}
onChange={(e)=>setNewNotification({...newNotification,message:e.target.value})}
/>

<input
placeholder="Time"
value={newNotification.time}
onChange={(e)=>setNewNotification({...newNotification,time:e.target.value})}
/>

<select
value={newNotification.type}
onChange={(e)=>setNewNotification({...newNotification,type:e.target.value})}
>

<option value="success">Success</option>
<option value="warning">Warning</option>
<option value="info">Info</option>
<option value="danger">Danger</option>

</select>

<button
className="add-btn"
onClick={isEditing ? handleUpdate : handleSave}
>
{isEditing ? "Update" : "Save"}
</button>

<button
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

          alert("Password updated and email sent successfully.");

          fetchPasswordRequests();

          setShowPasswordPopup(false);
          setSelectedRequest(null);
          setNewPassword("");

        } catch (error) {
          console.error(error);
          alert("Failed to update password.");
        }
      }}
    >
      Save & Send Email
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