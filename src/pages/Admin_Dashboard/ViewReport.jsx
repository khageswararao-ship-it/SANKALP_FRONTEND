import { useParams } from "react-router-dom";
import React from "react";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import "../../styles/layout.css";
import "../../styles/Dashboard.css";

function ViewReport() {
  const { id } = useParams();

  return (
    <div className="layout">
      <Sidebar activePage="Reports" />

      <div className="main-content">
        <Header title="View Report" />

        <div className="page-content">
          <h1 className="page-title">View Report</h1>

          <div className="card" style={{ padding: "30px" }}>
            <h2>Report ID: {id}</h2>
            <p>Report details will appear here.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewReport;