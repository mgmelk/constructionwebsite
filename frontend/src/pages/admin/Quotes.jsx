import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../components/Admin/Sidebar/Sidebar";
import Topbar from "../../components/Admin/Topbar/Topbar";
import "./Quotes.css";


function Quotes() {
  const navigate = useNavigate();
  const [quotes, setQuotes] = useState([]);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [selectedQuoteId, setSelectedQuoteId] = useState(null);
  const [estimateData, setEstimateData] = useState({
    materialsCost: "",
    laborCost: "",
    otherCost: "",
    estimatedDays: "",
    message: "",
    budget: "",
  });
  const [emailData, setEmailData] = useState({
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");

    if (!token || role !== "admin") {
      navigate("/admin/login");
      return;
    }

    loadQuotes();
  }, [navigate]);

  const loadQuotes = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`/api/quotes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuotes(response.data.quotes || []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load quote requests.");
    } finally {
      setLoading(false);
    }
  };

  const selectQuote = (quote) => {
    console.log("Selected quote:", quote);
    const normalizedQuote = {
      ...quote,
      _id: quote._id || quote.id,
      id: quote._id || quote.id,
      companyName: quote.companyName || "",
      address: quote.address || "",
      phone: quote.phone || "",
      details: quote.details || "No details provided.",
      status: quote.status || "Pending",
    };

    setSelectedQuote(normalizedQuote);
    setSelectedQuoteId(normalizedQuote._id || null);
    setStatusMessage("");
    setEstimateData({
      materialsCost: quote.estimate?.materialsCost || "",
      laborCost: quote.estimate?.laborCost || "",
      otherCost: quote.estimate?.otherCost || "",
      estimatedDays: quote.estimate?.estimatedDays || "",
      message: quote.estimate?.message || "",
      budget: quote.budget || "",
    });
    setEmailData({
      subject: `Budget Estimate for ${normalizedQuote.projectType} project`,
      message: `Hello ${normalizedQuote.fullName},\n\nWe have prepared a detailed budget estimate for your ${normalizedQuote.projectType} project.\n\nProject: ${normalizedQuote.projectType}\nSize: ${normalizedQuote.projectSize}\nClient: ${normalizedQuote.companyName || normalizedQuote.fullName}\n\nPlease review the estimate and reply if you would like to proceed or discuss changes.`,
    });
  };

  const handleEstimateSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage("");
    if (!selectedQuote) return;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `/api/quotes/${selectedQuote._id}/estimate`,
        {
          materialsCost: estimateData.materialsCost,
          laborCost: estimateData.laborCost,
          otherCost: estimateData.otherCost,
          estimatedDays: estimateData.estimatedDays,
          message: estimateData.message,
          budget: estimateData.budget,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setStatusMessage("Budget estimate saved successfully. You can now send it to the client.");
      const updatedQuote = response.data.quote;
      setSelectedQuote(updatedQuote);
      setQuotes((prev) => prev.map((q) => (q._id === updatedQuote._id ? updatedQuote : q)));
    } catch (err) {
      setStatusMessage(err.response?.data?.message || "Unable to save estimate.");
    }
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    setStatusMessage("");
    if (!selectedQuote) return;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `/api/quotes/${selectedQuote._id}/send`,
        {
          subject: emailData.subject,
          message: emailData.message,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setStatusMessage(response.data.message || "Email sent to client successfully.");
      setPreviewUrl(response.data.previewUrl || "");
      const updatedQuote = response.data.quote;
      setSelectedQuote(updatedQuote);
      setQuotes((prev) => prev.map((q) => (q._id === updatedQuote._id ? updatedQuote : q)));
    } catch (err) {
      const backendMessage = err.response?.data?.message || err.message || "Unable to send email.";
      setStatusMessage(backendMessage);
      setPreviewUrl("");
    }
  };

  return (
    <>
      <Sidebar />
      <Topbar adminName={localStorage.getItem("adminName") || "Admin"} />
      <div className="admin-quotes-page">
        <div className="admin-quotes-header">
          <div>
            <p className="admin-quotes-eyebrow">Quote Requests</p>
            <h1>Project Quote Management</h1>
            <p>Review incoming client requests, prepare materials and labor estimates, then email the total cost directly to the client.</p>
          </div>
        </div>

        {loading ? (
          <div className="admin-loading">Loading quote requests...</div>
        ) : error ? (
          <div className="admin-loading">{error}</div>
        ) : (
          <div className="admin-quotes-layout">
            <div className="admin-quotes-table-card">
              <div className="admin-quotes-table-header">
                <h2>{quotes.length} request(s)</h2>
              </div>
              <table className="admin-quotes-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Company</th>
                    <th>Project</th>
                    <th>Size</th>
                    <th>Status</th>
                    <th>Requested</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {quotes.map((quote) => (
                    <tr key={quote._id || quote.id} className={selectedQuoteId === (quote._id || quote.id) ? "selected-row" : ""}>
                      <td>{quote.fullName}</td>
                      <td>{quote.email}</td>
                      <td>{quote.companyName}</td>
                      <td>{quote.projectType}</td>
                      <td>{quote.projectSize}</td>
                      <td>{quote.status}</td>
                      <td>{new Date(quote.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button type="button" onClick={() => selectQuote(quote)}>
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="admin-quote-detail-card">
              {!selectedQuote ? (
                <div className="admin-quote-empty">
                  <h2>Select a quote request to view details.</h2>
                  <p>Click the View button for any row in the table to show the quote summary and estimate actions.</p>
                </div>
              ) : (
                <div className="admin-quote-detail-content">
                  <div className="admin-quote-detail-header">
                    <h2>Client Quote Details</h2>
                    <p className="admin-quote-highlight">{selectedQuote.fullName} • {selectedQuote.companyName || "Individual Client"}</p>
                    <p>{selectedQuote.projectType} / {selectedQuote.projectSize}</p>
                    <p className="admin-quote-status">Current status: {selectedQuote.status}</p>
                  </div>

                  <div className="admin-quote-summary">
                    <p><strong>Project details:</strong> {selectedQuote.details}</p>
                    <p><strong>Address:</strong> {selectedQuote.address || "Not provided"}</p>
                    <p><strong>Contact phone:</strong> {selectedQuote.phone}</p>
                  </div>

                  <div className="admin-quote-summary-box">
                    <p><strong>Ready to send to client:</strong></p>
                    <p>Budget, estimate details, and an email message are ready below.</p>
                  </div>
                  <form className="admin-quote-form" onSubmit={handleEstimateSubmit}>
                    <h3>Budget & Estimate Details</h3>
                    <div className="quote-grid">
                      <label>
                        Budget Amount (Birr)
                        <input
                          type="text"
                          value={estimateData.budget}
                          onChange={(e) => setEstimateData({ ...estimateData, budget: e.target.value })}
                          placeholder="e.g. 450,000 Birr"
                        />
                      </label>
                      <label>
                        Materials Cost
                        <input
                          type="number"
                          min="0"
                          value={estimateData.materialsCost}
                          onChange={(e) => setEstimateData({ ...estimateData, materialsCost: e.target.value })}
                          required
                        />
                      </label>
                      <label>
                        Labor Cost
                        <input
                          type="number"
                          min="0"
                          value={estimateData.laborCost}
                          onChange={(e) => setEstimateData({ ...estimateData, laborCost: e.target.value })}
                          required
                        />
                      </label>
                      <label>
                        Other Cost
                        <input
                          type="number"
                          min="0"
                          value={estimateData.otherCost}
                          onChange={(e) => setEstimateData({ ...estimateData, otherCost: e.target.value })}
                          required
                        />
                      </label>
                      <label>
                        Estimated Time
                        <input
                          type="text"
                          value={estimateData.estimatedDays}
                          onChange={(e) => setEstimateData({ ...estimateData, estimatedDays: e.target.value })}
                          placeholder="e.g. 8 weeks"
                        />
                      </label>
                    </div>

                    <label className="quote-details-label">
                      Optional estimate note for the client
                      <textarea
                        rows={4}
                        value={estimateData.message}
                        onChange={(e) => setEstimateData({ ...estimateData, message: e.target.value })}
                        placeholder="Add any notes about materials, schedule or exclusions."
                      />
                    </label>

                    <button type="submit">Save Estimate</button>
                  </form>

                  <form className="admin-quote-form" onSubmit={handleSendEmail}>
                    <h3>{selectedQuote.status === "Sent" ? "Resend Budget to Client" : "Send Budget to Client"}</h3>
                    <div className="admin-quote-summary-box">
                      <p><strong>Client:</strong> {selectedQuote.fullName}</p>
                      <p><strong>Budget:</strong> {estimateData.budget || "Not provided yet"}</p>
                      <p><strong>Estimated Total:</strong> {estimateData.materialsCost && estimateData.laborCost && estimateData.otherCost ? `${(Number(estimateData.materialsCost) + Number(estimateData.laborCost) + Number(estimateData.otherCost)).toLocaleString()} Birr` : "Pending"}</p>
                    </div>
                    <label>
                      Subject
                      <input
                        type="text"
                        value={emailData.subject}
                        onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                        required
                      />
                    </label>
                    <label className="quote-details-label">
                      Email Message
                      <textarea
                        rows={6}
                        value={emailData.message}
                        onChange={(e) => setEmailData({ ...emailData, message: e.target.value })}
                        required
                      />
                    </label>
                    <button type="submit">
                      {selectedQuote.status === "Sent" ? "Resend Budget to Client" : "Send Budget to Client"}
                    </button>
                  </form>

                  {statusMessage && <p className="admin-quote-status-message">{statusMessage}</p>}
                  {previewUrl && (
                    <p className="admin-quote-preview-url">
                      Email preview: <a href={previewUrl} target="_blank" rel="noreferrer">Open test email</a>
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Quotes;
