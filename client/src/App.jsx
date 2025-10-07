import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import Skills from "./components/Skills.jsx";
import Projects from "./components/Projects.jsx";
import Contact from "./components/Contact.jsx";
import Blog from "./components/Blog.jsx";
import ScrollDots from "./components/ScrollDots.jsx";
import ParallaxBackground from "./components/ParallaxBackground.jsx";
export default function App() {
  return (
    <>
      <VisitTracker />
      <Navbar />
      <ParallaxBackground/>
      <ScrollDots />
      <main>
        <Hero />
        <Skills />
        <Projects />
        <Blog/>
        <Contact />
      </main>
    </>
  );
}

