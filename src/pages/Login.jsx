import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";
import background from "../assets/background.png";
import "../styles/login.css";
import { loginUser, getAllLogins } from "../api/loginApi";
import { sendOtp } from "../api/otpApi";
import { API_BASE_URL } from "../api/apiConfig";
import AboutModal from "../components/AboutModal";
import { FaInfoCircle, FaSun, FaMoon, FaEye, FaEyeSlash } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

function Login() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const [role, setRole] = useState("admin");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [serverWakingUp, setServerWakingUp] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  // Background wakeup ping as soon as Login screen appears
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/login`, { method: "GET" }).catch(() => {});
  }, []);

  const handleLogin = async (e) => {
    if (e) e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    const inputCredential = username.trim();
    if (!inputCredential || !password.trim()) {
      setErrorMessage("Please enter both Username/Email and Password.");
      return;
    }

    setIsLoading(true);
    setServerWakingUp(false);

    // If request takes longer than 2.5 seconds, notify user that server is waking up
    const wakeUpTimer = setTimeout(() => {
      setServerWakingUp(true);
    }, 2500);

    try {
      let resolvedUsername = inputCredential;
      let effectiveRole = role.toUpperCase();

      // Support "Forgot Username": allow login via registered email address
      if (inputCredential.includes("@")) {
        try {
          const res = await getAllLogins();
          const allUsers = Array.isArray(res.data) ? res.data : [];
          const matched = allUsers.find(
            (u) =>
              u.email &&
              u.email.trim().toLowerCase() === inputCredential.toLowerCase()
          );
          if (matched && matched.username) {
            resolvedUsername = matched.username;
            if (matched.role) {
              effectiveRole = matched.role.toUpperCase();
              setRole(matched.role.toLowerCase());
            }
          }
        } catch (fetchErr) {
          console.warn("Could not query logins for email resolution:", fetchErr);
        }
      }

      // Authenticate with resolved username and password
      let user = null;
      try {
        user = await loginUser({
          username: resolvedUsername,
          password: password,
          role: effectiveRole,
        });
      } catch (authErr) {
        // Fallback: If initial authentication failed and user didn't have '@',
        // check if their input matches any registered email or employee ID
        try {
          const res = await getAllLogins();
          const allUsers = Array.isArray(res.data) ? res.data : [];
          const matched = allUsers.find(
            (u) =>
              (u.email && u.email.trim().toLowerCase() === inputCredential.toLowerCase()) ||
              (u.employeeId && u.employeeId.trim().toLowerCase() === inputCredential.toLowerCase())
          );
          if (matched && matched.username && matched.username !== resolvedUsername) {
            resolvedUsername = matched.username;
            effectiveRole = matched.role ? matched.role.toUpperCase() : effectiveRole;
            user = await loginUser({
              username: resolvedUsername,
              password: password,
              role: effectiveRole,
            });
          } else {
            throw authErr;
          }
        } catch (innerErr) {
          throw authErr;
        }
      }

      clearTimeout(wakeUpTimer);
      setServerWakingUp(false);

      if (!user || !user.role) {
        setIsLoading(false);
        setErrorMessage("Invalid Username/Email or Password. Please check your credentials.");
        return;
      }

      setSuccessMessage("Login successful! Redirecting...");

      if (user.role.toUpperCase() === "ADMIN") {
        setTimeout(() => navigate("/admin/dashboard"), 250);
      } else if (user.role.toUpperCase() === "EMPLOYEE") {
        localStorage.setItem("employeeId", user.employeeId);
        localStorage.setItem("username", user.username);
        localStorage.setItem("role", user.role);

        // Send OTP in background without blocking screen navigation
        sendOtp(user.employeeId).catch((otpError) => {
          console.warn("Could not dispatch OTP email:", otpError);
        });

        setTimeout(() => navigate("/employee/otp"), 250);
      } else {
        setIsLoading(false);
        setErrorMessage("Unrecognized user role. Please contact system administrator.");
      }
    } catch (error) {
      clearTimeout(wakeUpTimer);
      setServerWakingUp(false);
      setIsLoading(false);
      console.error("Login Error:", error);
      setErrorMessage("Invalid Username/Email or Password. Please try again.");
    }
  };

  return (
    <div
      className="login-container"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="login-card">
        {/* Top Controls: Dark Mode & About */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
          <button
            type="button"
            className="login-theme-btn"
            onClick={toggleTheme}
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <FaSun style={{ color: "#ffd54f" }} /> : <FaMoon />}
          </button>
          <button
            type="button"
            className="login-about-btn"
            onClick={() => setShowAbout(true)}
            title="About App & Developer"
            aria-label="About app"
          >
            <FaInfoCircle /> About App
          </button>
        </div>

        <img src={logo} alt="Sankalp IP Logo" className="login-logo" />

        <h1>Sankalp IP</h1>
        <p>HRMS Portal</p>

        {/* Instant Error Alert */}
        {errorMessage && (
          <div className="login-alert error-alert" role="alert">
            {errorMessage}
          </div>
        )}

        {/* Instant Success Alert */}
        {successMessage && (
          <div className="login-alert success-alert" role="alert">
            {successMessage}
          </div>
        )}

        {/* Server Wakeup Notification */}
        {serverWakingUp && !errorMessage && (
          <div className="login-alert info-alert" role="status">
            ⏳ Connecting to cloud server, please wait...
          </div>
        )}

        <form onSubmit={handleLogin} noValidate>
          <select
            className="login-select"
            value={role}
            disabled={isLoading}
            onChange={(e) => {
              setRole(e.target.value);
              setErrorMessage("");
            }}
          >
            <option value="admin">Admin Portal</option>
            <option value="employee">Employee Portal</option>
          </select>

          <input
            type="text"
            placeholder="Username or Registered Email"
            value={username}
            disabled={isLoading}
            autoComplete="username"
            onChange={(e) => {
              setUsername(e.target.value);
              setErrorMessage("");
            }}
          />
          <div style={{ fontSize: "11.5px", color: "#64748b", marginTop: "-8px", marginBottom: "14px", textAlign: "left", paddingLeft: "4px" }}>
            💡 <em>Forgot username? Enter your registered email to log in.</em>
          </div>

          <div style={{ position: "relative", width: "100%", marginBottom: "15px" }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              disabled={isLoading}
              autoComplete="current-password"
              style={{ width: "100%", paddingRight: "45px", marginBottom: 0 }}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrorMessage("");
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              style={{
                position: "absolute",
                right: "14px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "#64748b",
                fontSize: "18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "4px",
              }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

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
                fontWeight: "600",
              }}
            >
              Forgot Password?
            </span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`login-submit-btn ${isLoading ? "loading" : ""}`}
          >
            {isLoading ? (
              <span className="btn-loading-content">
                <span className="spinner"></span>
                <span>Verifying...</span>
              </span>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <div style={{ marginTop: "20px", fontSize: "12px", color: "#64748b" }}>
          Developed by <strong>Ravada Khageswar Rao</strong>
        </div>
      </div>

      <AboutModal isOpen={showAbout} onClose={() => setShowAbout(false)} />
    </div>
  );
}

export default Login;