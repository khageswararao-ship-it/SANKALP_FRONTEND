import { useParams } from "react-router-dom";
import React from "react";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import "../../styles/layout.css";
import "../../styles/Dashboard.css";

function GeneratePayroll() {
  return (
    <div className="layout">
      <Sidebar activePage="Payroll" />

      <div className="main-content">
        <Header title="Generate Payroll" />

        <div className="page-content">
          <h1 className="page-title">Generate Payroll</h1>

          <div className="card" style={{ padding: "30px" }}>
            <h2>Generate Monthly Payroll</h2>

            <br />

            <label>Select Month</label>
            <br />
            <input type="month" />

            <br />
            <br />

            <button className="add-btn">
              Generate Payroll
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GeneratePayroll;