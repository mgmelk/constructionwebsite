import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../components/Admin/Sidebar/Sidebar";
import Topbar from "../../components/Admin/Topbar/Topbar";
import "./Users.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function Users() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    role: "employee",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");

    if (!token || role !== "admin") {
      navigate("/admin/login");
      return;
    }

    const loadUsers = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load users.");
      } finally {
        setLoadingUsers(false);
      }
    };

    loadUsers();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(`${API_URL}/api/users`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage(response.data.message || "User created successfully.");
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        password: "",
        role: "employee",
      });
      setUsers((prev) => [
        ...prev,
        {
          _id: response.data.user?.id || `${Date.now()}`,
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          role: formData.role,
        },
      ]);
    } catch (err) {
      const serverMessage = err.response?.data?.message || "Unable to create user.";
      setError(serverMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Sidebar />
      <Topbar adminName={localStorage.getItem("adminName") || "Admin"} />

      <div className="admin-users-page">
        <div className="admin-users-card">
          <div className="admin-users-header">
            <div>
              <p className="admin-users-eyebrow">Admin panel</p>
              <h2>Register a new user</h2>
              <p>Only admins can register staff users. Clients should sign up through the homepage signup form.</p>
            </div>
          </div>

          <form className="admin-users-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <label>
                Full name
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
              </label>

              <label>
                Email
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </label>

              <label>
                Phone
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </label>

              <label>
                Password
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </label>

              <label>
                User type
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="admin">Admin</option>
                  <option value="hr_manager">HR Manager</option>
                  <option value="engineer">Engineer</option>
                  <option value="employee">Employee</option>
                  <option value="client">Client</option>
                </select>
              </label>
            </div>

            {error ? <p className="admin-users-error">{error}</p> : null}
            {message ? <p className="admin-users-success">{message}</p> : null}

            <button type="submit" disabled={loading}>
              {loading ? "Registering user..." : "Register user"}
            </button>
          </form>

          <div className="admin-users-table-section">
            <h3>All Users</h3>
            {loadingUsers ? (
              <p>Loading users...</p>
            ) : users.length === 0 ? (
              <p>No users found.</p>
            ) : (
              <div className="admin-users-table">
                <table>
                  <thead>
                    <tr>
                      <th>Full Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id}>
                        <td>{user.fullName || "-"}</td>
                        <td>{user.email || "-"}</td>
                        <td>{user.phone || "-"}</td>
                        <td>{user.role || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Users;
