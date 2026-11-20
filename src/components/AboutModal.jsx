import React from "react";
import {
  FaTimes,
  FaUserCheck,
  FaCode,
  FaServer,
  FaMobileAlt,
  FaShieldAlt,
  FaSyncAlt,
  FaGithub,
  FaLinkedin,
  FaBirthdayCake,
} from "react-icons/fa";
import logo from "../assets/logo.svg";
import { APP_VERSION, BUILD_NUMBER, DEVELOPER_NAME } from "../config/version";

function AboutModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const handleCheckUpdates = () => {
    if (typeof window.checkForAppUpdates === "function") {
      window.checkForAppUpdates(true);
    }
  };

  const calculateAge = () => {
    const birth = new Date(2007, 11, 24);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="popup-overlay" onClick={onClose} style={{ zIndex: 2000 }}>
      <div
        className="popup-form about-modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "540px",
          width: "92vw",
          padding: "26px",
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

        <div style={{ textAlign: "center", marginBottom: "18px" }}>
          <img
            src={logo}
            alt="Sankalp IP Logo"
            style={{ width: "65px", height: "65px", objectFit: "contain", marginBottom: "6px" }}
          />
          <h2 style={{ margin: "2px 0", color: "#1E88E5", fontSize: "22px" }}>
            Sankalp IP HRMS
          </h2>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", marginTop: "4px" }}>
            <span
              style={{
                fontSize: "12px",
                background: "rgba(30,136,229,0.12)",
                color: "#1E88E5",
                padding: "3px 10px",
                borderRadius: "20px",
                fontWeight: 600,
              }}
            >
              Version {APP_VERSION} (Build {BUILD_NUMBER})
            </span>
          </div>
        </div>

        {/* Developer Profile Card with User Headshot and Auto Age */}
        <div
          style={{
            background: "rgba(30,136,229,0.06)",
            border: "1px solid rgba(30,136,229,0.22)",
            borderRadius: "14px",
            padding: "14px",
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
            gap: "14px",
          }}
        >
          <img
            src="/author-photo.jpg"
            alt={DEVELOPER_NAME}
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "3px solid #1E88E5",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              flexShrink: 0,
            }}
          />
          <div style={{ flex: 1 }}>
            <h4 style={{ margin: "0 0 2px 0", color: "#0f172a", fontSize: "14px", display: "flex", alignItems: "center", gap: "6px" }}>
              <FaUserCheck color="#1E88E5" /> Developer & Architect
            </h4>
            <p style={{ margin: "0 0 2px 0", fontSize: "16px", fontWeight: "700", color: "#1E3A8A" }}>
              {DEVELOPER_NAME}
            </p>
            <p style={{ margin: "0 0 4px 0", fontSize: "12px", color: "#475569", display: "flex", alignItems: "center", gap: "5px" }}>
              <FaBirthdayCake color="#e11d48" /> Age: <strong>{calculateAge()}</strong> (24 Dec 2007)
            </p>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "6px" }}>
              <a
                href="https://github.com/khageswararao-ship-it"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  fontSize: "12px",
                  color: "#0f172a",
                  textDecoration: "none",
                  fontWeight: 600,
                  background: "#f1f5f9",
                  padding: "4px 10px",
                  borderRadius: "6px",
                  border: "1px solid #cbd5e1",
                }}
              >
                <FaGithub /> GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/khageswararao"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  fontSize: "12px",
                  color: "#0a66c2",
                  textDecoration: "none",
                  fontWeight: 600,
                  background: "#e0f2fe",
                  padding: "4px 10px",
                  borderRadius: "6px",
                  border: "1px solid #bae6fd",
                }}
              >
                <FaLinkedin /> LinkedIn
              </a>
            </div>
          </div>
        </div>

        <div style={{ fontSize: "13.5px", color: "#334155", lineHeight: "1.55", marginBottom: "16px" }}>
          <p style={{ margin: "0 0 10px 0" }}>
            <strong>About This App:</strong> Sankalp IP HRMS is an all-in-one Human Resource Management System engineered to streamline organizational workforce operations. It provides role-based portal access for both Administrators and Employees.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "12.5px" }}>
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

        {/* Check for Updates Action */}
        <div style={{ textAlign: "center", marginBottom: "14px" }}>
          <button
            type="button"
            onClick={handleCheckUpdates}
            style={{
              background: "#f1f5f9",
              border: "1px solid #cbd5e1",
              borderRadius: "8px",
              padding: "8px 16px",
              fontSize: "13px",
              fontWeight: "600",
              color: "#1e293b",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "7px",
              transition: "all 0.2s ease",
            }}
          >
            <FaSyncAlt color="#1E88E5" /> Check for App Updates
          </button>
        </div>

        <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "12px", textAlign: "center" }}>
          <p style={{ margin: "0", fontSize: "12px", color: "#94a3b8" }}>
            © {new Date().getFullYear()} Sankalp IP. Built with pride by {DEVELOPER_NAME}.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AboutModal;
