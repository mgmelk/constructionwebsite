import { useState, useEffect } from "react";
import axios from "axios";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUserTie,
  FaEye,
  FaFileAlt,
  FaCoins,
  FaHardHat,
  FaUsers
} from "react-icons/fa";
import "./HomeProjects.css";

// Fallback sample projects with guaranteed working unsplash construction images
const SAMPLE_PROJECTS = [
  {
    _id: "sample-1",
    projectName: "MG Building Commercial Complex & Plaza",
    projectCode: "PRJ-MG-8090",
    status: "Planning",
    progress: 0,
    location: "Bole Medhanealem Corridor, Addis Ababa",
    budget: 45000000,
    startDate: "2026-08-01",
    endDate: "2028-12-31",
    client: { fullName: "Abebe Kebede", email: "abebe@globaltech.com" },
    engineers: [{ fullName: "David Engineer", phone: "+251929581296" }],
    employees: [{ fullName: "Alex Employee" }],
    description: "Modern 22-story MG Building commercial complex featuring executive office suites, structural reinforced concrete framing, underground parking, and smart glass architecture.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=1000&q=80",
        name: "MG Building Exterior Facade",
      },
      {
        url: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1000&q=80",
        name: "Site Mobilization Plan",
      },
    ],
  },
  {
    _id: "sample-2",
    projectName: "Skyline Luxury Residential Complex",
    projectCode: "PRJ-8012",
    status: "Planning",
    progress: 0,
    location: "Bole Medhanealem Avenue",
    budget: 82000000,
    startDate: "2026-09-01",
    endDate: "2028-12-30",
    client: { fullName: "Tigist Alemu", email: "tigist@horizonproperties.com" },
    description: "Modern luxury residential apartments consisting of 120 units, swimming pool, rooftop garden, and eco-friendly solar integration.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1000&q=80",
        name: "Construction Progress",
      },
    ],
  },
  {
    _id: "sample-3",
    projectName: "National Highway Expansion & Bridge",
    projectCode: "PRJ-7033",
    status: "Planning",
    progress: 0,
    location: "Northern Corridor Highway",
    budget: 125000000,
    startDate: "2026-10-10",
    endDate: "2029-12-15",
    client: { fullName: "Federal Infrastructure Authority", email: "info@infra.gov.et" },
    description: "Structural concrete bridge design and 45km four-lane dual carriageway expansion designed for heavy transport load capabilities.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=1000&q=80",
        name: "Bridge Framework",
      },
    ],
  },
];

function HomeProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/projects");
      if (Array.isArray(res.data) && res.data.length > 0) {
        setProjects(res.data);
      } else {
        setProjects(SAMPLE_PROJECTS);
      }
    } catch (err) {
      console.log("Error loading projects, utilizing sample dataset:", err);
      setProjects(SAMPLE_PROJECTS);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter((p) => {
    if (activeTab === "All") return true;
    if (activeTab === "Active") return p.status === "In Progress" || p.status === "Planning";
    if (activeTab === "Finished") return p.status === "Completed";
    if (activeTab === "Planning") return p.status === "Planning";
    return true;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "Completed":
        return { text: "Finished / Completed", className: "badge-finished" };
      case "In Progress":
        return { text: "Active / In Progress", className: "badge-active" };
      case "Planning":
        return { text: "Planning Phase", className: "badge-planning" };
      case "On Hold":
        return { text: "On Hold", className: "badge-onhold" };
      default:
        return { text: status || "Active", className: "badge-active" };
    }
  };

  const getFallbackImage = (idx) => {
    const defaultImages = [
      "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=1000&q=80",
    ];
    return defaultImages[idx % defaultImages.length];
  };

  const resolveImageUrl = (imgItem, idx) => {
    if (!imgItem) return getFallbackImage(idx);
    let rawUrl = "";
    if (typeof imgItem === "string") rawUrl = imgItem;
    else if (imgItem && imgItem.url) rawUrl = imgItem.url;
    else if (imgItem && imgItem.src) rawUrl = imgItem.src;

    if (!rawUrl || typeof rawUrl !== "string" || rawUrl.trim() === "") {
      return getFallbackImage(idx);
    }

    let trimmed = rawUrl.trim();
    if (trimmed.startsWith("data:")) {
      return trimmed.replace(/[\r\n\s]+/g, "");
    }

    if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
      return `https://${trimmed}`;
    }

    return trimmed;
  };

  const getClientName = (clientData) => {
    if (!clientData) return "Client Unassigned";
    if (typeof clientData === "object") {
      return clientData.fullName || clientData.name || clientData.email || "Client Assigned";
    }
    if (typeof clientData === "string" && clientData.trim() !== "") {
      return clientData;
    }
    return "Client Unassigned";
  };

  return (
    <section className="home-projects-section" id="projects-showcase">
      <div className="home-projects-container">
        {/* Section Header */}
        <div className="home-projects-header">
          <span className="sub-title">Portfolios & Case Studies</span>
          <h2>Our Featured Construction Projects</h2>
          <p>
            Explore our finished landmarks, active site developments, structural engineering projects, and client developments.
          </p>
        </div>

        {/* Classification Filter Tabs */}
        <div className="home-projects-tabs">
          <button
            className={`tab-btn ${activeTab === "All" ? "active" : ""}`}
            onClick={() => setActiveTab("All")}
          >
            All Projects ({projects.length})
          </button>
          <button
            className={`tab-btn ${activeTab === "Active" ? "active" : ""}`}
            onClick={() => setActiveTab("Active")}
          >
            Active Projects ({projects.filter((p) => p.status === "In Progress" || p.status === "Planning").length})
          </button>
          <button
            className={`tab-btn ${activeTab === "Finished" ? "active" : ""}`}
            onClick={() => setActiveTab("Finished")}
          >
            Finished Projects ({projects.filter((p) => p.status === "Completed").length})
          </button>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
            Loading projects...
          </div>
        ) : filteredProjects.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
            No projects found in this classification.
          </div>
        ) : (
          <div className="home-projects-grid">
            {filteredProjects.map((project, idx) => {
              const statusInfo = getStatusBadge(project.status);
              const mainImg =
                project.images && project.images.length > 0
                  ? resolveImageUrl(project.images[0], idx)
                  : getFallbackImage(idx);

              return (
                <div key={project._id || idx} className="home-project-card">
                  {/* Banner Image */}
                  <div className="card-img-wrapper">
                    <img
                      src={mainImg}
                      alt={project.projectName}
                      onError={(e) => {
                        if (e.target.src && !e.target.src.startsWith("data:")) {
                          e.target.onerror = null;
                          e.target.src = getFallbackImage(idx);
                        }
                      }}
                    />
                    <span className={`card-status-badge ${statusInfo.className}`}>
                      {statusInfo.text}
                    </span>
                    <span className="card-code-tag">{project.projectCode || "PRJ-WEM"}</span>
                  </div>

                  {/* Card Content */}
                  <div className="card-body">
                    <h3 className="card-title">{project.projectName}</h3>

                    {/* Client Name Display */}
                    <div className="card-client-box">
                      <FaUserTie style={{ color: "#ff6b00" }} />
                      <span>
                        Client: <strong>{getClientName(project.client)}</strong>
                      </span>
                    </div>

                    <p className="card-desc">
                      {project.description
                        ? project.description.length > 110
                          ? project.description.substring(0, 110) + "..."
                          : project.description
                        : "High quality commercial & infrastructure building delivered by Wemaster Construction PLC."}
                    </p>

                    {/* Meta Details with ETB Birr */}
                    <div className="card-details-grid">
                      <span><FaMapMarkerAlt style={{ color: "#0066cc" }} /> {project.location || "Ethiopia"}</span>
                      <span><FaCoins style={{ color: "#16a34a" }} /> {(project.budget || 0).toLocaleString()} Birr</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="card-progress-bar">
                      <div className="bar-label">
                        <span>Construction Progress</span>
                        <span>{project.progress || 0}%</span>
                      </div>
                      <div className="bar-bg">
                        <div
                          className="bar-fill"
                          style={{ width: `${project.progress || 0}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      className="btn-view-details"
                      onClick={() => setSelectedProject(project)}
                    >
                      <FaEye /> View Full Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* PUBLIC PROJECT DETAILS MODAL */}
      {selectedProject && (
        <div className="pub-modal-backdrop" onClick={() => setSelectedProject(null)}>
          <div className="pub-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="pub-modal-header">
              <div>
                <span className="pub-code">{selectedProject.projectCode || "PRJ-001"}</span>
                <h2>{selectedProject.projectName}</h2>
              </div>
              <button
                className="pub-modal-close"
                onClick={() => setSelectedProject(null)}
              >
                &times;
              </button>
            </div>

            <div className="pub-modal-body">
              {/* Status Banner */}
              <div style={{ display: "flex", gap: "16px", alignItems: "center", marginBottom: "20px", flexWrap: "wrap" }}>
                <span className={`card-status-badge ${getStatusBadge(selectedProject.status).className}`} style={{ position: "static" }}>
                  {getStatusBadge(selectedProject.status).text}
                </span>
                <span style={{ fontSize: "14px", color: "#475569" }}>
                  Progress: <strong>{selectedProject.progress || 0}%</strong>
                </span>
              </div>

              {/* Grid Metadata */}
              <div className="card-details-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", fontSize: "14px", gap: "16px", background: "#f8fafc", padding: "18px", borderRadius: "12px", marginBottom: "24px" }}>
                <div>
                  <small style={{ display: "block", color: "#64748b" }}>Client Name</small>
                  <strong><FaUserTie style={{ color: "#ff6b00" }} /> {getClientName(selectedProject.client)}</strong>
                </div>
                <div>
                  <small style={{ display: "block", color: "#64748b" }}>Location</small>
                  <strong><FaMapMarkerAlt style={{ color: "#0066cc" }} /> {selectedProject.location || "Addis Ababa, Ethiopia"}</strong>
                </div>
                <div>
                  <small style={{ display: "block", color: "#64748b" }}>Total Budget</small>
                  <strong><FaCoins style={{ color: "#16a34a" }} /> {(selectedProject.budget || 0).toLocaleString()} ETB Birr</strong>
                </div>
                <div>
                  <small style={{ display: "block", color: "#64748b" }}>Start Date</small>
                  <strong><FaCalendarAlt /> {selectedProject.startDate ? new Date(selectedProject.startDate).toLocaleDateString() : "N/A"}</strong>
                </div>
                <div>
                  <small style={{ display: "block", color: "#64748b" }}>Completion Date</small>
                  <strong><FaCalendarAlt /> {selectedProject.endDate ? new Date(selectedProject.endDate).toLocaleDateString() : "Ongoing Project"}</strong>
                </div>
              </div>

              {/* Full Description */}
              <div style={{ marginBottom: "24px", background: "#ffffff", padding: "16px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                <h4 style={{ margin: "0 0 8px", fontSize: "16px", color: "#0f172a" }}>Project Overview & Description</h4>
                <p style={{ margin: 0, color: "#475569", lineHeight: "1.7", fontSize: "15px" }}>
                  {selectedProject.description || "High standard construction and engineering development executed by Wemaster Construction PLC with full architectural compliance and structural safety."}
                </p>
              </div>

              {/* Project Images Gallery */}
              <div style={{ marginBottom: "24px" }}>
                <h4 style={{ margin: "0 0 12px", fontSize: "16px", color: "#0f172a" }}>Project Site Photos</h4>
                <div className="pub-gallery-grid">
                  {(selectedProject.images && selectedProject.images.length > 0 ? selectedProject.images : [
                    { url: getFallbackImage(0) },
                    { url: getFallbackImage(1) }
                  ]).map((img, i) => {
                    const imgUrl = resolveImageUrl(img, i);
                    return (
                      <div key={i} className="pub-gallery-item">
                        <img
                          src={imgUrl}
                          alt={img.name || "Project site"}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = getFallbackImage(i);
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Assigned Engineers & Team if available */}
              {(selectedProject.engineers?.length > 0 || selectedProject.employees?.length > 0) && (
                <div style={{ marginBottom: "24px", background: "#f8fafc", padding: "16px", borderRadius: "12px" }}>
                  <h4 style={{ margin: "0 0 12px", fontSize: "16px", color: "#0f172a" }}>Assigned Engineering Team</h4>
                  <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                    {selectedProject.engineers?.map((eng, idx) => (
                      <div key={idx} style={{ fontSize: "14px", color: "#334155" }}>
                        <FaHardHat style={{ color: "#ff6b00" }} /> <strong>{eng.fullName || eng}</strong>
                      </div>
                    ))}
                    {selectedProject.employees?.map((emp, idx) => (
                      <div key={idx} style={{ fontSize: "14px", color: "#334155" }}>
                        <FaUsers style={{ color: "#0066cc" }} /> <strong>{emp.fullName || emp}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Project Documents if any */}
              {selectedProject.documents && selectedProject.documents.length > 0 && (
                <div>
                  <h4 style={{ margin: "0 0 12px", fontSize: "16px", color: "#0f172a" }}>Public Documents & Specifications</h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {selectedProject.documents.map((doc, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f8fafc", padding: "10px 16px", borderRadius: "8px" }}>
                        <span><FaFileAlt style={{ color: "#0066cc" }} /> {doc.name}</span>
                        <a href={doc.url} target="_blank" rel="noreferrer" style={{ color: "#ff6b00", fontWeight: "700", textDecoration: "none", fontSize: "13px" }}>
                          Open Document &rarr;
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default HomeProjects;
