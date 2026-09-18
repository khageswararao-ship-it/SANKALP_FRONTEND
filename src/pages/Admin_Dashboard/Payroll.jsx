import React, { useState, useEffect } from "react";
import {
  getPayroll,
  addPayroll,
  updatePayroll,
  deletePayroll,
  getPayrollById,
} from "../../api/payrollApi";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import "../../styles/layout.css";
import "../../styles/Dashboard.css";

function Payroll() {

const [payrollData, setPayrollData] = useState([]);

useEffect(() => {
  fetchPayroll();
}, []);

const fetchPayroll = async () => {
  try {
    const response = await getPayroll();
    setPayrollData(response.data);
  } catch (error) {
    console.error("Error fetching payroll:", error);
  }
};

const [showForm, setShowForm] = useState(false);
const [isEditing, setIsEditing] = useState(false);
const [viewPayroll, setViewPayroll] = useState(null);

const [search, setSearch] = useState("");
const [departmentFilter, setDepartmentFilter] = useState("");
const [monthFilter, setMonthFilter] = useState("");

const [newPayroll, setNewPayroll] = useState({
  id: "",
  name: "",
  department: "",
  basicSalary: "",
  bonus: "",
  netSalary: "",
  month: "August 2026",
  status: "Pending",
});





const filteredPayroll = payrollData.filter((payroll) => {

const searchMatch =
payroll.id.toLowerCase().includes(search.toLowerCase()) ||
payroll.name.toLowerCase().includes(search.toLowerCase());

const departmentMatch =
departmentFilter === "" ||
payroll.department === departmentFilter;

const monthMatch =
monthFilter === "" ||
payroll.month === monthFilter;

return searchMatch && departmentMatch && monthMatch;

});


const handleSave = async () => {
  if (
    !newPayroll.id ||
    !newPayroll.name ||
    !newPayroll.department ||
    !newPayroll.basicSalary
  ) {
    alert("Please fill all fields");
    return;
  }

  try {
    await addPayroll({
      ...newPayroll,
      netSalary:
        Number(newPayroll.basicSalary) +
        Number(newPayroll.bonus),
    });

    fetchPayroll();

    setShowForm(false);

    setNewPayroll({
      id: "",
      name: "",
      department: "",
      basicSalary: "",
      bonus: "",
      netSalary: "",
      month: "August 2026",
      status: "Pending",
    });

    alert("Payroll Generated Successfully!");
  } catch (error) {
    console.error(error);
  }
};


const handleView = async (id) => {
  try {
    const response = await getPayrollById(id);
    setViewPayroll(response.data);
  } catch (error) {
    console.error(error);
  }
};


const handleEdit = async (id) => {
  try {
    const response = await getPayrollById(id);

    setNewPayroll(response.data);

    setIsEditing(true);
    setShowForm(true);
  } catch (error) {
    console.error(error);
  }
};


const handleUpdate = async () => {
  try {
    await updatePayroll(newPayroll.id, {
      ...newPayroll,
      netSalary:
        Number(newPayroll.basicSalary) +
        Number(newPayroll.bonus),
    });

    fetchPayroll();

    setShowForm(false);
    setIsEditing(false);

    alert("Payroll Updated Successfully!");
  } catch (error) {
    console.error(error);
  }
};


const handleDelete = async (id) => {
  if (window.confirm("Delete Payroll?")) {
    try {
      await deletePayroll(id);
      fetchPayroll();
    } catch (error) {
      console.error(error);
    }
  }
};


  return (
    <div className="layout">
      <Sidebar activePage="Payroll" />

      <div className="main-content">
        <Header title="Payroll" />

        <div className="page-content">

          <h1 className="page-title">Payroll Management</h1>

<div className="dashboard-grid">

  <div className="dashboard-card">
    <h3>Total Payrolls</h3>
    <h2>{payrollData.length}</h2>
  </div>

  <div className="dashboard-card">
    <h3>Paid</h3>
    <h2>{payrollData.filter(p => p.status === "Paid").length}</h2>
  </div>

  <div className="dashboard-card">
    <h3>Pending</h3>
    <h2>{payrollData.filter(p => p.status === "Pending").length}</h2>
  </div>

</div>

<div className="employee-toolbar">

<input
  className="search-box"
  placeholder="Search Employee..."
  value={search}
  onChange={(e)=>setSearch(e.target.value)}
/>

<select
  className="filter-box"
  value={departmentFilter}
  onChange={(e)=>setDepartmentFilter(e.target.value)}
>
<option value="">All Departments</option>
<option>HR</option>
<option>Finance</option>
<option>IT</option>
</select>

<select
  className="filter-box"
  value={monthFilter}
  onChange={(e)=>setMonthFilter(e.target.value)}
>
<option value="">All Months</option>
<option>August 2026</option>
<option>July 2026</option>
<option>June 2026</option>
</select>

<button
className="action-btn"
onClick={()=>{
setSearch("");
setDepartmentFilter("");
setMonthFilter("");
}}
>
Reset
</button>

<button
  className="add-btn"
  onClick={() => {
    setIsEditing(false);

    setNewPayroll({
      id: "",
      name: "",
      department: "",
      basicSalary: "",
      bonus: "",
      netSalary: "",
      month: "August 2026",
      status: "Pending",
    });

    setShowForm(true);
  }}
>
  Generate Payroll
</button>

</div>

{showForm && (
  <div className="popup-overlay">
    <div className="popup-form">

      <h2>{isEditing ? "Edit Payroll" : "Generate Payroll"}</h2>

<input
  type="text"
  value={newPayroll.id}
  readOnly
/>

<input
  type="text"
  value={newPayroll.name}
  readOnly
/>

<input
  type="text"
  value={newPayroll.department}
  readOnly
/>

<input
  type="number"
  value={newPayroll.basicSalary}
  readOnly
/>

<select
  value={newPayroll.month}
  onChange={(e) =>
    setNewPayroll({
      ...newPayroll,
      month: e.target.value,
    })
  }
>
  <option>August 2026</option>
  <option>July 2026</option>
  <option>June 2026</option>
</select>

      <input
        type="number"
        placeholder="Bonus"
        value={newPayroll.bonus}
        onChange={(e) =>
          setNewPayroll({
            ...newPayroll,
            bonus: e.target.value,
          })
        }
      />

      <select
        value={newPayroll.status}
        onChange={(e) =>
          setNewPayroll({
            ...newPayroll,
            status: e.target.value,
          })
        }
      >
        <option>Pending</option>
        <option>Paid</option>
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
    setShowForm(false);
    setIsEditing(false);

    setNewPayroll({
      id: "",
      name: "",
      department: "",
      basicSalary: "",
      bonus: "",
      netSalary: "",
      month: "August 2026",
      status: "Pending",
    });
  }}
>
  Cancel
</button>

</div>
</div>
)}

{viewPayroll && (
  <div className="popup-overlay">
    <div className="popup-form">

      <h2>Payroll Details</h2>

      <p><strong>ID:</strong> {viewPayroll.id}</p>
      <p><strong>Name:</strong> {viewPayroll.name}</p>
      <p><strong>Department:</strong> {viewPayroll.department}</p>
      <p><strong>Basic Salary:</strong> ₹{viewPayroll.basicSalary}</p>
      <p><strong>Bonus:</strong> ₹{viewPayroll.bonus}</p>
      <p><strong>Net Salary:</strong> ₹{viewPayroll.netSalary}</p>
      <p><strong>Month:</strong> {viewPayroll.month}</p>
      <p><strong>Status:</strong> {viewPayroll.status}</p>

      <button
        className="add-btn"
        onClick={() => setViewPayroll(null)}
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
                  <th>Department</th>
                  <th>Basic Salary</th>
                  <th>Bonus</th>
                  <th>Net Salary</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

<tbody>
  {filteredPayroll.map((payroll) => (
    <tr key={payroll.id}>

      <td>{payroll.id}</td>

      <td>{payroll.name}</td>

      <td>{payroll.department}</td>

      <td>₹{payroll.basicSalary}</td>

      <td>₹{payroll.bonus}</td>

      <td>₹{payroll.netSalary}</td>

      <td>
        <span
          className={`status ${
            payroll.status === "Paid"
              ? "active"
              : "pending"
          }`}
        >
          {payroll.status}
        </span>
      </td>

      <td>

        <button
          className="action-btn view"
          onClick={() => handleView(payroll.id)}
        >
          View
        </button>

        <button
          className="action-btn edit"
          onClick={() => handleEdit(payroll.id)}
        >
          Edit
        </button>

        <button
          className="action-btn delete"
          onClick={() => handleDelete(payroll.id)}
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

export default Payroll;