import React from "react";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import "../../styles/layout.css";
import "../../styles/Dashboard.css";

function AddEmployee() {
  return (
    <div className="layout">
      <Sidebar activePage="Employees" />

      <div className="main-content">
        <Header title="Add Employee" />

        <div className="page-content">
          <h1 className="page-title">Add Employee</h1>
        </div>
      </div>
    </div>
  );
}

export default AddEmployee;