# Sankalp HRMS (Enterprise Frontend) 🏢
### Enterprise Human Resource Management & Workforce Operations Platform

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Capacitor](https://img.shields.io/badge/Capacitor-Android_Hybrid-119EFF?style=for-the-badge&logo=capacitor&logoColor=white)](https://capacitorjs.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](#)

A full-featured, responsive Enterprise Human Resource Management System (HRMS) built for corporate workforce operations, multi-tier organizational hierarchies, and automated compliance. Designed as a modern Single Page Application (SPA) with **React 18, Vite, React Router 6, and Recharts**, with cross-platform mobile support powered by **Capacitor Android**.

---

## 🏛️ System Architecture

```text
[ Client Presentation Layer ]
  ├── Admin Console (KPI Analytics, Employee Management, Payroll Engine)
  └── Employee Self-Service Portal (Leave Requests, Attendance, Payslips)
                    │
                    ▼
[ State & Routing Layer (React 18 + Context API) ]
  ├── ThemeContext & SidebarContext
  ├── Protected Route Guards
  └── In-App Update Engine (Capacitor)
                    │
                    ▼
[ Modular API Service Layer (Axios Interceptors) ]
  ├── Auth & OTP Engine (loginApi, otpApi, passwordResetApi)
  ├── Workforce Engine (employeeApi, attendanceApi, leaveApi)
  └── Financial Engine (payrollApi, reportApi)
                    │
                    ▼
[ Enterprise REST API Backend ]
```

---

## 🚀 Core Features & Modules

### 1. Security & Authentication Workflows
* **Time-Based OTP Verification:** Dual-factor authentication workflow for sensitive administrative actions and portal access.
* **Role-Based Access Control (RBAC):** Strict view and operational segregation between Administrators and Employees.
* **Self-Service Credential Recovery:** Multi-step username discovery, OTP password reset, and encrypted credentials update pipelines.

### 2. Administrative Workforce Command Center
* **Real-Time KPI Dashboards:** Interactive metrics visualizing total workforce, attendance compliance, active leave ratios, and monthly payroll expenditure via **Recharts**.
* **Employee Lifecycle Management:** Comprehensive CRUD operations covering onboarding, role assignment, departmental structuring, and status toggles.
* **Dynamic Attendance Ledger:** Centralized punch logging, anomaly detection, manual override capabilities, and automated presence tracking.
* **Leave Approval Pipeline:** Multi-tier leave review engine with instant approve/reject decision controls and quota deduction.
* **Payroll Processing Engine:** Automated net salary calculation taking allowances, deductions, and unpaid leave days into account, with instant pay slip generation.
* **Audit & Compliance Reporting:** Real-time generation and export of organizational attendance, leave, and tax compliance reports.

### 3. Employee Self-Service (ESS) Portal
* **Personal Attendance Hub:** Real-time personal clock-in/clock-out tracking and monthly presence calendar.
* **Leave Application Wizard:** Request time-off with live balance previews and status updates.
* **Digital Payslip Vault:** Secure viewing and downloading of historical monthly salary receipts.
* **Profile Management:** Secure editing of contact details, emergency contacts, and personal preferences.

### 4. Cross-Platform Mobile Deployment (Android)
* Powered by **Capacitor 8.5** to compile into a native Android APK with native hardware back button handling, splash screen support, and in-app update checks.

---

## 🛠️ Technology Stack

* **Core Framework:** React 18.3.1
* **Bundler & Tooling:** Vite 5.4.10
* **Routing:** React Router DOM 6.28
* **Data Visualization:** Recharts 3.10
* **Network & HTTP:** Axios with modular API service abstractions
* **Mobile Compilation:** Capacitor CLI & Android Bridge 8.5
* **Icons & Styling:** React Icons, Custom Component CSS Modules

---

## 📁 Modular Directory Hierarchy

```text
src/
├── api/                   # Centralized API service abstractions
│   ├── apiConfig.js       # Base Axios instance & request interceptors
│   ├── authApi.js         # Login, session validation & OTP endpoints
│   ├── employeeApi.js     # Personnel CRUD endpoints
│   ├── attendanceApi.js   # Punch records & attendance query endpoints
│   ├── leaveApi.js        # Leave workflows & balance endpoints
│   └── payrollApi.js      # Compensation calculation & slip endpoints
├── components/            # Reusable enterprise UI primitives
│   ├── Header.jsx         # Global top bar with profile dropdown
│   ├── Sidebar.jsx        # Admin collapsible navigation
│   ├── EmployeeSidebar.jsx# Employee portal navigation
│   ├── KpiCard.jsx        # Metric counter with dynamic delta badges
│   └── DashboardCard.jsx  # Card container for Recharts graphics
├── context/               # Global state providers (Theme, Sidebar)
├── pages/                 # Full-page route views
│   ├── Admin/             # Complete Admin Management views
│   ├── Employee/          # Complete Employee Self-Service views
│   └── Auth/              # Login, OTP Verification, Password Recovery
└── main.jsx               # Application bootstrap & route declarations
```

---

## 💻 Local Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/khageswararao-ship-it/SANKALP_FRONTEND.git
   cd SANKALP_FRONTEND
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment:**
   Create a `.env` file in the root directory:
   ```env
   VITE_API_BASE_URL=http://localhost:8080/api
   ```

4. **Launch development server:**
   ```bash
   npm run dev
   ```

5. **Build for production:**
   ```bash
   npm run build
   ```

---

## 👤 Author
**Ravada Khageswararao**  
* Frontend & Mobile Software Engineer  
* GitHub: [@khageswararao-ship-it](https://github.com/khageswararao-ship-it)
