import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import "./AuthPages.css";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please check and try again.");
      return;
    }

    setLoading(true);

    try {
      await axios.post(`/api/auth/reset-password/${token}`, {
        password,
      });

      setSuccess(true);
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 2500);
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid or expired password reset link."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Reset Password</h2>
        <p>Please enter your new password below.</p>

        {success ? (
          <div className="auth-success-container">
            <p className="auth-success">
              🎉 Password has been reset successfully! Redirecting you to the login page...
            </p>
            <p className="auth-link-text">
              <Link to="/login">Click here if not redirected automatically</Link>
            </p>
          </div>
        ) : (
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {error ? <p className="auth-error">{error}</p> : null}

            <button type="submit" disabled={loading}>
              {loading ? "Resetting Password..." : "Update Password"}
            </button>

            <p className="auth-link-text">
              <Link to="/login">Back to Login</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;
