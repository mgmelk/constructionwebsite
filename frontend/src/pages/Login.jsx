import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import "./AuthPages.css";


function Login() {
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
        setError("Login was successful but no token was returned.");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("userRole", user?.role || "client");
      const displayName = user?.fullName || user?.name || user?.username || "User";
      localStorage.setItem("adminName", displayName);
      localStorage.setItem("userName", displayName);
      localStorage.setItem("userEmail", user?.email || formData.email.trim().toLowerCase());

      if (user?.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else if (user?.role === "hr_manager") {
        navigate("/hr/dashboard", { replace: true });
      } else if (user?.role === "engineer") {
        navigate("/", { replace: true });
      } else if (user?.role === "employee") {
        navigate("/employee/dashboard", { replace: true });
      } else if (user?.role === "client") {
        navigate("/client/dashboard", { replace: true });
      } else {
        setError("Only admin, HR manager, engineer, employee, or client accounts can access the dashboard.");
      }
    } catch (err) {
      const isNetworkError = err.message === "Network Error" || err.code === "ERR_NETWORK";
      const message = isNetworkError
        ? "Unable to reach the backend API. Make sure the server is running and this device can access it."
        : err.response?.data?.message || err.message || "Login failed. Please try again.";
      setError(message);
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Login</h2>
        <p>Welcome back to WEMASTER Construction.</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
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
          Don’t have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
