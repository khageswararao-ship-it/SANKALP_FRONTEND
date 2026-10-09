import React from "react";
import { FaTimes, FaUserCheck, FaCode, FaServer, FaMobileAlt, FaGlobe, FaShieldAlt } from "react-icons/fa";
import logo from "../assets/logo.svg";

function AboutModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="popup-overlay" onClick={onClose} style={{ zIndex: 2000 }}>
      <div
        className="popup-form about-modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "540px",
          width: "92vw",
          padding: "28px",
          borderRadius: "16px",
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
          type="button"
          aria-label="Close"
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            background: "transparent",
            border: "none",
            fontSize: "20px",
            cursor: "pointer",
            color: "#64748b",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "4px",
          }}
        >
          <FaTimes />
        </button>

        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <img
            src={logo}
            alt="Sankalp IP Logo"
            style={{ width: "70px", height: "70px", objectFit: "contain", marginBottom: "8px" }}
          />
          <h2 style={{ margin: "4px 0", color: "#1E88E5", fontSize: "24px" }}>
            Sankalp IP HRMS
          </h2>
          <span
            style={{
              fontSize: "12px",
              background: "rgba(30,136,229,0.12)",
              color: "#1E88E5",
              padding: "4px 10px",
              borderRadius: "20px",
              fontWeight: 600,
            }}
          >
            Version 1.0.0 Enterprise
          </span>
        </div>

        <div
          style={{
            background: "rgba(30,136,229,0.06)",
            border: "1px solid rgba(30,136,229,0.2)",
            borderRadius: "12px",
            padding: "16px",
            marginBottom: "18px",
          }}
        >
          <h4 style={{ margin: "0 0 8px 0", color: "#0f172a", display: "flex", alignItems: "center", gap: "8px" }}>
            <FaUserCheck color="#1E88E5" /> Developer & Architect
          </h4>
          <p style={{ margin: "0 0 4px 0", fontSize: "16px", fontWeight: "700", color: "#1E3A8A" }}>
            Ravada Khageswar Rao
          </p>
          <p style={{ margin: "0", fontSize: "13px", color: "#64748b" }}>
            Lead Full-Stack Developer & Mobile Engineer
          </p>
        </div>

        <div style={{ fontSize: "14px", color: "#334155", lineHeight: "1.6", marginBottom: "18px" }}>
          <p style={{ margin: "0 0 10px 0" }}>
            <strong>About This App:</strong> Sankalp IP HRMS is an all-in-one Human Resource Management System engineered to streamline organizational workforce operations. It provides role-based portal access for both Administrators and Employees.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", fontSize: "13px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <FaCode color="#1E88E5" /> <span>React 18 & Vite</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <FaServer color="#43A047" /> <span>Spring Boot REST</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <FaMobileAlt color="#FB8C00" /> <span>Capacitor Android</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <FaShieldAlt color="#8E24AA" /> <span>TiDB Cloud MySQL</span>
            </div>
          </div>
        </div>

        <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "14px", textAlign: "center" }}>
          <p style={{ margin: "0", fontSize: "12px", color: "#94a3b8" }}>
            © {new Date().getFullYear()} Sankalp IP. Built with pride by Ravada Khageswar Rao.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AboutModal;
