import React, { useState, useEffect } from "react";
import {
    getPayroll,
    getPayrollById
} from "../../api/employeePayrollApi";
import Header from "../../components/Header";
import EmployeeSidebar from "../../components/EmployeeSidebar";
import "../../styles/layout.css";
import "../../styles/Dashboard.css";
import "../../styles/MyPayroll.css";

function MyPayroll() {

const [payrollData, setPayrollData] = useState([]);
const employeeId = localStorage.getItem("employeeId");

const [search,setSearch]=useState("");
const [viewPayroll,setViewPayroll]=useState(null);

useEffect(() => {
    fetchPayroll();
}, []);

const fetchPayroll = async () => {
    try {
        const response = await getPayroll(employeeId);
        setPayrollData([response.data]);
    } catch (error) {
        console.error(error);
    }
};

const filteredPayroll=payrollData.filter(item=>
item.month.toLowerCase().includes(search.toLowerCase())
);

const downloadPayslip=(item)=>{

const report=`
Employee Payroll

Month : ${item.month}

Basic Salary : ₹${item.basic}



Net Salary : ₹${item.net}
`;

const blob=new Blob([report],{
type:"text/plain"
});

const url=window.URL.createObjectURL(blob);

const link=document.createElement("a");

link.href=url;
link.download=`${item.month}_Payslip.txt`;

link.click();

window.URL.revokeObjectURL(url);

};

const handleView = async (id) => {

    try {

        const response = await getPayrollById(id);

        setViewPayroll(response.data);

    } catch (error) {

        console.error(error);

    }

};

return (

<div className="layout">

<EmployeeSidebar activePage="My Payroll"/>

<div className="main-content">

<Header
title="My Payroll"
profilePath="/employee/profile"
notificationPath="/employee/notifications"
/>

<div className="page-content">

<h1 className="page-title">
My Payroll
</h1>

{/* Summary */}

<div className="dashboard-grid">

<div className="dashboard-card">
<h3>Basic Salary</h3>
<h2>
₹{payrollData.length ? payrollData[0].basicSalary.toLocaleString() : 0}
</h2>
</div>

<div className="dashboard-card">
<h3>Allowances</h3>
<h2>
₹{payrollData.length ? payrollData[0].bonus.toLocaleString() : 0}
</h2>
</div>



<div className="dashboard-card">
<h3>Net Salary</h3>
<h2>
₹{payrollData.length ? payrollData[0].netSalary.toLocaleString() : 0}
</h2>
</div>

</div>

{/* Salary Breakdown */}

<div className="payroll-card">

<h2>Salary Breakdown</h2>

<div className="salary-row">
<span>Basic Salary</span>
<span>
₹{payrollData.length ? payrollData[0].basicSalary.toLocaleString() : 0}
</span>
</div>

<div className="salary-row">
<span>House Rent Allowance</span>
<span>₹5,000</span>
</div>

<div className="salary-row">
<span>Travel Allowance</span>
<span>₹3,000</span>
</div>

<div className="salary-row">
<span>Provident Fund</span>
<span>-₹1,500</span>
</div>

<div className="salary-row">
<span>Professional Tax</span>
<span>-₹1,000</span>
</div>

<div className="salary-row total">
<span>Net Salary</span>
<span>
₹{payrollData.length ? payrollData[0].netSalary.toLocaleString() : 0}
</span>
</div>

</div>

{/* Search */}

<div className="employee-toolbar">

<input
className="search-box"
placeholder="Search Month..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
/>

<button
className="action-btn"
onClick={()=>setSearch("")}
>
Reset
</button>

</div>

{/* Payroll Table */}

<div className="table-container">

<table className="employee-table">

<thead>

<tr>

<th>Month</th>

<th>Gross Salary</th>

<th>Deductions</th>

<th>Net Salary</th>

<th>Actions</th>

</tr>

</thead>

<tbody>

{filteredPayroll.map(item=>(

<tr key={item.id}>

<td>{item.month}</td>

<td>₹{item.basicSalary + item.bonus}</td>

<td>₹0</td>

<td>₹{item.netSalary}</td>

<td>

<button
className="action-btn view"
onClick={() => handleView(item.id)}
>
View
</button>

<button
className="download-btn"
onClick={()=>downloadPayslip(item)}
>
Download
</button>

</td>

</tr>

))}

</tbody>

</table>

</div>

{/* View Popup */}

{viewPayroll && (

<div className="popup-overlay">

<div className="popup-form">

<h2>Payslip Details</h2>

<p>
<strong>Month :</strong>
{" "}
{viewPayroll.month}
</p>

<p>
<strong>Basic Salary :</strong>
₹{viewPayroll.basicSalary}
</p>

<p>
<strong>Allowances :</strong>
₹{viewPayroll.bonus}
</p>

<p>
<strong>Deductions :</strong>
₹{viewPayroll.deduction}
</p>

<p>
<strong>Net Salary :</strong>
₹{viewPayroll.netSalary}
</p>

<button
className="add-btn"
onClick={()=>setViewPayroll(null)}
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

export default MyPayroll;