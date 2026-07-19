import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function EmployeeDashboard() {
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
    <div className="employee-dashboard-page">
      <div className="employee-dashboard-card">
        <h1>Employee Dashboard</h1>
        <p>Welcome back, {localStorage.getItem("adminName") || "Employee"}.</p>
        <div className="employee-dashboard-grid">
          <div className="employee-dashboard-box">
            <h3>Daily Tasks</h3>
            <p>Review assigned duties and daily project responsibilities.</p>
          </div>
          <div className="employee-dashboard-box">
            <h3>Attendance</h3>
            <p>Track work attendance and daily presence records.</p>
          </div>
          <div className="employee-dashboard-box">
            <h3>Reports</h3>
            <p>Submit progress reports and operational updates.</p>
          </div>
          <div className="employee-dashboard-box">
            <h3>Support</h3>
            <p>Access internal support channels and office notices.</p>
          </div>
        </div>
        {loading ? <p className="employee-loading">Loading dashboard...</p> : null}
      </div>
    </div>
  );
}

export default EmployeeDashboard;
