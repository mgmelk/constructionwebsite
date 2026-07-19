import "./About.css";
import aboutImage from "../../assets/images/hero.png";
import { FaCheckCircle } from "react-icons/fa";

function About() {
  return (
    <section className="about" id="about">

      <div className="about-image">

        <img src={aboutImage} alt="About WEMASTER" />

      </div>

      <div className="about-content">

        <span className="section-title">
          ABOUT WEMASTER
        </span>

        <h2>
          Building Excellence
        </h2>

        <p>
          WEMASTER Construction PLC delivers
          high-quality residential, commercial and
          industrial construction projects.
          Our experienced professionals combine
          innovation, quality craftsmanship and
          modern technology to build structures
          that stand the test of time.
        </p>

        <div className="about-list">

          <div>

            <FaCheckCircle className="check"/>

            Residential Construction

          </div>

          <div>

            <FaCheckCircle className="check"/>

            Commercial Construction

          </div>

          <div>

            <FaCheckCircle className="check"/>

            Industrial Construction

          </div>

          <div>

            <FaCheckCircle className="check"/>

            Professional Engineers

          </div>

          <div>

            <FaCheckCircle className="check"/>

            Quality Materials

          </div>

          <div>

            <FaCheckCircle className="check"/>

            On-Time Delivery

          </div>

        </div>

        <button>

          READ MORE

        </button>

      </div>

    </section>
  );
}

export default About;