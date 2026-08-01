import "./Statistics.css";
import {
  FaBuilding,
  FaHardHat,
  FaUsers,
  FaAward,
} from "react-icons/fa";

function Statistics() {
  return (
    <section className="statistics">

      <div className="statistics-header">

        <span>OUR ACHIEVEMENTS</span>

        <h2>Building Success Through Excellence</h2>

      </div>

      <div className="statistics-container">

        <div className="stat-card">

          <FaAward className="stat-icon" />

          <h1>10+</h1>

          <p>Partners</p>

        </div>

        <div className="stat-card">

          <FaBuilding className="stat-icon" />

          <h1>25+</h1>

          <p>Projects Completed</p>

        </div>

        <div className="stat-card">

          <FaHardHat className="stat-icon" />

          <h1>20+</h1>

          <p>Professionals and Technicians</p>

        </div>

        <div className="stat-card">

          <FaUsers className="stat-icon" />

          <h1>25+</h1>

          <p>Happy Clients</p>

        </div>

      </div>

    </section>
  );
}

export default Statistics;