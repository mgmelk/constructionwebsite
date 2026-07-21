import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../components/Admin/Sidebar/Sidebar";
import Topbar from "../../components/Admin/Topbar/Topbar";
import "./Users.css";


function AdminHRManagers() {
  const navigate = useNavigate();
  const [hrManagers, setHRManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");

    if (!token || role !== "admin") {
      navigate("/admin/login");
      return;
    }

    const loadHRManagers = async () => {
      try {
        const response = await axios.get(`/api/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setHRManagers(response.data.filter((user) => user.role === "hr_manager") || []);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load HR managers.");
      } finally {
        setLoading(false);
      }
    };

    loadHRManagers();
  }, [navigate]);

  return (
    <>
      <Sidebar />
      <Topbar adminName={localStorage.getItem("adminName") || "Admin"} />
      <div className="admin-users-page">
        <div className="admin-users-card">
          <div className="admin-users-header">
            <div>
              <p className="admin-users-eyebrow">HR Managers</p>
              <h2>HR manager records</h2>
              <p>All HR managers registered in the system.</p>
            </div>
          </div>
          {loading ? (
            <p>Loading HR managers...</p>
          ) : error ? (
            <p className="admin-users-error">{error}</p>
          ) : (
            <div className="admin-users-table">
              <div className="admin-users-table-header">
                <h3>{hrManagers.length} HR manager(s)</h3>
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
                  {hrManagers.map((hr) => (
                    <tr key={hr._id}>
                      <td>{hr.fullName || "-"}</td>
                      <td>{hr.email || "-"}</td>
                      <td>{hr.phone || "-"}</td>
                      <td>{hr.role || "-"}</td>
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

export default AdminHRManagers;
