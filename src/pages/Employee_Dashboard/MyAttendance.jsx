import React, { useState, useEffect, useRef } from "react";
import {
  getMyAttendance,
  getAttendanceSummary,
} from "../../api/myAttendanceApi";
import { addAttendance } from "../../api/attendanceApi";
import Header from "../../components/Header";
import EmployeeSidebar from "../../components/EmployeeSidebar";
import "../../styles/layout.css";
import "../../styles/Dashboard.css";
import "../../styles/MyAttendance.css";

function MyAttendance() {
  const tableRef = useRef(null);
  const scrollTable = (dir) => {
    if (tableRef.current) {
      tableRef.current.scrollBy({ left: dir === "left" ? -280 : 280, behavior: "smooth" });
    }
  };

  const [attendance, setAttendance] = useState([]);
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
  );
  const [filterDate, setFilterDate] = useState("");
  const [isCheckingIn, setIsCheckingIn] = useState(false);

  const employeeId = localStorage.getItem("employeeId") || "EMP001";
  const employeeName = localStorage.getItem("employeeName") || "Employee";

  const [summary, setSummary] = useState({
    present: 0,
    absent: 0,
    late: 0,
    percentage: 0,
  });

  // Keep live clock running with seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(
        new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    loadAttendance();
    loadSummary();
  }, []);

  const loadAttendance = async () => {
    try {
      const response = await getMyAttendance(employeeId);
      if (response && response.data) {
        setAttendance(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      console.error("Error loading attendance:", error);
    }
  };

  const loadSummary = async () => {
    try {
      const response = await getAttendanceSummary(employeeId);
      if (response && response.data) {
        setSummary(response.data);
      }
    } catch (error) {
      console.error("Error loading summary:", error);
    }
  };

  const todayStr = new Date().toISOString().split("T")[0];
  const todayRecord = attendance.find((item) => item.date === todayStr);

  const handleLiveCheckIn = async () => {
    if (todayRecord) {
      alert(`⚠️ You have already checked in today (${todayStr}) at ${todayRecord.checkIn}.\n\nAttendance can only be registered once per calendar day (24-hour cycle).`);
      return;
    }

    setIsCheckingIn(true);
    try {
      const now = new Date();
      const liveTimeWithSec = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      // Cutoff: 09:30 AM (9 * 60 + 30 = 570 mins)
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const status = currentMinutes <= 570 ? "Present" : "Late";

      const payload = {
        employeeId: employeeId,
        employeeName: employeeName,
        date: todayStr,
        checkIn: liveTimeWithSec,
        status: status,
      };

      await addAttendance(payload);
      alert(`✅ Check-in recorded at ${liveTimeWithSec}!\nStatus: ${status}${status === "Late" ? " (Checked in after 09:30 AM)" : " (On Time)"}`);

      await loadAttendance();
      await loadSummary();
    } catch (error) {
      console.error("Error registering check-in:", error);
      alert("Failed to mark check-in. Please try again.");
    } finally {
      setIsCheckingIn(false);
    }
  };

  const getStatusClass = (status) => {
    switch (String(status || "").toLowerCase()) {
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
      .map((item) => `${item.date} | ${item.checkIn} | ${item.status}`)
      .join("\n");

    const blob = new Blob([report], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Attendance_Report_${employeeId}.txt`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredAttendance = attendance.filter((item) => {
    if (!filterDate) return true;
    return item.date === filterDate;
  });

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
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
            <h1 className="page-title" style={{ margin: 0 }}>My Attendance Portal</h1>
            <div style={{ background: "rgba(30,136,229,0.12)", border: "1px solid rgba(30,136,229,0.3)", padding: "8px 18px", borderRadius: "24px", display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "14px", fontWeight: "700", color: "#1E88E5" }}>🕒 Live Time: {currentTime}</span>
            </div>
          </div>

          {/* Live Check-In Card with 24-Hour Reset Rule */}
          <div className="welcome-card" style={{ padding: "22px 26px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
              <div>
                <h2 style={{ fontSize: "20px", marginBottom: "6px" }}>
                  {todayRecord ? "✅ Attendance Recorded for Today" : "⏱️ Today's Attendance Check-In"}
                </h2>
                <p style={{ color: "#64748b", margin: 0 }}>
                  {todayRecord
                    ? `You checked in at ${todayRecord.checkIn} today. Status: ${todayRecord.status}. Resets tomorrow.`
                    : "Office timing: 09:30 AM cutoff. Check-ins after 09:30 AM are automatically marked as Late."}
                </p>
              </div>

              <div>
                {todayRecord ? (
                  <span style={{ display: "inline-block", background: todayRecord.status === "Present" ? "rgba(16,185,129,0.15)" : "rgba(245,158,11,0.15)", color: todayRecord.status === "Present" ? "#10b981" : "#f59e0b", padding: "10px 20px", borderRadius: "12px", fontWeight: "700", fontSize: "15px" }}>
                    ✓ {todayRecord.status} ({todayRecord.checkIn})
                  </span>
                ) : (
                  <button
                    className="add-btn"
                    onClick={handleLiveCheckIn}
                    disabled={isCheckingIn}
                    style={{ fontSize: "15px", padding: "12px 24px", display: "flex", alignItems: "center", gap: "8px", boxShadow: "0 4px 14px rgba(16,185,129,0.4)", background: "#10b981" }}
                  >
                    <span>{isCheckingIn ? "Recording..." : "📍 Check In Now"}</span>
                    <span style={{ fontSize: "13px", opacity: 0.9 }}>({currentTime})</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Top Controls */}
          <div className="table-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <input
                type="date"
                className="search-input"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              />
              {filterDate && (
                <button className="action-btn" onClick={() => setFilterDate("")}>
                  Clear
                </button>
              )}
            </div>
            <button className="add-btn" onClick={downloadReport}>
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
              <h3>Attendance Rate</h3>
              <h2>{summary.percentage}%</h2>
            </div>
          </div>

          {/* Attendance Progress */}
          <div className="attendance-progress">
            <div className="progress-title">
              <span>Overall Attendance Rate</span>
              <span>{summary.percentage}%</span>
            </div>

            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${summary.percentage}%` }}
              ></div>
            </div>
          </div>

          {/* Attendance Table with responsive slidebar */}
          <div className="table-container" ref={tableRef} style={{ overflowX: "auto", WebkitOverflowScrolling: "touch", width: "100%" }}>
            <table className="employee-table" style={{ minWidth: "550px", width: "100%" }}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Check-In Time (Live)</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredAttendance.length > 0 ? (
                  filteredAttendance.map((item, index) => (
                    <tr key={index}>
                      <td><strong>{item.date}</strong></td>
                      <td>{item.checkIn || "-"}</td>
                      <td>
                        <span className={`status ${getStatusClass(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>
                      No attendance records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Interactive Slidebar Under The Table */}
          <div className="table-slidebar-controller">
            <button
              type="button"
              className="table-slide-btn"
              onClick={() => scrollTable("left")}
              title="Slide Left"
            >
              ◀ Slide Left
            </button>
            <div className="table-slide-track">
              <span className="table-slide-text">
                👉 Slide or use buttons to view full attendance history 👈
              </span>
            </div>
            <button
              type="button"
              className="table-slide-btn"
              onClick={() => scrollTable("right")}
              title="Slide Right"
            >
              Slide Right ▶
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default MyAttendance;