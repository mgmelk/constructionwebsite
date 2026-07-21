import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import AdminTopbar from "../../components/Admin/AdminTopbar/AdminTopbar";
import "../AuthPages.css";


function AdminRegister() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    role: "admin",
    adminSecret: "",
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await axios.post(`/api/auth/register`, {
        ...formData,
        email: formData.email.trim().toLowerCase(),
      });

      setMessage(response.data.message || "Admin account created successfully.");
      setFormData({ fullName: "", email: "", phone: "", password: "", role: "admin", adminSecret: "" });
      navigate("/admin/login", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AdminTopbar />
      <div className="auth-page">
        <div className="auth-card">
          <h2>Create Admin Account</h2>
          <p>Create a new admin account for the dashboard.</p>
          <form className="auth-form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <input
              type="tel"
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Admin Secret"
              value={formData.adminSecret}
              onChange={(e) => setFormData({ ...formData, adminSecret: e.target.value })}
              required
            />
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {error ? <p className="auth-error">{error}</p> : null}
            {message ? <p className="auth-success">{message}</p> : null}
            <button type="submit" disabled={loading}>
              {loading ? "Creating account..." : "Create Admin"}
            </button>
          </form>
          <p className="auth-link-text">
            Already have an admin account? <Link to="/admin/login">Login</Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default AdminRegister;
