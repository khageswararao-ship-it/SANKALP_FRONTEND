import React, { useState, useEffect } from "react";

import {
  getLeaves,
  getLeaveById,
  applyLeave,
  deleteLeave,
} from "../../api/employeeLeaveApi";
import Header from "../../components/Header";
import EmployeeSidebar from "../../components/EmployeeSidebar";
import "../../styles/layout.css";
import "../../styles/Dashboard.css";
import "../../styles/MyLeave.css";

function MyLeave() {

const [leaveData, setLeaveData] = useState([]);

const [newLeave,setNewLeave]=useState({
from:"",
to:"",
type:"Casual Leave",
reason:"",
status:"Pending",
});

const [search,setSearch]=useState("");
const [statusFilter,setStatusFilter]=useState("");
const [viewLeave,setViewLeave]=useState(null);

useEffect(() => {
    fetchLeaves();
}, []);

const fetchLeaves = async () => {
    try {
        const response = await getLeaves();
        setLeaveData(response.data);
    } catch (error) {
        console.error(error);
    }
};

const filteredLeaves=leaveData.filter(item=>{

const typeMatch = item.leaveType
  .toLowerCase()
  .includes(search.toLowerCase());

const statusMatch=
statusFilter==="" ||
item.status===statusFilter;

return typeMatch && statusMatch;

});

const handleApply = async () => {

    if (
        !newLeave.from ||
        !newLeave.to ||
        !newLeave.reason
    ) {
        alert("Please fill all fields");
        return;
    }

    try {

        const leave = {
            id: Date.now().toString(),

            name: localStorage.getItem("employeeName"),

            department: localStorage.getItem("department") || "General",

            leaveType: newLeave.type,

            fromDate: newLeave.from,

            toDate: newLeave.to,

            days: 1,

            reason: newLeave.reason,

            status: "Pending",
        };
        await applyLeave(leave);

        fetchLeaves();

        setNewLeave({
            from: "",
            to: "",
            type: "Casual Leave",
            reason: "",
            status: "Pending",
        });

        alert("Leave Applied Successfully");

    } catch (error) {
        console.error(error);
    }

};



const handleDelete = async (id) => {

    if (window.confirm("Delete Leave Request?")) {

        try {

            await deleteLeave(id);

            fetchLeaves();

        } catch (error) {
            console.error(error);
        }

    }

};

const handleView = async (id) => {

    try {

        const response = await getLeaveById(id);

        setViewLeave(response.data);

    } catch (error) {
        console.error(error);
    }

};

return (
<div className="layout">

<EmployeeSidebar activePage="My Leave"/>

<div className="main-content">

<Header
title="My Leave"
profilePath="/employee/profile"
notificationPath="/employee/notifications"
/>

<div className="page-content">

<h1 className="page-title">My Leave</h1>

<div className="dashboard-grid">

<div className="dashboard-card">
<h3>Total Leave</h3>
<h2>{leaveData.length}</h2>
</div>

<div className="dashboard-card">
<h3>Approved</h3>
<h2>{leaveData.filter(l=>l.status==="Approved").length}</h2>
</div>

<div className="dashboard-card">
<h3>Pending</h3>
<h2>{leaveData.filter(l=>l.status==="Pending").length}</h2>
</div>

<div className="dashboard-card">
<h3>Rejected</h3>
<h2>{leaveData.filter(l=>l.status==="Rejected").length}</h2>
</div>

</div>

<div className="leave-form">

<h2>Apply Leave</h2>

<div className="leave-grid">

<input
type="date"
value={newLeave.from}
onChange={(e)=>
setNewLeave({...newLeave,from:e.target.value})
}
/>

<input
type="date"
value={newLeave.to}
onChange={(e)=>
setNewLeave({...newLeave,to:e.target.value})
}
/>

<select
value={newLeave.type}
onChange={(e)=>
setNewLeave({...newLeave,type:e.target.value})
}
>
<option>Casual Leave</option>
<option>Sick Leave</option>
<option>Earned Leave</option>
</select>

</div>

<textarea
rows="4"
placeholder="Reason"
value={newLeave.reason}
onChange={(e)=>
setNewLeave({...newLeave,reason:e.target.value})
}
/>

<button
className="add-btn"
onClick={handleApply}
>
Apply Leave
</button>

</div>

<div className="employee-toolbar">

<input
className="search-box"
placeholder="Search Leave Type..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
/>

<select
className="filter-box"
value={statusFilter}
onChange={(e)=>setStatusFilter(e.target.value)}
>
<option value="">All Status</option>
<option value="Approved">Approved</option>
<option value="Pending">Pending</option>
<option value="Rejected">Rejected</option>
</select>

<button
className="action-btn"
onClick={()=>{
setSearch("");
setStatusFilter("");
}}
>
Reset
</button>

</div>

<div className="table-container">

<table className="employee-table">

<thead>
<tr>
<th>From</th>
<th>To</th>
<th>Type</th>
<th>Reason</th>
<th>Status</th>
<th>Actions</th>
</tr>
</thead>

<tbody>

{filteredLeaves.map(item=>(

<tr key={item.id}>

<td>{item.fromDate}</td>
<td>{item.toDate}</td>
<td>{item.leaveType}</td>
<td>{item.reason}</td>

<td>
<span className={`status ${item.status.toLowerCase()}`}>
{item.status}
</span>
</td>

<td>

<button
className="action-btn view"
onClick={()=>handleView(item.id)}
>
View
</button>

<button
className="action-btn delete"
onClick={()=>handleDelete(item.id)}
>
Delete
</button>

</td>

</tr>

))}

</tbody>

</table>

</div>

{viewLeave && (

<div className="popup-overlay">

<div className="popup-form">

<h2>Leave Details</h2>

<p><strong>From:</strong> {viewLeave.fromDate}</p>

<p><strong>To:</strong> {viewLeave.toDate}</p>

<p><strong>Type:</strong> {viewLeave.leaveType}</p>

<p><strong>Reason:</strong> {viewLeave.reason}</p>

<p><strong>Status:</strong> {viewLeave.status}</p>

<button
className="add-btn"
onClick={()=>setViewLeave(null)}
>
Close
</button>

</div>

</div>

)}

</div>

</div>

</div>
);

}

export default MyLeave;