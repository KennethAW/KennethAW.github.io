export default function Experience() {
  return (
      <section id="experience" className="sec">
        <div className="container sec-grid">
          <div className="sec-aside">
            <header className="sec-head" data-reveal>
              <span className="sec-node" aria-hidden="true"></span>
              <span className="sec-index mono">02 &mdash; Experience</span>
              <h2>Deals, credit and the numbers behind them.</h2>
              <p className="sec-sub">Capital markets execution, counterparty credit and financial evaluation across Jakarta and Singapore.</p>
            </header>
          </div>
          <div className="rows" data-reveal data-stagger>
            <article className="row">
              <div className="row-meta"><span className="mono">Jun &ndash; Aug 2026</span><span className="mono place">Jakarta, Indonesia</span></div>
              <div className="row-title"><h3>Aldiracita Securities</h3><span className="row-role">Investment Banking Summer Analyst</span></div>
              <p className="row-sum">Deal execution across corporate bonds, sukuk and rights issues.</p>
              <ul>
                <li>Supported 8+ live capital-markets transactions, contributing to prospectuses, additional information documents, internal memoranda and underwriting tender submissions.</li>
                <li>Ran financial statement analysis, ratio work, capital structure reviews and transaction benchmarking to support credit assessment, deal structuring and investor materials.</li>
                <li>Reconciled offering terms, historical financials, shareholder data and disclosures across every deal document so nothing drifted between drafts.</li>
              </ul>
            </article>
            <article className="row">
              <div className="row-meta"><span className="mono">Dec 2025</span><span className="mono place">Jakarta, Indonesia</span></div>
              <div className="row-title"><h3>Maybank Securities</h3><span className="row-role">Middle Market Intern</span></div>
              <p className="row-sum">Repo credit analysis for middle-market counterparties.</p>
              <ul>
                <li>Prepared repurchase-agreement credit reports, assessing counterparty creditworthiness with Altman Z-Score, DuPont analysis and ratio diagnostics.</li>
                <li>Analysed profitability, leverage, liquidity and cash flow to support collateral and counterparty risk decisions.</li>
              </ul>
            </article>
            <article className="row">
              <div className="row-meta"><span className="mono">Jun &ndash; Dec 2024</span><span className="mono place">Singapore</span></div>
              <div className="row-title"><h3>Singtel</h3><span className="row-role">Energy &amp; Sustainability Intern</span></div>
              <p className="row-sum">Cost-benefit analysis for a new data centre.</p>
              <ul>
                <li>Modelled the return on energy-saving initiatives at the new Tuas Data Centre with engineering, procurement and finance, to test budget feasibility.</li>
                <li>Analysed temperature and humidity data to optimise climate-control strategy and identify operating-cost reductions.</li>
                <li>Reported sustainability and financial metrics to senior management to inform capital expenditure decisions.</li>
              </ul>
            </article>
          </div>
        </div>
      </section>
  );
}
