import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";
import background from "../assets/background.png";
import "../styles/login.css";
import { loginUser } from "../api/loginApi";
import { sendOtp } from "../api/otpApi";

function Login() {
  const navigate = useNavigate();

  const [role, setRole] = useState("admin");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

const handleLogin = async () => {
  console.log("1. Login button clicked");

  try {
    const user = await loginUser({
      username,
      password,
      role: role.toUpperCase(),
    });

    console.log("2. API Response:", user);
    console.log("Employee ID =", user.employeeId);

    if (!user) {
      console.log("3. User is null");
      alert("Invalid Username or Password");
      return;
    }

    console.log("4. User Role:", user.role);

    if (user.role.toUpperCase() === "ADMIN") {
      console.log("5. Going to Admin Dashboard");
      navigate("/admin/dashboard");
      } else if (user.role.toUpperCase() === "EMPLOYEE") {

        // Save employee details
        localStorage.setItem("employeeId", user.employeeId);
        localStorage.setItem("username", user.username);
        localStorage.setItem("role", user.role);

        
        console.log("Saved Employee ID:", localStorage.getItem("employeeId"));

        await sendOtp(user.employeeId);

        navigate("/employee/otp");
      }
  } catch (error) {
    console.error("Login Error:", error);
  }
};

  return (
    <div
      className="login-container"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="login-card">
        <img src={logo} alt="Logo" className="login-logo" />

        <h1>Sankalp IP</h1>
        <p>HRMS Portal</p>

        <select
          className="login-select"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="admin">Admin</option>
          <option value="employee">Employee</option>
        </select>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div style={{ textAlign: "right", marginBottom: "15px" }}>
          <span
          onClick={() => {
              if (role === "admin") {
                  navigate("/admin/forgot-password");
              } else {
                  navigate("/forgot-password");
              }
          }}
            style={{
              color: "#2563eb",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "600"
            }}
          >
            Forgot Password?
          </span>
        </div>

        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
}

export default Login;