import React, { useState, useEffect } from "react";
import {
  getAttendance,
  addAttendance,
  updateAttendance,
  deleteAttendance,
} from "../../api/attendanceApi";
import { getEmployees } from "../../api/employeeApi";
import { REAL_DEPARTMENTS } from "./Employees";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import "../../styles/layout.css";
import "../../styles/Dashboard.css";

function Attendance() {
  const [attendance, setAttendance] = useState([]);
  const [employeesList, setEmployeesList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [viewAttendance, setViewAttendance] = useState(null);

  // Search & Filters
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const [selectedDept, setSelectedDept] = useState("");
  const [newAttendance, setNewAttendance] = useState({
    employeeId: "",
    employeeName: "",
    department: "",
    date: "",
    checkIn: "09:00 AM",
    checkOut: "06:00 PM",
    status: "Present",
  });

  useEffect(() => {
    fetchAttendance();
    fetchEmployeesList();
  }, []);

  const fetchAttendance = async () => {
    try {
      const response = await getAttendance();
      if (response && response.data) {
        setAttendance(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      console.error("Error fetching attendance:", error);
    }
  };

  const fetchEmployeesList = async () => {
    try {
      const response = await getEmployees();
      if (response && response.data) {
        setEmployeesList(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      console.warn("Error fetching employees in Attendance:", error);
    }
  };

  // Summary Metrics
  const presentCount = attendance.filter((a) => a.status === "Present").length;
  const absentCount = attendance.filter((a) => a.status === "Absent").length;
  const lateCount = attendance.filter((a) => a.status === "Late").length;
  const leaveCount = attendance.filter((a) => a.status === "Leave").length;

  // Filter Records by search, department, status, and date
  const filteredAttendance = attendance.filter((record) => {
    const searchMatch =
      (record.employeeId || "").toLowerCase().includes(search.toLowerCase()) ||
      (record.employeeName || "").toLowerCase().includes(search.toLowerCase());

    const departmentMatch =
      departmentFilter === "" || record.department === departmentFilter;

    const statusMatch =
      statusFilter === "" || record.status === statusFilter;

    const dateMatch =
      dateFilter === "" || record.date === dateFilter;

    return searchMatch && departmentMatch && statusMatch && dateMatch;
  });

  const handleMarkAttendance = () => {
    setIsEditing(false);
    const initialDept = REAL_DEPARTMENTS[0];
    setSelectedDept(initialDept);

    const deptEmployees = employeesList.filter((e) => e.department === initialDept);
    const firstEmp = deptEmployees[0] || employeesList[0];

    const today = new Date().toISOString().split("T")[0];

    setNewAttendance({
      employeeId: firstEmp ? firstEmp.id : "",
      employeeName: firstEmp ? firstEmp.name : "",
      department: firstEmp ? (firstEmp.department || initialDept) : initialDept,
      date: today,
      checkIn: "09:00 AM",
      checkOut: "06:00 PM",
      status: "Present",
    });

    setShowForm(true);
  };

  const handleDeptSelectInModal = (dept) => {
    setSelectedDept(dept);
    const matching = employeesList.filter((e) => e.department === dept);
    const chosen = matching[0];

    if (chosen) {
      setNewAttendance((prev) => ({
        ...prev,
        department: dept,
        employeeId: chosen.id,
        employeeName: chosen.name,
      }));
    } else {
      setNewAttendance((prev) => ({
        ...prev,
        department: dept,
        employeeId: "",
        employeeName: "",
      }));
    }
  };

  const handleEmployeeSelectInModal = (empId) => {
    const emp = employeesList.find((e) => e.id === empId);
    if (emp) {
      setNewAttendance((prev) => ({
        ...prev,
        employeeId: emp.id,
        employeeName: emp.name,
        department: emp.department || selectedDept,
      }));
    }
  };

  const handleSaveAttendance = async () => {
    if (!newAttendance.employeeId || !newAttendance.employeeName || !newAttendance.date) {
      alert("Please select an employee and specify the date.");
      return;
    }

    try {
      await addAttendance(newAttendance);
      await fetchAttendance();
      setShowForm(false);
      alert("Attendance Marked Successfully!");
    } catch (error) {
      console.error("Error marking attendance:", error);
      alert("Failed to mark attendance.");
    }
  };

  const handleUpdateAttendance = async () => {
    try {
      await updateAttendance(newAttendance.id, newAttendance);
      await fetchAttendance();
      setShowForm(false);
      setIsEditing(false);
      alert("Attendance Record Updated Successfully!");
    } catch (error) {
      console.error("Error updating attendance:", error);
      alert("Failed to update attendance.");
    }
  };

  const handleEdit = (id) => {
    const record = attendance.find((a) => a.id === id);
    if (record) {
      setNewAttendance({ ...record });
      setIsEditing(true);
      setShowForm(true);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this attendance entry?")) return;
    try {
      await deleteAttendance(id);
      await fetchAttendance();
      alert("Attendance record deleted.");
    } catch (error) {
      console.error("Error deleting attendance:", error);
    }
  };

  const handleView = (id) => {
    const record = attendance.find((a) => a.id === id);
    if (record) setViewAttendance(record);
  };

  return (
    <div className="layout">
      <Sidebar activePage="Attendance" />

      <div className="main-content">
        <Header title="Attendance" />

        <div className="page-content">
          <h1 className="page-title">Employee Attendance by Department</h1>

          {/* Metrics summary */}
          <div className="dashboard-grid">
            <div className="dashboard-card">
              <h3>Present</h3>
              <h2 style={{ color: "#10b981" }}>{presentCount}</h2>
            </div>
            <div className="dashboard-card">
              <h3>Absent</h3>
              <h2 style={{ color: "#ef4444" }}>{absentCount}</h2>
            </div>
            <div className="dashboard-card">
              <h3>Late</h3>
              <h2 style={{ color: "#f59e0b" }}>{lateCount}</h2>
            </div>
            <div className="dashboard-card">
              <h3>On Leave</h3>
              <h2 style={{ color: "#6366f1" }}>{leaveCount}</h2>
            </div>
          </div>

          {/* Filter Toolbar with Comprehensive Department Selector */}
          <div className="employee-toolbar" style={{ flexWrap: "wrap", gap: "10px" }}>
            <input
              type="text"
              className="search-box"
              placeholder="🔍 Search Employee Name / ID..."
              value={search}
              style={{ minWidth: "220px" }}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              className="filter-box"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
            >
              <option value="">All Departments</option>
              {REAL_DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>

            <select
              className="filter-box"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Late">Late</option>
              <option value="Leave">Leave</option>
            </select>

            <input
              type="date"
              className="filter-box"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />

            <button
              type="button"
              className="action-btn"
              onClick={() => {
                setSearch("");
                setDepartmentFilter("");
                setStatusFilter("");
                setDateFilter("");
              }}
            >
              Reset
            </button>

            <button
              type="button"
              className="add-btn"
              onClick={handleMarkAttendance}
            >
              + Mark Attendance
            </button>
          </div>

          {/* Mark / Edit Attendance Popup */}
          {showForm && (
            <div className="popup-overlay" onClick={() => setShowForm(false)}>
              <div className="popup-form" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "520px", width: "92vw" }}>
                <h2>{isEditing ? "Edit Attendance Record" : "Mark Employee Attendance"}</h2>

                {!isEditing && (
                  <>
                    <label style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", marginBottom: "4px", display: "block" }}>
                      Select Department *
                    </label>
                    <select
                      className="filter-box"
                      style={{ width: "100%", marginBottom: "14px" }}
                      value={selectedDept}
                      onChange={(e) => handleDeptSelectInModal(e.target.value)}
                    >
                      {REAL_DEPARTMENTS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>

                    <label style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", marginBottom: "4px", display: "block" }}>
                      Select Employee from {selectedDept} *
                    </label>
                    <select
                      className="filter-box"
                      style={{ width: "100%", marginBottom: "14px" }}
                      value={newAttendance.employeeId}
                      onChange={(e) => handleEmployeeSelectInModal(e.target.value)}
                    >
                      {employeesList
                        .filter((e) => !selectedDept || e.department === selectedDept)
                        .map((emp) => (
                          <option key={emp.id} value={emp.id}>
                            {emp.name} ({emp.id})
                          </option>
                        ))}
                      {employeesList.filter((e) => !selectedDept || e.department === selectedDept).length === 0 && (
                        <option value="">No employees registered in this department</option>
                      )}
                    </select>
                  </>
                )}

                <label style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", marginBottom: "4px", display: "block" }}>
                  Employee ID & Name
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "10px", marginBottom: "14px" }}>
                  <input
                    type="text"
                    value={newAttendance.employeeId}
                    readOnly
                    placeholder="ID"
                    style={{ background: "rgba(30,136,229,0.06)", fontWeight: "700" }}
                  />
                  <input
                    type="text"
                    value={newAttendance.employeeName}
                    readOnly
                    placeholder="Name"
                    style={{ background: "rgba(30,136,229,0.06)", fontWeight: "600" }}
                  />
                </div>

                <label style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", marginBottom: "4px", display: "block" }}>
                  Department
                </label>
                <input
                  type="text"
                  value={newAttendance.department || selectedDept}
                  readOnly
                  style={{ background: "rgba(0,0,0,0.04)", marginBottom: "14px" }}
                />

                <label style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", marginBottom: "4px", display: "block" }}>
                  Date *
                </label>
                <input
                  type="date"
                  value={newAttendance.date}
                  style={{ marginBottom: "14px" }}
                  onChange={(e) =>
                    setNewAttendance({ ...newAttendance, date: e.target.value })
                  }
                />

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "14px" }}>
                  <div>
                    <label style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", marginBottom: "4px", display: "block" }}>
                      Check-In Time
                    </label>
                    <input
                      type="text"
                      placeholder="09:00 AM"
                      value={newAttendance.checkIn}
                      onChange={(e) =>
                        setNewAttendance({ ...newAttendance, checkIn: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", marginBottom: "4px", display: "block" }}>
                      Check-Out Time
                    </label>
                    <input
                      type="text"
                      placeholder="06:00 PM"
                      value={newAttendance.checkOut}
                      onChange={(e) =>
                        setNewAttendance({ ...newAttendance, checkOut: e.target.value })
                      }
                    />
                  </div>
                </div>

                <label style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", marginBottom: "4px", display: "block" }}>
                  Attendance Status *
                </label>
                <select
                  className="filter-box"
                  style={{ width: "100%", marginBottom: "20px" }}
                  value={newAttendance.status}
                  onChange={(e) =>
                    setNewAttendance({ ...newAttendance, status: e.target.value })
                  }
                >
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                  <option value="Late">Late</option>
                  <option value="Leave">Leave</option>
                </select>

                <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                  <button
                    type="button"
                    className="add-btn"
                    onClick={isEditing ? handleUpdateAttendance : handleSaveAttendance}
                  >
                    {isEditing ? "Update Record" : "Save Attendance"}
                  </button>
                  <button
                    type="button"
                    className="delete-btn"
                    onClick={() => {
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

          {/* View Attendance Popup */}
          {viewAttendance && (
            <div className="popup-overlay" onClick={() => setViewAttendance(null)}>
              <div className="popup-form" onClick={(e) => e.stopPropagation()}>
                <h2>Attendance Record Details</h2>
                <p><strong>Employee ID:</strong> {viewAttendance.employeeId}</p>
                <p><strong>Name:</strong> {viewAttendance.employeeName}</p>
                <p><strong>Department:</strong> {viewAttendance.department || "-"}</p>
                <p><strong>Date:</strong> {viewAttendance.date}</p>
                <p><strong>Check In:</strong> {viewAttendance.checkIn || "-"}</p>
                <p><strong>Check Out:</strong> {viewAttendance.checkOut || "-"}</p>
                <p><strong>Status:</strong> {viewAttendance.status}</p>

                <button
                  type="button"
                  className="add-btn"
                  onClick={() => setViewAttendance(null)}
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* Attendance Table with responsive slidebar */}
          <div className="table-container" style={{ overflowX: "auto", WebkitOverflowScrolling: "touch", width: "100%" }}>
            <table className="employee-table" style={{ minWidth: "750px", width: "100%" }}>
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Employee Name</th>
                  <th>Department</th>
                  <th>Date</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAttendance.length > 0 ? (
                  filteredAttendance.map((record, index) => (
                    <tr key={record.id || `${record.employeeId}-${record.date}-${index}`}>
                      <td><strong>{record.employeeId}</strong></td>
                      <td>{record.employeeName}</td>
                      <td>{record.department || "-"}</td>
                      <td>{record.date}</td>
                      <td>{record.checkIn || "-"}</td>
                      <td>{record.checkOut || "-"}</td>
                      <td>
                        <span
                          className={`status ${
                            record.status === "Present"
                              ? "active"
                              : record.status === "Late"
                              ? "pending"
                              : record.status === "Leave"
                              ? "approved"
                              : "inactive"
                          }`}
                        >
                          {record.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: "6px" }}>
                          <button
                            type="button"
                            className="action-btn view"
                            onClick={() => handleView(record.id)}
                          >
                            View
                          </button>
                          <button
                            type="button"
                            className="action-btn edit"
                            onClick={() => handleEdit(record.id)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="action-btn delete"
                            onClick={() => handleDelete(record.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
                      No attendance records found matching the filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Attendance;