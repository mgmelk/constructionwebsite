import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../components/admin/Sidebar/Sidebar";
import Topbar from "../../components/admin/Topbar/Topbar";
import DashboardCards from "../../components/admin/DashboardCards/DashboardCards";

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
      .get("http://localhost:5000/api/admin/dashboard", {
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