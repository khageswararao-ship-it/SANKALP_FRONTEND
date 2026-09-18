import React from "react";

function KpiCard({ title, value }) {
  return (
    <div className="card">
      <h4>{title}</h4>
      <h2>{value}</h2>
    </div>
  );
}

export default KpiCard;