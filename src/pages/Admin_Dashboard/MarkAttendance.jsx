import { useParams } from "react-router-dom";
import React from "react";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import "../../styles/layout.css";
import "../../styles/Dashboard.css";

function MarkAttendance() {
  return (
    <div className="layout">
      <Sidebar activePage="Attendance" />

      <div className="main-content">
        <Header title="Mark Attendance" />

        <div className="page-content">
          <h1 className="page-title">Mark Attendance</h1>
        </div>
      </div>
    </div>
  );
}

export default MarkAttendance;