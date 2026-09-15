export default function Nav() {
  return (
      <header className="nav">
        <div className="container nav-inner">
          <a className="brand" href="#top" title="Back to top">
            <span className="brand-mark" aria-hidden="true">KW</span>
            <span className="brand-name">Kenneth Wijaya</span>
          </a>
          <nav className="nav-primary" aria-label="Primary">
          <ul className="nav-links">
            <li><a href="#about">About</a></li>
            <li><a href="#experience">Experience</a></li>
            <li><a href="#projects">Work</a></li>
            <li><a href="#education">Education</a></li>
            <li><a href="#skills">Skills</a></li>
            <li><a href="#leadership">Leadership</a></li>
            <li><a href="#contact">Contact</a></li>
            <li><a className="btn" href="assets/Kenneth_Wijaya_Resume.pdf" target="_blank" rel="noopener">Resume
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7" /><path d="M8 7h9v9" /></svg></a></li>
          </ul>
          <span className="nav-indicator" aria-hidden="true"></span>
          </nav>
          <button className="nav-toggle" aria-label="Toggle menu" aria-expanded="false" aria-controls="menu">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 8h16M4 16h16" /></svg>
          </button>
        </div>
      </header>
  );
}
