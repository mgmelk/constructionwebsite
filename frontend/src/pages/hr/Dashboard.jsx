import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Dashboard.css";

function HRDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get("http://localhost:5000/api/hr-managers", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setLoading(false);
      })
      .catch((err) => {
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem("token");
          localStorage.removeItem("adminName");
          navigate("/login");
          return;
        }

        setError(err.response?.data?.message || "Unable to load HR dashboard.");
        setLoading(false);
      });
  }, [navigate]);

  return (
    <div className="hr-dashboard-page">
      <div className="hr-dashboard-card">
        <h1>HR Manager Dashboard</h1>
        <p>Welcome back, {localStorage.getItem("adminName") || "HR Manager"}.</p>
        <div className="hr-dashboard-grid">
          <div className="hr-dashboard-box">
            <h3>Employee Management</h3>
            <p>Track staff records, departments, and onboarding status.</p>
          </div>
          <div className="hr-dashboard-box">
            <h3>Recruitment</h3>
            <p>Monitor hiring workflows and candidate progress.</p>
          </div>
          <div className="hr-dashboard-box">
            <h3>Payroll & Attendance</h3>
            <p>Keep staff attendance and payroll information organized.</p>
          </div>
          <div className="hr-dashboard-box">
            <h3>Reports</h3>
            <p>Review HR performance and operational reports.</p>
          </div>
        </div>
        {loading ? <p className="hr-loading">Loading dashboard...</p> : null}
        {error ? <p className="hr-error">{error}</p> : null}
      </div>
    </div>
  );
}

export default HRDashboard;
