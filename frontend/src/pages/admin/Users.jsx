import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../components/admin/Sidebar/Sidebar";
import Topbar from "../../components/admin/Topbar/Topbar";
import "./Users.css";

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

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");

    if (!token || role !== "admin") {
      navigate("/admin/login");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post("http://localhost:5000/api/users", formData, {
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
              <h2>Create a new user account</h2>
              <p>Use this form to create accounts for employees, engineers, HR staff, or clients.</p>
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
                Role
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
              {loading ? "Creating account..." : "Create user"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Users;
