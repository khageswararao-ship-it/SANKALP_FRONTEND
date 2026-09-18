import { useParams } from "react-router-dom";
import React from "react";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import "../../styles/layout.css";
import "../../styles/Dashboard.css";

function RejectLeave() {
  const { id } = useParams();

  return (
    <div className="layout">
      <Sidebar activePage="Leave" />

      <div className="main-content">
        <Header title="Reject Leave" />

        <div className="page-content">
          <h1 className="page-title">Reject Leave</h1>
          <h2>Employee ID: {id}</h2>
        </div>
      </div>
    </div>
  );
}

export default RejectLeave;