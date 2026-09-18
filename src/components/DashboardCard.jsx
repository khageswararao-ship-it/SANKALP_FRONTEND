import React from "react";
import "../styles/Dashboard.css";

function DashboardCard({ title, value, icon, color }) {
  return (
    <div
      className="dashboard-card"
      style={{ borderTop: `5px solid ${color}` }}
    >
      <div className="card-icon" style={{ color }}>
        {icon}
      </div>

      <div className="card-info">
        <h3>{title}</h3>
        <h2>{value}</h2>
      </div>
    </div>
  );
}

export default DashboardCard;