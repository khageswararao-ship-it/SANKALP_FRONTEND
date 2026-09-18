import { useParams } from "react-router-dom";
import React from "react";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import "../../styles/layout.css";
import "../../styles/Dashboard.css";

function EditPayroll() {
  const { id } = useParams();

  return (
    <div className="layout">
      <Sidebar activePage="Payroll" />

      <div className="main-content">
        <Header title="Edit Payroll" />

        <div className="page-content">
          <h1 className="page-title">Edit Payroll</h1>

          <div className="card" style={{ padding: "30px" }}>
            <h2>Editing Payroll for {id}</h2>

            <input
              type="number"
              placeholder="Basic Salary"
              className="search-box"
            />

            <br />
            <br />

            <input
              type="number"
              placeholder="Bonus"
              className="search-box"
            />

            <br />
            <br />

            <button className="add-btn">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditPayroll;