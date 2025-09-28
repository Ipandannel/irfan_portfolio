import { useEffect, useState } from "react";

const sections = ["about","skills","projects","contact"];

export default function ScrollDots() {
  const [active, setActive] = useState("about");

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { threshold: 0.6 });

    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <div className="dotnav">
      {sections.map(id => (
        <a key={id} href={`#${id}`} className={`dot ${active===id ? "active":""}`} aria-label={id}/>
      ))}
    </div>
  );
}
