import React, { useState, useEffect } from "react";
import {
  getEmployeeNotifications,
  markNotificationAsRead,
  replyToNotification,
  deleteNotification,
  deleteAllNotifications,
} from "../../api/notificationApi";
import Header from "../../components/Header";
import EmployeeSidebar from "../../components/EmployeeSidebar";
import "../../styles/layout.css";
import "../../styles/Dashboard.css";
import "../../styles/Notifications.css";

function Notifications() {
const [notifications, setNotifications] = useState([]);

const employeeId = localStorage.getItem("employeeId");
const [replyText, setReplyText] = useState({});

useEffect(() => {
  loadNotifications();
}, []);

const loadNotifications = async () => {
  try {
    const response = await getEmployeeNotifications(employeeId);
    setNotifications(response.data);
  } catch (error) {
    console.error(error);
  }
};

const handleMarkAsRead = async (id) => {
  try {
    await markNotificationAsRead(id);
    loadNotifications();
  } catch (error) {
    console.error(error);
  }
};

const handleReply = async (id) => {

  if (!replyText[id] || replyText[id].trim() === "") {
    alert("Enter a reply");
    return;
  }

  try {

    await replyToNotification(id, replyText[id]);

    setReplyText({
      ...replyText,
      [id]: ""
    });

    loadNotifications();

    alert("Reply sent successfully.");

  } catch (error) {
    console.error(error);
  }
};

const handleMarkAllRead = async () => {
  try {
    for (const item of notifications) {
      if (!item.read) {
        await markNotificationAsRead(item.id);
      }
    }

    loadNotifications();
  } catch (error) {
    console.error(error);
  }
};

const handleDelete = async (id) => {
  try {
    await deleteNotification(id);
    loadNotifications();
  } catch (error) {
    console.error(error);
  }
};



  return (
    <div className="layout">
      <EmployeeSidebar activePage="Notifications" />

      <div className="main-content">
        <Header
          title="Notifications"
          profilePath="/employee/profile"
          notificationPath="/employee/notifications"
        />

        <div className="page-content">

          <h1 className="page-title">Notifications</h1>

          <div className="table-header">

            <h3>
              Total Notifications : {notifications.length}
            </h3>

            <div>

              <button
                className="add-btn"
                onClick={handleMarkAllRead}
              >
                Mark All Read
              </button>


            </div>

          </div>

          {notifications.length === 0 ? (

            <div className="dashboard-card">
              <h3>No Notifications Available</h3>
            </div>

          ) : (

            notifications.map((item) => (

              <div
                key={item.id}
                className="dashboard-card"
                style={{
                  marginBottom: "15px",
                  background: item.read
                    ? "#f5f5f5"
                    : "#eef8ff",
                }}
              >

                <h3>
                  {item.read ? "✅ Read" : "🔔 New"}
                </h3>

                <p>{item.message}</p>

                <p>
                  <strong>From:</strong> {item.sender}
                </p>

                <p>
                  <strong>Title:</strong> {item.title}
                </p>



                <div
                  style={{
                    marginTop: "15px",
                    display: "flex",
                    gap: "10px",
                  }}
                >

                  {!item.read && (

                    <button
                      className="add-btn"
                      onClick={() => handleMarkAsRead(item.id)}
                    >
                      Mark as Read
                    </button>

                  )}



                    <textarea
                      placeholder="Reply to Admin..."
                      value={replyText[item.id] || ""}
                      onChange={(e) =>
                        setReplyText({
                          ...replyText,
                          [item.id]: e.target.value,
                        })
                      }
                      style={{
                        width: "100%",
                        marginTop: "10px",
                        marginBottom: "10px",
                      }}
                    />

                    <button
                      className="add-btn"
                      onClick={() => handleReply(item.id)}
                    >
                      Send Reply
                    </button>



                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </button>

                </div>

              </div>

            ))

          )}

        </div>
      </div>
    </div>
  );
}

export default Notifications;