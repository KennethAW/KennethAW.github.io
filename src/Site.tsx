/* The page. Converted from the hand-written markup mechanically rather than
   retyped, so no stat, alt text or aria attribute went missing in transit.
   Split into section components in the commit after this one - equivalence
   first, structure second. */
export default function Site() {
  return (
    <>
        <a className="skip-link" href="#main" data-no-smooth>Skip to content</a>
        <div className="progress" aria-hidden="true"></div>
        <div className="field" aria-hidden="true"><i className="f-sheen"></i><i className="f-gold"></i><i className="f-ember"></i><i className="f-cool"></i></div>
        <div className="grain" aria-hidden="true"></div>

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


        <nav className="menu" id="menu" aria-label="Mobile" data-lenis-prevent>
          <a href="#about">About<span className="idx">01</span></a>
          <a href="#experience">Experience<span className="idx">02</span></a>
          <a href="#projects">Work<span className="idx">03</span></a>
          <a href="#education">Education<span className="idx">04</span></a>
          <a href="#skills">Skills<span className="idx">05</span></a>
          <a href="#leadership">Leadership<span className="idx">06</span></a>
          <a href="#contact">Contact<span className="idx">07</span></a>
          <div className="menu-foot">
            <a href="assets/Kenneth_Wijaya_Resume.pdf" target="_blank" rel="noopener">Resume &nearr;</a>
            <a href="https://www.linkedin.com/in/kenneth-anthony-wijaya" target="_blank" rel="noopener">LinkedIn &nearr;</a>
            <a href="https://github.com/KennethAW" target="_blank" rel="noopener">GitHub &nearr;</a>
          </div>
        </nav>

        <main id="main" tabIndex={-1}>

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

          <div className="thread">
            <div className="spine" aria-hidden="true"><div className="spine-fill"></div></div>


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


            <section id="projects" className="sec sec-invert">
              <div className="container sec-grid">
                <div className="sec-aside">
                  <header className="sec-head" data-reveal>
                    <span className="sec-node" aria-hidden="true"></span>
                    <span className="sec-index mono">03 &mdash; Selected work</span>
                    <h2>Built end to end. Reported <em>honestly</em>.</h2>
                    <p className="sec-sub">A full quant research pipeline with a dashboard you can drive, and a market-making bot from a trading competition.</p>
                  </header>
                </div>
                <div className="case">
                  <div className="case-head" data-reveal>
                    <span className="mono">Final-year project &middot; NTU EEE &middot; Aug 2025 &ndash; May 2026</span>
                    <h3>Can machine learning beat buy-and-hold <em>after costs</em>?</h3>
                    <p className="case-intro">Five large-cap US stocks, ten years of data and one question answered with a 72-feature pipeline, four competing models and a backtester that charges friction before it reports a number.</p>
                  </div>

                  <div className="window spot" id="dash-window" data-reveal>
                    <div className="window-bar">
                      <i></i><i></i><i></i>
                      <span className="mono">alpha-analytics &mdash; market intelligence terminal</span>
                      <span className="mono live" hidden={true}><b></b>Live</span>
                      <span className="mono right">Interactive</span>
                      <div className="window-tools" hidden={true}>
                        <a href="dashboard/index.html" target="_blank" rel="noopener">Full screen &nearr;</a>
                        <button type="button" data-dash-close>Close</button>
                      </div>
                    </div>
                    <div className="window-media">
                      <div className="window-loading" aria-hidden="true"></div>
                      <img className="parallax" src="assets/fyp-dashboard.jpg" width={1600} height={1000} decoding="async" alt="Alpha Analytics dashboard showing an XGBoost forecast overlaid on AAPL price, top feature importances, an execution ledger and backtest risk metrics" loading="lazy" />
                      <div className="window-launch">
                        <button className="btn btn-primary" type="button" data-dash-launch aria-expanded="false" aria-controls="dash-frame">Launch the dashboard
                          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg></button>
                        <span>Runs here on the page. Switch tickers and models, explore signals, backtests and features.</span>
                      </div>
                      <div className="window-frame" id="dash-frame" data-lenis-prevent></div>
                      <div className="window-error">
                        <p className="mono">The dashboard could not load here</p>
                        <p>It may be blocked in this browser. You can open it in its own tab instead.</p>
                        <a className="btn" href="dashboard/index.html" target="_blank" rel="noopener">Open in a new tab
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7" /><path d="M8 7h9v9" /></svg></a>
                      </div>
                    </div>
                  </div>

                  <div className="case-cols" data-reveal data-stagger>
                    <div>
                      <h4 className="mono">The question</h4>
                      <p>Can next-day predictions from machine learning generate <strong>risk-adjusted profit that beats simply holding SPY</strong>, once realistic transaction costs are charged? Universe: AAPL, MSFT, GOOGL, JPM and XOM, 2015 to 2024.</p>
                    </div>
                    <div>
                      <h4 className="mono">The approach</h4>
                      <p>27 technical indicators, 32 macro series, 9 FinBERT sentiment features and 4 calendar effects, split chronologically 70/15/15. <strong>XGBoost, LSTM, a Temporal Fusion Transformer and PatchTST</strong> competed on identical data. A vectorised backtester traded the signals with a 0.55 confidence gate, return-driven sizing, stop-loss and take-profit rules, and 5 basis points per side.</p>
                    </div>
                    <div>
                      <h4 className="mono">The result</h4>
                      <p>XGBoost led on directional accuracy at 55.5%, beating transformers with 60&times; more parameters. The best strategy made <strong>17.2% annualised at a Sharpe of 1.02 net of costs</strong>. None beat SPY&rsquo;s 23.4% over the 2023&ndash;24 rally, a result that held even at zero cost and one I report straight.</p>
                    </div>
                  </div>

                  <div className="numbers" data-reveal data-stagger>
                    <div><div className="n">72</div><div className="l">features across four modalities</div></div>
                    <div><div className="n">4<b>&times;5</b></div><div className="l">architectures benchmarked over five tickers</div></div>
                    <div><div className="n">100</div><div className="l">Optuna trials per ticker for XGBoost</div></div>
                    <div><div className="n">6<b>/20</b></div><div className="l">strategies significant at the 5% level</div></div>
                  </div>

                  <div data-reveal>
                    <h4 className="mono group-label">Four findings</h4>
                    <ul className="findings">
                      <li><strong>Simpler models won.</strong> On low signal-to-noise daily data, the inductive bias of gradient boosting beat raw capacity.</li>
                      <li><strong>Signal is asset-specific.</strong> Feature importance split differently per ticker, so per-ticker tuning beat one universal feature set.</li>
                      <li><strong>News is priced in by the close.</strong> Daily sentiment and calendar features received 0% importance across all five names.</li>
                      <li><strong>Regression beat classification.</strong> Predicting the continuous log return produced a sharper trading signal than a binary up-or-down label.</li>
                    </ul>
                  </div>

                  <div className="gallery-wrap" data-reveal>
                    <div className="gallery" id="case-gallery" role="group" tabIndex={0} aria-label="Screens from the dashboard and the presentation. Use the arrow keys to scroll.">
                      <figure className="spot"><div className="frame"><img src="assets/dash-1.jpg" width={1400} height={875} decoding="async" alt="Dashboard overview with predictive overlay, signal drivers, execution ledger and risk assessment" loading="lazy" /></div><figcaption><span className="mono">01</span>Dashboard: forecast overlay, signal drivers, execution ledger</figcaption></figure>
                      <figure className="spot"><div className="frame"><img src="assets/dash-4.jpg" width={1400} height={875} decoding="async" alt="Backtest results page with equity curve against buy and hold and a full trade log" loading="lazy" /></div><figcaption><span className="mono">02</span>Backtest results: equity curve against buy-and-hold, full trade log</figcaption></figure>
                      <figure className="spot"><div className="frame"><img src="assets/dash-5.jpg" width={1400} height={875} decoding="async" alt="Feature analysis page ranking feature importance" loading="lazy" /></div><figcaption><span className="mono">03</span>Feature analysis: importance rankings per model and ticker</figcaption></figure>
                      <figure className="spot"><div className="frame"><img src="assets/dash-2.jpg" width={1400} height={875} decoding="async" alt="Model comparison page with accuracy, directional accuracy and ROC AUC per model and ticker" loading="lazy" /></div><figcaption><span className="mono">04</span>Model comparison across all twenty model-ticker pairs</figcaption></figure>
                      <figure className="spot"><div className="frame"><img src="assets/deck-5.jpg" className="slide" width={1400} height={788} decoding="async" alt="Presentation slide describing the end-to-end pipeline" loading="lazy" /></div><figcaption><span className="mono">05</span>From the deck: the end-to-end pipeline</figcaption></figure>
                      <figure className="spot"><div className="frame"><img src="assets/deck-14.jpg" className="slide" width={1400} height={788} decoding="async" alt="Presentation slide showing profit across all strategies" loading="lazy" /></div><figcaption><span className="mono">06</span>From the deck: profit across the board</figcaption></figure>
                      <figure className="spot"><div className="frame"><img src="assets/deck-15.jpg" className="slide" width={1400} height={788} decoding="async" alt="Presentation slide summarising four key findings" loading="lazy" /></div><figcaption><span className="mono">07</span>From the deck: four key findings</figcaption></figure>
                    </div>
                    <div className="gallery-nav">
                      <button className="icon-btn" type="button" data-gallery-prev aria-controls="case-gallery" aria-label="Previous screen"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5" /><path d="m11 6-6 6 6 6" /></svg></button>
                      <button className="icon-btn" type="button" data-gallery-next aria-controls="case-gallery" aria-label="Next screen"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></svg></button>
                    </div>
                  </div>

                  <p className="limits" data-reveal><strong>Limitations I documented:</strong> a five-ticker universe, daily data only, long-only strategies, no slippage model beyond the 5 bps charge, and a single chronological split. The report says so on the slide before the conclusions.</p>

                  <div className="case-links" data-reveal>
                    <a className="btn" href="https://github.com/KennethAW/Final-Year-Project-Rev-1.0" target="_blank" rel="noopener">Source code
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7" /><path d="M8 7h9v9" /></svg></a>
                    <a className="tlink" href="dashboard/index.html" target="_blank" rel="noopener">Open the dashboard full screen</a>
                    <a className="tlink" href="assets/FYP-Presentation.pdf" target="_blank" rel="noopener">Slides (PDF)</a>
                    <a className="tlink" href="assets/FYP-Dashboard.pdf" target="_blank" rel="noopener">Dashboard walkthrough (PDF)</a>
                  </div>

                  <div className="project" data-reveal>
                    <div className="project-art" aria-hidden="true">
                      <svg viewBox="0 0 420 300" xmlns="http://www.w3.org/2000/svg">
                        <g className="ob-line">
                          <line x1="40" y1="30" x2="40" y2="270" />
                          <line x1="40" y1="60" x2="380" y2="60" /><line x1="40" y1="100" x2="380" y2="100" /><line x1="40" y1="140" x2="380" y2="140" />
                          <line x1="40" y1="180" x2="380" y2="180" /><line x1="40" y1="220" x2="380" y2="220" /><line x1="40" y1="260" x2="380" y2="260" />
                        </g>
                        <g className="ob-ask">
                          <rect x="42" y="48" width={150} height={24} rx="3" /><rect x="42" y="88" width={110} height={24} rx="3" /><rect x="42" y="128" width={70} height={24} rx="3" />
                        </g>
                        <g className="ob-bid">
                          <rect x="42" y="168" width={80} height={24} rx="3" /><rect x="42" y="208" width={125} height={24} rx="3" /><rect x="42" y="248" width={165} height={24} rx="3" />
                        </g>
                        <g className="ob-mid-g"><line className="ob-mid" x1="40" y1="152" x2="380" y2="152" /><text className="ob-text" x="386" y="156">mid</text></g>
                        <g className="ob-q1"><rect className="ob-quote" x="220" y="96" width={120} height={30} rx="15" /><text className="ob-text" x="248" y="116">ASK QUOTE</text></g>
                        <g className="ob-q2"><rect className="ob-quote" x="220" y="176" width={120} height={30} rx="15" /><text className="ob-text" x="252" y="196">BID QUOTE</text></g>
                        <text className="ob-text" x="12" y="64">A3</text><text className="ob-text" x="12" y="104">A2</text><text className="ob-text" x="12" y="144">A1</text>
                        <text className="ob-text" x="12" y="184">B1</text><text className="ob-text" x="12" y="224">B2</text><text className="ob-text" x="12" y="264">B3</text>
                        <text className="ob-text ob-cap" x="40" y="286">RESERVATION PRICE SHIFTS WITH INVENTORY</text>
                        <text className="ob-text ob-cap" x="40" y="298">SPREAD WIDENS WITH VOLATILITY AND RISK AVERSION</text>
                      </svg>
                    </div>
                    <div>
                      <span className="mono">Optiver Ready Trader Go &middot; Mar &ndash; May 2023</span>
                      <h3>Market making under <em>inventory risk</em>.</h3>
                      <p>A Python auto-trader built on the Avellaneda&ndash;Stoikov model for a simulated ETF market. The bot quotes around a reservation price that shifts with its inventory, widens its spread with volatility and risk aversion, and re-quotes as the book moves, earning the spread while keeping inventory near zero.</p>
                      <ul>
                        <li>Reservation price adjusted continuously for inventory</li>
                        <li>Spread set from volatility and risk aversion, not a fixed tick</li>
                        <li>Consistent positive returns across the simulated sessions</li>
                      </ul>
                      <span className="mono">Python &middot; Market making &middot; High-frequency execution</span>
                    </div>
                  </div>

                  <ul className="also" data-reveal data-stagger>
                    <li><div><span className="t">Cat vs Dog image classifier</span><br /><span className="d">Deep learning classifier for NTU&rsquo;s Artificial Intelligence and Data Mining module, 2025.</span></div><a className="tlink quiet" href="https://github.com/KennethAW/AIDM-Cat-vs-Dog" target="_blank" rel="noopener">GitHub</a></li>
                    <li><div><span className="t">AI virtual mouse</span><br /><span className="d">Real-time hand tracking with OpenCV mapped to cursor control, 2023.</span></div><a className="tlink quiet" href="https://github.com/KennethAW/AI-Virtual-Mouse-Hand-Tracking" target="_blank" rel="noopener">GitHub</a></li>
                  </ul>
                </div>
              </div>
            </section>


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


            <section id="leadership" className="sec">
              <div className="container sec-grid">
                <div className="sec-aside">
                  <header className="sec-head" data-reveal>
                    <span className="sec-node" aria-hidden="true"></span>
                    <span className="sec-index mono">06 &mdash; Leadership</span>
                    <h2>Beyond the classroom.</h2>
                  </header>
                </div>
                <div className="rows" data-reveal data-stagger>
                  <article className="row compact">
                    <div className="row-meta"><span className="mono">Aug 2024 &ndash; Aug 2025</span></div>
                    <div className="row-title"><h3>NTU EEE Club</h3><span className="row-role">Student Development Committee</span></div>
                    <p>Organised industry visits and talks with Huawei, STMicroelectronics and Infineon, connecting students with corporate representatives.</p>
                  </article>
                  <article className="row compact">
                    <div className="row-meta"><span className="mono">Aug 2023 &ndash; Aug 2024</span></div>
                    <div className="row-title"><h3>NTU Indonesian Students&rsquo; Association</h3><span className="row-role">Public Relations Director</span></div>
                    <p>Led a ten-person committee and ran the promotional campaigns that lifted attendance at major association events by 57%.</p>
                  </article>
                </div>
              </div>
            </section>


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
          </div>
        </main>

        <footer>
          <div className="container footer-inner">
            <span className="mono">&copy; <span id="year">2026</span> Kenneth Anthony Wijaya &middot; Updated Sep 2026</span>
            <span className="mono">Built by hand in London</span>
          </div>
        </footer>

        <button className="to-top" type="button" aria-label="Back to top">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5" /><path d="m5 12 7-7 7 7" /></svg>
        </button>
    </>
  );
}
