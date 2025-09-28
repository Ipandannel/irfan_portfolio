import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section id="about" className="section">
      <motion.div
        className="card hero-grid"
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        {/* Left side — text */}
        <div className="hero-text">
          <motion.h1
            className="heroTitle"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            Hi, I’m <span style={{ color: "var(--brand)" }}>Irfan Danial</span>,<br/>
            aspiring Software Engineer.
          </motion.h1>

          <p className="heroSubtitle">
            Full-stack developer who enjoys turning ideas into clean, scalable software.
          </p>

          <motion.p
            className="motto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Code that lasts, just like the miles I run.
          </motion.p>
        </div> {/* ✅ Close hero-text div */}

        {/* Right side — image */}
        <motion.div
          className="hero-img"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <img src="/irfan.jpg" alt="Irfan Danial" />
        </motion.div>
      </motion.div>
    </section>
  );
}
