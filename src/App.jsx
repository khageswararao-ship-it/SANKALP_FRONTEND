import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
// Admin Dashboard Pages
import Dashboard from "./pages/Admin_Dashboard/Dashboard";
import Employees from "./pages/Admin_Dashboard/Employees";
import Attendance from "./pages/Admin_Dashboard/Attendance";
import Leave from "./pages/Admin_Dashboard/Leave";
import Payroll from "./pages/Admin_Dashboard/Payroll";
import Reports from "./pages/Admin_Dashboard/Reports";
import Settings from "./pages/Admin_Dashboard/Settings";
import AdminNotifications from "./pages/Admin_Dashboard/Notifications";
import Profile from "./pages/Admin_Dashboard/Profile";

import AddEmployee from "./pages/Admin_Dashboard/AddEmployee";
import ViewEmployee from "./pages/Admin_Dashboard/ViewEmployee";
import EditEmployee from "./pages/Admin_Dashboard/EditEmployee";

import ViewAttendance from "./pages/Admin_Dashboard/ViewAttendance";
import EditAttendance from "./pages/Admin_Dashboard/EditAttendance";
import MarkAttendance from "./pages/Admin_Dashboard/MarkAttendance";

import ApplyLeave from "./pages/Admin_Dashboard/ApplyLeave";
import ViewLeave from "./pages/Admin_Dashboard/ViewLeave";
import ApproveLeave from "./pages/Admin_Dashboard/ApproveLeave";
import RejectLeave from "./pages/Admin_Dashboard/RejectLeave";

import GeneratePayroll from "./pages/Admin_Dashboard/GeneratePayroll";
import ViewPayroll from "./pages/Admin_Dashboard/ViewPayroll";
import EditPayroll from "./pages/Admin_Dashboard/EditPayroll";

import GenerateReport from "./pages/Admin_Dashboard/GenerateReport";
import ViewReport from "./pages/Admin_Dashboard/ViewReport";
import DownloadReport from "./pages/Admin_Dashboard/DownloadReport";

import ChangePassword from "./pages/Admin_Dashboard/ChangePassword";
import SystemSettings from "./pages/Admin_Dashboard/SystemSettings";
import SecuritySettings from "./pages/Admin_Dashboard/SecuritySettings";
import AdminForgotPassword from "./pages/AdminForgotPassword";
import AdminResetPassword from "./pages/AdminResetPassword";


// Emmploee Dashboard Pages

import EmployeeDashboard from "./pages/Employee_Dashboard/EmployeeDashboard";
import MyProfile from "./pages/Employee_Dashboard/MyProfile";
import MyAttendance from "./pages/Employee_Dashboard/MyAttendance";
import EmployeeNotifications from "./pages/Employee_Dashboard/Notifications";
import MyLeave from "./pages/Employee_Dashboard/MyLeave";
import MyPayroll from "./pages/Employee_Dashboard/MyPayroll";
import EmployeeSettings from "./pages/Employee_Dashboard/Settings";
import OTPVerification from "./pages/Employee_Dashboard/OTPVerification";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Login */}
        <Route path="/" element={<Login />} />
        <Route path="/admin-login" element={<Login />} />

        {/* Admin Dashboard */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />


            <Route
                path="/admin/forgot-password"
                element={<AdminForgotPassword />}
            />


            <Route
                path="/admin/reset-password"
                element={<AdminResetPassword />}
            />


        {/* Employees */}
        <Route path="/employees" element={<Employees />} />
        <Route path="/employees/add" element={<AddEmployee />} />
        <Route path="/employees/view/:id" element={<ViewEmployee />} />
        <Route path="/employees/edit/:id" element={<EditEmployee />} />

        {/* Attendance */}
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/attendance/mark" element={<MarkAttendance />} />
        <Route path="/attendance/view/:id" element={<ViewAttendance />} />
        <Route path="/attendance/edit/:id" element={<EditAttendance />} />

        {/* Leave */}
        <Route path="/leave" element={<Leave />} />
        <Route path="/leave/apply" element={<ApplyLeave />} />
        <Route path="/leave/view/:id" element={<ViewLeave />} />
        <Route path="/leave/approve/:id" element={<ApproveLeave />} />
        <Route path="/leave/reject/:id" element={<RejectLeave />} />

        {/* Payroll */}
        <Route path="/payroll" element={<Payroll />} />
        <Route path="/payroll/generate" element={<GeneratePayroll />} />
        <Route path="/payroll/view/:id" element={<ViewPayroll />} />
        <Route path="/payroll/edit/:id" element={<EditPayroll />} />

        {/* Reports */}
        <Route path="/reports" element={<Reports />} />
        <Route path="/reports/generate" element={<GenerateReport />} />
        <Route path="/reports/view/:id" element={<ViewReport />} />
        <Route path="/reports/download/:id" element={<DownloadReport />} />

        {/* Notifications */}
        <Route path="/notifications" element={<AdminNotifications />} />

        {/* Settings */}
        <Route path="/settings" element={<Settings />} />
        <Route path="/settings/password" element={<ChangePassword />} />
        <Route path="/settings/system" element={<SystemSettings />} />
        <Route path="/settings/security" element={<SecuritySettings />} />

        {/* Employee Dashboard */}
        <Route path="/employee/dashboard" element={<EmployeeDashboard />}/>

        {/* Employee Profile */}
        <Route path="/employee/profile" element={<MyProfile />} />

        {/* Employee Attendance */}
        <Route path="/employee/attendance" element={<MyAttendance />}/>

        {/* Employee Notifications */}
        <Route path="/employee/notifications" element={<EmployeeNotifications />}/>

        {/* Employee Leave */}
        <Route path="/employee/leave" element={<MyLeave />}/>

        {/* Employee Leave */}
        <Route path="/employee/payroll" element={<MyPayroll />}/>

        {/* Employee Settings */}
        <Route path="/employee/settings" element={<EmployeeSettings />}/>

        {/* Employee OTP Verification */}
        <Route path="/employee/otp" element={<OTPVerification />}/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;