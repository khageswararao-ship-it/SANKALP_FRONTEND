import React, { useState } from "react";
import { useEffect } from "react";
import {
  getAttendance,
  addAttendance,
  updateAttendance,
  deleteAttendance,
} from "../../api/attendanceApi";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import "../../styles/layout.css";
import "../../styles/Dashboard.css";

function Attendance() {

  const navigate = useNavigate();

const [attendance, setAttendance] = useState([]);

useEffect(() => {
  fetchAttendance();
}, []);

const fetchAttendance = async () => {
  try {
    const response = await getAttendance();
    setAttendance(response.data);
  } catch (error) {
    console.error("Error fetching attendance:", error);
  }
};

  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [viewAttendance, setViewAttendance] = useState(null);

  // Search & Filters
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const [newAttendance, setNewAttendance] = useState({
  employeeId: "",
  employeeName: "",
  department: "",
  date: "",
  checkIn: "",
  checkOut: "",
  status: "Present",
});

  // Summary
  const presentCount = attendance.filter(
    (a) => a.status === "Present"
  ).length;

  const absentCount = attendance.filter(
    (a) => a.status === "Absent"
  ).length;

  const lateCount = attendance.filter(
    (a) => a.status === "Late"
  ).length;

  const leaveCount = attendance.filter(
    (a) => a.status === "Leave"
  ).length;

  // Filter Records
  const filteredAttendance = attendance.filter((record) => {

   
      const searchMatch =
        record.employeeId.toLowerCase().includes(search.toLowerCase()) ||
        record.employeeName.toLowerCase().includes(search.toLowerCase());

    const departmentMatch =
      departmentFilter === "" ||
      record.department === departmentFilter;

    const statusMatch =
      statusFilter === "" ||
      record.status === statusFilter;

    const dateMatch =
      dateFilter === "" ||
      record.date === dateFilter;

    return (
      searchMatch &&
      departmentMatch &&
      statusMatch &&
      dateMatch
    );
  });

const handleMarkAttendance = () => {

  setIsEditing(false);

  setNewAttendance({
    id: "",
    name: "",
    department: "",
    date: "",
    checkIn: "",
    checkOut: "",
    status: "Present",
  });

  setShowForm(true);
};

const handleSaveAttendance = async () => {
  if (
    !newAttendance.employeeId ||
    !newAttendance.employeeName ||
    !newAttendance.department ||
    !newAttendance.date
  ) {
    alert("Please fill all fields");
    return;
  }

  try {
    await addAttendance(newAttendance);
    await fetchAttendance();

    setNewAttendance({
      employeeId: "",
      employeeName: "",
      department: "",
      date: "",
      checkIn: "",
      checkOut: "",
      status: "Present",
    });

    setShowForm(false);
    alert("Attendance Marked Successfully!");
  } catch (error) {
    console.error("Error saving attendance:", error);
  }
};






const handleView = (id) => {
  const record = attendance.find((att) => att.id === id);

  if (record) {
    setViewAttendance(record);
  }
};

    const handleEdit = (id) => {
      const record = attendance.find((att) => att.id === id);

      if (record) {
        setNewAttendance(record);
        setIsEditing(true);
        setShowForm(true);
      }
    };;

const handleUpdateAttendance = async () => {
  try {
    await updateAttendance(newAttendance.id, newAttendance);
    await fetchAttendance();

    setShowForm(false);
    setIsEditing(false);

    setNewAttendance({
      id: "",
      employeeId: "",
      employeeName: "",
      department: "",
      date: "",
      checkIn: "",
      checkOut: "",
      status: "Present",
    });

    alert("Attendance Updated Successfully!");
  } catch (error) {
    console.error("Error updating attendance:", error);
  }
};


const handleDelete = async (id) => {
  if (window.confirm("Are you sure you want to delete this attendance?")) {
    try {
      await deleteAttendance(id);
      await fetchAttendance();
      alert("Attendance deleted successfully!");
    } catch (error) {
      console.error("Error deleting attendance:", error);
    }
  }
};

  return (
    <div className="layout">
      <Sidebar activePage="Attendance" />

      <div className="main-content">
        <Header title="Attendance" />

        <div className="page-content">

        <h1 className="page-title">
  Attendance Management
</h1>

<div className="dashboard-grid">

  <div className="dashboard-card">
    <h3>Total</h3>
    <h2>{attendance.length}</h2>
  </div>

  <div className="dashboard-card">
    <h3>Present</h3>
    <h2>{presentCount}</h2>
  </div>

  <div className="dashboard-card">
    <h3>Absent</h3>
    <h2>{absentCount}</h2>
  </div>

  <div className="dashboard-card">
    <h3>Late</h3>
    <h2>{lateCount}</h2>
  </div>

  <div className="dashboard-card">
    <h3>Leave</h3>
    <h2>{leaveCount}</h2>
  </div>

</div>

<div className="employee-toolbar">

  <input
    type="text"
    className="search-box"
    placeholder="Search Employee..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />

  <select
    className="filter-box"
    value={departmentFilter}
    onChange={(e) =>
      setDepartmentFilter(e.target.value)
    }
  >
    <option value="">All Departments</option>
    <option>HR</option>
    <option>IT</option>
    <option>Finance</option>
    <option>Marketing</option>
  </select>

  <select
    className="filter-box"
    value={statusFilter}
    onChange={(e) =>
      setStatusFilter(e.target.value)
    }
  >
    <option value="">All Status</option>
    <option>Present</option>
    <option>Absent</option>
    <option>Late</option>
    <option>Leave</option>
  </select>

  <input
    type="date"
    className="filter-box"
    value={dateFilter}
    onChange={(e) =>
      setDateFilter(e.target.value)
    }
  />

  <button
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
    className="add-btn"
    onClick={handleMarkAttendance}
  >
    Mark Attendance
  </button>

</div>
          {showForm && (
  <div className="popup-overlay">
    <div className="popup-form">

      <h2>Mark Attendance</h2>

      <input
        type="text"
        placeholder="Employee ID"
        value={newAttendance.employeeId}
        onChange={(e) =>
          setNewAttendance({
            ...newAttendance,
            employeeId: e.target.value,
          })
        }
      />

      <input
        type="text"
        placeholder="Employee Name"
        value={newAttendance.employeeName}
        onChange={(e) =>
          setNewAttendance({
            ...newAttendance,
            employeeName: e.target.value,
          })
        }
      />

      <input
        type="text"
        placeholder="Department"
        value={newAttendance.department}
        onChange={(e) =>
          setNewAttendance({
            ...newAttendance,
            department: e.target.value,
          })
        }
      />

      <input
        type="date"
        value={newAttendance.date}
        onChange={(e) =>
          setNewAttendance({
            ...newAttendance,
            date: e.target.value,
          })
        }
      />

      <input
        type="time"
        value={newAttendance.checkIn}
        onChange={(e) =>
          setNewAttendance({
            ...newAttendance,
            checkIn: e.target.value,
          })
        }
      />

      

      <select
        value={newAttendance.status}
        onChange={(e) =>
          setNewAttendance({
            ...newAttendance,
            status: e.target.value,
          })
        }
      >
        <option>Present</option>
        <option>Absent</option>
        <option>Late</option>
        <option>Leave</option>
      </select>

      <button
        className="add-btn"
        onClick={
          isEditing
            ? handleUpdateAttendance
            : handleSaveAttendance
        }
      >
        {isEditing ? "Update" : "Save"}
      </button>

      <button
        className="delete-btn"
       onClick={() => {
  setShowForm(false);
  setIsEditing(false);

  setNewAttendance({
    id: "",
    name: "",
    department: "",
    date: "",
    checkIn: "",
    checkOut: "",
    status: "Present",
  });
}}
      >
        Cancel
      </button>

    </div>
  </div>
)}

{viewAttendance && (
  <div className="popup-overlay">
    <div className="popup-form">

     <h2>Employee Attendance Details</h2>

      <p><strong>Employee ID:</strong> {viewAttendance.id}</p>

      <p><strong>Name:</strong> {viewAttendance.name}</p>

      <p><strong>Department:</strong> {viewAttendance.department}</p>

      <p><strong>Date:</strong> {viewAttendance.date}</p>

      <p><strong>Check In:</strong> {viewAttendance.checkIn}</p>

      <p><strong>Check Out:</strong> {viewAttendance.checkOut}</p>

      <p><strong>Status:</strong> {viewAttendance.status}</p>

      <button
        className="add-btn"
        onClick={() =>  setViewAttendance(null)}
      >
        Close
      </button>

    </div>
  </div>
)}


          <div className="table-container">

            <table className="employee-table">

              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Date</th>
                  <th>Check In</th>
                  
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
  {filteredAttendance.map((record) => (
    <tr key={record.id}>
      <td>{record.employeeId}</td>
      <td>{record.employeeName}</td>
      <td>{record.department}</td>
      <td>{record.date}</td>
      <td>{record.checkIn}</td>
      
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
        <button
          className="action-btn view"
          onClick={() => handleView(record.id)}
        >
          View
        </button>

        <button
          className="action-btn edit"
          onClick={() => handleEdit(record.id)}
        >
          Edit
        </button>

        <button
          className="action-btn delete"
          onClick={() => handleDelete(record.id)}
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
export default Attendance;