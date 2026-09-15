export default function Skills() {
  return (
      <section id="skills" className="sec sec-wide">
        <div className="container sec-grid">
          <div className="sec-aside">
            <header className="sec-head" data-reveal>
              <span className="sec-node" aria-hidden="true"></span>
              <span className="sec-index mono">05 &mdash; Skills</span>
              <h2>The toolkit.</h2>
            </header>
          </div>
          <div className="skills" data-reveal data-stagger>
            <div>
              <h3 className="mono">Programming &amp; tools</h3>
              <ul><li>Python</li><li>C++</li><li>SQL</li><li>PyTorch</li><li>XGBoost &amp; Optuna</li><li>pandas</li><li>React &amp; TypeScript</li><li>Git</li><li>Bloomberg Terminal</li></ul>
            </div>
            <div>
              <h3 className="mono">Finance</h3>
              <ul><li>Financial statement analysis</li><li>Credit analysis</li><li>Capital markets execution</li><li>DCF modelling</li><li>Portfolio optimisation</li><li>Backtesting</li><li>Market making</li></ul>
            </div>
            <div>
              <h3 className="mono">Languages</h3>
              <ul><li>English, full professional</li><li>Bahasa Indonesia, native</li><li>Mandarin, limited working</li></ul>
            </div>
            <div className="now">
              <h3 className="mono">Studying now at Imperial</h3>
              <ul><li>Stochastic Calculus</li><li>Market Microstructure</li><li>Portfolio Management</li><li>Financial Statistics</li><li>Private Equity &amp; VC</li></ul>
            </div>
          </div>
        </div>
      </section>
  );
}
