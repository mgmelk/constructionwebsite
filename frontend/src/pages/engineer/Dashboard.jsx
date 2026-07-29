import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaHardHat,
  FaProjectDiagram,
  FaTasks,
  FaClipboardList,
  FaTools,
  FaShieldAlt,
  FaBell,
  FaUserTie,
  FaFileAlt,
  FaMapMarkerAlt,
  FaComments,
  FaPaperPlane,
} from "react-icons/fa";
import "./Dashboard.css";

function EngineerDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [taskForm, setTaskForm] = useState({ title: "", description: "", priority: "Medium", status: "Pending", dueDate: "" });
  const [reportForm, setReportForm] = useState({ summary: "", activities: "", materials: "", issues: "", photos: "" });
  const [materialForm, setMaterialForm] = useState({ itemName: "", quantity: 1, unit: "pcs", priority: "Medium", notes: "" });
  const [inspectionForm, setInspectionForm] = useState({ title: "", checklist: "", result: "Pass" });
  const [safetyForm, setSafetyForm] = useState({ hazard: "", severity: "Medium", status: "Open", actionTaken: "" });
  const [documentForm, setDocumentForm] = useState({ title: "", fileUrl: "", category: "General" });
  const [equipmentForm, setEquipmentForm] = useState({ name: "", status: "Available", location: "Site" });
  const [notificationForm, setNotificationForm] = useState({ title: "", message: "", type: "Info" });
  const [profileForm, setProfileForm] = useState({ fullName: "", phone: "" });
  const [messages, setMessages] = useState([]);
  const [messageForm, setMessageForm] = useState({ subject: "", body: "", recipientName: "", projectName: "" });
  const [replyInputs, setReplyInputs] = useState({});
  const [sendingMessage, setSendingMessage] = useState(false);
  const [replyingId, setReplyingId] = useState(null);
  const [taskStatusMap, setTaskStatusMap] = useState({});
  const [taskCommentInputs, setTaskCommentInputs] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const loadDashboard = async () => {
      try {
        const response = await axios.get("/api/engineers/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDashboardData(response.data);
        setProfileForm({
          fullName: response.data.profile?.fullName || "",
          phone: response.data.profile?.phone || "",
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    const loadMessages = async () => {
      try {
        const response = await axios.get("/api/messages", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(response.data?.messages || []);
      } catch (error) {
        console.error(error);
      }
    };

    loadDashboard();
    loadMessages();
  }, [navigate]);

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("/api/engineers/tasks", taskForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTaskForm({ title: "", description: "", priority: "Medium", status: "Pending", dueDate: "" });
      const response = await axios.get("/api/engineers/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDashboardData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("/api/engineers/daily-reports", {
        ...reportForm,
        activities: reportForm.activities.split("\n").filter(Boolean),
        materials: reportForm.materials.split("\n").filter(Boolean),
        issues: reportForm.issues.split("\n").filter(Boolean),
        photos: reportForm.photos.split("\n").filter(Boolean),
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReportForm({ summary: "", activities: "", materials: "", issues: "", photos: "" });
      const response = await axios.get("/api/engineers/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDashboardData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleMaterialSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("/api/engineers/material-requests", materialForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMaterialForm({ itemName: "", quantity: 1, unit: "pcs", priority: "Medium", notes: "" });
      const response = await axios.get("/api/engineers/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDashboardData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleInspectionSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("/api/engineers/inspections", {
        ...inspectionForm,
        checklist: inspectionForm.checklist.split("\n").filter(Boolean),
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInspectionForm({ title: "", checklist: "", result: "Pass" });
      const response = await axios.get("/api/engineers/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDashboardData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSafetySubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("/api/engineers/safety-reports", safetyForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSafetyForm({ hazard: "", severity: "Medium", status: "Open", actionTaken: "" });
      const response = await axios.get("/api/engineers/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDashboardData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDocumentSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("/api/engineers/documents", documentForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDocumentForm({ title: "", fileUrl: "", category: "General" });
      const response = await axios.get("/api/engineers/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDashboardData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEquipmentSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("/api/engineers/equipment", equipmentForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEquipmentForm({ name: "", status: "Available", location: "Site" });
      const response = await axios.get("/api/engineers/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDashboardData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleNotificationSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("/api/engineers/notifications", notificationForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotificationForm({ title: "", message: "", type: "Info" });
      const response = await axios.get("/api/engineers/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDashboardData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put("/api/engineers/profile", profileForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const response = await axios.get("/api/engineers/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDashboardData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleTaskUpdate = async (e, taskId) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const existingTask = dashboardData?.tasks?.find((task) => task._id === taskId);
    const nextStatus = taskStatusMap[taskId] || existingTask?.status || "Pending";
    const commentText = (taskCommentInputs[taskId] || "").trim();

    try {
      const nextComments = commentText
        ? [
            ...(existingTask?.comments || []),
            {
              text: commentText,
              author: dashboardData?.profile?.fullName || "Engineer",
              createdAt: new Date().toISOString(),
            },
          ]
        : existingTask?.comments || [];

      await axios.put(`/api/engineers/tasks/${taskId}`, {
        status: nextStatus,
        comments: nextComments,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const response = await axios.get("/api/engineers/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDashboardData(response.data);
      setTaskCommentInputs((prev) => ({ ...prev, [taskId]: "" }));
    } catch (error) {
      console.error(error);
    }
  };

  const handleMessageSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      setSendingMessage(true);
      await axios.post("/api/messages", {
        subject: messageForm.subject.trim(),
        body: messageForm.body.trim(),
        recipientName: messageForm.recipientName.trim() || "Client",
        projectName: messageForm.projectName.trim() || dashboardData?.projects?.[0]?.projectName || "Building Project",
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessageForm({ subject: "", body: "", recipientName: "", projectName: "" });
      const response = await axios.get("/api/messages", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(response.data?.messages || []);
    } catch (error) {
      console.error(error);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleReplySubmit = async (e, threadId) => {
    e.preventDefault();
    const replyText = (replyInputs[threadId] || "").trim();
    if (!replyText) return;

    try {
      const token = localStorage.getItem("token");
      setReplyingId(threadId);
      await axios.post(`/api/messages/${threadId}/reply`, { body: replyText }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReplyInputs((prev) => ({ ...prev, [threadId]: "" }));
      const response = await axios.get("/api/messages", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(response.data?.messages || []);
    } catch (error) {
      console.error(error);
    } finally {
      setReplyingId(null);
    }
  };

  return (
    <div className="engineer-dashboard-shell">
      <aside className="engineer-sidebar">
        <div className="engineer-brand">
          <FaHardHat />
          <div>
            <h2>Engineer Portal</h2>
            <p>Site Operations</p>
          </div>
        </div>

        <nav className="engineer-nav">
          <a href="#overview">Overview</a>
          <a href="#projects">Projects</a>
          <a href="#tasks">Tasks</a>
          <a href="#reports">Reports</a>
          <a href="#safety">Safety</a>
        </nav>

        <div className="engineer-sidebar-card">
          <h4>Today’s focus</h4>
          <p>Review site updates, close pending tasks, and confirm safety actions.</p>
        </div>
      </aside>

      <main className="engineer-main">
        <header className="engineer-topbar">
          <div>
            <p className="engineer-eyebrow">Construction Management System</p>
            <h1>Engineer Dashboard</h1>
            <p>Welcome back, {dashboardData?.profile?.fullName || "Engineer"}.</p>
          </div>
          <div className="engineer-topbar-actions">
            <div className="engineer-pill"><FaBell /> Alerts</div>
            <div className="engineer-pill"><FaUserTie /> {dashboardData?.profile?.role || "Engineer"}</div>
          </div>
        </header>

        {loading ? <p className="engineer-loading">Loading dashboard...</p> : null}

        {dashboardData ? (
          <>
            <section id="overview" className="engineer-summary-grid">
              <div className="engineer-stat-card">
                <div className="engineer-stat-icon"><FaProjectDiagram /></div>
                <div>
                  <strong>{dashboardData.stats?.totalProjects ?? 0}</strong>
                  <span>Assigned projects</span>
                </div>
              </div>
              <div className="engineer-stat-card">
                <div className="engineer-stat-icon"><FaClipboardList /></div>
                <div>
                  <strong>{dashboardData.stats?.activeProjects ?? 0}</strong>
                  <span>Active sites</span>
                </div>
              </div>
              <div className="engineer-stat-card">
                <div className="engineer-stat-icon"><FaTasks /></div>
                <div>
                  <strong>{dashboardData.stats?.pendingTasks ?? 0}</strong>
                  <span>Open tasks</span>
                </div>
              </div>
              <div className="engineer-stat-card">
                <div className="engineer-stat-icon"><FaTools /></div>
                <div>
                  <strong>{dashboardData.stats?.completedProjects ?? 0}</strong>
                  <span>Completed</span>
                </div>
              </div>
            </section>

            <section className="engineer-card">
              <div className="engineer-section-head">
                <div>
                  <h3>Profile Overview</h3>
                  <p>Keep your contact details current.</p>
                </div>
              </div>
              <form className="engineer-form-grid" onSubmit={handleProfileSubmit}>
                <input placeholder="Full name" value={profileForm.fullName} onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })} required />
                <input placeholder="Phone" value={profileForm.phone} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} />
                <div className="engineer-actions" style={{ gridColumn: "1 / -1" }}>
                  <button className="engineer-btn secondary" type="submit">Update Profile</button>
                </div>
              </form>
              <div className="engineer-info-grid">
                <div><strong>Name</strong><span>{dashboardData.profile?.fullName || "Engineer"}</span></div>
                <div><strong>Email</strong><span>{dashboardData.profile?.email || "-"}</span></div>
                <div><strong>Phone</strong><span>{dashboardData.profile?.phone || "-"}</span></div>
              </div>
            </section>

            <section id="projects" className="engineer-grid-2">
              <div className="engineer-card">
                <div className="engineer-section-head">
                  <div>
                    <h3>Assigned Projects</h3>
                    <p>Track active construction milestones.</p>
                  </div>
                </div>
                <div className="engineer-list">
                  {dashboardData.projects?.length ? dashboardData.projects.map((project) => (
                    <div key={project._id} className="engineer-list-item">
                      <strong>{project.projectName}</strong>
                      <div>Code: {project.projectCode}</div>
                      <div>Status: {project.status} | Progress: {project.progress}%</div>
                      <div><FaMapMarkerAlt /> {project.location || "-"}</div>
                    </div>
                  )) : <div className="engineer-list-item">No assigned projects yet.</div>}
                </div>
              </div>

              <div id="tasks" className="engineer-card">
                <div className="engineer-section-head">
                  <div>
                    <h3>Task Management</h3>
                    <p>Create and update engineering tasks.</p>
                  </div>
                </div>
                <form className="engineer-form-grid" onSubmit={handleTaskSubmit}>
                  <input placeholder="Task title" value={taskForm.title} onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })} required />
                  <select value={taskForm.priority} onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}>
                    <option>Low</option><option>Medium</option><option>High</option><option>Critical</option>
                  </select>
                  <input type="date" value={taskForm.dueDate} onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })} />
                  <select value={taskForm.status} onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value })}>
                    <option>Pending</option><option>In Progress</option><option>Review</option><option>Completed</option>
                  </select>
                  <textarea placeholder="Task description" value={taskForm.description} onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })} style={{ gridColumn: "1 / -1" }} />
                  <div className="engineer-actions" style={{ gridColumn: "1 / -1" }}>
                    <button className="engineer-btn" type="submit">Add Task</button>
                  </div>
                </form>
                <div className="engineer-list" style={{ marginTop: 12 }}>
                  {dashboardData.tasks?.length ? dashboardData.tasks.map((task) => (
                    <div key={task._id} className="engineer-list-item engineer-task-card">
                      <div className="engineer-task-title-row">
                        <strong>{task.title}</strong>
                        <span className="engineer-task-priority">{task.priority}</span>
                      </div>
                      <div>{task.description}</div>
                      <div className="engineer-task-meta">Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "-"} | Status: {task.status}</div>
                      <form className="engineer-task-update-form" onSubmit={(e) => handleTaskUpdate(e, task._id)}>
                        <select value={taskStatusMap[task._id] || task.status} onChange={(e) => setTaskStatusMap({ ...taskStatusMap, [task._id]: e.target.value })}>
                          <option>Pending</option><option>In Progress</option><option>Review</option><option>Completed</option>
                        </select>
                        <input placeholder="Add comment" value={taskCommentInputs[task._id] || ""} onChange={(e) => setTaskCommentInputs({ ...taskCommentInputs, [task._id]: e.target.value })} />
                        <button className="engineer-btn secondary" type="submit">Save</button>
                      </form>
                      {task.comments?.length ? (
                        <div className="engineer-task-comments">
                          {task.comments.map((comment, index) => (
                            <div key={`${task._id}-${index}`} className="engineer-task-comment">
                              <strong>{comment.author}</strong>
                              <span>{new Date(comment.createdAt).toLocaleString()}</span>
                              <p>{comment.text}</p>
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  )) : <div className="engineer-list-item">No tasks yet.</div>}
                </div>
              </div>
            </section>

            <section className="engineer-card">
              <div className="engineer-section-head">
                <div>
                  <h3>Project Progress Overview</h3>
                  <p>Track assigned work packages and milestones.</p>
                </div>
              </div>
              <div className="engineer-progress-list">
                {dashboardData.projects?.length ? dashboardData.projects.map((project) => (
                  <div key={project._id} className="engineer-progress-item">
                    <div className="engineer-progress-header">
                      <strong>{project.projectName}</strong>
                      <span>{project.progress || 0}%</span>
                    </div>
                    <div className="engineer-progress-bar">
                      <div style={{ width: `${project.progress || 0}%` }} />
                    </div>
                    <div className="engineer-progress-meta">
                      <span>Status: {project.status}</span>
                      <span>Team: {(project.employees || []).length + (project.engineers || []).length} members</span>
                      <span>Docs: {(project.documents || []).length}</span>
                    </div>
                  </div>
                )) : <div className="engineer-list-item">No project progress available yet.</div>}
              </div>
            </section>

            <section id="reports" className="engineer-grid-2">
              <div className="engineer-card">
                <div className="engineer-section-head">
                  <div>
                    <h3>Daily Site Reports</h3>
                    <p>Capture site progress and issues.</p>
                  </div>
                </div>
                <form className="engineer-form-grid" onSubmit={handleReportSubmit}>
                  <textarea placeholder="Site summary" value={reportForm.summary} onChange={(e) => setReportForm({ ...reportForm, summary: e.target.value })} required style={{ gridColumn: "1 / -1" }} />
                  <textarea placeholder="Activities (one per line)" value={reportForm.activities} onChange={(e) => setReportForm({ ...reportForm, activities: e.target.value })} />
                  <textarea placeholder="Materials used (one per line)" value={reportForm.materials} onChange={(e) => setReportForm({ ...reportForm, materials: e.target.value })} />
                  <textarea placeholder="Issues encountered (one per line)" value={reportForm.issues} onChange={(e) => setReportForm({ ...reportForm, issues: e.target.value })} />
                  <textarea placeholder="Photo URLs (one per line)" value={reportForm.photos} onChange={(e) => setReportForm({ ...reportForm, photos: e.target.value })} style={{ gridColumn: "1 / -1" }} />
                  <div className="engineer-actions" style={{ gridColumn: "1 / -1" }}>
                    <button className="engineer-btn" type="submit">Submit Report</button>
                  </div>
                </form>
                <div className="engineer-list" style={{ marginTop: 12 }}>
                  {dashboardData.dailyReports?.length ? dashboardData.dailyReports.map((report) => (
                    <div key={report._id} className="engineer-list-item">
                      <strong>{report.summary}</strong>
                      <div>{report.activities?.join(", ") || "No activities recorded"}</div>
                    </div>
                  )) : <div className="engineer-list-item">No reports yet.</div>}
                </div>
              </div>

              <div className="engineer-card">
                <div className="engineer-section-head">
                  <div>
                    <h3>Material Requests</h3>
                    <p>Track materials needed on site.</p>
                  </div>
                </div>
                <form className="engineer-form-grid" onSubmit={handleMaterialSubmit}>
                  <input placeholder="Item name" value={materialForm.itemName} onChange={(e) => setMaterialForm({ ...materialForm, itemName: e.target.value })} required />
                  <input type="number" min="1" value={materialForm.quantity} onChange={(e) => setMaterialForm({ ...materialForm, quantity: e.target.value })} />
                  <input placeholder="Unit" value={materialForm.unit} onChange={(e) => setMaterialForm({ ...materialForm, unit: e.target.value })} />
                  <select value={materialForm.priority} onChange={(e) => setMaterialForm({ ...materialForm, priority: e.target.value })}>
                    <option>Low</option><option>Medium</option><option>High</option>
                  </select>
                  <textarea placeholder="Notes" value={materialForm.notes} onChange={(e) => setMaterialForm({ ...materialForm, notes: e.target.value })} style={{ gridColumn: "1 / -1" }} />
                  <div className="engineer-actions" style={{ gridColumn: "1 / -1" }}>
                    <button className="engineer-btn secondary" type="submit">Request Materials</button>
                  </div>
                </form>
                <div className="engineer-list" style={{ marginTop: 12 }}>
                  {dashboardData.materialRequests?.length ? dashboardData.materialRequests.map((request) => (
                    <div key={request._id} className="engineer-list-item">
                      <strong>{request.itemName}</strong>
                      <div>Qty: {request.quantity} {request.unit} | Priority: {request.priority} | Status: {request.status}</div>
                    </div>
                  )) : <div className="engineer-list-item">No material requests yet.</div>}
                </div>
              </div>
            </section>

            <section id="safety" className="engineer-grid-2">
              <div className="engineer-card">
                <div className="engineer-section-head">
                  <div>
                    <h3>Quality Inspections</h3>
                    <p>Log and review inspection results.</p>
                  </div>
                </div>
                <form className="engineer-form-grid" onSubmit={handleInspectionSubmit}>
                  <input placeholder="Inspection title" value={inspectionForm.title} onChange={(e) => setInspectionForm({ ...inspectionForm, title: e.target.value })} required />
                  <select value={inspectionForm.result} onChange={(e) => setInspectionForm({ ...inspectionForm, result: e.target.value })}>
                    <option>Pass</option><option>Needs Attention</option><option>Fail</option>
                  </select>
                  <textarea placeholder="Checklist items (one per line)" value={inspectionForm.checklist} onChange={(e) => setInspectionForm({ ...inspectionForm, checklist: e.target.value })} style={{ gridColumn: "1 / -1" }} />
                  <div className="engineer-actions" style={{ gridColumn: "1 / -1" }}>
                    <button className="engineer-btn secondary" type="submit">Save Inspection</button>
                  </div>
                </form>
                <div className="engineer-list" style={{ marginTop: 12 }}>
                  {dashboardData.inspections?.length ? dashboardData.inspections.map((inspection) => (
                    <div key={inspection._id} className="engineer-list-item">
                      <strong>{inspection.title}</strong>
                      <div>Result: {inspection.result}</div>
                    </div>
                  )) : <div className="engineer-list-item">No inspections yet.</div>}
                </div>
              </div>

              <div className="engineer-card">
                <div className="engineer-section-head">
                  <div>
                    <h3>Safety & Hazard Tracking</h3>
                    <p>Report and monitor site safety issues.</p>
                  </div>
                </div>
                <form className="engineer-form-grid" onSubmit={handleSafetySubmit}>
                  <input placeholder="Hazard" value={safetyForm.hazard} onChange={(e) => setSafetyForm({ ...safetyForm, hazard: e.target.value })} required />
                  <select value={safetyForm.severity} onChange={(e) => setSafetyForm({ ...safetyForm, severity: e.target.value })}>
                    <option>Low</option><option>Medium</option><option>High</option><option>Critical</option>
                  </select>
                  <textarea placeholder="Action taken" value={safetyForm.actionTaken} onChange={(e) => setSafetyForm({ ...safetyForm, actionTaken: e.target.value })} style={{ gridColumn: "1 / -1" }} />
                  <div className="engineer-actions" style={{ gridColumn: "1 / -1" }}>
                    <button className="engineer-btn secondary" type="submit">Report Safety Issue</button>
                  </div>
                </form>
                <div className="engineer-list" style={{ marginTop: 12 }}>
                  {dashboardData.safetyReports?.length ? dashboardData.safetyReports.map((report) => (
                    <div key={report._id} className="engineer-list-item">
                      <strong>{report.hazard}</strong>
                      <div>Severity: {report.severity} | Status: {report.status}</div>
                    </div>
                  )) : <div className="engineer-list-item">No safety reports yet.</div>}
                </div>
              </div>
            </section>

            <section className="engineer-grid-2">
              <div className="engineer-card">
                <div className="engineer-section-head">
                  <div>
                    <h3>Documents & Drawings</h3>
                    <p>Upload project drawings and documents.</p>
                  </div>
                </div>
                <form className="engineer-form-grid" onSubmit={handleDocumentSubmit}>
                  <input placeholder="Document title" value={documentForm.title} onChange={(e) => setDocumentForm({ ...documentForm, title: e.target.value })} required />
                  <input placeholder="File URL" value={documentForm.fileUrl} onChange={(e) => setDocumentForm({ ...documentForm, fileUrl: e.target.value })} required />
                  <input placeholder="Category" value={documentForm.category} onChange={(e) => setDocumentForm({ ...documentForm, category: e.target.value })} />
                  <div className="engineer-actions" style={{ gridColumn: "1 / -1" }}>
                    <button className="engineer-btn secondary" type="submit">Upload Document</button>
                  </div>
                </form>
                <div className="engineer-list" style={{ marginTop: 12 }}>
                  {dashboardData.documents?.length ? dashboardData.documents.map((doc) => (
                    <div key={doc._id} className="engineer-list-item">
                      <strong>{doc.title}</strong>
                      <div>Category: {doc.category} | <a href={doc.fileUrl} target="_blank" rel="noreferrer">Open</a> | <a href={doc.fileUrl} target="_blank" rel="noreferrer" download>Download</a></div>
                    </div>
                  )) : <div className="engineer-list-item">No documents uploaded yet.</div>}
                </div>
              </div>

              <div className="engineer-card">
                <div className="engineer-section-head">
                  <div>
                    <h3>Equipment Tracking</h3>
                    <p>Monitor status and location of site equipment.</p>
                  </div>
                </div>
                <form className="engineer-form-grid" onSubmit={handleEquipmentSubmit}>
                  <input placeholder="Equipment name" value={equipmentForm.name} onChange={(e) => setEquipmentForm({ ...equipmentForm, name: e.target.value })} required />
                  <select value={equipmentForm.status} onChange={(e) => setEquipmentForm({ ...equipmentForm, status: e.target.value })}>
                    <option>Available</option><option>In Use</option><option>Maintenance</option><option>Offline</option>
                  </select>
                  <input placeholder="Location" value={equipmentForm.location} onChange={(e) => setEquipmentForm({ ...equipmentForm, location: e.target.value })} />
                  <div className="engineer-actions" style={{ gridColumn: "1 / -1" }}>
                    <button className="engineer-btn secondary" type="submit">Add Equipment</button>
                  </div>
                </form>
                <div className="engineer-list" style={{ marginTop: 12 }}>
                  {dashboardData.equipment?.length ? dashboardData.equipment.map((item) => (
                    <div key={item._id} className="engineer-list-item">
                      <strong>{item.name}</strong>
                      <div>Status: {item.status} | Location: {item.location}</div>
                    </div>
                  )) : <div className="engineer-list-item">No equipment registered yet.</div>}
                </div>
              </div>
            </section>

            <section className="engineer-card">
              <div className="engineer-section-head">
                <div>
                  <h3>Client Communication</h3>
                  <p>Discuss issues, progress, and building updates with clients.</p>
                </div>
              </div>

              <form className="engineer-form-grid engineer-message-form" onSubmit={handleMessageSubmit}>
                <input placeholder="Project or building name" value={messageForm.projectName} onChange={(e) => setMessageForm({ ...messageForm, projectName: e.target.value })} />
                <input placeholder="Client name" value={messageForm.recipientName} onChange={(e) => setMessageForm({ ...messageForm, recipientName: e.target.value })} />
                <input placeholder="Subject" value={messageForm.subject} onChange={(e) => setMessageForm({ ...messageForm, subject: e.target.value })} required />
                <textarea placeholder="Describe the issue, progress update, or question for the client..." value={messageForm.body} onChange={(e) => setMessageForm({ ...messageForm, body: e.target.value })} required style={{ gridColumn: "1 / -1" }} />
                <div className="engineer-actions" style={{ gridColumn: "1 / -1" }}>
                  <button className="engineer-btn" type="submit" disabled={sendingMessage}>
                    <FaPaperPlane /> {sendingMessage ? "Sending..." : "Send message"}
                  </button>
                </div>
              </form>

              <div className="engineer-message-thread-list">
                {messages.length ? messages.map((thread) => (
                  <div key={thread._id} className="engineer-message-thread">
                    <div className="engineer-thread-head">
                      <div>
                        <p className="engineer-thread-badge">{thread.projectName || "Building Project"}</p>
                        <h4>{thread.subject}</h4>
                        <p className="engineer-thread-meta">{thread.senderName || "Client"} → {thread.recipientName || "Team"}</p>
                      </div>
                      <span className={`engineer-thread-status ${thread.status?.toLowerCase() || "open"}`}>{thread.status || "Open"}</span>
                    </div>
                    <p className="engineer-thread-body">{thread.body}</p>
                    {thread.replies?.length ? (
                      <div className="engineer-reply-stack">
                        {thread.replies.map((reply, index) => (
                          <div key={`${thread._id}-${index}`} className="engineer-reply-item">
                            <strong>{reply.senderName}</strong>
                            <span>{reply.senderRole || "team"}</span>
                            <p>{reply.body}</p>
                          </div>
                        ))}
                      </div>
                    ) : null}
                    <form className="engineer-reply-form" onSubmit={(e) => handleReplySubmit(e, thread._id)}>
                      <input placeholder="Reply to this client conversation..." value={replyInputs[thread._id] || ""} onChange={(e) => setReplyInputs({ ...replyInputs, [thread._id]: e.target.value })} />
                      <button type="submit" disabled={replyingId === thread._id}>
                        {replyingId === thread._id ? "Replying..." : "Reply"}
                      </button>
                    </form>
                  </div>
                )) : <div className="engineer-list-item">No client conversations yet.</div>}
              </div>
            </section>

            <section className="engineer-card">
              <div className="engineer-section-head">
                <div>
                  <h3>Notifications & Communication</h3>
                  <p>Send daily updates and site notes.</p>
                </div>
              </div>
              <form className="engineer-form-grid" onSubmit={handleNotificationSubmit}>
                <input placeholder="Title" value={notificationForm.title} onChange={(e) => setNotificationForm({ ...notificationForm, title: e.target.value })} required />
                <select value={notificationForm.type} onChange={(e) => setNotificationForm({ ...notificationForm, type: e.target.value })}>
                  <option>Info</option><option>Warning</option><option>Success</option><option>Critical</option>
                </select>
                <textarea placeholder="Message" value={notificationForm.message} onChange={(e) => setNotificationForm({ ...notificationForm, message: e.target.value })} style={{ gridColumn: "1 / -1" }} required />
                <div className="engineer-actions" style={{ gridColumn: "1 / -1" }}>
                  <button className="engineer-btn secondary" type="submit">Send Update</button>
                </div>
              </form>
              <div className="engineer-list" style={{ marginTop: 12 }}>
                {dashboardData.notifications?.length ? dashboardData.notifications.map((note) => (
                  <div key={note._id} className="engineer-list-item">
                    <strong>{note.title}</strong>
                    <div>{note.message}</div>
                  </div>
                )) : <div className="engineer-list-item">No notifications yet.</div>}
              </div>
            </section>
          </>
        ) : null}
      </main>
    </div>
  );
}

export default EngineerDashboard;
