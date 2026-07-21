import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../components/Admin/Sidebar/Sidebar";
import Topbar from "../../components/Admin/Topbar/Topbar";
import "./Users.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function AdminEngineers() {
  const navigate = useNavigate();
  const [engineers, setEngineers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");

    if (!token || role !== "admin") {
      navigate("/admin/login");
      return;
    }

    const loadEngineers = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setEngineers(response.data.filter((user) => user.role === "engineer") || []);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load engineers.");
      } finally {
        setLoading(false);
      }
    };

    loadEngineers();
  }, [navigate]);

  return (
    <>
      <Sidebar />
      <Topbar adminName={localStorage.getItem("adminName") || "Admin"} />
      <div className="admin-users-page">
        <div className="admin-users-card">
          <div className="admin-users-header">
            <div>
              <p className="admin-users-eyebrow">Engineers</p>
              <h2>Engineer records</h2>
              <p>All engineers registered in the system.</p>
            </div>
          </div>
          {loading ? (
            <p>Loading engineers...</p>
          ) : error ? (
            <p className="admin-users-error">{error}</p>
          ) : (
            <div className="admin-users-table">
              <div className="admin-users-table-header">
                <h3>{engineers.length} engineer(s)</h3>
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
                  {engineers.map((engineer) => (
                    <tr key={engineer._id}>
                      <td>{engineer.fullName || "-"}</td>
                      <td>{engineer.email || "-"}</td>
                      <td>{engineer.phone || "-"}</td>
                      <td>{engineer.role || "-"}</td>
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

export default AdminEngineers;
