export default function Hero() {
  return (
      <section className="hero" id="top">
        <div className="hero-grid" aria-hidden="true"></div>
        <svg className="hero-path" viewBox="0 0 1000 300" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="lineFade" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#f4efe6" stopOpacity="0" />
              <stop offset="0.2" stopColor="#f4efe6" stopOpacity="0.55" />
              <stop offset="1" stopColor="#f0cd93" />
            </linearGradient>
            <linearGradient id="areaFade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#d8a35b" stopOpacity="0.14" />
              <stop offset="1" stopColor="#d8a35b" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path id="heroArea" fill="url(#areaFade)" d="" opacity="0" />
          <path id="heroLine" fill="none" stroke="url(#lineFade)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" d="" />
        </svg>

        <div className="container hero-rail hero-rail-top">
          <span className="status mono"><i aria-hidden="true"></i>Open to 2027 graduate roles</span>
          <span className="mono rail-end">London &middot; 2027 intake</span>
        </div>

        <div className="container hero-inner">
          <p className="hero-name">Kenneth Anthony Wijaya</p>
          <h1 className="hero-title">
            <span className="line"><span className="line-inner">Engineering rigour,</span></span>
            <span className="line"><span className="line-inner">applied to <em>markets</em>.</span></span>
          </h1>
          <p className="hero-lede">
            <strong>MSc Risk Management &amp; Financial Engineering at Imperial College London,</strong> after a First Class
            BEng in Electrical &amp; Electronic Engineering at NTU. I have supported live bond, sukuk and rights-issue deals in
            Jakarta, and built an end-to-end machine learning pipeline to test whether markets can be beaten after costs.
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary down" href="#projects">See the work
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14" /><path d="m6 13 6 6 6-6" /></svg></a>
            <a className="tlink" href="assets/Kenneth_Wijaya_Resume.pdf" target="_blank" rel="noopener">Download resume
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7" /><path d="M8 7h9v9" /></svg></a>
          </div>
        </div>

        <div className="container hero-rail hero-rail-bottom">
          <span className="hero-cue" aria-hidden="true"><i></i><span className="mono">Scroll</span></span>
          <span className="hero-links">
            <a className="tlink quiet" href="https://www.linkedin.com/in/kenneth-anthony-wijaya" target="_blank" rel="noopener">LinkedIn</a>
            <a className="tlink quiet" href="https://github.com/KennethAW" target="_blank" rel="noopener">GitHub</a>
            <a className="tlink quiet" href="mailto:w.kennethanthony@gmail.com">w.kennethanthony@gmail.com</a>
          </span>
        </div>
      </section>
  );
}
