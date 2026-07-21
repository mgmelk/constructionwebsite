import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../components/Admin/Sidebar/Sidebar";
import Topbar from "../../components/Admin/Topbar/Topbar";
import "./Users.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function AdminEmployees() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");

    if (!token || role !== "admin") {
      navigate("/admin/login");
      return;
    }

    const loadEmployees = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setEmployees(response.data.filter((user) => user.role === "employee") || []);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load employees.");
      } finally {
        setLoading(false);
      }
    };

    loadEmployees();
  }, [navigate]);

  return (
    <>
      <Sidebar />
      <Topbar adminName={localStorage.getItem("adminName") || "Admin"} />
      <div className="admin-users-page">
        <div className="admin-users-card">
          <div className="admin-users-header">
            <div>
              <p className="admin-users-eyebrow">Employees</p>
              <h2>Employee records</h2>
              <p>All employees registered in the system.</p>
            </div>
          </div>
          {loading ? (
            <p>Loading employees...</p>
          ) : error ? (
            <p className="admin-users-error">{error}</p>
          ) : (
            <div className="admin-users-table">
              <div className="admin-users-table-header">
                <h3>{employees.length} employee(s)</h3>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee) => (
                    <tr key={employee._id}>
                      <td>{employee.fullName || "-"}</td>
                      <td>{employee.email || "-"}</td>
                      <td>{employee.phone || "-"}</td>
                      <td>{employee.role || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default AdminEmployees;
