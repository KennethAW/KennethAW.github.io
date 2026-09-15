export default function Work() {
  return (
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
                  <a href="dashboard/index.html" target="_blank" rel="noopener">Full screen ↗</a>
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
  );
}
