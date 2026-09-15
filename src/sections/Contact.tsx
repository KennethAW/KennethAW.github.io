export default function Contact() {
  return (
      <section id="contact" className="sec contact">
        <div className="container contact-grid">
          <div>
            <header className="sec-head" data-reveal>
              <span className="sec-node" aria-hidden="true"></span>
              <span className="sec-index mono">07 &mdash; Contact</span>
              <h2>Start a <em>conversation</em>.</h2>
            </header>
            <div data-reveal data-stagger>
              <p className="contact-sub">Graduate opportunities, quant research, or anything on this page. Email is the fastest way to reach me, and I reply to everything.</p>
              <div className="contact-row">
                <a className="tlink contact-email" href="mailto:w.kennethanthony@gmail.com">w.kennethanthony@gmail.com</a>
                <button className="icon-btn" type="button" data-copy="w.kennethanthony@gmail.com" aria-label="Copy w.kennethanthony@gmail.com to clipboard">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width={11} height={11} rx="2" /><path d="M5 15V6a2 2 0 0 1 2-2h9" /></svg>
                  <span className="copied" aria-hidden="true">OK</span>
                </button>

                <span className="sr-only" role="status" data-copy-status></span>
              </div>
              <div className="contact-links">
                <a className="tlink quiet" href="https://www.linkedin.com/in/kenneth-anthony-wijaya" target="_blank" rel="noopener">LinkedIn</a>
                <a className="tlink quiet" href="https://github.com/KennethAW" target="_blank" rel="noopener">GitHub</a>
                <a className="tlink quiet" href="assets/Kenneth_Wijaya_Resume.pdf" target="_blank" rel="noopener">Resume (PDF)</a>
              </div>
            </div>
          </div>
          <dl className="facts contact-facts" data-reveal data-stagger>
            <div className="fact"><dt className="mono">Where</dt><dd>London &middot; <span className="clock" id="clock">&ndash;&ndash;:&ndash;&ndash;</span></dd></div>
            <div className="fact"><dt className="mono">Status</dt><dd><span className="status"><i aria-hidden="true"></i>Open to 2027 graduate roles</span></dd></div>
            <div className="fact"><dt className="mono">Looking for</dt><dd>Investment banking, markets and quantitative finance. Open to London, Singapore and Hong Kong desks.</dd></div>
            <div className="fact"><dt className="mono">Right to work</dt><dd>UK student visa now, and eligible for the Graduate Route after the MSc. Also eligible for Singapore&rsquo;s Work Holiday Pass and Hong Kong&rsquo;s Top Talent Pass Scheme.</dd></div>
            <div className="fact"><dt className="mono">Languages</dt><dd>English, Bahasa Indonesia, Mandarin</dd></div>
          </dl>
        </div>
      </section>
  );
}
