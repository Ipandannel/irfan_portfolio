import { motion, useScroll, useTransform } from "framer-motion";

export default function ParallaxBackground() {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);   // far layer
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -400]);   // near layer

  return (
    <div aria-hidden className="parallaxWrap">
      <motion.div className="parallaxLayer layer1" style={{ y: y1 }} />
      <motion.div className="parallaxLayer layer2" style={{ y: y2 }} />
    </div>
  );
}
