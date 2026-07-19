import "./Hero.css";
import heroImage from "../../assets/images/hero.png";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <section
      className="hero"
      style={{
        backgroundImage: `url(${heroImage})`,
      }}
    >
      <div className="overlay">
        <Link to="/projects" className="projects-btn">
          OUR PROJECTS →
        </Link>
      </div>
    </section>
  );
}

export default Hero;