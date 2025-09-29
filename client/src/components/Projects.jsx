import { motion } from "framer-motion";

function ProjectCard({ project }) {
  const { title, tagline, img, tech, repo, live } = project;
  return (
    <motion.article
      className="proj-card"
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.45 }}
    >
      {/* Image */}
      <a href={live || repo} target="_blank" rel="noreferrer" className="proj-media">
        <img src={img} alt={`${title} preview`} loading="lazy" />
      </a>

      {/* Body */}
      <div className="proj-body">
        <h3 className="proj-title">{title}</h3>
        <p className="proj-tagline">{tagline}</p>

        <div className="proj-tags">
          {tech.map((t) => (
            <span className="badge" key={t}>{t}</span>
          ))}
        </div>

        <div className="proj-actions">
          {live && (
            <a className="btn" href={live} target="_blank" rel="noreferrer">Live</a>
          )}
          {repo && (
            <a className="btn ghost" href={repo} target="_blank" rel="noreferrer">Code (GitHub)</a>
          )}
        </div>
      </div>
    </motion.article>
  );
}

const projects = [
  {
    title: "Rehearse AI — NLP + Emotion Feedback",
    tagline:
      "Mobile prototype that guides pacing and affect using local ML (CREMA-D). Focus: coaching feedback & clear UX.",
    img: "/rehearseai.jpeg",     
    tech: ["Flutter", "TensorFlow Lite", "Python", "Librosa"],
    repo: "Stay Tuned!",   // <— GitHub URL
    live: null                                             // <— add demo URL if you have one
  },
  {
    title: "Predictive Film Selection & Analytics",
    tagline:
      "Dockerized Flask + React pipeline with SQL analytics to ingest, score, and rank films. Built for quick insights.",
    img: "/film-analytics.jpeg",       // <— put your image here
    tech: ["Docker", "Flask", "React", "PostgreSQL"],
    repo: "https://github.com/Ipandannel/predictive_film", // <— GitHub URL
    live: null
  },
  {
    title: "Poisson Image Editing",
    tagline:
      "Gradient-domain ‘seamless cloning’ (C++/Python). Paste objects into new scenes while preserving local gradients.",
    img: "/poisson.jpeg",              // <— put your image here
    tech: ["C++", "Python", "OpenCV"],
    repo: "https://github.com/Ipandannel/poisson_image_editing.git", // <— GitHub URL
    live: null
  }
];

export default function Projects() {
  return (
    <section id="projects" className="section">
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 style={{ marginTop: 0 }}>Projects</h2>

        <div className="proj-grid">
          {projects.map((p) => (
            <ProjectCard key={p.title} project={p} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}




