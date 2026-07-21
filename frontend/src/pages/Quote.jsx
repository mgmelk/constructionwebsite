import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Quote.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

console.log("QUOTE page using API_URL:", API_URL);

function Quote() {
  const [formData, setFormData] = useState({
    fullName: "",
    companyName: "",
    email: "",
    phone: "",
    address: "",
    projectType: "",
    projectSize: "",
    details: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/api/quotes/request`, {
        ...formData,
        email: formData.email.trim().toLowerCase(),
        fullName: formData.fullName.trim(),
        companyName: formData.companyName.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        projectType: formData.projectType.trim(),
        projectSize: formData.projectSize.trim(),
        details: formData.details.trim(),
      });

      setMessage(response.data.message || "Quote request submitted successfully.");
      setFormData({
        fullName: "",
        companyName: "",
        email: "",
        phone: "",
        address: "",
        projectType: "",
        projectSize: "",
        details: "",
      });
    } catch (err) {
      console.error("Quote submit error:", err);
      const status = err.response?.status;
      const serverMessage = err.response?.data?.message;
      setError(`${status ? status + ": " : ""}${serverMessage || err.message || "Unable to submit quote request."}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="quote-page">
      <div className="quote-page-inner">
        <div style={{ marginBottom: 12 }}>
          <button
            type="button"
            onClick={async () => {
              try {
                const res = await fetch(`${API_URL}/api/test`);
                const text = await res.text();
                alert(`API Test ${res.status}: ${text}`);
              } catch (e) {
                alert(`API Test failed: ${e.message}`);
              }
            }}
            style={{ padding: "8px 12px", marginBottom: 8 }}
          >
            Test API Connectivity
          </button>
        </div>
        <div className="quote-header">
          <h1>Get a Construction Quote</h1>
          <p>Tell us about your project and we will send your request to the admin team for a cost estimate.</p>
          <p>
            Already registered? <Link to="/login">Login</Link> to manage your requests or view your dashboard.
          </p>
        </div>
        <form className="quote-form" onSubmit={handleSubmit}>
          <div className="quote-grid">
            <label>
              Full Name
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Your full name"
              />
            </label>
            <label>
              Company Name
              <input
                type="text"
                required
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                placeholder="Your company or organization"
              />
            </label>
            <label>
              Email
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Your email address"
              />
            </label>
            <label>
              Phone
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Phone number"
              />
            </label>
            <label>
              Address
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Project address"
              />
            </label>
            <label>
              Project Type
              <input
                type="text"
                required
                value={formData.projectType}
                onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                placeholder="Example: Residential, Commercial, Renovation"
              />
            </label>
            <label>
              Project Size
              <input
                type="text"
                required
                value={formData.projectSize}
                onChange={(e) => setFormData({ ...formData, projectSize: e.target.value })}
                placeholder="Example: 1500 sqft, 3 floors"
              />
            </label>
          </div>
          <label className="quote-details-label">
            Project Details
            <textarea
              required
              value={formData.details}
              onChange={(e) => setFormData({ ...formData, details: e.target.value })}
              placeholder="Describe the work, materials, or timeline you need"
              rows={6}
            />
          </label>

          {error && <p className="quote-error">{error}</p>}
          {message && <p className="quote-success">{message}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Submitting request..." : "Submit Quote Request"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default Quote;
