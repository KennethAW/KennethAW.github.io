export default function Education() {
  return (
      <section id="education" className="sec">
        <div className="container sec-grid">
          <div className="sec-aside">
            <header className="sec-head" data-reveal>
              <span className="sec-node" aria-hidden="true"></span>
              <span className="sec-index mono">04 &mdash; Education</span>
              <h2>Singapore, then London.</h2>
            </header>
          </div>
          <div className="rows" data-reveal data-stagger>
            <article className="row">
              <div className="row-meta"><span className="mono">2026 &ndash; 2027</span><span className="mono place">London, United Kingdom</span></div>
              <div className="row-title"><h3>Imperial College London</h3></div>
              <p className="row-sum">MSc Risk Management and Financial Engineering</p>
              <p>Stochastic Calculus, Private Equity &amp; Venture Capital, Financial Statistics, Market Microstructure and Portfolio Management.</p>
            </article>
            <article className="row">
              <div className="row-meta"><span className="mono">2022 &ndash; 2026</span><span className="mono place">Singapore</span></div>
              <div className="row-title"><h3>Nanyang Technological University</h3></div>
              <p className="row-sum">BEng (Hons) Electrical &amp; Electronic Engineering, specialising in Computing &amp; Intelligent Systems</p>
              <p>First Class Honours, CGPA 4.85/5.00. ASEAN Undergraduate Scholarship. Dean&rsquo;s List in 2022/23, 2024/25 and 2025/26. Modules included Business Finance, Data Structures &amp; Algorithms, and Artificial Intelligence &amp; Data Mining.</p>
            </article>
            <article className="row compact">
              <div className="row-meta"><span className="mono">Dec 2024</span><span className="mono place">Guangzhou, China</span></div>
              <div className="row-title"><h3>Sun Yat-sen University</h3></div>
              <p>Winter exchange programme in economics.</p>
            </article>
            <article className="row compact">
              <div className="row-meta"><span className="mono">Further coursework</span></div>
              <p>Portfolio Optimisation with the Markowitz Model (Coursera), DCF Modelling (Coursera), DeFi Infrastructure (Duke University).</p>
            </article>
          </div>
        </div>
      </section>
  );
}
