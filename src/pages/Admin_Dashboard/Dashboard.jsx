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
} from "react-icons/fa";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";

import {
  getEmployees,
  getAttendance,
  getLeaves,
  getPayroll,
} from "../../api/dashboardApi";

function Dashboard() {
  const [employees, setEmployees] = useState(0);
  const [attendance, setAttendance] = useState(0);
  const [pendingLeaves, setPendingLeaves] = useState(0);
  const [payroll, setPayroll] = useState(0);
  const COLORS = ["#1E88E5", "#43A047", "#FB8C00", "#E53935"];

const attendanceData = [
  { name: "Present", value: attendance },
  { name: "Absent", value: 100 - attendance },
];

const statsData = [
  { name: "Employees", value: employees },
  { name: "Leaves", value: pendingLeaves },
  { name: "Attendance", value: attendance },
];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const employeeRes = await getEmployees();
      setEmployees(employeeRes.data.length);

      const attendanceRes = await getAttendance();

      const presentCount = attendanceRes.data.filter(
        (a) => a.status === "Present"
      ).length;

      const attendancePercentage =
        attendanceRes.data.length > 0
          ? Math.round((presentCount / attendanceRes.data.length) * 100)
          : 0;

      setAttendance(attendancePercentage);

      const leaveRes = await getLeaves();

      const pending = leaveRes.data.filter(
        (l) => l.status === "Pending"
      ).length;

      setPendingLeaves(pending);

      const payrollRes = await getPayroll();

      const totalSalary = payrollRes.data.reduce(
        (sum, p) => sum + Number(p.salary || 0),
        0
      );

      setPayroll(totalSalary);
    } catch (error) {
      console.error("Dashboard Error:", error);
    }
  };

  return (
    <div className="layout">
      <Sidebar activePage="Dashboard" />

      <div className="main-content">
        <Header />

        <div className="page-content">

    <h1 className="page-title">
        Welcome Back, Admin 👋
    </h1>

    {/* ===== TOP CARDS ===== */}

    <div className="dashboard-grid">

        <DashboardCard
            title="Employees"
            value={employees}
            icon={<FaUsers />}
            color="#1E88E5"
        />

        <DashboardCard
            title="Attendance"
            value={`${attendance}%`}
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

    {/* ===== CHARTS ===== */}

    <div className="dashboard-charts">

        <div className="chart-card">

            <h3>Attendance Overview</h3>

            <ResponsiveContainer width="100%" height={300}>
                <PieChart>

                    <Pie
                        data={attendanceData}
                        dataKey="value"
                        outerRadius={100}
                        label
                    >
                        {attendanceData.map((entry,index)=>(
                            <Cell
                                key={index}
                                fill={COLORS[index]}
                            />
                        ))}
                    </Pie>

                    <Tooltip/>

                </PieChart>
            </ResponsiveContainer>

        </div>

        <div className="chart-card">

            <h3>Company Statistics</h3>

            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={statsData}>
                    <XAxis dataKey="name"/>
                    <YAxis/>
                    <Tooltip/>
                    <Bar
                        dataKey="value"
                        fill="#1E88E5"
                    />
                </BarChart>
            </ResponsiveContainer>

        </div>

    </div>

    {/* ===== BOTTOM ===== */}

    <div className="recent-section">

        <div className="recent-card">

            <h3>Recent Activity</h3>

            <ul>

                <li>✅ Employee records synchronized</li>

                <li>🟢 Attendance updated</li>

                <li>📄 Leave requests processed</li>

                <li>💰 Payroll generated</li>

                <li>🔔 Notifications delivered</li>

            </ul>

        </div>

        <div className="recent-card">

            <h3>Quick Summary</h3>

            <p>Total Employees : <b>{employees}</b></p>

            <p>Attendance : <b>{attendance}%</b></p>

            <p>Pending Leaves : <b>{pendingLeaves}</b></p>

            <p>Total Payroll : <b>₹{payroll.toLocaleString()}</b></p>

        </div>

    </div>

</div>
      </div>
    </div>
  );
}

export default Dashboard;