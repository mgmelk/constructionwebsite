import "./Contact.css";

function Contact() {
  return (
    <section className="contact-page" id="contact">
      <div className="contact-inner">
        <p className="contact-label">Contact</p>
        <p>
          Reach us for construction materials, electrical works, software services,
          and building design.
        </p>
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
