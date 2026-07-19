import "./Features.css";
import {
  FaBuilding,
  FaUsers,
  FaShieldAlt,
  FaLeaf,
} from "react-icons/fa";

function Features() {
  return (
    <section className="features">

      <div className="feature">

        <FaBuilding className="feature-icon" />

        <div>

          <h3>QUALITY CONSTRUCTION</h3>

          <p>
            Delivering the highest standards in every
            project.
          </p>

        </div>

      </div>

      <div className="feature">

        <FaUsers className="feature-icon" />

        <div>

          <h3>EXPERIENCED TEAM</h3>

          <p>
            Our experts bring years of experience
            and dedication.
          </p>

        </div>

      </div>

      <div className="feature">

        <FaShieldAlt className="feature-icon" />

        <div>

          <h3>SAFETY FIRST</h3>

          <p>
            We prioritize safety in every step of
            our construction.
          </p>

        </div>

      </div>

      <div className="feature">

        <FaLeaf className="feature-icon" />

        <div>

          <h3>SUSTAINABLE SOLUTIONS</h3>

          <p>
            Building a better future with
            sustainable practices.
          </p>

        </div>

      </div>

    </section>
  );
}

export default Features;