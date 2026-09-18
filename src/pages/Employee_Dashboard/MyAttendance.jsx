import React, { useState, useEffect } from "react";
import {
  getMyAttendance,
  getAttendanceSummary,
} from "../../api/myAttendanceApi";
import Header from "../../components/Header";
import EmployeeSidebar from "../../components/EmployeeSidebar";
import "../../styles/layout.css";
import "../../styles/Dashboard.css";
import "../../styles/MyAttendance.css";

function MyAttendance() {

  const [attendance, setAttendance] = useState([]);

  const employeeId = localStorage.getItem("employeeId");

const [summary, setSummary] = useState({
  present: 0,
  absent: 0,
  late: 0,
  percentage: 0,
});

useEffect(() => {
  loadAttendance();
  loadSummary();
}, []);

const loadAttendance = async () => {
  try {
    const response = await getMyAttendance(employeeId);
    setAttendance(response.data);
  } catch (error) {
    console.error(error);
  }
};

const loadSummary = async () => {
  try {
    const response = await getAttendanceSummary(employeeId);
    setSummary(response.data);
  } catch (error) {
    console.error(error);
  }
};

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case "present":
        return "present";
      case "late":
        return "late";
      case "absent":
        return "absent";
      case "leave":
        return "leave";
      default:
        return "";
    }
  };


const downloadReport = () => {
  const report = attendance
    .map(
      (item) =>
        `${item.date} | ${item.checkIn} | ${item.status}`
    )
    .join("\n");

  const blob = new Blob([report], { type: "text/plain" });
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "Attendance_Report.txt";
  link.click();

  window.URL.revokeObjectURL(url);
};


  return (
    <div className="layout">
      <EmployeeSidebar activePage="My Attendance" />

      <div className="main-content">
        <Header
          title="My Attendance"
          profilePath="/employee/profile"
          notificationPath="/employee/notifications"
        />

        <div className="page-content">
          <h1 className="page-title">My Attendance</h1>

          {/* Top Controls */}
          <div className="table-header">
            <input
              type="date"
              className="search-input"
            />
                <button className="add-btn" onClick={downloadReport} >
                Download Report
                </button>
          </div>

          {/* Summary Cards */}
          <div className="dashboard-grid">
            <div className="dashboard-card">
              <h3>Present</h3>
              <h2>{summary.present}</h2>
            </div>

            <div className="dashboard-card">
              <h3>Absent</h3>
              <h2>{summary.absent}</h2>
            </div>

            <div className="dashboard-card">
              <h3>Late</h3>
              <h2>{summary.late}</h2>
            </div>

            <div className="dashboard-card">
              <h3>Attendance</h3>
              <h2>{summary.percentage}%</h2>
            </div>
          </div>

          {/* Attendance Progress */}
          <div className="attendance-progress">
            <div className="progress-title">
              <span>Monthly Attendance</span>
              <span>95%</span>
            </div>

            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${summary.percentage}%` }}
              ></div>
            </div>
          </div>

          {/* Attendance Table */}
          <div className="table-container">
            <table className="employee-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Check In</th>
                  
                  
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {attendance.map((item, index) => (
                  <tr key={index}>
                    <td>{item.date}</td>
                    <td>{item.checkIn}</td>
                    
                    
                    <td>
                      <span className={`status ${getStatusClass(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
}

export default MyAttendance;