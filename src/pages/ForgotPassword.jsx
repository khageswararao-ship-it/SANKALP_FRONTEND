import React, { useState } from "react";
import { Link } from "react-router-dom";
import { submitRequest } from "../api/forgotPasswordApi";
import "../styles/ForgotPassword.css";

function ForgotPassword() {
  const [employeeId, setEmployeeId] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!employeeId || !employeeName || !reason) {
      setMessage("❌ Please fill all fields.");
      return;
    }

    setLoading(true);

    try {
      await submitRequest({
        employeeId,
        employeeName,
        reason,
        requestDate: new Date().toLocaleDateString(),
      });

      setMessage("✅ Request submitted successfully.");

      setEmployeeId("");
      setEmployeeName("");
      setReason("");
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to submit request.");
    }

    setLoading(false);
  };

  return (
    <div className="page-content">
      <div className="forgot-card">

        <h2>Forgot Password</h2>

        <p>
          Submit a password reset request. The administrator will review and
          approve your request.
        </p>

        <input
          type="text"
          placeholder="Employee ID"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
        />

        <input
          type="text"
          placeholder="Employee Name"
          value={employeeName}
          onChange={(e) => setEmployeeName(e.target.value)}
        />

        <textarea
          placeholder="Reason for password reset"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        <button
          className="submit-btn"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Request"}
        </button>

        {message && (
          <p
            className={
              message.includes("✅")
                ? "success-message"
                : "error-message"
            }
          >
            {message}
          </p>
        )}

        <div className="back-login">
          <Link to="/">← Back to Login</Link>
        </div>

      </div>
    </div>
  );
}

export default ForgotPassword;