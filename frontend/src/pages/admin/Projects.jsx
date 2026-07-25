import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../components/Admin/Sidebar/Sidebar";
import Topbar from "../../components/Admin/Topbar/Topbar";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaEye,
  FaCheckCircle,
  FaFileAlt,
  FaImage,
  FaUserTie,
  FaHardHat,
  FaUsers,
  FaDollarSign,
  FaCalendarAlt,
  FaTasks,
} from "react-icons/fa";
import "./Projects.css";

function AdminProjects() {
  const navigate = useNavigate();

  // State
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Modals
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [viewingProject, setViewingProject] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    projectName: "",
    projectCode: "",
    description: "",
    location: "",
    budget: 0,
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    status: "Planning",
    progress: 0,
    client: "",
    projectManager: "",
    engineers: [],
    employees: [],
    images: [],
    documents: [],
  });

  // Media upload input helpers
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [imageNameInput, setImageNameInput] = useState("");
  const [docUrlInput, setDocUrlInput] = useState("");
  const [docNameInput, setDocNameInput] = useState("");

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("userRole");

  useEffect(() => {
    if (!token || role !== "admin") {
      navigate("/admin/login");
      return;
    }
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [projRes, usersRes] = await Promise.all([
        axios.get("/api/projects", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setProjects(projRes.data || []);
      setUsers(usersRes.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load project data.");
    } finally {
      setLoading(false);
    }
  };

  // Helper lists for user roles
  const clientsList = users.filter((u) => u.role === "client");
  const engineersList = users.filter((u) => u.role === "engineer" || u.role === "project_manager");
  const employeesList = users.filter((u) => u.role === "employee" || u.role === "engineer");

  // Reset form
  const resetForm = () => {
    setFormData({
      projectName: "",
      projectCode: "",
      description: "",
      location: "",
      budget: 0,
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
      status: "Planning",
      progress: 0,
      client: "",
      projectManager: "",
      engineers: [],
      employees: [],
      images: [],
      documents: [],
    });
    setImageUrlInput("");
    setImageNameInput("");
    setDocUrlInput("");
    setDocNameInput("");
    setEditingProject(null);
  };

  // Open Create Modal
  const handleOpenCreateModal = () => {
    resetForm();
    setShowFormModal(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (proj) => {
    setEditingProject(proj);
    setFormData({
      projectName: proj.projectName || "",
      projectCode: proj.projectCode || "",
      description: proj.description || "",
      location: proj.location || "",
      budget: proj.budget || 0,
      startDate: proj.startDate ? new Date(proj.startDate).toISOString().split("T")[0] : "",
      endDate: proj.endDate ? new Date(proj.endDate).toISOString().split("T")[0] : "",
      status: proj.status || "Planning",
      progress: proj.progress || 0,
      client: proj.client?._id || proj.client || "",
      projectManager: proj.projectManager?._id || proj.projectManager || "",
      engineers: Array.isArray(proj.engineers) ? proj.engineers.map((e) => e._id || e) : [],
      employees: Array.isArray(proj.employees) ? proj.employees.map((e) => e._id || e) : [],
      images: proj.images || [],
      documents: proj.documents || [],
    });
    setShowFormModal(true);
  };

  // Open View Details Modal
  const handleOpenDetailsModal = (proj) => {
    setViewingProject(proj);
    setShowDetailsModal(true);
  };

  // Submit Add/Edit Form
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.projectName) {
      setError("Project name is required.");
      return;
    }

    try {
      if (editingProject) {
        const res = await axios.put(`/api/projects/${editingProject._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccess("Project updated successfully!");
        setProjects(projects.map((p) => (p._id === editingProject._id ? res.data.project : p)));
      } else {
        const res = await axios.post("/api/projects", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccess("Project created successfully!");
        setProjects([res.data.project, ...projects]);
      }
      setShowFormModal(false);
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || "Operation failed.");
    }
  };

  // Delete Project
  const handleDeleteProject = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      await axios.delete(`/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess(`Project "${name}" deleted.`);
      setProjects(projects.filter((p) => p._id !== id));
      if (viewingProject?._id === id) setShowDetailsModal(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete project.");
    }
  };

  // Mark Completed Shortcut
  const handleMarkCompleted = async (id) => {
    try {
      const res = await axios.patch(
        `/api/projects/${id}/complete`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(`Project marked as Completed!`);
      setProjects(projects.map((p) => (p._id === id ? res.data.project : p)));
      if (viewingProject?._id === id) {
        setViewingProject(res.data.project);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to mark as completed.");
    }
  };

  // Image & Document Handlers for Form
  const handleAddImage = () => {
    if (!imageUrlInput) return;
    const newImg = {
      url: imageUrlInput,
      name: imageNameInput || "Project Image",
      uploadedAt: new Date(),
    };
    setFormData({ ...formData, images: [...formData.images, newImg] });
    setImageUrlInput("");
    setImageNameInput("");
  };

  const handleRemoveImage = (index) => {
    const updated = [...formData.images];
    updated.splice(index, 1);
    setFormData({ ...formData, images: updated });
  };

  const handleAddDocument = () => {
    if (!docUrlInput || !docNameInput) {
      alert("Please provide both document title and file URL.");
      return;
    }
    const newDoc = {
      url: docUrlInput,
      name: docNameInput,
      uploadedAt: new Date(),
    };
    setFormData({ ...formData, documents: [...formData.documents, newDoc] });
    setDocUrlInput("");
    setDocNameInput("");
  };

  const handleRemoveDocument = (index) => {
    const updated = [...formData.documents];
    updated.splice(index, 1);
    setFormData({ ...formData, documents: updated });
  };

  // File Upload Conversion (Base64 / Local preview fallback)
  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === "image") {
        setFormData({
          ...formData,
          images: [
            ...formData.images,
            { url: reader.result, name: file.name, uploadedAt: new Date() },
          ],
        });
      } else if (type === "document") {
        setFormData({
          ...formData,
          documents: [
            ...formData.documents,
            { url: reader.result, name: file.name, uploadedAt: new Date() },
          ],
        });
      }
    };
    reader.readAsDataURL(file);
  };

  // Engineer multi-select toggle
  const handleEngineerToggle = (engId) => {
    const exists = formData.engineers.includes(engId);
    let updated = [];
    if (exists) {
      updated = formData.engineers.filter((id) => id !== engId);
    } else {
      updated = [...formData.engineers, engId];
    }
    setFormData({ ...formData, engineers: updated });
  };

  // Employee multi-select toggle
  const handleEmployeeToggle = (empId) => {
    const exists = formData.employees.includes(empId);
    let updated = [];
    if (exists) {
      updated = formData.employees.filter((id) => id !== empId);
    } else {
      updated = [...formData.employees, empId];
    }
    setFormData({ ...formData, employees: updated });
  };

  // Filtered Projects
  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.projectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.projectCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.location?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "All" || p.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate Summary Stats
  const totalProjects = projects.length;
  const inProgressProjects = projects.filter((p) => p.status === "In Progress").length;
  const completedProjects = projects.filter((p) => p.status === "Completed").length;
  const totalBudget = projects.reduce((acc, curr) => acc + (curr.budget || 0), 0);

  // Status badge styling helper
  const getStatusBadge = (status) => {
    switch (status) {
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

  return (
    <>
      <Sidebar />
      <Topbar adminName={localStorage.getItem("adminName") || "Admin"} />

      <div className="admin-projects-page">
        {/* Header Title & Actions */}
        <div className="projects-header">
          <div>
            <span className="projects-eyebrow">Admin Dashboard</span>
            <h1>Project Management</h1>
            <p>Create, manage, assign teams, upload files, and track construction project progress.</p>
          </div>
          <button className="add-project-btn" onClick={handleOpenCreateModal}>
            <FaPlus /> Add New Project
          </button>
        </div>

        {/* Feedback Messages */}
        {error && <div className="project-alert alert-error">{error}</div>}
        {success && <div className="project-alert alert-success">{success}</div>}

        {/* Summary Metric Cards */}
        <div className="projects-summary-grid">
          <div className="summary-card">
            <div className="summary-icon blue"><FaTasks /></div>
            <div>
              <h3>{totalProjects}</h3>
              <p>Total Projects</p>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-icon yellow"><FaTasks /></div>
            <div>
              <h3>{inProgressProjects}</h3>
              <p>In Progress</p>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-icon green"><FaCheckCircle /></div>
            <div>
              <h3>{completedProjects}</h3>
              <p>Completed</p>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-icon gold"><FaDollarSign /></div>
            <div>
              <h3>${totalBudget.toLocaleString()}</h3>
              <p>Total Budget</p>
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="projects-filter-bar">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by project name, code or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Status:</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="All">All Statuses</option>
              <option value="Planning">Planning</option>
              <option value="In Progress">In Progress</option>
              <option value="On Hold">On Hold</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="projects-loading">Loading projects...</div>
        ) : filteredProjects.length === 0 ? (
          <div className="projects-empty">
            <h3>No projects found</h3>
            <p>Try adjusting your search filters or click "Add New Project" to create one.</p>
          </div>
        ) : (
          <div className="projects-grid">
            {filteredProjects.map((project) => (
              <div key={project._id} className="project-card">
                <div className="project-card-header">
                  <div>
                    <span className="project-code">{project.projectCode}</span>
                    <h3 className="project-name">{project.projectName}</h3>
                  </div>
                  <span className={`status-badge ${getStatusBadge(project.status)}`}>
                    {project.status}
                  </span>
                </div>

                <p className="project-location">📍 {project.location || "Location not set"}</p>
                <p className="project-desc">
                  {project.description
                    ? project.description.length > 90
                      ? project.description.substring(0, 90) + "..."
                      : project.description
                    : "No description provided."}
                </p>

                {/* Progress Bar */}
                <div className="progress-section">
                  <div className="progress-label">
                    <span>Progress</span>
                    <strong>{project.progress || 0}%</strong>
                  </div>
                  <div className="progress-bar-bg">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${project.progress || 0}%` }}
                    ></div>
                  </div>
                </div>

                {/* Info Metadata Grid */}
                <div className="project-meta-grid">
                  <div>
                    <span>Budget</span>
                    <strong>${(project.budget || 0).toLocaleString()}</strong>
                  </div>
                  <div>
                    <span>Client</span>
                    <strong>{project.client?.fullName || "Unassigned"}</strong>
                  </div>
                  <div>
                    <span>Engineers</span>
                    <strong>{project.engineers?.length || 0} assigned</strong>
                  </div>
                  <div>
                    <span>Employees</span>
                    <strong>{project.employees?.length || 0} assigned</strong>
                  </div>
                </div>

                {/* Media indicators */}
                <div className="project-attachments-bar">
                  <span><FaImage /> {project.images?.length || 0} Images</span>
                  <span><FaFileAlt /> {project.documents?.length || 0} Documents</span>
                </div>

                {/* Card Action Buttons */}
                <div className="project-card-actions">
                  <button
                    className="action-btn btn-view"
                    onClick={() => handleOpenDetailsModal(project)}
                    title="View Details"
                  >
                    <FaEye /> View
                  </button>
                  <button
                    className="action-btn btn-edit"
                    onClick={() => handleOpenEditModal(project)}
                    title="Edit Project"
                  >
                    <FaEdit /> Edit
                  </button>
                  {project.status !== "Completed" && (
                    <button
                      className="action-btn btn-complete"
                      onClick={() => handleMarkCompleted(project._id)}
                      title="Mark as Completed"
                    >
                      <FaCheckCircle /> Complete
                    </button>
                  )}
                  <button
                    className="action-btn btn-delete"
                    onClick={() => handleDeleteProject(project._id, project.projectName)}
                    title="Delete Project"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CREATE / EDIT PROJECT MODAL */}
      {showFormModal && (
        <div className="modal-overlay" onClick={() => setShowFormModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingProject ? "Edit Project" : "Add New Project"}</h2>
              <button className="modal-close" onClick={() => setShowFormModal(false)}>
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="project-form">
              <div className="form-row-2">
                <label>
                  Project Name *
                  <input
                    type="text"
                    required
                    placeholder="e.g. Commercial Office Tower"
                    value={formData.projectName}
                    onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                  />
                </label>

                <label>
                  Project Code
                  <input
                    type="text"
                    placeholder="Auto-generated if blank (e.g. PRJ-10293)"
                    value={formData.projectCode}
                    onChange={(e) => setFormData({ ...formData, projectCode: e.target.value })}
                  />
                </label>
              </div>

              <div className="form-row-2">
                <label>
                  Location
                  <input
                    type="text"
                    placeholder="City, Region or Site Address"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </label>

                <label>
                  Budget ($)
                  <input
                    type="number"
                    min="0"
                    placeholder="0.00"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  />
                </label>
              </div>

              <div className="form-row-2">
                <label>
                  Start Date
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </label>

                <label>
                  End Date
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </label>
              </div>

              <div className="form-row-2">
                <label>
                  Status
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="Planning">Planning</option>
                    <option value="In Progress">In Progress</option>
                    <option value="On Hold">On Hold</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </label>

                <label>
                  Progress (%) - [{formData.progress}%]
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={formData.progress}
                    onChange={(e) => setFormData({ ...formData, progress: e.target.value })}
                  />
                </label>
              </div>

              {/* Assignment Sections */}
              <div className="assignment-section">
                <h3>Assignments</h3>

                <label>
                  Assign Client <FaUserTie />
                  <select
                    value={formData.client}
                    onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                  >
                    <option value="">-- Select Client --</option>
                    {clientsList.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.fullName} ({c.email})
                      </option>
                    ))}
                  </select>
                </label>

                <div className="multi-assign-box">
                  <label>Assign Engineers <FaHardHat /></label>
                  <div className="checkbox-scroll-list">
                    {engineersList.length === 0 ? (
                      <p className="hint-text">No engineers registered.</p>
                    ) : (
                      engineersList.map((eng) => (
                        <label key={eng._id} className="checkbox-item">
                          <input
                            type="checkbox"
                            checked={formData.engineers.includes(eng._id)}
                            onChange={() => handleEngineerToggle(eng._id)}
                          />
                          <span>{eng.fullName} ({eng.email})</span>
                        </label>
                      ))
                    )}
                  </div>
                </div>

                <div className="multi-assign-box">
                  <label>Assign Employees <FaUsers /></label>
                  <div className="checkbox-scroll-list">
                    {employeesList.length === 0 ? (
                      <p className="hint-text">No employees registered.</p>
                    ) : (
                      employeesList.map((emp) => (
                        <label key={emp._id} className="checkbox-item">
                          <input
                            type="checkbox"
                            checked={formData.employees.includes(emp._id)}
                            onChange={() => handleEmployeeToggle(emp._id)}
                          />
                          <span>{emp.fullName} ({emp.email})</span>
                        </label>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              <label>
                Description
                <textarea
                  rows="3"
                  placeholder="Detailed project description, scope of work, specifications..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                ></textarea>
              </label>

              {/* Upload Images */}
              <div className="media-section">
                <h3>Upload Project Images <FaImage /></h3>
                <div className="media-input-row">
                  <input
                    type="text"
                    placeholder="Image URL (http://...)"
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Caption / Title"
                    value={imageNameInput}
                    onChange={(e) => setImageNameInput(e.target.value)}
                  />
                  <button type="button" onClick={handleAddImage} className="btn-add-media">
                    Add URL
                  </button>
                </div>
                <div className="file-upload-picker">
                  <span>or Upload Image File: </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, "image")}
                  />
                </div>

                {formData.images.length > 0 && (
                  <div className="media-preview-grid">
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="preview-item">
                        <img src={img.url} alt={img.name} />
                        <span>{img.name}</span>
                        <button type="button" onClick={() => handleRemoveImage(idx)}>&times;</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Upload Documents */}
              <div className="media-section">
                <h3>Upload Project Documents <FaFileAlt /></h3>
                <div className="media-input-row">
                  <input
                    type="text"
                    placeholder="Document Title (e.g. Architectural Blueprint)"
                    value={docNameInput}
                    onChange={(e) => setDocNameInput(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="File URL (http://...)"
                    value={docUrlInput}
                    onChange={(e) => setDocUrlInput(e.target.value)}
                  />
                  <button type="button" onClick={handleAddDocument} className="btn-add-media">
                    Add Doc
                  </button>
                </div>
                <div className="file-upload-picker">
                  <span>or Upload Document File: </span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
                    onChange={(e) => handleFileUpload(e, "document")}
                  />
                </div>

                {formData.documents.length > 0 && (
                  <ul className="doc-preview-list">
                    {formData.documents.map((doc, idx) => (
                      <li key={idx}>
                        <span>📄 {doc.name}</span>
                        <button type="button" onClick={() => handleRemoveDocument(idx)}>&times;</button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Modal Buttons */}
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowFormModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  {editingProject ? "Save Changes" : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW PROJECT DETAILS MODAL */}
      {showDetailsModal && viewingProject && (
        <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="project-code">{viewingProject.projectCode}</span>
                <h2>{viewingProject.projectName}</h2>
              </div>
              <button className="modal-close" onClick={() => setShowDetailsModal(false)}>
                &times;
              </button>
            </div>

            <div className="project-details-body">
              {/* Top Banner Status Bar */}
              <div className="details-banner">
                <span className={`status-badge ${getStatusBadge(viewingProject.status)}`}>
                  {viewingProject.status}
                </span>

                <div className="banner-progress">
                  <span>Progress: <strong>{viewingProject.progress}%</strong></span>
                  <div className="progress-bar-bg">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${viewingProject.progress}%` }}
                    ></div>
                  </div>
                </div>

                {viewingProject.status !== "Completed" && (
                  <button
                    className="btn-complete"
                    onClick={() => handleMarkCompleted(viewingProject._id)}
                  >
                    <FaCheckCircle /> Mark as Completed
                  </button>
                )}
              </div>

              {/* Grid Overview Info */}
              <div className="details-info-grid">
                <div className="info-box">
                  <span className="info-label"><FaDollarSign /> Budget</span>
                  <span className="info-val">${(viewingProject.budget || 0).toLocaleString()}</span>
                </div>
                <div className="info-box">
                  <span className="info-label">📍 Location</span>
                  <span className="info-val">{viewingProject.location || "N/A"}</span>
                </div>
                <div className="info-box">
                  <span className="info-label"><FaCalendarAlt /> Start Date</span>
                  <span className="info-val">
                    {viewingProject.startDate
                      ? new Date(viewingProject.startDate).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
                <div className="info-box">
                  <span className="info-label"><FaCalendarAlt /> End Date</span>
                  <span className="info-val">
                    {viewingProject.endDate
                      ? new Date(viewingProject.endDate).toLocaleDateString()
                      : "Ongoing"}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="details-section">
                <h3>Description</h3>
                <p>{viewingProject.description || "No detailed description added."}</p>
              </div>

              {/* Assigned Client & Staff */}
              <div className="details-section">
                <h3>Assigned Team & Client</h3>
                <div className="team-grid">
                  <div className="team-card">
                    <h4>Client <FaUserTie /></h4>
                    {viewingProject.client ? (
                      <div>
                        <strong>{viewingProject.client.fullName}</strong>
                        <p>{viewingProject.client.email}</p>
                        <p>{viewingProject.client.phone}</p>
                      </div>
                    ) : (
                      <p className="hint-text">No client assigned.</p>
                    )}
                  </div>

                  <div className="team-card">
                    <h4>Engineers <FaHardHat /> ({viewingProject.engineers?.length || 0})</h4>
                    {viewingProject.engineers && viewingProject.engineers.length > 0 ? (
                      <ul>
                        {viewingProject.engineers.map((eng) => (
                          <li key={eng._id}>
                            <strong>{eng.fullName}</strong> ({eng.email})
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="hint-text">No engineers assigned.</p>
                    )}
                  </div>

                  <div className="team-card">
                    <h4>Employees <FaUsers /> ({viewingProject.employees?.length || 0})</h4>
                    {viewingProject.employees && viewingProject.employees.length > 0 ? (
                      <ul>
                        {viewingProject.employees.map((emp) => (
                          <li key={emp._id}>
                            <strong>{emp.fullName}</strong> ({emp.email})
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="hint-text">No employees assigned.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Images Gallery */}
              <div className="details-section">
                <h3>Project Images <FaImage /> ({viewingProject.images?.length || 0})</h3>
                {viewingProject.images && viewingProject.images.length > 0 ? (
                  <div className="gallery-grid">
                    {viewingProject.images.map((img, idx) => (
                      <a key={idx} href={img.url} target="_blank" rel="noreferrer" className="gallery-card">
                        <img src={img.url} alt={img.name} />
                        <span>{img.name}</span>
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="hint-text">No images uploaded for this project.</p>
                )}
              </div>

              {/* Documents List */}
              <div className="details-section">
                <h3>Project Documents <FaFileAlt /> ({viewingProject.documents?.length || 0})</h3>
                {viewingProject.documents && viewingProject.documents.length > 0 ? (
                  <div className="docs-list">
                    {viewingProject.documents.map((doc, idx) => (
                      <div key={idx} className="doc-item">
                        <div>
                          <strong>📄 {doc.name}</strong>
                          <span className="doc-date">
                            Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <a href={doc.url} target="_blank" rel="noreferrer" className="btn-download">
                          Open File ↗
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="hint-text">No documents attached to this project.</p>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn-edit"
                onClick={() => {
                  setShowDetailsModal(false);
                  handleOpenEditModal(viewingProject);
                }}
              >
                <FaEdit /> Edit Project
              </button>
              <button className="btn-cancel" onClick={() => setShowDetailsModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AdminProjects;
