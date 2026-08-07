import { useState } from "react";
import axios from "axios";
import "./Contact.css";

const initialForm = {
  phoneNumber: "",
  emailAddress: "",
  message: "",
  website: "",
};

const requiredFields = ["phoneNumber", "emailAddress", "message"];

function Contact() {
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    if (status.type) {
      setStatus({ type: "", message: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone Number is required.";
    }
    if (!formData.emailAddress.trim()) {
      newErrors.emailAddress = "Email Address is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.emailAddress.trim())) {
      newErrors.emailAddress = "Enter a valid email address.";
    }
    if (!formData.message.trim()) {
      newErrors.message = "Message is required.";
    }

    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return;

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setStatus({ type: "error", message: "Please fix the highlighted fields." });
      return;
    }

    if (formData.website.trim()) {
      setStatus({ type: "error", message: "Spam detected. Please submit the form normally." });
      return;
    }

    setSubmitting(true);
    setStatus({ type: "", message: "" });

    const payload = {
      phoneNumber: formData.phoneNumber.trim(),
      emailAddress: formData.emailAddress.trim().toLowerCase(),
      message: formData.message.trim(),
      website: formData.website,
    };

    try {
      const response = await axios.post("/api/contact", payload);
      const successMessage = response?.data?.message || "Your message has been sent successfully.";

      setStatus({ type: "success", message: successMessage });
      setFormData(initialForm);
      setErrors({});
    } catch (error) {
      console.error("Contact send error:", error);
      // If we received 404 from current baseURL, try local backend directly (common dev proxy issue)
      const statusCode = error?.response?.status;
      if (statusCode === 404) {
        try {
          const altResp = await axios.post("http://127.0.0.1:5000/api/contact", payload);
          const altMsg = altResp?.data?.message || "Your message has been sent successfully.";
          setStatus({ type: "success", message: altMsg });
          setFormData(initialForm);
          setErrors({});
          return;
        } catch (altErr) {
          console.error("Fallback post to http://127.0.0.1:5000 failed:", altErr);
          const altMsg = altErr?.response?.data?.message || altErr.message || "Unable to send your message. Please try again.";
          setStatus({ type: "error", message: altMsg });
          return;
        }
      }

      const serverMessage = error?.response?.data?.message || error.message || "Unable to send your message. Please try again.";
      setStatus({ type: "error", message: serverMessage });
    } finally {
      setSubmitting(false);
    }
  };

  const renderError = (field) => errors[field] ? <div className="error-message">{errors[field]}</div> : null;

  return (
    <section className="contact-page" id="contact">
      <div className="contact-inner">
        <p className="contact-label">Contact</p>
        <h2>Contact Us</h2>
        <p>Reach us for construction materials, electrical works, software services, and building design.</p>

        <form className="contact-form" onSubmit={handleSubmit} noValidate>
          <div className="contact-grid">
            <label className="contact-group">
              Phone Number <span className="required-star">*</span>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className={errors.phoneNumber ? "contact-input input-error" : "contact-input"}
                placeholder="+251 9XX XXX XXX"
                required
              />
              {renderError("phoneNumber")}
            </label>

            <label className="contact-group">
              Email Address <span className="required-star">*</span>
              <input
                type="email"
                name="emailAddress"
                value={formData.emailAddress}
                onChange={handleChange}
                className={errors.emailAddress ? "contact-input input-error" : "contact-input"}
                placeholder="you@example.com"
                required
              />
              {renderError("emailAddress")}
            </label>

            <label className="contact-group contact-full-width">
              Message <span className="required-star">*</span>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                className={errors.message ? "contact-textarea input-error" : "contact-textarea"}
                placeholder="Tell us more about your project or question"
                rows="6"
                required
              />
              {renderError("message")}
            </label>

            <label className="contact-honeypot">
              Leave this empty
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={handleChange}
                autoComplete="off"
              />
            </label>
          </div>

          {status.message && (
            <div className={`contact-feedback ${status.type === "success" ? "success" : "error"}`}>
              {status.message}
            </div>
          )}

          <button type="submit" className="contact-submit" disabled={submitting}>
            {submitting ? "Sending..." : "Send Message"}
          </button>
        </form>

        <div className="contact-details">
          <div>
            <strong>Phone</strong>
            <p>+251 913 922 193</p>
            <p>+251 924 594 602</p>
          </div>
          <div>
            <strong>Email</strong>
            <p>melkamugatew11@gmail.com</p>
          </div>
          <div>
            <strong>Social</strong>
            <p>@wemastercon</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
