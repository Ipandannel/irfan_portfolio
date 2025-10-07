import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Blog() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section id="blog" className="section">
      <motion.div
        className="card blog-grid"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        {/* LEFT: text */}
        <div className="blog-text">
          <h2 style={{ marginTop: 0 }}>From 5K Struggles to Marathon Miles — and Better Code</h2>
          <p className="small" style={{ marginTop: 6 }}>
            How distance running reshaped my discipline, resilience, and the way I engineer software.
          </p>

          {/* Teaser always visible */}
          <p style={{ marginTop: 12 }}>
            Something happened that made me feel stuck, unfocused, and
            honestly not myself. I laced up, started to run to clear my head and could barely get through 5 km.
            But every run taught me the same lesson: progress isn’t loud; it’s consistent. Step by step,
            I moved from 5Ks to a full marathon in <b>Melaka</b>, and later <b>Manchester</b>.
          </p>

          {/* Collapsible "Read more" */}
          <AnimatePresence initial={false}>
            {expanded && (
              <motion.div
                key="more"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4 }}
                style={{ overflow: "hidden" }}
              >
                <p>
                  Running changed how I work. Marathon training is basically an agile roadmap:
                  set a realistic plan, show up, iterate, recover, and keep moving. Do it even though you're tired, 
                  do it unmotivated, do it sad, do it for a better version of you. The same mindset
                  drives my engineering: ship small, measure, learn, and scale. Long runs taught me to
                  love the boring parts, the quiet repetition that turns weaknesses into strengths.
                </p>
                <p>
                  That discipline shows up in my code. I care about clean interfaces, well-named
                  abstractions, and repeatable pipelines. When something breaks (and it will),
                  I don’t panic — I debug like I breathe on mile 36: steady pace, check the signals,
                  adapt, and finish the job. Endurance in running became endurance in problem-solving.
                </p>
                <p>
                  If there’s one takeaway from my journey, it’s this: staying the same guarantees the
                  same result. Often people get stuck in their 5k even though they are capable and destined for so much more,
                  they may actually be capable of even an Ironman, but comfort takes over.
                  Growth needs effort and time. Just like training cycles, software gets
                  better through continuous improvement — tests, refactors, and thoughtful iteration.
                </p>
                <p>
                  Today, I run for clarity and I code for impact. The miles gave me confidence; the
                  code gives me purpose. And both remind me that momentum beats motivation, every time.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            className="btn ghost"
            style={{ marginTop: 12 }}
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            aria-controls="blog-more"
          >
            {expanded ? "Show less" : "Read more"}
          </button>

          {/* Sub-headline tying to what employers want */}
          <ul className="small" style={{ marginTop: 14, paddingLeft: 18 }}>
            <li><b>Discipline → Delivery:</b> consistent reps, consistent shipping.</li>
            <li><b>Resilience → Reliability:</b> handle failures, adapt, finish.</li>
            <li><b>Pacing → Scalability:</b> plan milestones, avoid burnout, optimise sustainably.</li>
          </ul>
        </div>

        {/* RIGHT: image */}
        <motion.div
          className="blog-img"
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
        >
          {/* Put your rectangular JPEG in client/public, e.g. /marathon.jpg */}
          <img src="/marathon.jpg" alt="Irfan on a marathon run" />
          <figcaption className="small" style={{ textAlign: "center", marginTop: 8, color: "var(--muted)" }}>
            Melaka & Manchester marathons — the miles that shaped my engineering mindset.
          </figcaption>
        </motion.div>
      </motion.div>
    </section>
  );
}


