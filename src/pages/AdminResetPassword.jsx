import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { adminResetPassword } from "../api/adminResetPasswordApi";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import logo from "../assets/logo.svg";
import background from "../assets/background.png";
import "../styles/login.css";

function AdminResetPassword() {

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);

    const handleReset = async () => {

        if (!password || !confirmPassword) {
            alert("Please fill all fields.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        try {

            const message = await adminResetPassword(token, password);

            alert(message);

            navigate("/");

        } catch (error) {

            alert(
                error.response?.data ||
                "Unable to reset password."
            );

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
                <p>Admin Password Reset</p>

                <div style={{ position: "relative", width: "100%", marginBottom: "15px" }}>
                    <input
                        type={showPass ? "text" : "password"}
                        placeholder="New Password"
                        value={password}
                        style={{ width: "100%", paddingRight: "45px", marginBottom: 0 }}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPass((prev) => !prev)}
                        style={{
                            position: "absolute",
                            right: "12px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            color: "#64748b",
                            fontSize: "18px",
                            padding: "4px",
                        }}
                    >
                        {showPass ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>

                <div style={{ position: "relative", width: "100%", marginBottom: "20px" }}>
                    <input
                        type={showConfirmPass ? "text" : "password"}
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        style={{ width: "100%", paddingRight: "45px", marginBottom: 0 }}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPass((prev) => !prev)}
                        style={{
                            position: "absolute",
                            right: "12px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            color: "#64748b",
                            fontSize: "18px",
                            padding: "4px",
                        }}
                    >
                        {showConfirmPass ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>

                <button onClick={handleReset}>
                    Reset Password
                </button>

            </div>
        </div>
    );
}

export default AdminResetPassword;