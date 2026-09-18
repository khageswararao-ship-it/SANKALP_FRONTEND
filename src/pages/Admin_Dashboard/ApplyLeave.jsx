import React from "react";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import "../../styles/layout.css";
import "../../styles/Dashboard.css";

function ApplyLeave() {
  return (
    <div className="layout">
      <Sidebar activePage="Leave" />

      <div className="main-content">
        <Header title="Apply Leave" />

        <div className="page-content">
          <h1 className="page-title">Apply Leave</h1>
        </div>
      </div>
    </div>
  );
}

export default ApplyLeave;