// Admin dashboard page
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../components/Admin/Sidebar/Sidebar";
import Topbar from "../../components/Admin/Topbar/Topbar";
import DashboardCards from "../../components/Admin/DashboardCards/DashboardCards";
import {
  FaPlus,
  FaProjectDiagram,
  FaCheckCircle,
  FaPlay,
  FaUserTie,
  FaMapMarkerAlt,
  FaEye,
  FaEdit,
  FaCoins,
  FaFolderOpen,
  FaTrash,
  FaHardHat,
  FaUsers,
  FaComments,
  FaPaperPlane,
  FaSync
} from "react-icons/fa";
import "./Dashboard.css";

const spinKeyframes = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const DEFAULT_ADMIN_PAYMENTS = [
  { id: "INV-20M-01", description: "Phase 1 Milestone Payment (Mobilization & Site Prep)", amount: 20000000, date: "2026-08-01", status: "Unpaid" },
  { id: "INV-30M-02", description: "Phase 2 Milestone Payment (Substructure & Foundation)", amount: 30000000, date: "2026-12-01", status: "Unpaid" },
  { id: "INV-50M-03", description: "Phase 3 Milestone Payment (Superstructure & Floor Concrete)", amount: 50000000, date: "2027-06-01", status: "Unpaid" },
  { id: "INV-50M-04", description: "Phase 4 Milestone Payment (MEP, Glass Facade & Final Handover)", amount: 50000000, date: "2028-05-01", status: "Unpaid" },
];

function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [replyTexts, setReplyTexts] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [materials, setMaterials] = useState([]);
  const [materialForm, setMaterialForm] = useState({
    materialName: "",
    category: "General",
    quantity: "",
    unit: "pcs",
    unitPrice: "",
    supplier: "",
    invoiceNumber: "",
    purchaseDate: new Date().toISOString().split("T")[0],
    project: "",
    status: "Pending",
    notes: "",
  });

  const handleTogglePaymentStatus = async (projectId, paymentId, currentStatus) => {
    const newStatus = currentStatus === "Paid" ? "Unpaid" : "Paid";
    try {
      const res = await axios.patch(
        `/api/projects/${projectId}/payments/${paymentId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(`Receipt accepted! Milestone payment marked as ${newStatus}`);
      setProjects(projects.map((p) => (p._id === projectId ? res.data.project : p)));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update payment status.");
    }
  };

  // Modal State for Add / Edit Project
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const [formData, setFormData] = useState({
    projectName: "",
    projectCode: "",
    description: "",
    location: "",
    budget: "150000000",
    paidAmount: "0",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    status: "In Progress",
    progress: 0,
    client: "",
    engineers: [],
    employees: [],
    images: [],
  });

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("userRole");

  useEffect(() => {
    if (!token) {
      navigate("/admin/login", { replace: true });
      return;
    }

    if (role && role !== "admin") {
      navigate("/admin/login", { replace: true });
      return;
    }

    if (!role) {
      localStorage.setItem("userRole", "admin");
    }

    fetchDashboardData();
  }, [navigate, role, token]);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError("");
    try {
      const [dashRes, projRes, usersRes, msgRes, materialsRes] = await Promise.all([
        axios.get(`/api/admin/dashboard`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`/api/projects`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`/api/users`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`/api/messages`, { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: { messages: [] } })),
        axios.get(`/api/admin/materials`, { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: { purchases: [] } })),
      ]);

      setStats(dashRes.data.dashboard);
      setProjects(projRes.data || []);
      setUsers(usersRes.data || []);
      setMessages(msgRes.data?.messages || []);
      setMaterials(materialsRes.data?.purchases || []);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        localStorage.removeItem("adminName");
        navigate("/admin/login", { replace: true });
        return;
      }
      setError(err.response?.data?.message || "Unable to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  const clientsList = users.filter((u) => u.role === "client");
  const engineersList = users.filter((u) => u.role === "engineer");
  const employeesList = users.filter((u) => u.role === "employee");
  const visibleAdminMessages = (messages || []).filter((msg) => {
    const recipientName = (msg.recipientName || "").toLowerCase();
    const senderName = (msg.senderName || "").toLowerCase();
    const replyRoles = (msg.replies || []).map((reply) => (reply.senderRole || "").toLowerCase());

    const mentionsEngineer =
      recipientName.includes("engineer") ||
      recipientName.includes("david") ||
      senderName.includes("engineer") ||
      senderName.includes("david") ||
      replyRoles.includes("engineer");

    return !mentionsEngineer;
  });

  const handleMaterialSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const payload = {
        ...materialForm,
        quantity: Number(materialForm.quantity),
        unitPrice: Number(materialForm.unitPrice),
      };

      const res = await axios.post(`/api/admin/materials`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const createdPurchase = res.data.purchase || {
        ...payload,
        _id: Date.now().toString(),
        totalAmount: Number(payload.quantity) * Number(payload.unitPrice),
        createdAt: new Date().toISOString(),
      };

      setSuccess(res.data.message || "Material purchase registered successfully.");
      setMaterials((prev) => [createdPurchase, ...prev]);
      setMaterialForm({
        materialName: "",
        category: "General",
        quantity: "",
        unit: "pcs",
        unitPrice: "",
        supplier: "",
        invoiceNumber: "",
        purchaseDate: new Date().toISOString().split("T")[0],
        project: "",
        status: "Pending",
        notes: "",
      });
    } catch (err) {
      const status = err.response?.status;
      const data = err.response?.data;
      const serverMsg = data && typeof data === "object" ? data.message : data;
      const message = serverMsg ? `Server ${status}: ${serverMsg}` : (err.message || "Failed to register material purchase.");
      setError(message);
      console.error("Material purchase error:", err);
    }
  };

  const handleResetForm = () => {
    setEditingProject(null);
    setFormData({
      projectName: "",
      projectCode: "",
      description: "",
      location: "",
      budget: "150000000",
      paidAmount: "0",
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
      status: "In Progress",
      progress: 0,
      client: "",
      engineers: [],
      employees: [],
      images: [],
    });
  };

  const handleOpenCreateModal = () => {
    handleResetForm();
    setShowAddModal(true);
  };

  const handleOpenEditModal = (proj) => {
    setEditingProject(proj);
    setFormData({
      projectName: proj.projectName || "",
      projectCode: proj.projectCode || "",
      description: proj.description || "",
      location: proj.location || "",
      budget: typeof proj.budget !== "undefined" ? proj.budget : 150000000,
      paidAmount: typeof proj.paidAmount !== "undefined" ? proj.paidAmount : 0,
      startDate: proj.startDate ? new Date(proj.startDate).toISOString().split("T")[0] : "",
      endDate: proj.endDate ? new Date(proj.endDate).toISOString().split("T")[0] : "",
      status: proj.status || "In Progress",
      progress: proj.progress || 0,
      client: proj.client?._id || proj.client || "",
      engineers: Array.isArray(proj.engineers) ? proj.engineers.map((e) => e._id || e) : [],
      employees: Array.isArray(proj.employees) ? proj.employees.map((e) => e._id || e) : [],
      images: proj.images || [],
    });
    setShowAddModal(true);
  };

  const handleEngineerToggle = (engId) => {
    setFormData((prev) => {
      const current = prev.engineers || [];
      const updated = current.includes(engId)
        ? current.filter((id) => id !== engId)
        : [...current, engId];
      return { ...prev, engineers: updated };
    });
  };

  const handleEmployeeToggle = (empId) => {
    setFormData((prev) => {
      const current = prev.employees || [];
      const updated = current.includes(empId)
        ? current.filter((id) => id !== empId)
        : [...current, empId];
      return { ...prev, employees: updated };
    });
  };

  const compressSingleImage = (imgItem) => {
    return new Promise((resolve) => {
      let url = "";
      let name = "Project Image";
      let uploadedAt = new Date();

      if (typeof imgItem === "string") {
        url = imgItem;
      } else if (imgItem && typeof imgItem === "object") {
        url = imgItem.url || "";
        name = imgItem.name || "Project Image";
        uploadedAt = imgItem.uploadedAt || new Date();
      }

      if (!url || !url.startsWith("data:image")) {
        resolve({ url, name, uploadedAt });
        return;
      }

      if (url.length < 100000) {
        resolve({ url, name, uploadedAt });
        return;
      }

      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 500;
        const MAX_HEIGHT = 500;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        const compressedUrl = canvas.toDataURL("image/jpeg", 0.5);
        resolve({ url: compressedUrl, name, uploadedAt });
      };

      img.onerror = () => {
        resolve({ url, name, uploadedAt });
      };

      img.src = url;
    });
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.projectName) {
      setError("Project Name is required.");
      return;
    }

    try {
      // Compress all images in payload to guarantee lightweight request
      const compressedImages = await Promise.all((formData.images || []).map(compressSingleImage));
      const payload = {
        ...formData,
        images: compressedImages,
      };

      if (editingProject) {
        // Edit existing project
        const res = await axios.put(`/api/projects/${editingProject._id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccess(`Project "${res.data.project.projectName}" updated successfully!`);
        setProjects(projects.map((p) => (p._id === editingProject._id ? res.data.project : p)));
      } else {
        // Create new project
        const res = await axios.post("/api/projects", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccess(`Project "${res.data.project.projectName}" created successfully!`);
        setProjects([res.data.project, ...projects]);
      }

      setShowAddModal(false);
      handleResetForm();

      // Refresh dashboard stats
      const dashRes = await axios.get(`/api/admin/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(dashRes.data.dashboard);
    } catch (err) {
      console.error("Project save error details:", err);
      const serverMsg = err.response?.data?.message || err.message || "Failed to save project.";
      setError(serverMsg);
    }
  };

  const handleQuickStatusChange = async (id, newStatus) => {
    try {
      const res = await axios.patch(
        `/api/projects/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(`Project status updated to ${newStatus}`);
      setProjects(projects.map((p) => (p._id === id ? res.data.project : p)));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update project status.");
    }
  };

  const handleDeleteProject = async (id, name) => {
    if (!window.confirm(`Are you sure you want to permanently delete project "${name}"?`)) return;
    setError("");
    setSuccess("");
    try {
      await axios.delete(`/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess(`Project "${name}" deleted successfully!`);
      setProjects(projects.filter((p) => p._id !== id));

      // Refresh dashboard stats
      const dashRes = await axios.get(`/api/admin/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(dashRes.data.dashboard);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete project.");
    }
  };

  // Exclusive File Explorer Image Upload Handler (Supports multiple files & compression)
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 600;
          const MAX_HEIGHT = 600;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.6);

          setFormData((prev) => ({
            ...prev,
            images: [
              ...prev.images,
              {
                url: dataUrl,
                name: file.name || "Uploaded Photo",
                uploadedAt: new Date(),
              },
            ],
          }));
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index) => {
    const updated = [...formData.images];
    updated.splice(index, 1);
    setFormData({ ...formData, images: updated });
  };

  const getStatusBadgeClass = (st) => {
    switch (st) {
      case "Completed":
        return "badge-completed";
      case "In Progress":
        return "badge-in-progress";
      case "Planning":
        return "badge-planning";
      case "On Hold":
        return "badge-on-hold";
      case "Cancelled":
        return "badge-cancelled";
      default:
        return "badge-default";
    }
  };

  const pendingReceiptProjects = projects.filter((proj) =>
    Array.isArray(proj.payments) && proj.payments.some((pay) => pay.status === "Pending Approval")
  );

  const pendingReceiptItems = pendingReceiptProjects.flatMap((proj) =>
    (proj.payments || [])
      .filter((pay) => pay.status === "Pending Approval")
      .map((pay) => ({ ...pay, projectId: proj._id, projectName: proj.projectName, projectCode: proj.projectCode, clientName: proj.client?.fullName || "Unknown Client" }))
  );

  const handleRefreshPendingApprovals = async () => {
    setRefreshing(true);
    try {
      const projRes = await axios.get(`/api/projects`, { headers: { Authorization: `Bearer ${token}` } });
      setProjects(projRes.data || []);
      setSuccess("Pending approvals refreshed!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to refresh pending approvals.");
      setTimeout(() => setError(""), 3000);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <>
      <style>{spinKeyframes}</style>
      <Sidebar />
      <Topbar adminName={localStorage.getItem("adminName") || "Admin"} />
      
      <div className="admin-dashboard-header">
        <div className="admin-dashboard-header-text">
          <h1>Admin Dashboard</h1>
          <p>Manage construction projects, clients, user roles, and track overall progress.</p>
        </div>
        <div className="admin-header-actions">
          <button
            className="admin-action-button btn-add-project"
            onClick={handleOpenCreateModal}
          >
            <FaPlus /> Add New Project
          </button>
          <Link to="/admin/users" className="admin-action-button">
            Register User
          </Link>
        </div>
      </div>

      <div className="admin-dashboard-links">
        <Link to="/admin/users" className="admin-dashboard-link-card">Users</Link>
        <Link to="/admin/clients" className="admin-dashboard-link-card">Clients</Link>
        <Link to="/admin/employees" className="admin-dashboard-link-card">Employees</Link>
        <Link to="/admin/engineers" className="admin-dashboard-link-card">Engineers</Link>
        <Link to="/admin/hr-managers" className="admin-dashboard-link-card">HR Managers</Link>
        <Link to="/admin/quotes" className="admin-dashboard-link-card">Quotes</Link>
      </div>

      <div className="dashboard-content-container">
        {error && <div className="dashboard-alert alert-error">{error}</div>}
        {success && <div className="dashboard-alert alert-success">{success}</div>}

        {loading ? (
          <div className="dashboard-loading">Loading dashboard metrics...</div>
        ) : (
          <>
            <DashboardCards stats={stats} />

            {/* Projects Overview & Status Classification Section */}
            <div className="dashboard-projects-section">
              <div className="section-header">
                <div>
                  <h2>Recent Projects & Classification Overview</h2>
                  <p>Filter, edit, or change status (Active, Finished, Planning, On Hold) directly from here.</p>
                </div>
                <Link to="/admin/projects" className="view-all-link">
                  Manage All Projects ({projects.length}) &rarr;
                </Link>
              </div>

              {projects.length === 0 ? (
                <div className="empty-projects-card">
                  <p>No projects recorded yet.</p>
                  <button className="btn-create-first" onClick={handleOpenCreateModal}>
                    <FaPlus /> Add Your First Project
                  </button>
                </div>
              ) : (
                <div className="dashboard-projects-grid">
                  {projects.slice(0, 6).map((proj) => (
                    <div key={proj._id} className="dash-project-card">
                      <div className="dash-card-header">
                        <div>
                          <span className="dash-proj-code">{proj.projectCode}</span>
                          <h3 className="dash-proj-title">{proj.projectName}</h3>
                        </div>
                        <span className={`status-pill ${getStatusBadgeClass(proj.status)}`}>
                          {proj.status}
                        </span>
                      </div>

                      <div className="dash-proj-client">
                        <FaUserTie className="icon" />
                        <span>Client: <strong>{proj.client?.fullName || "Unassigned"}</strong></span>
                        {proj.client?.email && <small> ({proj.client.email})</small>}
                      </div>

                      <div className="dash-proj-meta">
                        <span><FaMapMarkerAlt /> {proj.location || "N/A"}</span>
                        <span><FaCoins /> {(proj.budget || 0).toLocaleString()} Birr</span>
                      </div>

                      <div className="dash-proj-progress">
                        <div className="progress-text">
                          <span>Progress</span>
                          <span><strong>{proj.progress || 0}%</strong></span>
                        </div>
                        <div className="progress-bg">
                          <div
                            className="progress-fill"
                            style={{ width: `${proj.progress || 0}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Financial Milestone Installments & Admin Receipt Approvals (20M, 30M, 50M, 50M) */}
                      <div style={{ marginTop: "14px", paddingTop: "12px", borderTop: "1px dashed #cbd5e1" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: "700", marginBottom: "8px" }}>
                          <span><FaCoins style={{ color: "#ff6b00" }} /> Milestone Receipts (20M, 30M, 50M, 50M)</span>
                          <span style={{ color: "#16a34a" }}>Paid: {(proj.paidAmount || 0).toLocaleString()} / {(proj.budget || 150000000).toLocaleString()} ETB</span>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                          {((proj.payments && proj.payments.length > 0) ? proj.payments : DEFAULT_ADMIN_PAYMENTS).map((pay) => (
                            <div key={pay.id || pay._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f8fafc", padding: "6px 10px", borderRadius: "6px", fontSize: "12px", border: "1px solid #e2e8f0" }}>
                              <span><strong>{pay.id}:</strong> {(Number(pay.amount)/1000000)}M ETB</span>
                              <button
                                type="button"
                                onClick={() => handleTogglePaymentStatus(proj._id, pay.id || pay._id, pay.status)}
                                style={{
                                  background: pay.status === "Paid" ? "#10b981" : "#0f172a",
                                  color: "white",
                                  border: "none",
                                  padding: "4px 10px",
                                  borderRadius: "6px",
                                  fontWeight: "700",
                                  fontSize: "11px",
                                  cursor: "pointer",
                                  transition: "all 0.2s ease"
                                }}
                              >
                                {pay.status === "Paid" ? "✓ Paid (Receipt Accepted)" : "Accept Receipt & Mark Paid"}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="dash-card-actions">
                        <button
                          className="action-pill btn-edit"
                          title="Edit Project Details"
                          onClick={() => handleOpenEditModal(proj)}
                        >
                          <FaEdit /> Edit
                        </button>

                        {proj.status !== "Completed" ? (
                          <button
                            className="action-pill btn-finish"
                            title="Mark as Finished / Completed"
                            onClick={() => handleQuickStatusChange(proj._id, "Completed")}
                          >
                            <FaCheckCircle /> Mark Finished
                          </button>
                        ) : (
                          <button
                            className="action-pill btn-active"
                            title="Re-activate Project"
                            onClick={() => handleQuickStatusChange(proj._id, "In Progress")}
                          >
                            <FaPlay /> Mark Active
                          </button>
                        )}

                        <button
                          className="action-pill btn-delete"
                          title="Delete Cancelled or Selected Project"
                          onClick={() => handleDeleteProject(proj._id, proj.projectName)}
                          style={{ background: "#fee2e2", color: "#dc2626", border: "1px solid #fca5a5" }}
                        >
                          <FaTrash /> Delete
                        </button>

                        <Link to="/admin/projects" className="action-pill btn-details">
                          <FaEye /> Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Material Purchases & Inventory Registration */}
            <div className="materials-section">
              <div className="section-header">
                <div>
                  <h2>Material Purchases</h2>
                  <p>Register purchased construction materials, their price, quantity, supplier, and invoice details.</p>
                </div>
              </div>

              <div className="materials-grid">
                <form className="material-form" onSubmit={handleMaterialSubmit}>
                  <div className="grid-2">
                    <input
                      placeholder="Material name"
                      value={materialForm.materialName}
                      onChange={(e) => setMaterialForm({ ...materialForm, materialName: e.target.value })}
                      required
                    />
                    <input
                      placeholder="Category"
                      value={materialForm.category}
                      onChange={(e) => setMaterialForm({ ...materialForm, category: e.target.value })}
                    />
                  </div>
                  <div className="grid-2">
                    <input
                      type="number"
                      min="1"
                      placeholder="Quantity"
                      value={materialForm.quantity}
                      onChange={(e) => setMaterialForm({ ...materialForm, quantity: e.target.value })}
                      required
                    />
                    <input
                      placeholder="Unit"
                      value={materialForm.unit}
                      onChange={(e) => setMaterialForm({ ...materialForm, unit: e.target.value })}
                    />
                  </div>
                  <div className="grid-2">
                    <input
                      type="number"
                      min="0"
                      placeholder="Unit price"
                      value={materialForm.unitPrice}
                      onChange={(e) => setMaterialForm({ ...materialForm, unitPrice: e.target.value })}
                      required
                    />
                    <input
                      placeholder="Supplier"
                      value={materialForm.supplier}
                      onChange={(e) => setMaterialForm({ ...materialForm, supplier: e.target.value })}
                    />
                  </div>
                  <div className="grid-2">
                    <input
                      placeholder="Invoice number"
                      value={materialForm.invoiceNumber}
                      onChange={(e) => setMaterialForm({ ...materialForm, invoiceNumber: e.target.value })}
                    />
                    <input
                      type="date"
                      value={materialForm.purchaseDate}
                      onChange={(e) => setMaterialForm({ ...materialForm, purchaseDate: e.target.value })}
                    />
                  </div>
                  <select
                    value={materialForm.status}
                    onChange={(e) => setMaterialForm({ ...materialForm, status: e.target.value })}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Received">Received</option>
                    <option value="Canceled">Canceled</option>
                  </select>
                  <textarea
                    rows="3"
                    placeholder="Notes"
                    value={materialForm.notes}
                    onChange={(e) => setMaterialForm({ ...materialForm, notes: e.target.value })}
                  />
                  <button type="submit" style={{ background: "#16a34a", padding: "12px 18px", fontSize: "15px", boxShadow: "0 6px 16px rgba(22, 163, 74, 0.2)" }}>Register Purchase</button>
                </form>

                <div className="material-list">
                  {materials.length === 0 ? (
                    <div className="empty-projects-card">
                      <p>No material purchases registered yet.</p>
                    </div>
                  ) : (
                    materials.map((item) => (
                      <div key={item._id} className="material-card">
                        <strong>{item.materialName}</strong>
                        <div className="material-meta">
                          {item.quantity} {item.unit} · Unit price: {Number(item.unitPrice || 0).toLocaleString()} ETB · Total: {Number(item.totalAmount || 0).toLocaleString()} ETB
                        </div>
                        <div className="material-meta">
                          Supplier: {item.supplier || "N/A"} · Invoice: {item.invoiceNumber || "N/A"} · Status: {item.status}
                        </div>
                        {item.notes ? <div className="material-meta">Notes: {item.notes}</div> : null}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Pending Receipt Approvals */}
            <div className="dashboard-projects-section" style={{ marginTop: "32px" }}>
              <div className="section-header">
                <div>
                  <h2 style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <FaPaperPlane style={{ color: "#ff6b00" }} /> Pending Client Receipt Approvals
                  </h2>
                  <p>Review receipts submitted by clients and accept milestone payments from here.</p>
                </div>
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <button
                    onClick={handleRefreshPendingApprovals}
                    disabled={refreshing}
                    style={{
                      background: "#0f172a",
                      color: "white",
                      border: "none",
                      padding: "8px 16px",
                      borderRadius: "8px",
                      fontWeight: "700",
                      fontSize: "13px",
                      cursor: refreshing ? "not-allowed" : "pointer",
                      opacity: refreshing ? 0.6 : 1,
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      transition: "all 0.2s ease"
                    }}
                    title="Refresh pending approvals"
                  >
                    <FaSync style={{ animation: refreshing ? "spin 1s linear infinite" : "none" }} /> Refresh
                  </button>
                  <Link to="/admin/projects" className="view-all-link">
                    Review All Projects ({pendingReceiptItems.length}) &rarr;
                  </Link>
                </div>
              </div>

              {pendingReceiptItems.length === 0 ? (
                <div className="empty-projects-card" style={{ padding: "30px" }}>
                  <FaPaperPlane style={{ fontSize: "36px", color: "#cbd5e1", marginBottom: "8px" }} />
                  <p>No receipts pending approval right now.</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                  {pendingReceiptItems.map((pay) => (
                    <div key={`${pay.projectId}-${pay.id || pay._id}`} style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "20px", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", marginBottom: "14px" }}>
                        <div>
                          <span className="dash-proj-code">{pay.projectCode || "Unknown Code"}</span>
                          <h3 className="dash-proj-title" style={{ margin: "8px 0 0" }}>{pay.projectName || "Unnamed Project"}</h3>
                          <p style={{ margin: "4px 0 0", color: "#64748b" }}>Client: <strong>{pay.clientName || "Unknown Client"}</strong></p>
                        </div>
                        <span className="status-pill badge-sched">Pending Approval</span>
                      </div>

                      <div style={{ display: "grid", gap: "10px", padding: "14px", borderRadius: "12px", background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                          <div>
                            <h4 style={{ margin: 0, fontSize: "16px", color: "#0f172a" }}>{pay.id}</h4>
                            <p style={{ margin: "4px 0 0", color: "#475569" }}>{pay.description}</p>
                          </div>
                          <span className="status-pill badge-sched">Pending Approval</span>
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", color: "#334155", fontSize: "13px" }}>
                          <div><strong>Amount:</strong> {(Number(pay.amount) || 0).toLocaleString()} Birr</div>
                          <div><strong>Method:</strong> {pay.paymentMethod || "Not provided"}</div>
                          <div><strong>Ref:</strong> {pay.receiptRef || "N/A"}</div>
                          {pay.receiptUrl && (
                            <a href={pay.receiptUrl} target="_blank" rel="noreferrer" style={{ color: "#0f172a", fontWeight: "700" }}>
                              View Receipt Image
                            </a>
                          )}
                        </div>
                        <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", flexWrap: "wrap" }}>
                          <button
                            className="action-pill btn-edit"
                            style={{ background: "#10b981", color: "white", border: "none" }}
                            onClick={() => handleTogglePaymentStatus(pay.projectId, pay.id || pay._id, pay.status)}
                          >
                            <FaCheckCircle /> Accept & Mark Paid
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Client Direct Messages & Inquiries Inbox */}
            <div className="dashboard-projects-section" style={{ marginTop: "32px" }}>
              <div className="section-header">
                <div>
                  <h2 style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <FaComments style={{ color: "#ff6b00" }} /> Client to Admin Messages Inbox ({visibleAdminMessages.length})
                  </h2>
                  <p>Read client questions, view project context, and reply directly as Admin from the dashboard.</p>
                </div>
              </div>

              {visibleAdminMessages.length === 0 ? (
                <div className="empty-projects-card" style={{ padding: "30px" }}>
                  <FaComments style={{ fontSize: "36px", color: "#cbd5e1", marginBottom: "8px" }} />
                  <p>No client-to-admin messages received yet.</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                  {visibleAdminMessages.map((msg) => (
                    <div key={msg._id} style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "20px", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                        <div>
                          <span style={{ fontSize: "12px", fontWeight: "800", color: "#ff6b00", background: "rgba(255,107,0,0.1)", padding: "3px 10px", borderRadius: "6px", textTransform: "uppercase" }}>
                            {msg.projectName || "MG Building Commercial Complex"}
                          </span>
                          <h3 style={{ margin: "8px 0 4px", fontSize: "18px", color: "#0f172a", fontWeight: "700" }}>{msg.subject}</h3>
                          <div style={{ fontSize: "13px", color: "#64748b", display: "flex", gap: "14px", flexWrap: "wrap" }}>
                            <span><strong>From Client:</strong> {msg.senderName} ({msg.senderEmail})</span>
                            <span><strong>Target:</strong> {msg.recipientName || "Admin"} ({msg.recipientPhone || "Admin Inbox"})</span>
                            <span><strong>Date:</strong> {new Date(msg.createdAt).toLocaleString()}</span>
                          </div>
                        </div>
                        <span className={`status-pill ${msg.status === "Replied" ? "badge-completed" : "badge-in-progress"}`}>
                          {msg.status || "Open"}
                        </span>
                      </div>

                      {/* Client Inquiry Body */}
                      <div style={{ background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "10px", padding: "14px 18px", color: "#1e293b", fontSize: "14px", lineHeight: "1.6", marginBottom: "14px" }}>
                        <strong style={{ color: "#0f172a", display: "block", marginBottom: "4px" }}>💬 Client Inquiry:</strong>
                        {msg.body}
                      </div>

                      {/* Conversation Thread Replies */}
                      {msg.replies && msg.replies.length > 0 && (
                        <div style={{ marginLeft: "16px", paddingLeft: "14px", borderLeft: "3px solid #ff6b00", display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px" }}>
                          {msg.replies.map((reply, ridx) => (
                            <div key={ridx} style={{ background: reply.senderRole === "client" ? "#eff6ff" : "#fff7ed", border: `1px solid ${reply.senderRole === "client" ? "#bfdbfe" : "#fed7aa"}`, borderRadius: "10px", padding: "12px 16px", fontSize: "13.5px" }}>
                              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                                <strong style={{ color: reply.senderRole === "client" ? "#1e40af" : "#c2410c" }}>
                                  {reply.senderRole === "client" ? `👤 ${reply.senderName} (CLIENT)` : `�️ ${reply.senderName} (ADMIN)`}
                                </strong>
                                <small style={{ color: "#64748b" }}>{new Date(reply.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small>
                              </div>
                              <p style={{ margin: 0, color: "#1e293b", lineHeight: "1.5" }}>{reply.body}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Admin Reply Box */}
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        const text = replyTexts[msg._id];
                        if (!text || !text.trim()) return;
                        axios.post(
                          `/api/messages/${msg._id}/reply`,
                          {
                            body: text.trim(),
                            senderName: localStorage.getItem("adminName") || "Admin",
                            senderRole: "admin",
                          },
                          { headers: { Authorization: `Bearer ${token}` } }
                        ).then(() => {
                          setSuccess("Direct message successfully sent!");
                          setReplyTexts((prev) => ({ ...prev, [msg._id]: "" }));
                          return axios.get('/api/messages', { headers: { Authorization: `Bearer ${token}` } });
                        }).then((updatedRes) => {
                          setMessages(updatedRes.data?.messages || []);
                        }).catch((err) => {
                          setError("Failed to submit reply.");
                        });
                      }} style={{ display: "flex", gap: "12px" }}>
                        <input
                          type="text"
                          placeholder="Type reply as Admin..."
                          value={replyTexts[msg._id] || ""}
                          onChange={(e) => setReplyTexts({ ...replyTexts, [msg._id]: e.target.value })}
                          style={{ flex: 1, padding: "10px 16px", border: "1px solid #cbd5e1", borderRadius: "10px", fontSize: "14px", outline: "none" }}
                        />
                        <button type="submit" style={{ background: "#ff6b00", color: "white", border: "none", padding: "10px 22px", borderRadius: "10px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", fontSize: "14px" }}>
                          <FaPaperPlane /> Send Reply
                        </button>
                      </form>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* CREATE / EDIT PROJECT MODAL FOR ADMIN */}
      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="dash-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="dash-modal-header">
              <h2>{editingProject ? "Edit Construction Project" : "Add New Construction Project"}</h2>
              <button className="modal-close-btn" onClick={() => setShowAddModal(false)}>
                &times;
              </button>
            </div>

            {error && <div className="dashboard-alert alert-error" style={{ margin: "16px 28px 0" }}>{error}</div>}

            <form onSubmit={handleProjectSubmit} className="dash-project-form">
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Project Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Skyline Luxury Apartments"
                    value={formData.projectName}
                    onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Project Code</label>
                  <input
                    type="text"
                    placeholder="Auto-generated if blank"
                    value={formData.projectCode}
                    onChange={(e) => setFormData({ ...formData, projectCode: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Select Client <FaUserTie /></label>
                  <select
                    value={formData.client}
                    onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                  >
                    <option value="">-- Select Registered Client --</option>
                    {clientsList.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.fullName} ({c.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    placeholder="City / Site Address"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
              </div>

              {/* Assign Engineers & Employees Multi-Select Area */}
              <div className="form-grid-2" style={{ background: "#f8fafc", padding: "14px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                <div className="form-group">
                  <label style={{ fontWeight: "700", display: "flex", alignItems: "center", gap: "6px" }}>
                    <FaHardHat style={{ color: "#ff6b00" }} /> Assign Engineers ({formData.engineers?.length || 0} Selected)
                  </label>
                  <div style={{ maxHeight: "130px", overflowY: "auto", border: "1px solid #cbd5e1", padding: "8px 12px", borderRadius: "8px", background: "white" }}>
                    {engineersList.length === 0 ? (
                      <span style={{ fontSize: "13px", color: "#64748b" }}>No engineers registered.</span>
                    ) : (
                      engineersList.map((eng) => (
                        <label key={eng._id} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", margin: "6px 0", cursor: "pointer" }}>
                          <input
                            type="checkbox"
                            checked={(formData.engineers || []).includes(eng._id)}
                            onChange={() => handleEngineerToggle(eng._id)}
                          />
                          <span><strong>{eng.fullName}</strong> ({eng.email})</span>
                        </label>
                      ))
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label style={{ fontWeight: "700", display: "flex", alignItems: "center", gap: "6px" }}>
                    <FaUsers style={{ color: "#0066cc" }} /> Assign Employees ({formData.employees?.length || 0} Selected)
                  </label>
                  <div style={{ maxHeight: "130px", overflowY: "auto", border: "1px solid #cbd5e1", padding: "8px 12px", borderRadius: "8px", background: "white" }}>
                    {employeesList.length === 0 ? (
                      <span style={{ fontSize: "13px", color: "#64748b" }}>No employees registered.</span>
                    ) : (
                      employeesList.map((emp) => (
                        <label key={emp._id} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", margin: "6px 0", cursor: "pointer" }}>
                          <input
                            type="checkbox"
                            checked={(formData.employees || []).includes(emp._id)}
                            onChange={() => handleEmployeeToggle(emp._id)}
                          />
                          <span><strong>{emp.fullName}</strong> ({emp.email})</span>
                        </label>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div className="form-grid-3">
                <div className="form-group">
                  <label>Total Contract Budget (ETB)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="150000000"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Amount Paid to Date (ETB)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formData.paidAmount}
                    onChange={(e) => setFormData({ ...formData, paidAmount: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Status Classification</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="In Progress">Active (In Progress)</option>
                    <option value="Planning">Planning</option>
                    <option value="On Hold">On Hold</option>
                    <option value="Completed">Finished (Completed)</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Progress: <strong>{formData.progress}%</strong></label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={formData.progress}
                    onChange={(e) => setFormData({ ...formData, progress: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Estimated End Date</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description & Scope of Work</label>
                <textarea
                  rows="3"
                  placeholder="Overview of project requirements, dimensions, specifications..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                ></textarea>
              </div>

              {/* Exclusive File Explorer Upload Box */}
              <div className="form-group image-input-box" style={{ background: "#f8fafc", padding: "18px", borderRadius: "12px", border: "2px dashed #cbd5e1" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: "700", color: "#0f172a", marginBottom: "10px" }}>
                  <FaFolderOpen style={{ color: "#ff6b00", fontSize: "18px" }} /> Upload Project Photos from File Explorer
                </label>
                
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileUpload}
                  style={{ display: "block", width: "100%", padding: "10px", background: "white", borderRadius: "8px", border: "1px solid #cbd5e1", cursor: "pointer" }}
                />
                <small style={{ color: "#64748b", marginTop: "6px", display: "block" }}>
                  You can select one or multiple photos directly from your computer files (.jpg, .png, .webp).
                </small>

                {formData.images.length > 0 && (
                  <div className="img-tags-row" style={{ marginTop: "16px", display: "flex", flexWrap: "wrap", gap: "10px" }}>
                    {formData.images.map((img, i) => (
                      <div key={i} style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "white", border: "1px solid #cbd5e1", padding: "6px 12px", borderRadius: "20px", fontSize: "13px", color: "#1e293b", boxShadow: "0 2px 6px rgba(0,0,0,0.05)" }}>
                        <span>📷 {typeof img === 'string' ? 'Uploaded Photo' : (img.name || 'Project Photo')}</span>
                        <button type="button" onClick={() => handleRemoveImage(i)} style={{ border: "none", background: "none", color: "#b91c1c", cursor: "pointer", display: "flex", alignItems: "center" }}>
                          <FaTrash size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="dash-modal-footer">
                <button
                  type="button"
                  className="btn-modal-cancel"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-modal-submit">
                  {editingProject ? "Save Changes" : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Dashboard;