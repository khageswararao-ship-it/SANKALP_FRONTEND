import React, { useState, useEffect } from "react";
import {
  getEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
} from "../../api/employeeApi";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import "../../styles/layout.css";
import "../../styles/Dashboard.css";

export const REAL_DEPARTMENTS = [
  "Engineering & Technology",
  "Human Resources (HR)",
  "Finance & Accounting",
  "Sales & Business Development",
  "Marketing & Communications",
  "Operations & Logistics",
  "Quality Assurance (QA)",
  "Legal & Intellectual Property",
  "Product Management",
  "Customer Support & Success",
  "Administration & Facilities",
];

function Employees() {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [newEmployee, setNewEmployee] = useState({
    id: "",
    name: "",
    department: REAL_DEPARTMENTS[0],
    email: "",
    status: "Active",
  });

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showView, setShowView] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await getEmployees();
      if (response && response.data) {
        setEmployees(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const generateNextEmployeeId = () => {
    const existingNums = (employees || [])
      .map((emp) => {
        const match = String(emp.id).match(/\d+/);
        return match ? parseInt(match[0], 10) : 0;
      })
      .filter((n) => !isNaN(n));
    const maxNum = existingNums.length > 0 ? Math.max(...existingNums, 0) : 0;
    const nextNum = maxNum + 1;
    return `EMP${String(nextNum).padStart(3, "0")}`;
  };

  const handleAddEmployee = () => {
    setIsEditing(false);
    setNewEmployee({
      id: generateNextEmployeeId(),
      name: "",
      department: REAL_DEPARTMENTS[0],
      email: "",
      status: "Active",
    });
    setShowForm(true);
  };

  const handleSaveEmployee = async () => {
    if (!newEmployee.name.trim() || !newEmployee.email.trim()) {
      alert("Please enter Employee Name and Email.");
      return;
    }

    try {
      const employeeData = {
        id: newEmployee.id || generateNextEmployeeId(),
        name: newEmployee.name.trim(),
        email: newEmployee.email.trim(),
        department: newEmployee.department || REAL_DEPARTMENTS[0],
        status: newEmployee.status || "Active",
      };

      await addEmployee(employeeData);
      await fetchEmployees();

      setShowForm(false);
      alert("Employee Added Successfully!");
    } catch (error) {
      console.error("Error adding employee:", error);
      alert("Failed to add employee. Please check connection.");
    }
  };

  const handleUpdateEmployee = async () => {
    if (!newEmployee.name.trim() || !newEmployee.email.trim()) {
      alert("Please enter Employee Name and Email.");
      return;
    }

    try {
      await updateEmployee(newEmployee.id, newEmployee);
      await fetchEmployees();
      setShowForm(false);
      setIsEditing(false);
      alert("Employee Updated Successfully!");
    } catch (error) {
      console.error("Error updating employee:", error);
      alert("Failed to update employee.");
    }
  };

  const handleEdit = (id) => {
    const employee = employees.find((emp) => emp.id === id);
    if (employee) {
      setNewEmployee({
        ...employee,
        department: employee.department || REAL_DEPARTMENTS[0],
      });
      setIsEditing(true);
      setShowForm(true);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete employee ${id}?`
    );
    if (!confirmDelete) return;

    try {
      await deleteEmployee(id);
      await fetchEmployees();
      alert("Employee deleted successfully!");
    } catch (error) {
      console.error("Error deleting employee:", error);
      alert("Failed to delete employee.");
    }
  };

  const handleView = (id) => {
    const emp = employees.find((e) => e.id === id);
    if (emp) {
      setSelectedEmployee(emp);
      setShowView(true);
    }
  };

  // Filter employees by Search, Department, and Status
  const filteredEmployees = employees.filter((employee) => {
    const nameMatch = (employee.name || "").toLowerCase().includes(searchTerm.toLowerCase());
    const idMatch = (employee.id || "").toLowerCase().includes(searchTerm.toLowerCase());
    const searchPass = searchTerm === "" || nameMatch || idMatch;

    const deptPass = departmentFilter === "" || employee.department === departmentFilter;
    const statusPass = statusFilter === "" || employee.status === statusFilter;

    return searchPass && deptPass && statusPass;
  });

  return (
    <div className="layout">
      <Sidebar activePage="Employees" />

      <div className="main-content">
        <Header title="Employees" />
        <div className="page-content">
          <h1 className="page-title">Employee Management</h1>

          {/* Top Filter Toolbar */}
          <div className="employee-toolbar" style={{ flexWrap: "wrap", gap: "10px" }}>
            <input
              type="text"
              placeholder="🔍 Search Employee Name / ID..."
              className="search-box"
              style={{ minWidth: "220px" }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>

            <button
              type="button"
              className="action-btn"
              onClick={() => {
                setSearchTerm("");
                setDepartmentFilter("");
                setStatusFilter("");
              }}
            >
              Reset
            </button>

            <button
              type="button"
              className="add-btn"
              onClick={handleAddEmployee}
            >
              + Add Employee
            </button>
          </div>

          {/* Add / Edit Employee Popup */}
          {showForm && (
            <div className="popup-overlay" onClick={() => setShowForm(false)}>
              <div className="popup-form" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "500px", width: "92vw" }}>
                <h2>{isEditing ? "Edit Employee" : "Add Employee"}</h2>

                <label style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", marginBottom: "4px", display: "block" }}>
                  Employee ID {isEditing ? "(Locked)" : "(Auto-Generated)"}
                </label>
                <input
                  type="text"
                  value={newEmployee.id}
                  readOnly
                  style={{
                    background: "rgba(30,136,229,0.08)",
                    cursor: "not-allowed",
                    fontWeight: "700",
                    color: "#1E88E5",
                  }}
                />

                <label style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", marginBottom: "4px", display: "block" }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter Full Name"
                  value={newEmployee.name}
                  onChange={(e) =>
                    setNewEmployee({
                      ...newEmployee,
                      name: e.target.value,
                    })
                  }
                />

                <label style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", marginBottom: "4px", display: "block" }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  placeholder="Enter Official Email"
                  value={newEmployee.email}
                  onChange={(e) =>
                    setNewEmployee({
                      ...newEmployee,
                      email: e.target.value,
                    })
                  }
                />

                <label style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", marginBottom: "4px", display: "block" }}>
                  Department *
                </label>
                <select
                  className="filter-box"
                  style={{ width: "100%", marginBottom: "15px" }}
                  value={newEmployee.department || REAL_DEPARTMENTS[0]}
                  onChange={(e) =>
                    setNewEmployee({
                      ...newEmployee,
                      department: e.target.value,
                    })
                  }
                >
                  {REAL_DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>

                <label style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", marginBottom: "4px", display: "block" }}>
                  Employment Status
                </label>
                <select
                  className="filter-box"
                  style={{ width: "100%", marginBottom: "20px" }}
                  value={newEmployee.status || "Active"}
                  onChange={(e) =>
                    setNewEmployee({
                      ...newEmployee,
                      status: e.target.value,
                    })
                  }
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>

                <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                  <button
                    type="button"
                    className="add-btn"
                    onClick={isEditing ? handleUpdateEmployee : handleSaveEmployee}
                  >
                    {isEditing ? "Update Employee" : "Save Employee"}
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
          {showView && selectedEmployee && (
            <div className="popup-overlay" onClick={() => setShowView(false)}>
              <div className="popup-form" onClick={(e) => e.stopPropagation()}>
                <h2>Employee Details</h2>
                <p><strong>ID:</strong> {selectedEmployee.id}</p>
                <p><strong>Name:</strong> {selectedEmployee.name}</p>
                <p><strong>Email:</strong> {selectedEmployee.email}</p>
                <p><strong>Department:</strong> {selectedEmployee.department || "General"}</p>
                <p><strong>Status:</strong> {selectedEmployee.status || "Active"}</p>

                <button
                  type="button"
                  className="add-btn"
                  onClick={() => setShowView(false)}
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* Employee Table with responsive scroll */}
          <div className="table-container" style={{ overflowX: "auto", WebkitOverflowScrolling: "touch", width: "100%" }}>
            <table className="employee-table" style={{ minWidth: "650px", width: "100%" }}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map((employee) => (
                    <tr key={employee.id}>
                      <td><strong>{employee.id}</strong></td>
                      <td>{employee.name}</td>
                      <td>{employee.department || "-"}</td>
                      <td>{employee.email}</td>
                      <td>
                        <span
                          className={
                            employee.status === "Active"
                              ? "status active"
                              : "status inactive"
                          }
                        >
                          {employee.status || "Active"}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: "6px" }}>
                          <button
                            className="action-btn view"
                            onClick={() => handleView(employee.id)}
                          >
                            View
                          </button>
                          <button
                            className="action-btn edit"
                            onClick={() => handleEdit(employee.id)}
                          >
                            Edit
                          </button>
                          <button
                            className="action-btn delete"
                            onClick={() => handleDelete(employee.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>
                      No employees found matching the filters.
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

export default Employees;