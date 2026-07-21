import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../components/Admin/Sidebar/Sidebar";
import Topbar from "../../components/Admin/Topbar/Topbar";
import "./Users.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function AdminClients() {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");

    if (!token || role !== "admin") {
      navigate("/admin/login");
      return;
    }

    const loadClients = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setClients(response.data.filter((user) => user.role === "client") || []);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load clients.");
      } finally {
        setLoading(false);
      }
    };

    loadClients();
  }, [navigate]);

  return (
    <>
      <Sidebar />
      <Topbar adminName={localStorage.getItem("adminName") || "Admin"} />
      <div className="admin-users-page">
        <div className="admin-users-card">
          <div className="admin-users-header">
            <div>
              <p className="admin-users-eyebrow">Clients</p>
              <h2>Client records</h2>
              <p>All client accounts registered through the system.</p>
            </div>
          </div>
          {loading ? (
            <p>Loading clients...</p>
          ) : error ? (
            <p className="admin-users-error">{error}</p>
          ) : (
            <div className="admin-users-table">
              <div className="admin-users-table-header">
                <h3>{clients.length} client(s)</h3>
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
                  {clients.map((client) => (
                    <tr key={client._id}>
                      <td>{client.fullName || "-"}</td>
                      <td>{client.email || "-"}</td>
                      <td>{client.phone || "-"}</td>
                      <td>{client.role || "-"}</td>
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

export default AdminClients;
