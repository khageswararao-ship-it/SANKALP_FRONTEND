import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import DashboardCard from "../../components/DashboardCard";
import "../../styles/layout.css";
import "../../styles/Dashboard.css";

import {
  FaUsers,
  FaUserCheck,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
} from "react-icons/fa";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

import {
  getEmployees,
  getAttendance,
  getLeaves,
  getPayroll,
} from "../../api/dashboardApi";

function Dashboard() {
  const [employees, setEmployees] = useState(0);
  const [attendancePercent, setAttendancePercent] = useState(0);
  const [attendanceCounts, setAttendanceCounts] = useState({
    present: 0,
    absent: 0,
    late: 0,
    leave: 0,
    total: 0,
  });
  const [pendingLeaves, setPendingLeaves] = useState(0);
  const [payroll, setPayroll] = useState(0);

  const COLORS = {
    Present: "#10b981", // green
    Absent: "#ef4444",  // red
    Late: "#f59e0b",    // amber
    Leave: "#6366f1",   // indigo
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const employeeRes = await getEmployees();
      const totalEmployees = Array.isArray(employeeRes.data) ? employeeRes.data.length : 0;
      setEmployees(totalEmployees);

      const attendanceRes = await getAttendance();
      const records = Array.isArray(attendanceRes.data) ? attendanceRes.data : [];

      const present = records.filter((a) => a.status === "Present").length;
      const absent = records.filter((a) => a.status === "Absent").length;
      const late = records.filter((a) => a.status === "Late").length;
      const leave = records.filter((a) => a.status === "Leave").length;
      const total = records.length;

      setAttendanceCounts({ present, absent, late, leave, total });

      const calculatedPercent =
        total > 0
          ? Math.round((present / total) * 100)
          : totalEmployees > 0
          ? 100
          : 0;

      setAttendancePercent(calculatedPercent);

      const leaveRes = await getLeaves();
      const leaveRecords = Array.isArray(leaveRes.data) ? leaveRes.data : [];
      const pending = leaveRecords.filter((l) => l.status === "Pending").length;
      setPendingLeaves(pending);

      const payrollRes = await getPayroll();
      const payrollRecords = Array.isArray(payrollRes.data) ? payrollRes.data : [];
      const totalSalary = payrollRecords.reduce(
        (sum, p) => sum + Number(p.salary || p.netSalary || p.basicSalary || 0),
        0
      );
      setPayroll(totalSalary);
    } catch (error) {
      console.error("Dashboard Error:", error);
    }
  };

  // Build robust attendance data for chart
  const hasAttendanceRecords = attendanceCounts.total > 0;
  const attendanceChartData = hasAttendanceRecords
    ? [
        { name: "Present", value: attendanceCounts.present, fill: COLORS.Present },
        { name: "Absent", value: attendanceCounts.absent, fill: COLORS.Absent },
        { name: "Late", value: attendanceCounts.late, fill: COLORS.Late },
        { name: "On Leave", value: attendanceCounts.leave, fill: COLORS.Leave },
      ].filter((item) => item.value > 0)
    : [
        { name: "Active Employees", value: employees > 0 ? employees : 1, fill: COLORS.Present },
      ];

  return (
    <div className="layout">
      <Sidebar activePage="Dashboard" />

      <div className="main-content">
        <Header />

        <div className="page-content">
          <h1 className="page-title">Welcome Back, Admin 👋</h1>

          {/* ===== TOP METRICS CARDS ===== */}
          <div className="dashboard-grid">
            <DashboardCard
              title="Employees"
              value={employees}
              icon={<FaUsers />}
              color="#1E88E5"
            />

            <DashboardCard
              title="Attendance"
              value={`${attendancePercent}%`}
              icon={<FaUserCheck />}
              color="#43A047"
            />

            <DashboardCard
              title="Pending Leaves"
              value={pendingLeaves}
              icon={<FaCalendarAlt />}
              color="#FB8C00"
            />

            <DashboardCard
              title="Payroll"
              value={`₹${payroll.toLocaleString()}`}
              icon={<FaMoneyBillWave />}
              color="#8E24AA"
            />
          </div>

          {/* ===== ATTENDANCE OVERVIEW CHART & SUMMARY ===== */}
          <div className="dashboard-charts" style={{ gridTemplateColumns: "1fr", maxWidth: "900px", margin: "20px auto 0 auto" }}>
            <div className="chart-card" style={{ padding: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px", marginBottom: "15px" }}>
                <h3 style={{ margin: 0, fontSize: "18px" }}>Attendance Overview</h3>
                <span style={{ fontSize: "13px", fontWeight: "600", color: "#10b981", background: "rgba(16,185,129,0.1)", padding: "4px 12px", borderRadius: "20px" }}>
                  {attendanceCounts.total > 0 ? `${attendanceCounts.total} Recorded Today` : "Real-time Tracking"}
                </span>
              </div>

              {/* Status badges */}
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px" }}>
                  <FaCheckCircle color="#10b981" /> <span>Present: <strong>{attendanceCounts.present}</strong></span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px" }}>
                  <FaTimesCircle color="#ef4444" /> <span>Absent: <strong>{attendanceCounts.absent}</strong></span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px" }}>
                  <FaClock color="#f59e0b" /> <span>Late: <strong>{attendanceCounts.late}</strong></span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px" }}>
                  <FaCalendarAlt color="#6366f1" /> <span>On Leave: <strong>{attendanceCounts.leave}</strong></span>
                </div>
              </div>

              {/* Robust True Solid Pie Chart */}
              <div style={{ width: "100%", height: "290px", minHeight: "290px", position: "relative" }}>
                <ResponsiveContainer width="100%" height={290} minHeight={290}>
                  <PieChart>
                    <Pie
                      data={attendanceChartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      innerRadius={0}
                      paddingAngle={attendanceChartData.length > 1 ? 2 : 0}
                      stroke="#ffffff"
                      strokeWidth={2}
                      isAnimationActive={true}
                      animationDuration={900}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {attendanceChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [`${value} Employee(s)`, name]} />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Quick Summary Bar */}
              <div style={{ marginTop: "20px", borderTop: "1px solid rgba(226, 232, 240, 0.6)", paddingTop: "15px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "12px", textAlign: "center" }}>
                  <div>
                    <div style={{ fontSize: "12px", color: "#64748b" }}>Overall Attendance</div>
                    <div style={{ fontSize: "18px", fontWeight: "700", color: "#10b981" }}>{attendancePercent}%</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "12px", color: "#64748b" }}>Active Workforce</div>
                    <div style={{ fontSize: "18px", fontWeight: "700", color: "#1E88E5" }}>{employees} Staff</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "12px", color: "#64748b" }}>Pending Leaves</div>
                    <div style={{ fontSize: "18px", fontWeight: "700", color: "#FB8C00" }}>{pendingLeaves} Requests</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "12px", color: "#64748b" }}>Monthly Payroll</div>
                    <div style={{ fontSize: "18px", fontWeight: "700", color: "#8E24AA" }}>₹{payroll.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;