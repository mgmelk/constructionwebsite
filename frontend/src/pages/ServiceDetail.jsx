import { useParams, Link } from "react-router-dom";
import { services } from "../data/servicesData";
import { FaCheckCircle, FaArrowRight, FaClipboardList, FaShieldAlt, FaAward } from "react-icons/fa";
import "./ServiceDetail.css";

function ServiceDetail() {
  const { slug } = useParams();
  const serviceIndex = services.findIndex((item) => item.slug === slug);
  const service = services[serviceIndex];
  const isShortOverview = serviceIndex > 0;

  if (!service) {
    return (
      <div className="service-detail-page empty-state">
        <h2>Service Not Found</h2>
        <p>The service you are looking for does not exist or has been moved.</p>
        <Link to="/" className="btn-primary">
          Home
        </Link>
      </div>
    );
  }

  return (
    <div className="service-detail-page">
      {/* Hero Header */}
      <div className="service-detail-hero">
        <div className="service-hero-container">
          <div className="service-detail-header-top">
            <Link to="/" className="btn-home-top">
              Home
            </Link>
          </div>

          <span className="service-category-badge">{service.categoryBadge || "WEMASTER SERVICES"}</span>
          <h1>{service.heroTitle || service.title}</h1>
          <p className="service-detail-intro">{service.intro}</p>

        </div>
      </div>

      {/* Main Content Area */}
      <div className="service-detail-content">
        
        {/* Overview & Main Description Paragraphs */}
        <section className="detail-section overview-section">
          <div className="section-title-wrap">
            <span className="section-subtitle"><FaClipboardList /> ABOUT THIS SERVICE</span>
          </div>
          <div className="service-paragraphs">
            {isShortOverview ? (
              <p className="service-paragraph">{service.shortDescription || service.intro}</p>
            ) : service.descriptionParagraphs ? (
              service.descriptionParagraphs.map((paragraph, idx) => (
                <p key={idx} className="service-paragraph">{paragraph}</p>
              ))
            ) : (
              <p className="service-paragraph">{service.intro}</p>
            )}
          </div>

          {service.detailImage && (
            <div className="service-detail-image">
              <img src={service.detailImage} alt={`${service.title} illustration`} />
            </div>
          )}

          {service.projectHighlight && (
            <div className="project-highlight-box">
              <h3>Project Highlight</h3>
              <p>{service.projectHighlight}</p>
            </div>
          )}
        </section>

        {/* Why Choose / Services List Section */}
        {service.whyChooseList && service.whyChooseList.length > 0 && (
          <section className="detail-section why-choose-section">
            <div className="section-title-wrap">
              <span className="section-subtitle"><FaShieldAlt /> EXCELLENCE & SERVICES</span>
              <h2>{service.serviceListTitle || "Why Choose WEMASTER Construction PLC?"}</h2>
            </div>
            <div className="why-choose-grid">
              {service.whyChooseList.map((item, idx) => (
                <div key={idx} className="why-choose-card">
                  <FaCheckCircle className="check-gold-icon" />
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Highlights Section */}
        {service.highlights && service.highlights.length > 0 && (
          <section className="detail-section">
            <div className="section-title-wrap">
              <span className="section-subtitle"><FaClipboardList /> KEY CAPABILITIES</span>
              <h2>Standards & Highlights</h2>
            </div>
            <div className="highlights-grid">
              {service.highlights.map((item, idx) => (
                <div key={idx} className="highlight-card">
                  <div className="highlight-number">0{idx + 1}</div>
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Closing Commitment Statement */}
        {service.closingText && (
          <section className="detail-section closing-statement-box">
            <div className="closing-statement-content">
              <FaAward className="closing-icon" />
              <p>{service.closingText}</p>
            </div>
          </section>
        )}

        {/* Call to Action Banner */}
        <section className="cta-banner">
          <div className="cta-content">
            <h2>Ready to Source Materials or Equip Your Project?</h2>
            <p>Get in touch with our team for competitive quotes, technical specifications, and timely delivery support.</p>
            <div className="cta-buttons">
              <Link to="/quote" className="btn-cta-primary">
                Get a Fast Quote
              </Link>
              <Link to="/contact" className="btn-cta-secondary">
                Contact Our Team
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}

export default ServiceDetail;
