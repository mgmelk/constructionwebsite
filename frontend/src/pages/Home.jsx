import Navbar from "../components/Navbar/Navbar";
import AuthBar from "../components/AuthBar/AuthBar";
import Hero from "../components/Hero/Hero";
import Features from "../components/Features/Features";
import About from "../components/About/About";
import Statistics from "../components/Statistics/Statistics";
import Services from "../components/Services/Services";
import Contact from "../components/Contact/Contact";
import "./Home.css";

function Home() {
  return (
    <>
      <div className="top-auth-strip">
        <AuthBar />
      </div>
      <Navbar />
      <Hero />
      <Features />
      <About />
      <Statistics />
      <Services />
      <Contact />
    </>
  );
}

export default Home;