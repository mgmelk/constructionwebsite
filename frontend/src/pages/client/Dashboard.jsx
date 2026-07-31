import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  FaHardHat,
  FaProjectDiagram,
  FaCheckCircle,
  FaClock,
  FaCoins,
  FaClipboardList,
  FaFilePdf,
  FaDownload,
  FaComments,
  FaCreditCard,
  FaEdit,
  FaMapMarkerAlt,
  FaUserTie,
  FaBell,
  FaSignOutAlt,
  FaImages,
  FaCalendarAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaTimes,
  FaEye,
  FaArrowRight
} from "react-icons/fa";
import "./Dashboard.css";

const DEFAULT_CLIENT_PROJECT = {
  _id: "client-prj-101",
  projectName: "MG Building Commercial Complex & Plaza",
  projectCode: "PRJ-MG-8090",
  status: "Planning",
  progress: 0,
  location: "Bole Medhanealem Corridor, Addis Ababa",
  budget: 150000000,
  paidAmount: 0,
  startDate: "2026-08-01",
  endDate: "2028-12-31",
  daysRemaining: 880,
  client: { fullName: "Melkamu Gatew", companyName: "Global Tech Africa", email: "abebe@globaltech.com" },
  projectManager: { fullName: "Admin Support", phone: "", email: "" },
  engineers: [],
  employees: [{ _id: "emp-1", fullName: "Alex Employee", email: "alex.employee@gmail.com" }],
  description: "Modern 22-story MG Building commercial complex featuring executive office suites, structural reinforced concrete framing, underground parking, and smart glass architecture.",
  milestones: [
    { title: "Phase 1: Architectural Design & Municipal Permits", date: "Aug 2026 - Nov 2026", progress: 0, status: "Scheduled" },
    { title: "Phase 2: Deep Foundation & Substructure Concrete", date: "Dec 2026 - May 2027", progress: 0, status: "Scheduled" },
    { title: "Phase 3: Superstructure Framework & Floor Slabs", date: "Jun 2027 - Apr 2028", progress: 0, status: "Scheduled" },
    { title: "Phase 4: MEP (Plumbing, HVAC & Electrical)", date: "May 2028 - Aug 2028", progress: 0, status: "Scheduled" },
    { title: "Phase 5: Glass Facade, Interior Finishing & Handover", date: "Sep 2028 - Dec 2028", progress: 0, status: "Scheduled" },
  ],
  timeline: [
    { date: "July 27, 2026", title: "Project Planning & Registration", desc: "MG Building project setup completed. Engineering team assigned and municipal clearance initiated." },
  ],
  payments: [
    { id: "INV-20M-01", description: "Phase 1 Milestone Payment (Mobilization & Site Prep)", amount: 20000000, date: "2026-08-01", status: "Unpaid" },
    { id: "INV-30M-02", description: "Phase 2 Milestone Payment (Substructure & Foundation)", amount: 30000000, date: "2026-12-01", status: "Unpaid" },
    { id: "INV-50M-03", description: "Phase 3 Milestone Payment (Superstructure & Floor Slabs)", amount: 50000000, date: "2027-06-01", status: "Unpaid" },
    { id: "INV-50M-04", description: "Phase 4 Milestone Payment (MEP, Glass Facade & Handover)", amount: 50000000, date: "2028-05-01", status: "Unpaid" },
  ],
  documents: [
    { id: "doc-1", name: "Approved Architectural Blueprints (v3.2).pdf", size: "14.2 MB", date: "2024-03-10", category: "Architecture" },
    { id: "doc-2", name: "Structural Engineering Calculation Sheet.pdf", size: "8.5 MB", date: "2024-03-12", category: "Engineering" },
    { id: "doc-3", name: "Municipal Construction Permit & Environmental Clearance.pdf", size: "3.1 MB", date: "2024-03-01", category: "Permits" },
    { id: "doc-4", name: "Concrete Core Lab Test Quality Audit Report.pdf", size: "5.4 MB", date: "2026-07-02", category: "Quality" },
  ],
  images: [],
  updates: [
    { title: "Concrete Pour Complete", time: "2 hours ago", desc: "Lead Site Engineer confirmed 14th floor slab pour passed structural audit." },
    { title: "Inspection Approved", time: "Yesterday at 4:30 PM", desc: "Municipal Inspector signed off on elevator shaft alignment." },
    { title: "New Quality Document", time: "3 days ago", desc: "Concrete Core Quality Audit PDF uploaded to Document Vault." },
  ]
};

function ClientDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [clientProjects, setClientProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(DEFAULT_CLIENT_PROJECT);

  // Active Modals State
  const [activeModal, setActiveModal] = useState(null); // 'payment' | 'message' | 'change_request' | 'photo_preview'
  const [previewPhoto, setPreviewPhoto] = useState(null);

  // Form States
  const [paymentAmount, setPaymentAmount] = useState("20000000");
  const [paymentMethod, setPaymentMethod] = useState("Telebirr");
  const [selectedPaymentMilestone, setSelectedPaymentMilestone] = useState("INV-20M-01");
  const [receiptRefInput, setReceiptRefInput] = useState("");
  const [receiptImageBase64, setReceiptImageBase64] = useState("");
  const [submittingReceipt, setSubmittingReceipt] = useState(false);
  const receiptFileInput = useRef(null);

  const [messageSubject, setMessageSubject] = useState("");
  const [messageBody, setMessageBody] = useState("");
  const [changeTitle, setChangeTitle] = useState("");
  const [changeDetails, setChangeDetails] = useState("");

  // Alert Notifications
  const [toastMsg, setToastMsg] = useState("");

  const clientName = localStorage.getItem("userName") || localStorage.getItem("adminName") || "Melkamu Gatew";
  const clientEmail = localStorage.getItem("userEmail") || "";

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");
    const savedEmail = localStorage.getItem("userEmail");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    if (role && role !== "client") {
      navigate("/login", { replace: true });
      return;
    }

    if (!role && !savedEmail) {
      navigate("/login", { replace: true });
      return;
    }

    if (!role) {
      localStorage.setItem("userRole", "client");
    }

    fetchClientData();
  }, [navigate]);

  const fetchClientData = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/projects", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const allProjects = Array.isArray(res.data) ? res.data : [];
      const matchedProjects = allProjects.filter((project) => {
        const projectClient = project.client;
        const fullName = projectClient?.fullName || "";
        const email = projectClient?.email || "";
        const clientId = projectClient?._id || "";
        const currentUserId = localStorage.getItem("userId") || "";

        return (
          (clientName && fullName && fullName.toLowerCase().includes(clientName.toLowerCase())) ||
          (clientEmail && email && email.toLowerCase() === clientEmail.toLowerCase()) ||
          (clientId && currentUserId && clientId === currentUserId)
        );
      });

      const projectsToShow = matchedProjects.length > 0 ? matchedProjects : allProjects;

      if (projectsToShow.length > 0) {
        setClientProjects(projectsToShow);
        setSelectedProject(projectsToShow[0]);
      } else {
        setClientProjects([DEFAULT_CLIENT_PROJECT]);
        setSelectedProject(DEFAULT_CLIENT_PROJECT);
      }
    } catch (err) {
      console.log("Using sample project dataset for client showcase:", err);
      setClientProjects([DEFAULT_CLIENT_PROJECT]);
      setSelectedProject(DEFAULT_CLIENT_PROJECT);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 4000);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("adminName");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  const handleReceiptFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setReceiptImageBase64(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveReceiptPreview = () => {
    setReceiptImageBase64("");
    if (receiptFileInput.current) {
      receiptFileInput.current.value = "";
    }
  };

  const handleOpenReceiptModal = (paymentId) => {
    setSelectedPaymentMilestone(paymentId);
    setActiveModal("payment");
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setSubmittingReceipt(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `/api/projects/${selectedProject._id}/payments/${selectedPaymentMilestone}/receipt`,
        {
          receiptUrl: receiptImageBase64 || "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80",
          paymentMethod,
          receiptRef: receiptRefInput || `REF-${Date.now().toString().slice(-6)}`,
        },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      setActiveModal(null);
      setReceiptImageBase64("");
      setReceiptRefInput("");
      showNotification("Receipt submitted successfully!");
      fetchClientData();
    } catch (err) {
      console.error("Receipt submission error:", err);
      showNotification("Failed to submit receipt. Please try again.");
    } finally {
      setSubmittingReceipt(false);
    }
  };

  const [sendingMsg, setSendingMsg] = useState(false);
  const [messagesList, setMessagesList] = useState([]);
  const [replyInputText, setReplyInputText] = useState({});

  useEffect(() => {
    fetchClientMessages();
  }, []);

  const fetchClientMessages = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/messages", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.data?.messages) {
        setMessagesList(res.data.messages);
      }
    } catch (err) {
      console.error("Error fetching client messages:", err);
    }
  };

  const handleMessageSubmit = async (e) => {
    e.preventDefault();
    if (!messageSubject.trim() || !messageBody.trim()) return;

    setSendingMsg(true);
    const recipientPhone = "";
    const recipientName = "Admin";
    const recipientId = null;
    const projectName = selectedProject.projectName || "MG Building Commercial Complex";

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "/api/messages",
        {
          subject: messageSubject.trim(),
          body: messageBody.trim(),
          recipientName,
          recipientPhone,
          recipientId,
          projectName,
          projectId: selectedProject._id,
        },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      setActiveModal(null);
      setMessageSubject("");
      setMessageBody("");
      showNotification("Direct message successfully sent to Admin!");
      fetchClientMessages();
    } catch (err) {
      console.error("Error sending in-app message:", err);
      showNotification("Failed to send message. Please try again.");
    } finally {
      setSendingMsg(false);
    }
  };

  const handleClientReplySubmit = async (e, messageId) => {
    e.preventDefault();
    const text = replyInputText[messageId];
    if (!text || !text.trim()) return;

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `/api/messages/${messageId}/reply`,
        { body: text.trim(), senderRole: "client" },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      setReplyInputText((prev) => ({ ...prev, [messageId]: "" }));
      showNotification("Reply successfully sent!");
      fetchClientMessages();
    } catch (err) {
      console.error("Reply submit error:", err);
    }
  };

  const handleChangeRequestSubmit = (e) => {
    e.preventDefault();
    setActiveModal(null);
    setChangeTitle("");
    setChangeDetails("");
    showNotification("Change Request submitted to Engineering Team for review.");
  };

  const currentPaymentsList = (selectedProject?.payments && selectedProject.payments.length > 0) ? selectedProject.payments : [];
  const currentPaid = currentPaymentsList.filter((p) => p.status === "Paid").reduce((sum, p) => sum + Number(p.amount || 0), 0);
  const currentBudget = typeof selectedProject?.budget !== "undefined" && selectedProject?.budget !== null && Number(selectedProject.budget) > 0 ? Number(selectedProject.budget) : 150000000;
  const remainingBalance = currentBudget - currentPaid;
  const visibleMilestones = Array.isArray(selectedProject?.milestones) && selectedProject.milestones.length > 0
    ? selectedProject.milestones
    : DEFAULT_CLIENT_PROJECT.milestones;
  const visibleMessagesList = (messagesList || []).filter((msg) => {
    const recipientName = (msg.recipientName || "").toLowerCase();
    const senderName = (msg.senderName || "").toLowerCase();
    const replyRoles = (msg.replies || []).map((reply) => (reply.senderRole || "").toLowerCase());
    const isEngineerConversation =
      recipientName.includes("engineer") ||
      recipientName.includes("david") ||
      senderName.includes("engineer") ||
      senderName.includes("david") ||
      replyRoles.includes("engineer");
    const isAdminConversation =
      recipientName.includes("admin") ||
      senderName.includes("admin") ||
      replyRoles.includes("admin");

    return !isEngineerConversation && isAdminConversation;
  });

  return (
    <div className="client-dashboard-page">
      {/* TOP NAVIGATION BAR */}
      <header className="client-navbar">
        <div className="client-nav-brand">
          <div className="brand-icon"><FaHardHat /></div>
          <h2>WEMASTER <span>CONSTRUCTION</span></h2>
        </div>

        <div className="client-nav-right">
          {/* Project Selector if multiple */}
          {clientProjects.length > 1 && (
            <select
              className="proj-select-dropdown"
              value={selectedProject._id}
              onChange={(e) => {
                const found = clientProjects.find((p) => p._id === e.target.value);
                if (found) setSelectedProject(found);
              }}
            >
              {clientProjects.map((p) => (
                <option key={p._id} value={p._id}>{p.projectName}</option>
              ))}
            </select>
          )}

          <button className="notif-btn" title="Notifications">
            <FaBell />
            <span className="notif-badge">3</span>
          </button>

          <div className="user-profile-badge">
            <div className="avatar-circle">{clientName.charAt(0).toUpperCase()}</div>
            <span style={{ fontSize: "14px", fontWeight: "700", color: "#ffffff" }}>{clientName}</span>
          </div>

          <button className="btn-logout-client" onClick={handleLogout}>
            <FaSignOutAlt /> Sign Out
          </button>
        </div>
      </header>

      <div className="client-container">
        {/* TOAST NOTIFICATION */}
        {toastMsg && (
          <div style={{ background: "#10b981", color: "white", padding: "14px 24px", borderRadius: "12px", marginBottom: "24px", fontWeight: "700", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 8px 20px rgba(16, 185, 129, 0.3)" }}>
            <span>✓ {toastMsg}</span>
            <button onClick={() => setToastMsg("")} style={{ border: "none", background: "none", color: "white", fontSize: "18px", cursor: "pointer" }}>&times;</button>
          </div>
        )}

        {/* HERO BANNER */}
        <div className="client-hero-banner">
          <div className="hero-text">
            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(255, 107, 0, 0.2)", color: "#ff6b00", padding: "4px 12px", borderRadius: "12px", fontSize: "12px", fontWeight: "800", marginBottom: "10px" }}>
              <FaProjectDiagram /> CLIENT DASHBOARD
            </div>
            <h1>{selectedProject.projectName}</h1>
            <p><FaMapMarkerAlt style={{ color: "#ff6b00" }} /> {selectedProject.location || "Addis Ababa, Ethiopia"} &nbsp;|&nbsp; Code: <strong>{selectedProject.projectCode || "PRJ-9042"}</strong></p>
          </div>

          <div className="hero-quick-meta">
            <div className="hero-tag">
              <FaUserTie style={{ color: "#ff6b00" }} /> PM: {selectedProject.projectManager?.fullName || "Admin Support"}
            </div>
            <div className="hero-tag">
              <FaCalendarAlt style={{ color: "#38bdf8" }} /> Handover: {selectedProject.endDate ? new Date(selectedProject.endDate).toLocaleDateString() : "Nov 30, 2026"}
            </div>
          </div>
        </div>

        {/* 5 SUMMARY CARDS GRID */}
        <div className="summary-cards-grid">
          {/* Card 1: Status */}
          <div className="sum-card">
            <div className="sum-icon-wrapper icon-status"><FaCheckCircle /></div>
            <div className="sum-details">
              <span>Project Status</span>
              <h3 style={{ color: "#0284c7" }}>{selectedProject.status || "Planning"}</h3>
              <small>Initial Planning Phase</small>
            </div>
          </div>

          {/* Card 2: Progress */}
          <div className="sum-card">
            <div className="sum-icon-wrapper icon-progress"><FaProjectDiagram /></div>
            <div className="sum-details">
              <span>Progress Percentage</span>
              <h3>{selectedProject.progress ?? 0}%</h3>
              <small>Project Beginning</small>
            </div>
          </div>

          {/* Card 3: Budget */}
          <div className="sum-card">
            <div className="sum-icon-wrapper icon-budget"><FaCoins /></div>
            <div className="sum-details">
              <span>Contract Budget</span>
              <h3>{(currentBudget / 1000000).toFixed(1)}M Birr</h3>
              <small>{currentPaid.toLocaleString()} Birr Paid</small>
            </div>
          </div>

          {/* Card 4: Days Remaining */}
          <div className="sum-card">
            <div className="sum-icon-wrapper icon-days"><FaClock /></div>
            <div className="sum-details">
              <span>Days Remaining</span>
              <h3>{selectedProject.daysRemaining || 880} Days</h3>
              <small>Target Completion Stage</small>
            </div>
          </div>
        </div>

        {/* MAIN DASHBOARD LAYOUT (2 COLUMNS) */}
        <div className="dashboard-main-grid">
          {/* LEFT COLUMN - MAIN SECTIONS */}
          <div className="left-column">
            
            {/* SECTION 1: PROJECT OVERVIEW */}
            <div className="dash-section-card">
              <div className="section-head">
                <h2><FaProjectDiagram className="sec-icon" /> Project Overview & Specifications</h2>
                <span className="milestone-badge badge-sched">{selectedProject.status || "Planning"}</span>
              </div>
              <p style={{ color: "#475569", lineHeight: "1.7", fontSize: "14px", margin: "0 0 16px" }}>
                {selectedProject.description || DEFAULT_CLIENT_PROJECT.description}
              </p>

              <div className="overview-grid">
                <div className="overview-box">
                  <label>Client Name</label>
                  <strong><FaUserTie style={{ color: "#ff6b00" }} /> {selectedProject.client?.fullName || "Melkamu Gatew"}</strong>
                </div>
                <div className="overview-box">
                  <label>Site Location</label>
                  <strong><FaMapMarkerAlt style={{ color: "#0284c7" }} /> {selectedProject.location || "Addis Ababa"}</strong>
                </div>
                <div className="overview-box">
                  <label>Start Date</label>
                  <strong><FaCalendarAlt style={{ color: "#16a34a" }} /> {selectedProject.startDate ? new Date(selectedProject.startDate).toLocaleDateString() : "Aug 01, 2026"}</strong>
                </div>
                <div className="overview-box">
                  <label>Project Manager</label>
                  <strong><FaPhoneAlt style={{ color: "#ff6b00" }} /> {selectedProject.projectManager?.fullName || "Admin Support"}</strong>
                </div>
              </div>
            </div>

            {/* SECTION 2: PROGRESS TRACKING & MILESTONES */}
            <div className="dash-section-card">
              <div className="section-head">
                <h2><FaCheckCircle className="sec-icon" /> Progress Tracking & Phase Milestones</h2>
                <span style={{ fontSize: "14px", fontWeight: "700", color: "#ff6b00" }}>{selectedProject.progress ?? 0}% Overall</span>
              </div>

              {/* Progress Bar */}
              <div className="progress-interactive-bar">
                <div className="bar-meta">
                  <span>Construction Stage Completion</span>
                  <span>{selectedProject.progress ?? 0}%</span>
                </div>
                <div className="bar-track">
                  <div className="bar-fill-animated" style={{ width: `${selectedProject.progress ?? 0}%` }}></div>
                </div>
              </div>

              {/* Milestone List */}
              <div className="milestones-list">
                {visibleMilestones.map((ms, idx) => (
                  <div key={`${ms.title || idx}-${idx}`} className="milestone-item">
                    <div className={`milestone-icon ${ms.status === "Completed" ? "ms-done" : ms.status === "In Progress" ? "ms-progress" : "ms-upcoming"}`}>
                      {ms.status === "Completed" ? "✓" : idx + 1}
                    </div>
                    <div className="milestone-info">
                      <h4>{ms.title}</h4>
                      <p>{ms.date ? `${ms.date} • ` : ""}{Number(ms.progress || 0)}% Completed</p>
                    </div>
                    <span className={`milestone-badge ${ms.status === "Completed" ? "badge-done" : ms.status === "In Progress" ? "badge-inprog" : "badge-sched"}`}>
                      {ms.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 3: PROJECT TIMELINE */}
            <div className="dash-section-card">
              <div className="section-head">
                <h2><FaCalendarAlt className="sec-icon" /> Chronological Project Timeline</h2>
              </div>
              <div className="timeline-stream">
                {(selectedProject.timeline || DEFAULT_CLIENT_PROJECT.timeline).map((item, i) => (
                  <div key={i} className="timeline-node">
                    <div className="node-dot"></div>
                    <div className="node-content">
                      <span>{item.date}</span>
                      <h4>{item.title}</h4>
                      <p>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 4: BUDGET & PAYMENT SUMMARY */}
            <div className="dash-section-card">
              <div className="section-head">
                <h2><FaCoins className="sec-icon" /> Budget & Financial Payment Summary</h2>
                <button className="doc-btn-download" onClick={() => setActiveModal("payment")}>
                  <FaCreditCard /> Make Payment
                </button>
              </div>

              <div className="budget-overview-cards">
                <div className="b-card">
                  <label>Total Contract Budget</label>
                  <h3>{currentBudget.toLocaleString()} Birr</h3>
                </div>
                <div className="b-card">
                  <label>Amount Paid to Date</label>
                  <h3 style={{ color: "#16a34a" }}>{currentPaid.toLocaleString()} Birr</h3>
                </div>
                <div className="b-card">
                  <label>Remaining Balance</label>
                  <h3 style={{ color: "#ea580c" }}>{remainingBalance.toLocaleString()} Birr</h3>
                </div>
              </div>

              {/* Payments Table */}
              <div className="payments-table-wrapper">
                <table className="payments-table">
                  <thead>
                    <tr>
                      <th>Invoice ID</th>
                      <th>Description</th>
                      <th>Amount (ETB)</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Receipt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(selectedProject.payments || DEFAULT_CLIENT_PROJECT.payments).map((pay, idx) => (
                      <tr key={idx}>
                        <td><strong>{pay.id}</strong></td>
                        <td>{pay.description}</td>
                        <td><strong>{pay.amount.toLocaleString()} Birr</strong></td>
                        <td>{pay.date}</td>
                        <td>
                          <span className={`milestone-badge ${pay.status === "Paid" ? "badge-done" : pay.status === "Pending Approval" ? "badge-sched" : "badge-inprog"}`}>
                            {pay.status}
                          </span>
                        </td>
                        <td style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "flex-start" }}>
                          {pay.status !== "Paid" ? (
                            <button
                              type="button"
                              onClick={() => handleOpenReceiptModal(pay.id || pay._id)}
                              style={{
                                border: "none",
                                borderRadius: "8px",
                                background: pay.status === "Pending Approval" ? "#fbbf24" : "#0f172a",
                                color: pay.status === "Pending Approval" ? "#0f172a" : "white",
                                padding: "8px 10px",
                                cursor: "pointer",
                                fontWeight: "700",
                                fontSize: "13px",
                              }}
                            >
                              {pay.status === "Pending Approval" ? "View Receipt" : "Submit Receipt"}
                            </button>
                          ) : (
                            <span style={{ fontSize: "13px", color: "#16a34a", fontWeight: "700" }}>
                              Submitted
                            </span>
                          )}
                          {pay.receiptRef && (
                            <small style={{ color: "#475569", fontSize: "12px" }}>
                              Ref: {pay.receiptRef}
                            </small>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* SECTION 5: PROGRESS PHOTOS & GALLERY */}
            <div className="dash-section-card" id="gallery-section">
              <div className="section-head">
                <h2><FaImages className="sec-icon" /> Site Photos & Ground Visual Gallery</h2>
              </div>
              <div className="photos-grid">
                {(selectedProject.images && selectedProject.images.length > 0 ? selectedProject.images : DEFAULT_CLIENT_PROJECT.images).map((img, i) => (
                  <div key={i} className="photo-card" onClick={() => { setPreviewPhoto(img); setActiveModal("photo_preview"); }}>
                    <img src={typeof img === 'string' ? img : img.url} alt={img.caption || "Site Photo"} />
                    <div className="photo-caption">{img.caption || `Site Photo #${i + 1}`}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 6: IN-APP MESSAGES & ADMIN CONVERSATION THREADS */}
            <div className="dash-section-card" id="messages-section">
              <div className="section-head">
                <h2><FaComments className="sec-icon" /> In-App Direct Messages & Admin Replies</h2>
                <button className="doc-btn-download" onClick={() => setActiveModal("message")} style={{ background: "#ff6b00", color: "white", border: "none" }}>
                  <FaComments /> New Message
                </button>
              </div>

              {visibleMessagesList.length === 0 ? (
                <div style={{ padding: "30px", textAlign: "center", color: "#64748b", background: "#f8fafc", borderRadius: "12px", border: "1px dashed #cbd5e1" }}>
                  <FaComments style={{ fontSize: "36px", color: "#cbd5e1", marginBottom: "10px" }} />
                  <p style={{ margin: "0 0 12px", fontWeight: "600" }}>No message conversations yet.</p>
                  <button onClick={() => setActiveModal("message")} style={{ background: "#ff6b00", color: "white", border: "none", padding: "8px 18px", borderRadius: "8px", fontWeight: "700", cursor: "pointer" }}>
                    Send Message to Admin
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  {visibleMessagesList.map((msg) => (
                    <div key={msg._id} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "18px", boxShadow: "0 2px 6px rgba(0,0,0,0.03)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                        <div>
                          <span style={{ fontSize: "12px", fontWeight: "800", color: "#ff6b00", background: "rgba(255,107,0,0.1)", padding: "2px 8px", borderRadius: "6px" }}>
                            {msg.projectName || "MG Building Project"}
                          </span>
                          <h3 style={{ margin: "6px 0 2px", fontSize: "16px", color: "#0f172a" }}>{msg.subject}</h3>
                          <small style={{ color: "#64748b" }}>To: {msg.recipientName || "Admin"} &bull; {new Date(msg.createdAt).toLocaleString()}</small>
                        </div>
                        <span className={`milestone-badge ${msg.status === "Replied" ? "badge-done" : "badge-inprog"}`}>
                          {msg.status || "Open"}
                        </span>
                      </div>

                      {/* Initial Client Message Box */}
                      <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "12px 16px", color: "#334155", fontSize: "14px", lineHeight: "1.6", marginBottom: "12px" }}>
                        <strong style={{ display: "block", color: "#0f172a", marginBottom: "4px" }}>You ({msg.senderName}):</strong>
                        {msg.body}
                      </div>

                      {/* Conversation Thread Replies */}
                      {msg.replies && msg.replies.length > 0 && (
                        <div style={{ marginLeft: "16px", paddingLeft: "14px", borderLeft: "3px solid #38bdf8", display: "flex", flexDirection: "column", gap: "10px", marginBottom: "14px" }}>
                          {msg.replies.map((reply, ridx) => (
                            <div key={ridx} style={{ background: reply.senderRole === "client" ? "#eff6ff" : "#f0fdf4", border: `1px solid ${reply.senderRole === "client" ? "#bfdbfe" : "#bbf7d0"}`, borderRadius: "10px", padding: "10px 14px", fontSize: "13.5px" }}>
                              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                                <strong style={{ color: reply.senderRole === "client" ? "#1e40af" : "#166534" }}>
                                  {reply.senderRole === "client" ? "You" : `👷 ${reply.senderName} (${reply.senderRole.toUpperCase()})`}
                                </strong>
                                <small style={{ color: "#64748b" }}>{new Date(reply.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small>
                              </div>
                              <p style={{ margin: 0, color: "#1e293b", lineHeight: "1.5" }}>{reply.body}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Reply Back Box for Client */}
                      <form onSubmit={(e) => handleClientReplySubmit(e, msg._id)} style={{ display: "flex", gap: "10px" }}>
                        <input
                          type="text"
                          placeholder="Reply to admin..."
                          value={replyInputText[msg._id] || ""}
                          onChange={(e) => setReplyInputText({ ...replyInputText, [msg._id]: e.target.value })}
                          style={{ flex: 1, padding: "8px 14px", border: "1px solid #cbd5e1", borderRadius: "8px", fontSize: "13px", outline: "none" }}
                        />
                        <button type="submit" style={{ background: "#0f172a", color: "white", border: "none", padding: "8px 16px", borderRadius: "8px", fontWeight: "700", cursor: "pointer", fontSize: "13px" }}>
                          Reply
                        </button>
                      </form>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* RIGHT COLUMN - SIDEBAR QUICK ACTIONS & NOTIFICATIONS */}
          <div className="right-column">
            
            {/* QUICK ACTIONS PANEL */}
            <div className="dash-section-card">
              <div className="section-head">
                <h2>Quick Actions</h2>
              </div>
              <div className="quick-actions-grid">
                <button className="qa-btn" onClick={() => {
                  document.getElementById("gallery-section")?.scrollIntoView({ behavior: "smooth" });
                }}>
                  <FaImages className="qa-icon" />
                  Site Gallery
                </button>

                <button className="qa-btn" onClick={() => setActiveModal("payment")}>
                  <FaCreditCard className="qa-icon" />
                  Make Payment
                </button>

                <button className="qa-btn" onClick={() => {
                  document.getElementById("messages-section")?.scrollIntoView({ behavior: "smooth" });
                }}>
                  <FaComments className="qa-icon" />
                  Message Admin
                </button>

                <button className="qa-btn" onClick={() => setActiveModal("change_request")}>
                  <FaEdit className="qa-icon" />
                  Change Request
                </button>
              </div>
            </div>

            {/* PROJECT ENGINEER & TEAM CONTACT CARD */}
            <div className="dash-section-card" style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", color: "white" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}>
                <div style={{ width: "46px", height: "46px", borderRadius: "50%", background: "#ff6b00", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", fontWeight: "700" }}>
                  <FaHardHat />
                </div>
                <div>
                  <h4 style={{ margin: "0 0 2px", fontSize: "16px", color: "white" }}>{selectedProject.projectManager?.fullName || "Admin Support"}</h4>
                  <small style={{ color: "#94a3b8" }}>Project Administration</small>
                </div>
              </div>
              <p style={{ fontSize: "13px", color: "#cbd5e1", lineHeight: "1.5", margin: "0 0 16px" }}>
                Directly responsible for project coordination, approvals, and client communications for MG Building.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px", color: "#e2e8f0" }}>
                {selectedProject.projectManager?.phone ? (
                  <span>
                    <FaPhoneAlt style={{ color: "#ff6b00" }} />{" "}
                    <a
                      href={`tel:${selectedProject.projectManager.phone}`}
                      style={{ color: "#ffffff", fontWeight: "700", textDecoration: "none" }}
                    >
                      {selectedProject.projectManager.phone}
                    </a>
                  </span>
                ) : null}
                {selectedProject.projectManager?.email ? (
                  <span><FaEnvelope style={{ color: "#38bdf8" }} /> {selectedProject.projectManager.email}</span>
                ) : null}
              </div>
              <button
                style={{ width: "100%", marginTop: "16px", background: "#ff6b00", color: "white", border: "none", padding: "10px", borderRadius: "8px", fontWeight: "700", cursor: "cursor", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
                onClick={() => setActiveModal("message")}
              >
                <FaComments /> Send Direct In-App Message to Admin
              </button>
            </div>

            {/* RECENT ACTIVITY & UPDATES */}
            <div className="dash-section-card">
              <div className="section-head">
                <h2><FaBell className="sec-icon" /> Recent Activity & Updates</h2>
              </div>
              <div className="notif-feed">
                {(selectedProject.updates || DEFAULT_CLIENT_PROJECT.updates).map((up, i) => (
                  <div key={i} className="notif-feed-item">
                    <div className="notif-dot"></div>
                    <div>
                      <strong style={{ display: "block", color: "#0f172a" }}>{up.title}</strong>
                      <span style={{ fontSize: "12px", color: "#64748b" }}>{up.time}</span>
                      <p style={{ margin: "4px 0 0", color: "#475569", fontSize: "13px" }}>{up.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* POPUP MODALS */}

      {/* MODAL 1: MAKE PAYMENT & SUBMIT RECEIPT */}
      {activeModal === "payment" && (
        <div className="client-modal-backdrop" onClick={() => setActiveModal(null)}>
          <div className="client-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3><FaCreditCard style={{ color: "#ff6b00" }} /> Upload & Submit Payment Receipt</h3>
              <button className="modal-close-x" onClick={() => setActiveModal(null)}>&times;</button>
            </div>
            <form onSubmit={handlePaymentSubmit} className="modal-body-form">
              <div className="modal-body-content">
                <div>
                  <label>Project Contract</label>
                  <textarea
                    className="project-contract-textarea"
                    readOnly
                    value={selectedProject.projectName}
                  />
                </div>
                <div>
                  <label>Select Milestone Installment to Pay</label>
                  <select value={selectedPaymentMilestone} onChange={(e) => setSelectedPaymentMilestone(e.target.value)}>
                    <option value="INV-20M-01">Phase 1 Milestone (20 Million ETB)</option>
                    <option value="INV-30M-02">Phase 2 Milestone (30 Million ETB)</option>
                    <option value="INV-50M-03">Phase 3 Milestone (50 Million ETB)</option>
                    <option value="INV-50M-04">Phase 4 Milestone (50 Million ETB)</option>
                  </select>
                </div>
                <div>
                  <label>Payment Channel Method</label>
                  <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                    <option value="Telebirr">Telebirr SuperApp</option>
                    <option value="CBE Birr">Commercial Bank of Ethiopia (CBE Birr)</option>
                    <option value="Bank Wire Transfer">Direct Bank Wire Transfer (CBE / BOA / Dashen)</option>
                  </select>
                </div>
                <div>
                  <label>Transaction Reference / Bank Ref Code</label>
                  <input
                    type="text"
                    placeholder="e.g. FT2619890XX or Ref No."
                    value={receiptRefInput}
                    onChange={(e) => setReceiptRefInput(e.target.value)}
                  />
                </div>
                <div>
                  <label>Upload Payment Receipt Photo / Document (from File Explorer)</label>
                  <input
                    type="file"
                    accept="image/*"
                    ref={receiptFileInput}
                    onChange={handleReceiptFileSelect}
                    style={{ padding: "8px", background: "white", border: "1px solid #cbd5e1", borderRadius: "8px", width: "100%" }}
                  />
                  {receiptImageBase64 && (
                    <div style={{ marginTop: "10px", textAlign: "center" }}>
                      <img src={receiptImageBase64} alt="Receipt Preview" style={{ maxHeight: "100px", borderRadius: "6px", display: "block", margin: "6px auto 0" }} />
                      <button
                        type="button"
                        onClick={handleRemoveReceiptPreview}
                        style={{
                          marginTop: "10px",
                          background: "#ef4444",
                          color: "white",
                          border: "none",
                          borderRadius: "8px",
                          padding: "8px 14px",
                          cursor: "pointer",
                          fontWeight: "700",
                        }}
                      >
                        Remove File
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn-modal-action" disabled={submittingReceipt}>
                  {submittingReceipt ? "Submitting Receipt..." : "Submit Receipt & Mark Paid"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: MESSAGE PROJECT MANAGER / ENGINEER */}
      {activeModal === "message" && (
        <div className="client-modal-backdrop" onClick={() => setActiveModal(null)}>
          <div className="client-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3><FaComments style={{ color: "#ff6b00" }} /> Message Admin</h3>
              <button className="modal-close-x" onClick={() => setActiveModal(null)}>&times;</button>
            </div>
            <form onSubmit={handleMessageSubmit} className="modal-body-form">
              <div>
                <label>Recipient Admin</label>
                <input
                  type="text"
                  disabled
                  value="Admin Support"
                />
              </div>
              <div>
                <label>Subject</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Inquiry regarding MG Building foundation schedule"
                  value={messageSubject}
                  onChange={(e) => setMessageSubject(e.target.value)}
                />
              </div>
              <div>
                <label>Message Details</label>
                <textarea
                  rows="4"
                  required
                  placeholder="Type your question or direct message for Admin..."
                  value={messageBody}
                  onChange={(e) => setMessageBody(e.target.value)}
                ></textarea>
              </div>
              <button type="submit" className="btn-modal-action" disabled={sendingMsg}>
                {sendingMsg ? "Sending Message..." : "Send Direct Message &rarr;"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: SUBMIT CHANGE REQUEST */}
      {activeModal === "change_request" && (
        <div className="client-modal-backdrop" onClick={() => setActiveModal(null)}>
          <div className="client-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3><FaEdit style={{ color: "#ff6b00" }} /> Submit Scope Change Request</h3>
              <button className="modal-close-x" onClick={() => setActiveModal(null)}>&times;</button>
            </div>
            <form onSubmit={handleChangeRequestSubmit} className="modal-body-form">
              <div>
                <label>Change Request Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Request extra electrical sockets in Lobby"
                  value={changeTitle}
                  onChange={(e) => setChangeTitle(e.target.value)}
                />
              </div>
              <div>
                <label>Impacted Construction Phase</label>
                <select>
                  <option>Phase 3: Superstructure</option>
                  <option>Phase 4: MEP Installation</option>
                  <option>Phase 5: Interior Finishing</option>
                </select>
              </div>
              <div>
                <label>Detailed Specifications & Reasons</label>
                <textarea
                  rows="4"
                  required
                  placeholder="Describe the requested changes, layout modifications, or material preferences..."
                  value={changeDetails}
                  onChange={(e) => setChangeDetails(e.target.value)}
                ></textarea>
              </div>
              <button type="submit" className="btn-modal-action">
                Submit Change Request to Engineers &rarr;
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: PHOTO PREVIEW LIGHTBOX */}
      {activeModal === "photo_preview" && previewPhoto && (
        <div className="client-modal-backdrop" onClick={() => setActiveModal(null)}>
          <div style={{ position: "relative", maxWidth: "800px", width: "100%", background: "#0f172a", borderRadius: "16px", overflow: "hidden", padding: "16px" }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setActiveModal(null)} style={{ position: "absolute", top: "16px", right: "16px", border: "none", background: "rgba(0,0,0,0.6)", color: "white", width: "36px", height: "36px", borderRadius: "50%", cursor: "pointer", fontSize: "20px" }}>&times;</button>
            <img src={typeof previewPhoto === 'string' ? previewPhoto : previewPhoto.url} alt="Enlarged Progress View" style={{ width: "100%", maxHeight: "500px", objectFit: "contain", borderRadius: "8px" }} />
            <p style={{ color: "white", textAlign: "center", margin: "12px 0 0", fontWeight: "700" }}>{previewPhoto.caption || "Site Construction Progress Photo"}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ClientDashboard;
