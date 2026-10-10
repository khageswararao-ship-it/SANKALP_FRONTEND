import React, { useState, useEffect, useRef } from "react";
import {
  getPayroll,
  addPayroll,
  updatePayroll,
  deletePayroll,
} from "../../api/payrollApi";
import { getEmployees } from "../../api/employeeApi";
import { REAL_DEPARTMENTS, DEPARTMENT_BASE_SALARIES } from "./Employees";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import "../../styles/layout.css";
import "../../styles/Dashboard.css";

function Payroll() {
  const tableRef = useRef(null);
  const scrollTable = (dir) => {
    if (tableRef.current) {
      tableRef.current.scrollBy({ left: dir === "left" ? -280 : 280, behavior: "smooth" });
    }
  };

  const [payrollData, setPayrollData] = useState([]);
  const [employeesList, setEmployeesList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [viewPayroll, setViewPayroll] = useState(null);

  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState("");

  const [selectedDept, setSelectedDept] = useState("");
  const [newPayroll, setNewPayroll] = useState({
    id: "",
    name: "",
    department: "",
    basicSalary: "",
    bonus: "0",
    netSalary: "",
    month: "October 2026",
    status: "Pending",
  });

  useEffect(() => {
    fetchPayroll();
    fetchEmployeesList();
  }, []);

  const fetchPayroll = async () => {
    try {
      const response = await getPayroll();
      if (response && response.data) {
        setPayrollData(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      console.error("Error fetching payroll:", error);
    }
  };

  const fetchEmployeesList = async () => {
    try {
      const response = await getEmployees();
      if (response && response.data) {
        setEmployeesList(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      console.warn("Error fetching employees list:", error);
    }
  };

  const handleOpenGenerate = () => {
    setIsEditing(false);
    const initialDept = REAL_DEPARTMENTS[0];
    setSelectedDept(initialDept);

    const deptEmployees = employeesList.filter((e) => e.department === initialDept);
    const firstEmp = deptEmployees[0] || employeesList[0];
    const deptScale = DEPARTMENT_BASE_SALARIES[initialDept] || { base: 50000, bonus: 5000, total: 55000 };

    setNewPayroll({
      id: firstEmp ? firstEmp.id : "",
      name: firstEmp ? firstEmp.name : "",
      department: firstEmp ? (firstEmp.department || initialDept) : initialDept,
      basicSalary: String(deptScale.base),
      bonus: String(deptScale.bonus),
      netSalary: String(deptScale.total),
      month: "October 2026",
      status: "Pending",
    });

    setShowForm(true);
  };

  const handleDepartmentChange = (dept) => {
    setSelectedDept(dept);
    const matchingEmployees = employeesList.filter((e) => e.department === dept);
    const chosenEmp = matchingEmployees[0];
    const deptScale = DEPARTMENT_BASE_SALARIES[dept] || { base: 50000, bonus: 5000, total: 55000 };

    if (chosenEmp) {
      setNewPayroll((prev) => ({
        ...prev,
        department: dept,
        id: chosenEmp.id,
        name: chosenEmp.name,
        basicSalary: String(deptScale.base),
        bonus: String(deptScale.bonus),
        netSalary: String(deptScale.total),
      }));
    } else {
      setNewPayroll((prev) => ({
        ...prev,
        department: dept,
        id: "",
        name: "",
        basicSalary: String(deptScale.base),
        bonus: String(deptScale.bonus),
        netSalary: String(deptScale.total),
      }));
    }
  };

  const handleEmployeeSelect = (empId) => {
    const emp = employeesList.find((e) => e.id === empId);
    if (emp) {
      const dept = emp.department || selectedDept || REAL_DEPARTMENTS[0];
      const deptScale = DEPARTMENT_BASE_SALARIES[dept] || { base: 50000, bonus: 5000, total: 55000 };
      setNewPayroll((prev) => ({
        ...prev,
        id: emp.id,
        name: emp.name,
        department: dept,
        basicSalary: String(deptScale.base),
        bonus: String(deptScale.bonus),
        netSalary: String(deptScale.total),
      }));
    }
  };

  const filteredPayroll = payrollData.filter((payroll) => {
    const query = (search || "").trim().toLowerCase();
    const searchMatch =
      !query ||
      (payroll.id || "").toLowerCase().includes(query) ||
      (payroll.name || "").toLowerCase().includes(query);

    const departmentMatch =
      departmentFilter === "" || payroll.department === departmentFilter;

    const monthMatch =
      monthFilter === "" || payroll.month === monthFilter;

    return searchMatch && departmentMatch && monthMatch;
  });

  const handleSave = async () => {
    if (!newPayroll.id || !newPayroll.name || !newPayroll.basicSalary) {
      alert("Please select an employee and enter basic salary.");
      return;
    }

    try {
      const basic = Number(newPayroll.basicSalary) || 0;
      const bonus = Number(newPayroll.bonus) || 0;

      await addPayroll({
        ...newPayroll,
        basicSalary: basic,
        bonus: bonus,
        netSalary: basic + bonus,
      });

      await fetchPayroll();
      setShowForm(false);
      alert("Payroll Record Generated Successfully!");
    } catch (error) {
      console.error("Error saving payroll:", error);
      alert("Failed to generate payroll record.");
    }
  };

  const handleUpdate = async () => {
    try {
      const basic = Number(newPayroll.basicSalary) || 0;
      const bonus = Number(newPayroll.bonus) || 0;

      await updatePayroll(newPayroll.id, {
        ...newPayroll,
        basicSalary: basic,
        bonus: bonus,
        netSalary: basic + bonus,
      });

      await fetchPayroll();
      setShowForm(false);
      setIsEditing(false);
      alert("Payroll Record Updated Successfully!");
    } catch (error) {
      console.error("Error updating payroll:", error);
      alert("Failed to update payroll.");
    }
  };

  const handleEdit = (id) => {
    const record = payrollData.find((p) => p.id === id);
    if (record) {
      setNewPayroll({ ...record });
      setIsEditing(true);
      setShowForm(true);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Are you sure you want to delete payroll record for ${id}?`)) {
      return;
    }
    try {
      await deletePayroll(id);
      await fetchPayroll();
      alert("Payroll record deleted successfully.");
    } catch (error) {
      console.error("Error deleting payroll:", error);
      alert("Failed to delete payroll record.");
    }
  };

  const handleView = (id) => {
    const record = payrollData.find((p) => p.id === id);
    if (record) {
      setViewPayroll(record);
    }
  };

  return (
    <div className="layout">
      <Sidebar activePage="Payroll" />

      <div className="main-content">
        <Header title="Payroll" />

        <div className="page-content">
          <h1 className="page-title">Payroll Management</h1>

          {/* Toolbar */}
          <div className="employee-toolbar" style={{ flexWrap: "wrap", gap: "10px" }}>
            <input
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
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
            >
              <option value="">All Months</option>
              <option value="August 2026">August 2026</option>
              <option value="July 2026">July 2026</option>
              <option value="June 2026">June 2026</option>
              <option value="May 2026">May 2026</option>
            </select>

            <button
              type="button"
              className="action-btn"
              onClick={() => {
                setSearch("");
                setDepartmentFilter("");
                setMonthFilter("");
              }}
            >
              Reset
            </button>

            <button
              type="button"
              className="add-btn"
              onClick={handleOpenGenerate}
            >
              + Generate Payroll
            </button>
          </div>

          {/* Generate / Edit Payroll Popup Modal */}
          {showForm && (
            <div className="popup-overlay" onClick={() => setShowForm(false)}>
              <div className="popup-form" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "520px", width: "92vw" }}>
                <h2>{isEditing ? "Edit Payroll Record" : "Generate Payroll"}</h2>

                {!isEditing && (
                  <>
                    <label style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", marginBottom: "4px", display: "block" }}>
                      Select Department *
                    </label>
                    <select
                      className="filter-box"
                      style={{ width: "100%", marginBottom: "14px" }}
                      value={selectedDept}
                      onChange={(e) => handleDepartmentChange(e.target.value)}
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
                      value={newPayroll.id}
                      onChange={(e) => handleEmployeeSelect(e.target.value)}
                    >
                      {employeesList
                        .filter((e) => !selectedDept || e.department === selectedDept)
                        .map((emp) => (
                          <option key={emp.id} value={emp.id}>
                            {emp.name} ({emp.id})
                          </option>
                        ))}
                      {employeesList.filter((e) => !selectedDept || e.department === selectedDept).length === 0 && (
                        <option value="">No staff registered in this department</option>
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
                    value={newPayroll.id}
                    readOnly
                    placeholder="ID"
                    style={{ background: "rgba(30,136,229,0.06)", fontWeight: "700" }}
                  />
                  <input
                    type="text"
                    value={newPayroll.name}
                    readOnly
                    placeholder="Employee Name"
                    style={{ background: "rgba(30,136,229,0.06)", fontWeight: "600" }}
                  />
                </div>

                <label style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", marginBottom: "4px", display: "block" }}>
                  Basic Salary (₹) *
                </label>
                <input
                  type="number"
                  placeholder="Basic Salary"
                  value={newPayroll.basicSalary}
                  onChange={(e) =>
                    setNewPayroll({ ...newPayroll, basicSalary: e.target.value })
                  }
                />

                <label style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", marginBottom: "4px", display: "block" }}>
                  Bonus / Allowance (₹)
                </label>
                <input
                  type="number"
                  placeholder="Bonus"
                  value={newPayroll.bonus}
                  onChange={(e) =>
                    setNewPayroll({ ...newPayroll, bonus: e.target.value })
                  }
                />

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "15px" }}>
                  <div>
                    <label style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", marginBottom: "4px", display: "block" }}>
                      Month
                    </label>
                    <select
                      className="filter-box"
                      style={{ width: "100%" }}
                      value={newPayroll.month}
                      onChange={(e) =>
                        setNewPayroll({ ...newPayroll, month: e.target.value })
                      }
                    >
                      <option value="August 2026">August 2026</option>
                      <option value="July 2026">July 2026</option>
                      <option value="June 2026">June 2026</option>
                      <option value="May 2026">May 2026</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", marginBottom: "4px", display: "block" }}>
                      Payment Status
                    </label>
                    <select
                      className="filter-box"
                      style={{ width: "100%" }}
                      value={newPayroll.status}
                      onChange={(e) =>
                        setNewPayroll({ ...newPayroll, status: e.target.value })
                      }
                    >
                      <option value="Pending">Pending</option>
                      <option value="Paid">Paid</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                  <button
                    type="button"
                    className="add-btn"
                    onClick={isEditing ? handleUpdate : handleSave}
                  >
                    {isEditing ? "Update Payroll" : "Save Payroll"}
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

          {/* View Details Popup */}
          {viewPayroll && (
            <div className="popup-overlay" onClick={() => setViewPayroll(null)}>
              <div className="popup-form" onClick={(e) => e.stopPropagation()}>
                <h2>Payroll Details</h2>
                <p><strong>Employee ID:</strong> {viewPayroll.id}</p>
                <p><strong>Name:</strong> {viewPayroll.name}</p>
                <p><strong>Department:</strong> {viewPayroll.department}</p>
                <p><strong>Basic Salary:</strong> ₹{viewPayroll.basicSalary}</p>
                <p><strong>Bonus:</strong> ₹{viewPayroll.bonus}</p>
                <p><strong>Net Salary:</strong> ₹{viewPayroll.netSalary}</p>
                <p><strong>Month:</strong> {viewPayroll.month}</p>
                <p><strong>Status:</strong> {viewPayroll.status}</p>

                <button
                  type="button"
                  className="add-btn"
                  onClick={() => setViewPayroll(null)}
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* Payroll Table with responsive scroll */}
          <div className="table-container" ref={tableRef} style={{ overflowX: "auto", WebkitOverflowScrolling: "touch", width: "100%" }}>
            <table className="employee-table" style={{ minWidth: "750px", width: "100%" }}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>Basic Salary</th>
                  <th>Bonus</th>
                  <th>Net Salary</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayroll.length > 0 ? (
                  filteredPayroll.map((payroll) => (
                    <tr key={`${payroll.id}-${payroll.month}`}>
                      <td><strong>{payroll.id}</strong></td>
                      <td>{payroll.name}</td>
                      <td>{payroll.department}</td>
                      <td>₹{Number(payroll.basicSalary || 0).toLocaleString()}</td>
                      <td>₹{Number(payroll.bonus || 0).toLocaleString()}</td>
                      <td>₹{Number(payroll.netSalary || 0).toLocaleString()}</td>
                      <td>
                        <span
                          className={`status ${
                            payroll.status === "Paid" ? "active" : "pending"
                          }`}
                        >
                          {payroll.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: "6px" }}>
                          <button
                            type="button"
                            className="action-btn view"
                            onClick={() => handleView(payroll.id)}
                          >
                            View
                          </button>
                          <button
                            type="button"
                            className="action-btn edit"
                            onClick={() => handleEdit(payroll.id)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="action-btn delete"
                            onClick={() => handleDelete(payroll.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>
                      No payroll records found. Click "+ Generate Payroll" to create one.
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

export default Payroll;