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

function Employees() {
  const navigate = useNavigate();

const [employees, setEmployees] = useState([]);


const [newEmployee, setNewEmployee] = useState({
  id: "",
  name: "",
  department: "",
  email: "",
  status: "Active",
});




const [showForm, setShowForm] = useState(false);

useEffect(() => {
  fetchEmployees();
}, []);

const fetchEmployees = async () => {

  try {
    const response = await getEmployees();
    setEmployees(response.data);
  } catch (error) {
    console.error("Error fetching employees:", error);
  }
};


const handleAddEmployee = () => {
  setShowForm(true);
};


const handleSaveEmployee = async () => {
    if (
      !newEmployee.id ||
      !newEmployee.name ||
      !newEmployee.department ||
      !newEmployee.email
    ) {
    alert("Please fill all fields");
    return;
  }

  try {
const employeeData = {
  id: newEmployee.id,
  name: newEmployee.name,
  email: newEmployee.email,
  department: newEmployee.department,
  status: newEmployee.status,
};

await addEmployee(employeeData);

    await fetchEmployees();

    setNewEmployee({
      id: "",
      name: "",
      department: "",
      email: "",
      status: "Active",
    });

    setShowForm(false);

    alert("Employee Added Successfully!");
  } catch (error) {
    console.error("Error adding employee:", error);
    alert("Failed to add employee.");
  }
};


const handleUpdateEmployee = async () => {
  try {
    await updateEmployee(newEmployee.id, newEmployee);

    await fetchEmployees();

    setShowForm(false);
    setIsEditing(false);

    setNewEmployee({
      id: "",
      name: "",
      department: "",
      email: "",
      status: "Active",
    });

    alert("Employee Updated Successfully!");
  } catch (error) {
    console.error("Error updating employee:", error);
    alert("Failed to update employee.");
  }
};


const handleView = (id) => {
  const employee = employees.find((emp) => emp.id === id);

  setSelectedEmployee(employee);
  setShowView(true);
};

  const [isEditing, setIsEditing] = useState(false);
  const [showView, setShowView] = useState(false);
const [selectedEmployee, setSelectedEmployee] = useState(null);
const [searchTerm, setSearchTerm] = useState("");

const handleEdit = (id) => {
  const employee = employees.find(emp => emp.id === id);

  setNewEmployee(employee);

  setIsEditing(true);

  setShowForm(true);
};

const handleDelete = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this employee?"
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


const filteredEmployees = employees.filter((employee) =>
  employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  employee.id.toLowerCase().includes(searchTerm.toLowerCase())
);

  return (
    <div className="layout">
      <Sidebar activePage="Employees" />

      <div className="main-content">
        <Header title="Employees" />
        <div className="page-content">

          <h1 className="page-title">Employee Management</h1>

          {/* Top Bar */}
          <div className="employee-toolbar">


              <input
                type="text"
                placeholder="🔍 Search Employee..."
                className="search-box"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

            <select className="filter-box">
              <option>All Departments</option>
              <option>HR</option>
              <option>IT</option>
              <option>Finance</option>
              <option>Marketing</option>
            </select>

            <select className="filter-box">
              <option>All Status</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>

              <button
                className="add-btn"
                onClick={handleAddEmployee}
              >
                + Add Employee
              </button>

          </div>



{
   showForm && (

  <div className="popup-overlay">
    <div className="popup-form">

      



        <h2>{isEditing ? "Edit Employee" : "Add Employee"}</h2>

        <input
          type="text"
          placeholder="Employee ID (EMP001)"
          value={newEmployee.id}
          disabled={isEditing}
          onChange={(e) =>
            setNewEmployee({
              ...newEmployee,
              id: e.target.value,
            })
          }
        />

        <input
          type="text"
          placeholder="Employee Name"
          value={newEmployee.name}
          onChange={(e) =>
            setNewEmployee({
              ...newEmployee,
              name: e.target.value,
            })
          }
        />

      <input
        type="email"
        placeholder="Email"
        value={newEmployee.email}
        onChange={(e) =>
          setNewEmployee({
            ...newEmployee,
            email: e.target.value,
          })
        }
      />

      <input
        type="text"
        placeholder="Department"
        value={newEmployee.department || ""}
        onChange={(e) =>
          setNewEmployee({
            ...newEmployee,
            department: e.target.value,
          })
        }
      />

        <button
          className="add-btn"
          onClick={
            isEditing
              ? handleUpdateEmployee
              : handleSaveEmployee
          }
        >
          {isEditing ? "Update" : "Save"}
        </button>

        <button
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
)}


{showView && selectedEmployee && (
  <div className="popup-overlay">
    <div className="popup-form">

      <h2>Employee Details</h2>

      <p><strong>ID:</strong> {selectedEmployee.id}</p>
      <p><strong>Name:</strong> {selectedEmployee.name}</p>
      <p><strong>Email:</strong> {selectedEmployee.email}</p>
      <p><strong>Department:</strong> {selectedEmployee.department}</p>
      <p><strong>Status:</strong> {selectedEmployee.status}</p>

      <button
        className="add-btn"
        onClick={() => setShowView(false)}
      >
        Close
      </button>

    </div>
  </div>
)}


          {/* Employee Table */}

          <div className="table-container">

            <table className="employee-table">

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
  {filteredEmployees.map((employee) => (
    <tr key={employee.id}>
      <td>{employee.id}</td>
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

export default Employees;