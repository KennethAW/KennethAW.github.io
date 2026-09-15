export default function About() {
  return (
      <section id="about" className="sec">
        <div className="container sec-grid">
          <div className="sec-aside">
            <header className="sec-head" data-reveal>
              <span className="sec-node" aria-hidden="true"></span>
              <span className="sec-index mono">01 &mdash; About</span>
              <h2>Trained as an engineer. Drawn to <em>markets</em>.</h2>
            </header>
          </div>
          <div>
            <div className="lead" data-reveal data-stagger>
              <p>
                I grew up in Indonesia and took the <strong>ASEAN Undergraduate Scholarship</strong> to Nanyang Technological
                University, where I graduated with First Class Honours in Electrical and Electronic Engineering and made the
                Dean&rsquo;s List three times.
              </p>
              <p>
                Along the way I found that the problems I enjoyed most were financial ones: <strong>pricing a deal, sizing a
                risk, testing whether a signal survives contact with real costs.</strong> That took me to a summer in investment
                banking and a winter in middle-market credit in Jakarta, to a final-year project on machine learning for
                trading, and now to Imperial College London for an MSc in Risk Management and Financial Engineering.
              </p>
              <p>Outside work I invest in equities and options, play poker and badminton, and travel whenever term allows.</p>
            </div>
            <ol className="bring" data-reveal data-stagger>
              <li>
                <span className="n">01</span>
                <div>
                  <h3>Deal execution</h3>
                  <p>Eight-plus live capital-markets transactions at Aldiracita Securities: prospectuses, information documents, internal memoranda and underwriting tenders, with the financials reconciled line by line.</p>
                </div>
              </li>
              <li>
                <span className="n">02</span>
                <div>
                  <h3>Quant research, end to end</h3>
                  <p>A 72-feature pipeline, four model architectures and a cost-aware backtester, built from scratch and benchmarked honestly against buy-and-hold.</p>
                </div>
              </li>
              <li>
                <span className="n">03</span>
                <div>
                  <h3>Engineering fundamentals</h3>
                  <p>Python, C++, SQL and PyTorch, with the habits of an engineering degree: reproducible experiments, fixed seeds, chronological splits and no leakage.</p>
                </div>
              </li>
            </ol>
            <dl className="facts" data-reveal data-stagger>
              <div className="fact"><dt className="mono">Based in</dt><dd>London, United Kingdom</dd></div>
              <div className="fact"><dt className="mono">Currently</dt><dd>MSc Risk Management &amp; Financial Engineering, Imperial College London, 2026&ndash;27</dd></div>
              <div className="fact"><dt className="mono">Open to</dt><dd>2027 graduate roles in investment banking, markets and quantitative finance, on London, Singapore or Hong Kong desks</dd></div>
              <div className="fact"><dt className="mono">Languages</dt><dd>English, Bahasa Indonesia, Mandarin</dd></div>
            </dl>
          </div>
        </div>
      </section>
  );
}
