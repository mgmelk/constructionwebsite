import { useParams, Link } from "react-router-dom";
import { services } from "../data/servicesData";
import "./ServiceDetail.css";

function ServiceDetail() {
  const { slug } = useParams();
  const service = services.find((item) => item.slug === slug);

  if (!service) {
    return (
      <div className="service-detail-page empty-state">
        <h2>Service not found</h2>
        <p>The service you are looking for does not exist.</p>
        <Link to="/" className="back-link">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="service-detail-page">
      <div className="service-detail-hero">
        <div>
          <p className="service-detail-eyebrow">OUR SERVICE</p>
          <h1>{service.heroTitle}</h1>
          <p className="service-detail-intro">{service.intro}</p>
          <Link to="/" className="back-link">
            ← Back to Home
          </Link>
        </div>
      </div>

      <div className="service-detail-content">
        <section className="detail-section">
          <h2>{service.title}</h2>
          <p>{service.intro}</p>
        </section>

        <section className="detail-section">
          <h3>Key Highlights</h3>
          <ul>
            {service.highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="detail-section">
          <h3>Why Choose Us</h3>
          <ul>
            {service.benefits.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="detail-section note-box">
          <h3>Our Commitment</h3>
          <p>{service.note}</p>
        </section>
      </div>
    </div>
  );
}

export default ServiceDetail;
