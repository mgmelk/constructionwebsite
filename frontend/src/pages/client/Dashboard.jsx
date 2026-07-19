import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function ClientDashboard() {
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
    <div className="client-dashboard-page">
      <div className="client-dashboard-card">
        <h1>Client Dashboard</h1>
        <p>Welcome back, {localStorage.getItem("adminName") || "Client"}.</p>
        <div className="client-dashboard-grid">
          <div className="client-dashboard-box">
            <h3>Projects</h3>
            <p>View your active and completed construction projects.</p>
          </div>
          <div className="client-dashboard-box">
            <h3>Progress Updates</h3>
            <p>Track latest progress reports and milestone updates.</p>
          </div>
          <div className="client-dashboard-box">
            <h3>Payments</h3>
            <p>Check payment status and project billing information.</p>
          </div>
          <div className="client-dashboard-box">
            <h3>Support</h3>
            <p>Reach out for support and project-related requests.</p>
          </div>
        </div>
        {loading ? <p className="client-loading">Loading dashboard...</p> : null}
      </div>
    </div>
  );
}

export default ClientDashboard;
