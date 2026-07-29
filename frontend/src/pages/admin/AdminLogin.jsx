import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import AdminTopbar from "../../components/Admin/AdminTopbar/AdminTopbar";
import "../AuthPages.css";


function AdminLogin() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(`/api/auth/login`, {
        ...formData,
        email: formData.email.trim().toLowerCase(),
      });

      const { token, user } = response.data;

      if (!token) {
        setError("Login succeeded but no token was returned.");
        return;
      }

      if (user?.role !== "admin") {
        setError("Only admin accounts can access this area.");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("userRole", user.role);
      localStorage.setItem("adminName", user.fullName || "Admin");
      localStorage.setItem("userName", user.fullName || "Admin");
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Login failed. Please try again.");
      console.error("Admin login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AdminTopbar />
      <div className="auth-page">
        <div className="auth-card">
          <h2>Admin Login</h2>
          <p>Access the admin dashboard securely.</p>
          <form className="auth-form" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Admin Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
            <div className="auth-forgot-link">
              <Link to="/forgot-password">Forgot password?</Link>
            </div>
            {error ? <p className="auth-error">{error}</p> : null}
            <button type="submit" disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>
          <p className="auth-link-text">
            Need an admin account? <Link to="/admin/register">Create one</Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default AdminLogin;
