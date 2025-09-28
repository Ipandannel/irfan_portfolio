import { motion } from "framer-motion";

// Quick icons via simple CDN URLs (swap to local files if you like)
const icons = {
  C: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg",
  "C++": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",
  Python: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
  Java: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
  JavaScript: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
  Dart: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg",
  Haskell: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/haskell/haskell-original.svg",
  SQL: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
  React: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  NodeJS: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
  Laravel: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-plain.svg",
  Docker: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
  Git: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg"
};

const skills = [
  "C", "C++", "Python", "Java", "JavaScript", "Dart", "Haskell", "SQL",
  "React", "NodeJS", "Laravel", "Docker", "Git"
];

export default function Skills() {
  return (
    <section id="skills" className="section">
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: .6 }}
        viewport={{ once: true }}
      >
        <h2 style={{ marginTop: 0 }}>Skills</h2>
        <p className="small">Languages, frameworks, and tools.</p>
        <div className="skills-grid" style={{ marginTop: 16 }}>
          {skills.map((s, i) => (
            <motion.div
              key={s}
              className="skill"
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              viewport={{ once: true }}
            >
              <img src={icons[s]} alt={`${s} logo`} loading="lazy" />
              <span>{s}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
