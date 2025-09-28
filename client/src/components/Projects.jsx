import { motion } from "framer-motion";

export default function Projects() {
  return (
    <section id="projects" className="section">
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: .6 }}
        viewport={{ once: true }}
      >
        <h2 style={{ marginTop: 0 }}>Projects</h2>

        {/* Example placeholder */}
        <div className="skills-grid" style={{ marginTop: 16 }}>
          <div className="skill"><span>RehearseAI — NLP + Emotion Feedback</span></div>
          <div className="skill"><span>Predictive Film Selection (Docker, Flask/React)</span></div>
          <div className="skill"><span>Poisson Image Editing (C++/Python)</span></div>
        </div>
      </motion.div>
    </section>
  );
}
