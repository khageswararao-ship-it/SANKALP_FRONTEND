import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminForgotPassword } from "../api/adminForgotPasswordApi";


function AdminForgotPassword() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");

    const handleSubmit = async () => {

        if (!email) {
            alert("Please enter your email.");
            return;
        }

        try {

            const message = await adminForgotPassword(email);

            alert(message);

        } catch (error) {

            alert(
                error.response?.data ||
                "Unable to process request."
            );

        }

    };

    return (

        <div className="login-container">

            <div className="login-card">

                <h2>Admin Forgot Password</h2>

                <p>Enter your registered admin email.</p>

                <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <button onClick={handleSubmit}>
                    Send Reset Link
                </button>

                <br />
                <br />

                <button onClick={() => navigate("/")}>
                    Back to Login
                </button>

            </div>

        </div>

    );
}

export default AdminForgotPassword;