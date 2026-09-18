import { useParams } from "react-router-dom";
import React from "react";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import "../../styles/layout.css";
import "../../styles/Dashboard.css";

function EditEmployee() {
  const { id } = useParams();

  return (
    <div className="layout">
      <Sidebar activePage="Employees" />

      <div className="main-content">
        <Header title="Edit Employee" />

        <div className="page-content">
          <h1 className="page-title">Edit Employee</h1>
          <h2>Employee ID: {id}</h2>
        </div>
      </div>
    </div>
  );
}

export default EditEmployee;