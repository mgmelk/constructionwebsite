import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./AuthPages.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(false);

    try {
      setLoading(true);
      const response = await axios.post("/api/auth/forgot-password", {
        email: email.trim().toLowerCase(),
      });

      setSuccessMessage(
        response.data?.message ||
          "A password reset link has been sent to your email address. Please check your inbox."
      );
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to process request. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Forgot Password</h2>
        <p>Enter your registered account email address to receive password reset instructions.</p>

        {successMessage ? (
          <div className="auth-success-container">
            <p className="auth-success">
              📩 {successMessage}
            </p>
            <p style={{ marginTop: "16px", fontSize: "14px", color: "#555" }}>
              Open your email inbox, click the secure reset link inside the email, and follow the instructions to set your new password.
            </p>
            <p className="auth-link-text" style={{ marginTop: "24px" }}>
              <Link to="/login">Back to Login</Link>
            </p>
          </div>
        ) : (
          <form className="auth-form" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {error ? <p className="auth-error">{error}</p> : null}

            <button type="submit" disabled={loading}>
              {loading ? "Sending Email..." : "Send Reset Link"}
            </button>

            <p className="auth-link-text">
              Remembered your password? <Link to="/login">Back to Login</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
