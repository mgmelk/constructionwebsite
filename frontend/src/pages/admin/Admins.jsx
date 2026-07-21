import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../components/Admin/Sidebar/Sidebar";
import Topbar from "../../components/Admin/Topbar/Topbar";
import "./Users.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function Admins() {
  const navigate = useNavigate();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");

    if (!token || role !== "admin") {
      navigate("/admin/login");
      return;
    }

    const loadAdmins = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setAdmins(response.data.filter((user) => user.role === "admin") || []);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load admins.");
      } finally {
        setLoading(false);
      }
    };

    loadAdmins();
  }, [navigate]);

  return (
    <>
      <Sidebar />
      <Topbar adminName={localStorage.getItem("adminName") || "Admin"} />
      <div className="admin-users-page">
        <div className="admin-users-card">
          <div className="admin-users-header">
            <div>
              <p className="admin-users-eyebrow">Admins</p>
              <h2>Admin records</h2>
              <p>All admin users registered in the system.</p>
            </div>
          </div>
          {loading ? (
            <p>Loading admins...</p>
          ) : error ? (
            <p className="admin-users-error">{error}</p>
          ) : (
            <div className="admin-users-table">
              <div className="admin-users-table-header">
                <h3>{admins.length} admin(s)</h3>
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
                  {admins.map((admin) => (
                    <tr key={admin._id}>
                      <td>{admin.fullName || "-"}</td>
                      <td>{admin.email || "-"}</td>
                      <td>{admin.phone || "-"}</td>
                      <td>{admin.role || "-"}</td>
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

export default Admins;
