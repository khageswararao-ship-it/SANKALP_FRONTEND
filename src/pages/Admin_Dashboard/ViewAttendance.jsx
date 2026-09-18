import { useParams } from "react-router-dom";
import React from "react";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import "../../styles/layout.css";
import "../../styles/Dashboard.css";

function ViewAttendance() {
  const { id } = useParams();

  return (
    <div className="layout">
      <Sidebar activePage="Attendance" />

      <div className="main-content">
        <Header title="View Attendance" />

        <div className="page-content">
          <h1 className="page-title">Attendance Details</h1>
          <h2>Employee ID: {id}</h2>
        </div>
      </div>
    </div>
  );
}

export default ViewAttendance;