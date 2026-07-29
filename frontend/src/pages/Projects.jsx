import Navbar from "../components/Navbar/Navbar";
import HomeProjects from "../components/HomeProjects/HomeProjects";
import Contact from "../components/Contact/Contact";

function Projects() {
  return (
    <>
      <Navbar />
      <div style={{ paddingTop: "80px" }}>
        <HomeProjects />
      </div>
      <Contact />
    </>
  );
}

export default Projects;
