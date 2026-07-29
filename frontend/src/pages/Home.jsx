import Navbar from "../components/Navbar/Navbar";
import Hero from "../components/Hero/Hero";
import Features from "../components/Features/Features";
import About from "../components/About/About";
import Statistics from "../components/Statistics/Statistics";
import Services from "../components/Services/Services";
import HomeProjects from "../components/HomeProjects/HomeProjects";
import Contact from "../components/Contact/Contact";
import "./Home.css";

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <About />
      <Statistics />
      <Services />
      <HomeProjects />
      <Contact />
    </>
  );
}

export default Home;