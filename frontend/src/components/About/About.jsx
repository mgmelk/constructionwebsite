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

        <div className="about-text">
          <p>
            Wemaster Construction and Engineering PLC is a registered company under Ethiopian federal trade registration and licensing office. The company is committed to driving services in electrical and electromechanical system design, maintenance, construction materials and equipment’s wholesale, software development and interior design and finishing works. This reflects our broader aim to be a multidisciplinary engineering and construction company capable of handling complex and diverse projects.
          </p>

          <p>
            As Ethiopia continues to experience rapid urbanization, infrastructure growth, and energy demand, Wemaster is well-positioned to contribute to national development goals by delivering high-impact, reliable, and innovative construction services.
          </p>

          <p className="about-slogan"><strong>Colaborate and Construct</strong></p>
        </div>

      </div>

    </section>
  );
}

export default About;