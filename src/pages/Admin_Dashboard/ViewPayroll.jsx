import { useParams } from "react-router-dom";
import React from "react";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import "../../styles/layout.css";
import "../../styles/Dashboard.css";

function ViewPayroll() {
  const { id } = useParams();

  return (
    <div className="layout">
      <Sidebar activePage="Payroll" />

      <div className="main-content">
        <Header title="Payroll Details" />

        <div className="page-content">
          <h1 className="page-title">Payroll Details</h1>

          <div className="card" style={{ padding: "30px" }}>
            <h2>Employee ID : {id}</h2>

            <p>Basic Salary : ₹50,000</p>
            <p>Bonus : ₹5,000</p>
            <p>Net Salary : ₹55,000</p>
            <p>Status : Paid</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewPayroll;