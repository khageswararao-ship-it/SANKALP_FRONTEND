import React, { useState, useEffect, useRef } from "react";
import {
  getLeave,
  addLeave,
  updateLeave,
  deleteLeave,
  getLeaveById,
} from "../../api/leaveApi";
import { getEmployees } from "../../api/employeeApi";
import { REAL_DEPARTMENTS } from "./Employees";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import "../../styles/layout.css";
import "../../styles/Dashboard.css";

function Leave() {
  const tableRef = useRef(null);
  const scrollTable = (dir) => {
    if (tableRef.current) {
      tableRef.current.scrollBy({ left: dir === "left" ? -280 : 280, behavior: "smooth" });
    }
  };

  const [leaveData, setLeaveData] = useState([]);
  const [employeesList, setEmployeesList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [viewLeave, setViewLeave] = useState(null);

  const [search, setSearch] = useState("");
  const [leaveFilter, setLeaveFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [newLeave, setNewLeave] = useState({
    id: "",
    name: "",
    department: "",
    leaveType: "Casual Leave",
    fromDate: "",
    toDate: "",
    days: "1",
    reason: "",
    status: "Pending",
  });

  useEffect(() => {
    fetchLeave();
    fetchEmployees();
  }, []);

  const fetchLeave = async () => {
    try {
      const response = await getLeave();
      if (response && response.data) {
        setLeaveData(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      console.error("Error fetching leave:", error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await getEmployees();
      if (response && response.data) {
        setEmployeesList(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      console.warn("Error fetching employees in Leave:", error);
    }
  };

  const total = leaveData.length;
  const approved = leaveData.filter((l) => l.status === "Approved").length;
  const pending = leaveData.filter((l) => l.status === "Pending").length;
  const rejected = leaveData.filter((l) => l.status === "Rejected").length;

  const filteredLeave = leaveData.filter((leave) => {
    const searchMatch =
      (leave.id || "").toLowerCase().includes(search.toLowerCase()) ||
      (leave.name || "").toLowerCase().includes(search.toLowerCase());

    const leaveMatch =
      leaveFilter === "" || leave.leaveType === leaveFilter;

    const statusMatch =
      statusFilter === "" || leave.status === statusFilter;

    return searchMatch && leaveMatch && statusMatch;
  });

  const handleApplyLeave = () => {
    setIsEditing(false);
    const firstEmp = employeesList[0];

    setNewLeave({
      id: firstEmp ? firstEmp.id : "",
      name: firstEmp ? firstEmp.name : "",
      department: firstEmp ? (firstEmp.department || REAL_DEPARTMENTS[0]) : REAL_DEPARTMENTS[0],
      leaveType: "Casual Leave",
      fromDate: new Date().toISOString().split("T")[0],
      toDate: new Date().toISOString().split("T")[0],
      days: "1",
      reason: "",
      status: "Pending",
    });

    setShowForm(true);
  };

  const handleSelectEmployee = (empId) => {
    const emp = employeesList.find((e) => e.id === empId);
    if (emp) {
      setNewLeave((prev) => ({
        ...prev,
        id: emp.id,
        name: emp.name,
        department: emp.department || REAL_DEPARTMENTS[0],
      }));
    }
  };

  const handleSave = async () => {
    if (!newLeave.id || !newLeave.name || !newLeave.fromDate || !newLeave.toDate) {
      alert("Please select an employee and choose valid leave dates.");
      return;
    }

    try {
      await addLeave(newLeave);
      await fetchLeave();

      setShowForm(false);
      alert("Leave Application Submitted Successfully!");
    } catch (error) {
      console.error("Error saving leave:", error);
      alert("Failed to submit leave application.");
    }
  };

  const handleEdit = (id) => {
    const record = leaveData.find((leave) => leave.id === id);
    if (record) {
      setNewLeave({ ...record });
      setIsEditing(true);
      setShowForm(true);
    }
  };

  const handleUpdate = async () => {
    try {
      await updateLeave(newLeave.id, newLeave);
      await fetchLeave();

      setShowForm(false);
      setIsEditing(false);
      alert("Leave Record Updated Successfully!");
    } catch (error) {
      console.error("Error updating leave:", error);
      alert("Failed to update leave.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this leave record?")) return;
    try {
      await deleteLeave(id);
      await fetchLeave();
      alert("Leave record deleted.");
    } catch (error) {
      console.error("Error deleting leave:", error);
    }
  };

  const handleApprove = async (leaveId) => {
    try {
      const leave = leaveData.find((l) => l.id === leaveId);
      if (leave) {
        await updateLeave(leaveId, { ...leave, status: "Approved" });
        await fetchLeave();
      }
    } catch (error) {
      console.error("Error approving leave:", error);
    }
  };

  const handleReject = async (leaveId) => {
    try {
      const leave = leaveData.find((l) => l.id === leaveId);
      if (leave) {
        await updateLeave(leaveId, { ...leave, status: "Rejected" });
        await fetchLeave();
      }
    } catch (error) {
      console.error("Error rejecting leave:", error);
    }
  };

  const handleView = async (id) => {
    try {
      const response = await getLeaveById(id);
      setViewLeave(response.data);
    } catch (error) {
      const record = leaveData.find((l) => l.id === id);
      if (record) setViewLeave(record);
    }
  };

  return (
    <div className="layout">
      <Sidebar activePage="Leave" />

      <div className="main-content">
        <Header title="Leave" />

        <div className="page-content">
          <h1 className="page-title">Leave Management</h1>

          {/* Metric Cards */}
          <div className="dashboard-grid">
            <div className="dashboard-card">
              <h3>Total Leaves</h3>
              <h2>{total}</h2>
            </div>
            <div className="dashboard-card">
              <h3>Approved</h3>
              <h2 style={{ color: "#10b981" }}>{approved}</h2>
            </div>
            <div className="dashboard-card">
              <h3>Pending</h3>
              <h2 style={{ color: "#FB8C00" }}>{pending}</h2>
            </div>
            <div className="dashboard-card">
              <h3>Rejected</h3>
              <h2 style={{ color: "#ef4444" }}>{rejected}</h2>
            </div>
          </div>

          {/* Toolbar */}
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
              value={leaveFilter}
              onChange={(e) => setLeaveFilter(e.target.value)}
            >
              <option value="">All Leave Types</option>
              <option value="Casual Leave">Casual Leave</option>
              <option value="Sick Leave">Sick Leave</option>
              <option value="Annual Leave">Annual Leave</option>
              <option value="Maternity / Paternity">Maternity / Paternity</option>
            </select>

            <select
              className="filter-box"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>

            <button
              type="button"
              className="action-btn"
              onClick={() => {
                setSearch("");
                setLeaveFilter("");
                setStatusFilter("");
              }}
            >
              Reset
            </button>

            <button
              type="button"
              className="add-btn"
              onClick={handleApplyLeave}
            >
              + Apply Leave
            </button>
          </div>

          {/* Apply / Edit Leave Popup */}
          {showForm && (
            <div className="popup-overlay" onClick={() => setShowForm(false)}>
              <div className="popup-form" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "500px", width: "92vw" }}>
                <h2>{isEditing ? "Edit Leave Request" : "Apply Leave for Employee"}</h2>

                {!isEditing && (
                  <>
                    <label style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", marginBottom: "4px", display: "block" }}>
                      Select Registered Employee *
                    </label>
                    <select
                      className="filter-box"
                      style={{ width: "100%", marginBottom: "14px" }}
                      value={newLeave.id}
                      onChange={(e) => handleSelectEmployee(e.target.value)}
                    >
                      {employeesList.map((emp) => (
                        <option key={emp.id} value={emp.id}>
                          {emp.name} ({emp.id}) — {emp.department || "General"}
                        </option>
                      ))}
                      {employeesList.length === 0 && (
                        <option value="">No registered employees available</option>
                      )}
                    </select>
                  </>
                )}

                <label style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", marginBottom: "4px", display: "block" }}>
                  Employee ID & Name (Original Record)
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "10px", marginBottom: "14px" }}>
                  <input
                    type="text"
                    value={newLeave.id || ""}
                    readOnly
                    placeholder="ID"
                    style={{ background: "rgba(30,136,229,0.06)", fontWeight: "700" }}
                  />
                  <input
                    type="text"
                    value={newLeave.name || ""}
                    readOnly
                    placeholder="Employee Name"
                    style={{ background: "rgba(30,136,229,0.06)", fontWeight: "600" }}
                  />
                </div>

                <label style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", marginBottom: "4px", display: "block" }}>
                  Department
                </label>
                <input
                  type="text"
                  value={newLeave.department || ""}
                  readOnly
                  style={{ background: "rgba(0,0,0,0.04)", marginBottom: "14px" }}
                />

                <label style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", marginBottom: "4px", display: "block" }}>
                  Leave Type *
                </label>
                <select
                  className="filter-box"
                  style={{ width: "100%", marginBottom: "14px" }}
                  value={newLeave.leaveType || "Casual Leave"}
                  onChange={(e) =>
                    setNewLeave({ ...newLeave, leaveType: e.target.value })
                  }
                >
                  <option value="Casual Leave">Casual Leave</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Annual Leave">Annual Leave</option>
                  <option value="Maternity / Paternity">Maternity / Paternity</option>
                </select>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "14px" }}>
                  <div>
                    <label style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", marginBottom: "4px", display: "block" }}>
                      From Date *
                    </label>
                    <input
                      type="date"
                      value={newLeave.fromDate || ""}
                      onChange={(e) =>
                        setNewLeave({ ...newLeave, fromDate: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", marginBottom: "4px", display: "block" }}>
                      To Date *
                    </label>
                    <input
                      type="date"
                      value={newLeave.toDate || ""}
                      onChange={(e) =>
                        setNewLeave({ ...newLeave, toDate: e.target.value })
                      }
                    />
                  </div>
                </div>

                <label style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", marginBottom: "4px", display: "block" }}>
                  Number of Days
                </label>
                <input
                  type="number"
                  placeholder="Days"
                  value={newLeave.days ?? "1"}
                  onChange={(e) =>
                    setNewLeave({ ...newLeave, days: e.target.value })
                  }
                />

                <label style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", marginBottom: "4px", display: "block" }}>
                  Reason for Leave
                </label>
                <textarea
                  placeholder="Provide reason for leave"
                  value={newLeave.reason || ""}
                  rows={2}
                  onChange={(e) =>
                    setNewLeave({ ...newLeave, reason: e.target.value })
                  }
                />

                <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "15px" }}>
                  <button
                    type="button"
                    className="add-btn"
                    onClick={isEditing ? handleUpdate : handleSave}
                  >
                    {isEditing ? "Update Leave" : "Submit Leave"}
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

          {/* View Leave Popup */}
          {viewLeave && (
            <div className="popup-overlay" onClick={() => setViewLeave(null)}>
              <div className="popup-form" onClick={(e) => e.stopPropagation()}>
                <h2>Leave Details</h2>
                <p><strong>Employee ID:</strong> {viewLeave.id}</p>
                <p><strong>Name:</strong> {viewLeave.name}</p>
                <p><strong>Department:</strong> {viewLeave.department || "-"}</p>
                <p><strong>Leave Type:</strong> {viewLeave.leaveType}</p>
                <p><strong>Period:</strong> {viewLeave.fromDate} to {viewLeave.toDate} ({viewLeave.days} days)</p>
                <p><strong>Reason:</strong> {viewLeave.reason || "None specified"}</p>
                <p><strong>Status:</strong> {viewLeave.status}</p>

                <button
                  type="button"
                  className="add-btn"
                  onClick={() => setViewLeave(null)}
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* Leave Table with responsive slidebar */}
          <div className="table-container" ref={tableRef} style={{ overflowX: "auto", WebkitOverflowScrolling: "touch", width: "100%" }}>
            <table className="employee-table" style={{ minWidth: "720px", width: "100%" }}>
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Employee Name</th>
                  <th>Leave Type</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeave.length > 0 ? (
                  filteredLeave.map((leave, idx) => (
                    <tr key={`${leave.id}-${leave.fromDate}-${idx}`}>
                      <td><strong>{leave.id}</strong></td>
                      <td>{leave.name}</td>
                      <td>{leave.leaveType}</td>
                      <td>{leave.fromDate}</td>
                      <td>{leave.toDate}</td>
                      <td>
                        <span
                          className={`status ${
                            leave.status === "Approved"
                              ? "active"
                              : leave.status === "Pending"
                              ? "pending"
                              : "inactive"
                          }`}
                        >
                          {leave.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: "6px" }}>
                          <button
                            type="button"
                            className="action-btn view"
                            onClick={() => handleView(leave.id)}
                          >
                            View
                          </button>
                          {leave.status === "Pending" && (
                            <>
                              <button
                                type="button"
                                className="action-btn edit"
                                style={{ background: "#10b981", color: "#fff" }}
                                onClick={() => handleApprove(leave.id)}
                              >
                                Approve
                              </button>
                              <button
                                type="button"
                                className="action-btn delete"
                                onClick={() => handleReject(leave.id)}
                              >
                                Reject
                              </button>
                            </>
                          )}
                          <button
                            type="button"
                            className="action-btn delete"
                            onClick={() => handleDelete(leave.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
                      <p style={{ margin: "0 0 6px 0", fontSize: "15px", fontWeight: "600", color: "#475569" }}>
                        No leave requests found.
                      </p>
                      <span style={{ fontSize: "13px" }}>
                        When employees apply for leave, their requests will appear here with their original Employee ID.
                      </span>
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
                👉 Touch & slide table or use buttons to view all columns 👈
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

export default Leave;