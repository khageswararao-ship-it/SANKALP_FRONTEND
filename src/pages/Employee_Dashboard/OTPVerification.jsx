import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import EmployeeSidebar from "../../components/EmployeeSidebar";
import "../../styles/layout.css";
import "../../styles/OTPVerification.css";
import { verifyOtp, sendOtp } from "../../api/otpApi";


function OTPVerification() {

  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(30);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");



  const navigate = useNavigate();

  useEffect(() => {

    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);

  }, [timer]);

const handleVerify = async () => {

  if (otp.length !== 6) {
    setMessage("❌ Please enter a valid 6-digit OTP.");
    return;
  }

  setLoading(true);

  try {

    const employeeId = localStorage.getItem("employeeId");



    const response = await verifyOtp(employeeId, otp);

    setLoading(false);

    if (response.data) {

      setMessage("✅ OTP Verified Successfully.");

      setTimeout(() => {
        navigate("/employee/dashboard");
      }, 1000);

    } else {

      setMessage("❌ Invalid OTP.");

    }

  } catch (error) {

    console.error(error);
    setLoading(false);
    setMessage("❌ Verification Failed.");

  }

};

    const handleResend = async () => {
      try {
        const employeeId = localStorage.getItem("employeeId");

        await sendOtp(employeeId);

        setOtp("");
        setTimer(30);
        setMessage("✅ New OTP has been sent to your email.");
      } catch (error) {
        console.error(error);
        setMessage("❌ Failed to send OTP.");
      }
    };

  return (


        <div className="page-content">

          <div className="otp-card">

            <h2>Verify Your Identity</h2>

            <p>
              Enter the 6-digit OTP sent to your registered email or mobile number.
            </p>

            <input
              type="text"
              maxLength={6}
              className="otp-input"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, ""))
              }
            />

            {message && (
              <p
                style={{
                  marginTop: "15px",
                  fontWeight: "bold",
                  color: message.includes("✅")
                    ? "green"
                    : message.includes("📩")
                    ? "#0d6efd"
                    : "red",
                }}
              >
                {message}
              </p>
            )}

            <button
              className="verify-btn"
              onClick={handleVerify}
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <button
              className="resend-btn"
              onClick={handleResend}
              disabled={timer > 0}
            >
              {timer > 0
                ? `Resend OTP (${timer}s)`
                : "Resend OTP"}
            </button>

          </div>

        </div>

    


  );
}

export default OTPVerification;