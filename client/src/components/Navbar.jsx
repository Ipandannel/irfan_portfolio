export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="brand">Irfan Danial</div>
      <div className="navlinks">
        <a href="#about">About</a>
        <a href="#skills">Skills</a>
        <a href="#projects">Projects</a>

        {/* Special contact button */}
        <a href="#contact" className="contactBtn" aria-label="Contact">
          <span className="phoneEmoji" aria-hidden="true">📞</span>
          <span>Contact</span>
        </a>
      </div>
    </nav>
  );
}
