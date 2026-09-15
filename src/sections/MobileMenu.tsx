export default function MobileMenu() {
  return (
      <nav className="menu" id="menu" aria-label="Mobile" data-lenis-prevent>
        <a href="#about">About<span className="idx">01</span></a>
        <a href="#experience">Experience<span className="idx">02</span></a>
        <a href="#projects">Work<span className="idx">03</span></a>
        <a href="#education">Education<span className="idx">04</span></a>
        <a href="#skills">Skills<span className="idx">05</span></a>
        <a href="#leadership">Leadership<span className="idx">06</span></a>
        <a href="#contact">Contact<span className="idx">07</span></a>
        <div className="menu-foot">
          <a href="assets/Kenneth_Wijaya_Resume.pdf" target="_blank" rel="noopener">Resume ↗</a>
          <a href="https://www.linkedin.com/in/kenneth-anthony-wijaya" target="_blank" rel="noopener">LinkedIn ↗</a>
          <a href="https://github.com/KennethAW" target="_blank" rel="noopener">GitHub ↗</a>
        </div>
      </nav>
  );
}
