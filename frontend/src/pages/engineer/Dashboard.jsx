import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function EngineerDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="engineer-dashboard-page">
      <div className="engineer-dashboard-card">
        <h1>Engineer Dashboard</h1>
        <p>Welcome back, {localStorage.getItem("adminName") || "Engineer"}.</p>
        <div className="engineer-dashboard-grid">
          <div className="engineer-dashboard-box">
            <h3>Projects</h3>
            <p>Monitor active engineering assignments and site progress.</p>
          </div>
          <div className="engineer-dashboard-box">
            <h3>Technical Reports</h3>
            <p>Review inspection notes and project documentation.</p>
          </div>
          <div className="engineer-dashboard-box">
            <h3>Maintenance Tasks</h3>
            <p>Track maintenance schedules and issue resolution.</p>
          </div>
          <div className="engineer-dashboard-box">
            <h3>Resources</h3>
            <p>Access engineering standards, plans, and technical assets.</p>
          </div>
        </div>
        {loading ? <p className="engineer-loading">Loading dashboard...</p> : null}
      </div>
    </div>
  );
}

export default EngineerDashboard;
