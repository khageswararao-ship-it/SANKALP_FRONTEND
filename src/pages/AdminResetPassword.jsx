import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { adminResetPassword } from "../api/adminResetPasswordApi";
import logo from "../assets/logo.svg";
import background from "../assets/background.png";
import "../styles/login.css";

function AdminResetPassword() {

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

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

                <input
                    type="password"
                    placeholder="New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <button onClick={handleReset}>
                    Reset Password
                </button>

            </div>
        </div>
    );
}

export default AdminResetPassword;