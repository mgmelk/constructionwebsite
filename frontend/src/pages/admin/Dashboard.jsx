import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../components/Admin/Sidebar/Sidebar";
import Topbar from "../../components/Admin/Topbar/Topbar";
import DashboardCards from "../../components/Admin/DashboardCards/DashboardCards";
import "./Dashboard.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");

    if (!token || role !== "admin") {
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");
      localStorage.removeItem("adminName");
      navigate("/admin/login");
      return;
    }

    axios
      .get(`${API_URL}/api/admin/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setStats(response.data.dashboard);
        setLoading(false);
      })
      .catch((err) => {
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem("token");
          localStorage.removeItem("adminName");
          navigate("/admin/login");
          return;
        }

        setError(err.response?.data?.message || "Unable to load dashboard.");
        setLoading(false);
      });
  }, [navigate]);

  return (
    <>
      <Sidebar />
      <Topbar adminName={localStorage.getItem("adminName") || "Admin"} />
      <div className="admin-dashboard-header">
        <div className="admin-dashboard-header-text">
          <h1>Admin Dashboard</h1>
          <p>Register any staff user here. Regular visitors signing up from the homepage are created as clients only.</p>
        </div>
        <Link to="/admin/users" className="admin-action-button">
          Register User
        </Link>
      </div>
      <div className="admin-dashboard-links">
        <Link to="/admin/users" className="admin-dashboard-link-card">Users</Link>
        <Link to="/admin/clients" className="admin-dashboard-link-card">Clients</Link>
        <Link to="/admin/employees" className="admin-dashboard-link-card">Employees</Link>
        <Link to="/admin/engineers" className="admin-dashboard-link-card">Engineers</Link>
        <Link to="/admin/hr-managers" className="admin-dashboard-link-card">HR Managers</Link>
        <Link to="/admin/quotes" className="admin-dashboard-link-card">Quotes</Link>
      </div>
      {loading ? (
        <div className="dashboard-loading">Loading dashboard...</div>
      ) : error ? (
        <div className="dashboard-loading">{error}</div>
      ) : (
        <DashboardCards stats={stats} />
      )}
    </>
  );
}

export default Dashboard;