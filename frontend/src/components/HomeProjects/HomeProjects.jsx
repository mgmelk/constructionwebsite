import { useState, useEffect } from "react";
import axios from "axios";
import wholesaleImage from "../../assets/images/wholesale.png";
import softwareImage from "../../assets/images/software.jpg";
import finishingImage from "../../assets/images/finishing.jpg";
import electricImage from "../../assets/images/electric.jpg";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUserTie,
  FaEye,
  FaFileAlt,
  FaHardHat,
  FaUsers
} from "react-icons/fa";
import "./HomeProjects.css";

// Sample project card shown on the public showcase
const SAMPLE_PROJECTS = [
  {
    _id: "sample-1",
    projectName: "Construction Material Supply",
    projectCode: "PRJ-WH-104",
    status: "Completed",
    progress: 100,
    location: "Addis Ababa, Ethiopia",
    budget: 15000000,
    client: { fullName: "Castel Real Estate", email: "client@example.com" },
    description: "Construction material : Cement supply to Castel Realestate construction project",
    images: [{ url: wholesaleImage, name: "Wholesale Supply" }],
  },
  {
    _id: "sample-2",
    projectName: "Electrical Connection & Transformer Erection",
    projectCode: "PRJ-ET-205",
    status: "Completed",
    progress: 100,
    location: "Addis Ababa Riverside, Ethiopia",
    budget: 0,
    client: { fullName: "Addis Ababa Riverside Project", email: "client@example.com" },
    description: "New connection and transformer erection for Addis Ababa Riverside project",
    images: [{ url: electricImage, name: "Riverside Project" }],
  },
  {
    _id: "sample-3",
    projectName: "Digital System Integration",
    projectCode: "PRJ-SW-306",
    status: "Completed",
    progress: 100,
    location: "Addis Ababa, Ethiopia",
    budget: 0,
    client: { fullName: "Genbinet.com", email: "client@example.com" },
    description: "Genbinet.com digital system integration for construction sector stakeholders in Ethiopia",
    images: [{ url: softwareImage, name: "Software Project" }],
  },
  {
    _id: "sample-4",
    projectName: "Partition Wall Construction",
    projectCode: "PRJ-FN-407",
    status: "Completed",
    progress: 100,
    location: "Addis Ababa, Ethiopia",
    budget: 0,
    client: { fullName: "Meklit Microfinance", email: "client@example.com" },
    description: "Partition wall construction for Meklit Microfinance branch office",
    images: [{ url: finishingImage, name: "Finishing Project" }],
  },
];

function HomeProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");

  useEffect(() => {
    fetchProjects();
  }, []);

  const isExcludedProject = (project) => {
    const text = [
      project?.projectName,
      project?.name,
      project?.title,
      project?.description,
      project?.projectCode,
      project?.client?.fullName,
      project?.client?.name,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return /mg\b/i.test(text) && /(building|complex|plaza|tower|office)/i.test(text);
  };

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/projects", {
        headers: localStorage.getItem("token") ? { Authorization: `Bearer ${localStorage.getItem("token")}` } : {},
      });
      const apiProjects = Array.isArray(res.data) ? res.data : [];
      const visibleProjects = apiProjects.filter((project) => !isExcludedProject(project));

      if (visibleProjects.length > 0) {
        setProjects(SAMPLE_PROJECTS);
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
      if (trimmed.startsWith("/") || trimmed.startsWith("./") || trimmed.startsWith("../")) {
        return trimmed;
      }
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
          <span className="sub-title">Some Selected Projects</span>
          <h2>Our Featured Construction Projects</h2>
          <p>
            Explore our finished construction and construction related projects, finished sites, active developments.
          </p>
        </div>

        <div className="home-projects-tabs">
          <button
            className={`tab-btn ${activeTab === "All" ? "active" : ""}`}
            onClick={() => setActiveTab("All")}
          >
            Featured Projects ({projects.length})
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

                    {/* Meta Details */}
                    <div className="card-details-grid">
                      <span><FaMapMarkerAlt style={{ color: "#0066cc" }} /> {project.location || "Ethiopia"}</span>
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

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </section>
  );
}

export default HomeProjects;
