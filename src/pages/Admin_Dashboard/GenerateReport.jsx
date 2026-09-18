import { useParams } from "react-router-dom";
import React from "react";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import "../../styles/layout.css";
import "../../styles/Dashboard.css";

function GenerateReport() {
  return (
    <div className="layout">
      <Sidebar activePage="Reports" />

      <div className="main-content">
        <Header title="Generate Report" />

        <div className="page-content">
          <h1 className="page-title">Generate Report</h1>

          <div className="card" style={{ padding: "30px" }}>
            <h2>Generate New Report</h2>

            <button className="add-btn">
              Generate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GenerateReport;