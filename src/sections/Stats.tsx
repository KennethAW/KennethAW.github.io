export default function Stats() {
  return (
      <div className="container stats-wrap">
        <div className="stats" data-reveal data-stagger>
          <div className="stat">
            <div className="stat-num"><span data-count="4.85" data-decimals="2">4.85</span><span className="suffix">/5.00</span></div>
            <div className="stat-lbl">CGPA, First Class Honours, Electrical &amp; Electronic Engineering, NTU</div>
          </div>
          <div className="stat">
            <div className="stat-num"><span data-count="3" data-decimals="0">3</span><span className="suffix">&times;</span></div>
            <div className="stat-lbl">Dean&rsquo;s List, top 5% of the cohort, on the ASEAN Undergraduate Scholarship</div>
          </div>
          <div className="stat">
            <div className="stat-num"><span data-count="8" data-decimals="0">8</span><span className="suffix">+</span></div>
            <div className="stat-lbl">Live capital-markets transactions supported as an Investment Banking Summer Analyst</div>
          </div>
          <div className="stat">
            <div className="stat-num"><span data-count="55.5" data-decimals="1">55.5</span><span className="suffix">%</span></div>
            <div className="stat-lbl">Best next-day directional accuracy in my machine learning research across five large caps</div>
          </div>
        </div>
      </div>
  );
}
