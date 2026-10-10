import React, { useState, useEffect } from "react";
import { getEmployeeDashboard } from "../../api/employeeDashboardApi";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import EmployeeSidebar from "../../components/EmployeeSidebar";
import "../../styles/layout.css";
import "../../styles/EmployeeDashboard.css";

function EmployeeDashboard() {

const navigate = useNavigate();

const [employee, setEmployee] = useState({
  id: "",
  name: "",
  designation: "",
  attendance: 0,
  leaveBalance: 0,
  salary: 0,
  notifications: 0,
});

useEffect(() => {
  fetchEmployeeDashboard();
}, []);

const fetchEmployeeDashboard = async () => {
  try {

    const employeeId = localStorage.getItem("employeeId");

    const response = await getEmployeeDashboard(employeeId);

    setEmployee(response.data);

  } catch (error) {
    console.error("Error fetching employee dashboard:", error);
  }
};

const [currentTime, setCurrentTime] = useState(
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
);

useEffect(() => {
  const t = setInterval(() => {
    setCurrentTime(
      new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
    );
  }, 1000);
  return () => clearInterval(t);
}, []);

const today = new Date();

  return (
    <div className="layout">
      <EmployeeSidebar activePage="Dashboard" />

      <div className="main-content">
        <Header title="Employee Dashboard" profilePath="/employee/profile" notificationPath="/employee/notifications" />

          <div className="page-content">

            {/* Welcome Card with Live Time & Portal Status */}
            <div className="welcome-card">

                <div
                style={{
                display:"flex",
                justifyContent:"space-between",
                alignItems:"center",
                flexWrap:"wrap",
                gap:"10px",
                marginBottom:"20px"
                }}
                >
                  <div style={{ background: "rgba(30,136,229,0.12)", border: "1px solid rgba(30,136,229,0.3)", padding: "6px 16px", borderRadius: "20px", fontSize: "13px", fontWeight: "700", color: "#1E88E5" }}>
                    🕒 Live Clock: {currentTime}
                  </div>

                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      className="add-btn"
                      onClick={() => navigate("/employee/attendance")}
                      style={{ background: "#10b981", boxShadow: "0 4px 12px rgba(16,185,129,0.35)" }}
                    >
                      📍 Attendance Check-In
                    </button>
                    <button
                      className="action-btn"
                      onClick={() => navigate("/employee/notifications")}
                    >
                      🔔 Notifications
                    </button>
                  </div>
                </div>


              <div>
                <h2>Welcome Back, {employee.name || "Employee"} 👋</h2>
                <p>{employee.designation || "Staff Member"} | Employee ID: <strong>{employee.id}</strong></p>
                <p style={{ marginTop: "4px" }}>🏢 Department: <strong>{employee.department || "Corporate"}</strong></p>
              </div>

              <div className="welcome-date">
                <h3>{today.toLocaleDateString()}</h3>
                <p>{today.toLocaleDateString("en-US",{weekday:"long"})}</p>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="dashboard-grid">

              <div className="dashboard-card">
                <h3>📅 Attendance</h3>
               <h2>{employee.attendance}%</h2>
              </div>

              <div className="dashboard-card">
                <h3>🌴 Leave Balance</h3>
               <h2>{employee.leaveBalance} Days</h2>
              </div>

              <div className="dashboard-card">
                <h3>💰 Salary</h3>
                <h2>₹{employee.salary.toLocaleString()}</h2>
              </div>

              <div className="dashboard-card">
                <h3>🔔 Notifications</h3>
                <h2>{employee.notifications}</h2>
              </div>

            </div>

            {/* Quick Actions */}
              <div className="quick-actions">

              <button
              className="action-btn"
              onClick={()=>navigate("/employee/leave")}
              >
              Apply Leave
              </button>

              <button
              className="action-btn"
              onClick={()=>navigate("/employee/payroll")}
              >
              View Payslip
              </button>

              <button
              className="action-btn"
              onClick={()=>navigate("/employee/attendance")}
              >
              Attendance
              </button>

              <button
              className="action-btn"
              onClick={()=>navigate("/employee/profile")}
              >
              My Profile
              </button>

              </div>

            {/* Attendance Progress */}
            <div className="attendance-progress">

              <div className="progress-title">
                <span>Attendance Progress</span>
                <span>{employee.attendance}%</span>
              </div>

              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${employee.attendance}%` }}
                ></div>
              </div>

            </div>


<div className="dashboard-grid">

<div className="dashboard-card">
<h3>Today's Tasks</h3>
<p>✔ Complete HR Training</p>
<p>✔ Submit Daily Report</p>
</div>

<div className="dashboard-card">
<h3>Upcoming Meeting</h3>
<p>Project Review</p>
<p>03:00 PM</p>
</div>



           </div>

          </div>
      </div>
    </div>
  );
}

export default EmployeeDashboard;