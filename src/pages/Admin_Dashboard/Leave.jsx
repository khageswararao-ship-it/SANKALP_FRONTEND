import React, { useState, useEffect } from "react";
import {
  getLeave,
  addLeave,
  updateLeave,
  deleteLeave,
  getLeaveById,
} from "../../api/leaveApi";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import "../../styles/layout.css";
import "../../styles/Dashboard.css";

function Leave() {

const [leaveData, setLeaveData] = useState([]);

useEffect(() => {
  fetchLeave();
}, []);

const fetchLeave = async () => {
  try {
    const response = await getLeave();
    setLeaveData(response.data);
  } catch (error) {
    console.error("Error fetching leave:", error);
  }
};

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
  days: "",
  reason: "",
  status: "Pending",
});


const total = leaveData.length;

const approved = leaveData.filter(
  (l) => l.status === "Approved"
).length;

const pending = leaveData.filter(
  (l) => l.status === "Pending"
).length;

const rejected = leaveData.filter(
  (l) => l.status === "Rejected"
).length;


const filteredLeave = leaveData.filter((leave) => {

const searchMatch =
  (leave.id || "").toLowerCase().includes(search.toLowerCase()) ||
  (leave.name || "").toLowerCase().includes(search.toLowerCase());

  const leaveMatch =
    leaveFilter === "" ||
    leave.leaveType === leaveFilter;

  const statusMatch =
    statusFilter === "" ||
    leave.status === statusFilter;

  return searchMatch && leaveMatch && statusMatch;
});

const handleApplyLeave = () => {

  setIsEditing(false);

  setNewLeave({
    id: "",
    name: "",
    department: "",
    leaveType: "Casual Leave",
    fromDate: "",
    toDate: "",
    days: "",
    reason: "",
    status: "Pending",
  });

  setShowForm(true);
};


const handleSave = async () => {
  if (
    !newLeave.id ||
    !newLeave.name ||
    !newLeave.department
  ) {
    alert("Please fill all fields");
    return;
  }

  try {
    await addLeave(newLeave);

    fetchLeave();

    setNewLeave({
      id: "",
      name: "",
      department: "",
      leaveType: "Casual Leave",
      fromDate: "",
      toDate: "",
      days: "",
      reason: "",
      status: "Pending",
    });

    setShowForm(false);

    alert("Leave Added Successfully!");
  } catch (error) {
    console.error("Error saving leave:", error);
  }
};



const handleEdit = (id) => {
const record = leaveData.find((leave) => leave.id === id);

if (!record) {
  alert("Leave not found");
  return;
}

setNewLeave({
  id: record.id || "",
  name: record.name || "",
  department: record.department || "",
  leaveType: record.leaveType || "Casual Leave",
  fromDate: record.fromDate || "",
  toDate: record.toDate || "",
  days: record.days ?? "",
  reason: record.reason || "",
  status: record.status || "Pending",
});

  setIsEditing(true);

  setShowForm(true);
};

const handleUpdate = async () => {
  try {
    await updateLeave(newLeave.id, newLeave);

    fetchLeave();

    setShowForm(false);
    setIsEditing(false);

    setNewLeave({
      id: "",
      name: "",
      department: "",
      leaveType: "Casual Leave",
      fromDate: "",
      toDate: "",
      days: "",
      reason: "",
      status: "Pending",
    });

    alert("Leave Updated Successfully!");
  } catch (error) {
    console.error("Error updating leave:", error);
  }
};


const handleDelete = async (id) => {
  if (window.confirm("Delete Leave?")) {
    try {
      await deleteLeave(id);
      fetchLeave();
      alert("Deleted Successfully");
    } catch (error) {
      console.error("Error deleting leave:", error);
    }
  }
};

const handleApprove = async (leaveId) => {
  try {
    const leave = leaveData.find((l) => l.id === leaveId);

    const updatedLeave = {
      ...leave,
      status: "Approved",
    };

    await updateLeave(leaveId, updatedLeave);
    fetchLeave();
  } catch (error) {
    console.error("Error approving leave:", error);
  }
};

const handleReject = async (leaveId) => {
  try {
    const leave = leaveData.find((l) => l.id === leaveId);

    const updatedLeave = {
      ...leave,
      status: "Rejected",
    };

    await updateLeave(leaveId, updatedLeave);
    fetchLeave();
  } catch (error) {
    console.error("Error rejecting leave:", error);
  }
};

const handleView = async (id) => {
  try {
    const response = await getLeaveById(id);
    setViewLeave(response.data);
  } catch (error) {
    console.error("Error fetching leave:", error);
  }
};


  return (
    <div className="layout">
      <Sidebar activePage="Leave" />

      <div className="main-content">
        <Header title="Leave" />

        <div className="page-content">

          <h1 className="page-title">Leave Management</h1>

<div className="dashboard-grid">

  <div className="dashboard-card">
    <h3>Total Leaves</h3>
    <h2>{total}</h2>
  </div>

  <div className="dashboard-card">
    <h3>Approved</h3>
    <h2>{approved}</h2>
  </div>

  <div className="dashboard-card">
    <h3>Pending</h3>
    <h2>{pending}</h2>
  </div>

  <div className="dashboard-card">
    <h3>Rejected</h3>
    <h2>{rejected}</h2>
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
    value={leaveFilter}
    onChange={(e) => setLeaveFilter(e.target.value)}
  >
    <option value="">All Leave Types</option>
    <option>Casual Leave</option>
    <option>Sick Leave</option>
    <option>Annual Leave</option>
  </select>

  <select
    className="filter-box"
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
  >
    <option value="">All Status</option>
    <option>Pending</option>
    <option>Approved</option>
    <option>Rejected</option>
  </select>

  <button
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
    className="add-btn"
    onClick={handleApplyLeave}
  >
    Apply Leave
  </button>

</div>

{/* Apply / Edit Leave Popup */}

{showForm && (
  <div className="popup-overlay">
    <div className="popup-form">

      <h2>{isEditing ? "Edit Leave" : "Apply Leave"}</h2>

      <input
        type="text"
        placeholder="Employee ID"
        value={newLeave.id || ""}
        onChange={(e) =>
          setNewLeave({
            ...newLeave,
            id: e.target.value,
          })
        }
      />

      <input
        type="text"
        placeholder="Employee Name"
        value={newLeave.name || ""}
        onChange={(e) =>
          setNewLeave({
            ...newLeave,
            name: e.target.value,
          })
        }
      />

      <input
        type="text"
        placeholder="Department"
        value={newLeave.department || ""}
        onChange={(e) =>
          setNewLeave({
            ...newLeave,
            department: e.target.value,
          })
        }
      />

      <select
        value={newLeave.leaveType || ""}
        onChange={(e) =>
          setNewLeave({
            ...newLeave,
            leaveType: e.target.value,
          })
        }
      >
        <option>Casual Leave</option>
        <option>Sick Leave</option>
        <option>Annual Leave</option>
      </select>

      <input
        type="date"
        value={newLeave.fromDate || ""}
        onChange={(e) =>
          setNewLeave({
            ...newLeave,
            fromDate: e.target.value,
          })
        }
      />

      <input
        type="date"
        value={newLeave.toDate || ""}
        onChange={(e) =>
          setNewLeave({
            ...newLeave,
            toDate: e.target.value,
          })
        }
      />

      <input
        type="number"
        placeholder="Days"
        value={newLeave.days ?? ""}
        onChange={(e) =>
          setNewLeave({
            ...newLeave,
            days: e.target.value,
          })
        }
      />

      <textarea
        placeholder="Reason"
        value={newLeave.reason || ""}
        onChange={(e) =>
          setNewLeave({
            ...newLeave,
            reason: e.target.value,
          })
        }
      />

      <select
        value={newLeave.status || ""}
        onChange={(e) =>
          setNewLeave({
            ...newLeave,
            status: e.target.value,
          })
        }
      >
        <option>Pending</option>
        <option>Approved</option>
        <option>Rejected</option>
      </select>

      <button
        className="add-btn"
        onClick={isEditing ? handleUpdate : handleSave}
      >
        {isEditing ? "Update" : "Save"}
      </button>

      <button
        className="delete-btn"
        onClick={() => {

          setNewLeave({
            id: "",
            name: "",
            department: "",
            leaveType: "Casual Leave",
            fromDate: "",
            toDate: "",
            days: "",
            reason: "",
            status: "Pending",
          });


          setShowForm(false);
          setIsEditing(false);
        }}
      >
        Cancel
      </button>

    </div>
  </div>
)}

{/* View Leave Popup */}

{viewLeave && (
  <div className="popup-overlay">
    <div className="popup-form">

      <h2>Leave Details</h2>

      <p><strong>ID:</strong> {viewLeave.id}</p>
      <p><strong>Name:</strong> {viewLeave.name}</p>
      <p><strong>Department:</strong> {viewLeave.department}</p>
      <p><strong>Leave Type:</strong> {viewLeave.leaveType}</p>
      <p><strong>From:</strong> {viewLeave.fromDate}</p>
      <p><strong>To:</strong> {viewLeave.toDate}</p>
      <p><strong>Days:</strong> {viewLeave.days}</p>
      <p><strong>Reason:</strong> {viewLeave.reason}</p>
      <p><strong>Status:</strong> {viewLeave.status}</p>

      <button
        className="add-btn"
        onClick={() => setViewLeave(null)}
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
                  <th>Employee</th>
                  <th>Leave Type</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

<tbody>
  {filteredLeave.map((leave) => (
    <tr key={`${leave.id}-${leave.fromDate}-${leave.toDate}`}>

      <td>{leave.id}</td>

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

        <button
          className="action-btn view"
          onClick={() => handleView(leave.id)}
        >
          View
        </button>

        <button
          className="action-btn edit"
          onClick={() => handleEdit(leave.id)}
        >
          Edit
        </button>

        <button
          className="action-btn edit"
          onClick={() => handleApprove(leave.id)}
        >
          Approve
        </button>

        <button
          className="action-btn delete"
          onClick={() => handleReject(leave.id)}
        >
          Reject
        </button>

        <button
          className="action-btn delete"
          onClick={() => handleDelete(leave.id)}
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
export default Leave;