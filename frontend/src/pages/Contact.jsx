import React from "react";
import { Link } from "react-router-dom";
import "../components/Contact/Contact.css";

function Contact() {
  return (
    <section className="contact-page">
      <div className="contact-inner">
        <div className="contact-top-actions">
          <Link to="/" className="btn-home-contact">
            Home
          </Link>
        </div>
        <p>Reach us for construction materials, electrical works, software services, and building design.</p>
        <div className="contact-details">
          <div>
            <strong>Phone</strong>
            <p>+251 913 922 193</p>
            <p>+251 924 594 602</p>
          </div>
          <div>
            <strong>Email</strong>
            <p>wemasterconstruction@gmail.com</p>
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
