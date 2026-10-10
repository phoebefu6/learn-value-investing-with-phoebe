/* vi-bench.js - the intrinsic value bench UI. Renders into #vi-bench on Analyst session 10.
 * Every number shown is computed by vi-live.js from window.VI_SAMPLE (real 10-K figures from SEC
 * EDGAR XBRL) at the moment a control changes; nothing is stored. */
(function () {
  "use strict";
  var V = window.VI, S = window.VI_SAMPLE, rootEl = document.getElementById("vi-bench");
  if (!V || !S || !rootEl) return;

  var RUNGS = [
    { id: "last", name: "1 · Last year's earnings", note: "Net income per share in the last known year, held flat. What a quick reading uses." },
    { id: "norm5", name: "2 · Five-year owner earnings", note: "Mean of five years of net income + D&A - capex per share, held flat." },
    { id: "norm10", name: "3 · Ten-year owner earnings", note: "Mean of ten years of owner earnings per share, held flat. A whole cycle, usually." },
    { id: "fade", name: "4 · Ten-year, growth fading", note: "Rung 3's base, growing at half its own past growth rate, fading to 2.5% over five years." },
    { id: "best", name: "Extrapolate the best year's growth", anti: true,
      note: "The anti-lever. Start from the last year and compound the single best year-on-year growth of the past ten." }
  ];

  var state = { co: 0, rung: "norm10", N: 5, r: 9, n: 10, g: 5, gt: 2.5, price: "", broken: false, saved: null };

  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function grp(x, d) { return x.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d }); }
  function usd(x) { return (x < 0 ? "-$" : "$") + grp(Math.abs(x), 2); }
  function pct(x, d) { return (x >= 0 ? "+" : "-") + grp(Math.abs(x * 100), d == null ? 1 : d) + "%"; }
  function pc0(x) { return grp(x * 100, 1) + "%"; }

  function metric(label, value, unit, kind) {
    var m = el("div", "vb-metric");
    m.appendChild(el("span", "vb-mlabel", label));
    m.appendChild(el("span", "vb-mvalue", value));
    if (unit) m.appendChild(el("span", "vb-munit", unit));
    m.appendChild(el("span", "vb-mkind " + (kind === "computed" ? "is-computed" : "is-modelled"), kind));
    return m;
  }

  /* ---------- static frame ---------- */
  rootEl.className = "vb-wrap";
  rootEl.appendChild(el("h4", null, "The intrinsic value bench"));
  rootEl.appendChild(el("p", "vb-rail", "Educational, not investment advice. Real annual 10-K figures for four US filers, from SEC EDGAR XBRL. Owner earnings here are net income + depreciation and amortisation - ALL capital expenditure, an approximation: filings do not split maintenance from growth capex. No market prices: the only price on this bench is the one you type."));

  var coRow = el("div", "vb-cos");
  S.companies.forEach(function (c, i) {
    var b = el("button", "vb-co", c.name);
    b.type = "button";
    b.addEventListener("click", function () { state.co = i; render(); });
    coRow.appendChild(b);
  });
  rootEl.appendChild(coRow);

  /* A. the ladder */
  var secA = el("div", "vb-sec");
  secA.appendChild(el("h5", null, "A · The ladder: forecast the held-out years, then check against the filings"));
  var nRow = el("div", "vb-ctls");
  var nLab = el("label", "vb-ctl", "Hold out the last ");
  var nSel = document.createElement("select");
  [3, 4, 5].forEach(function (N) { var o = document.createElement("option"); o.value = N; o.textContent = N + " fiscal years"; if (N === 5) o.selected = true; nSel.appendChild(o); });
  nSel.addEventListener("change", function () { state.N = parseInt(nSel.value, 10); render(); });
  nLab.appendChild(nSel); nRow.appendChild(nLab); secA.appendChild(nRow);
  var presets = el("div", "vb-presets");
  RUNGS.forEach(function (R) {
    var b = el("button", "vb-preset" + (R.anti ? " is-anti" : ""));
    b.type = "button"; b.dataset.rung = R.id;
    b.appendChild(el("span", "vb-pname", R.name));
    if (R.anti) b.appendChild(el("span", "vb-anti", "anti-lever"));
    b.appendChild(el("span", "vb-pnote", R.note));
    b.addEventListener("click", function () { state.rung = R.id; render(); });
    presets.appendChild(b);
  });
  secA.appendChild(presets);
  var verdictA = el("p", "vb-verdict"); secA.appendChild(verdictA);
  var metricsA = el("div", "vb-metrics"); secA.appendChild(metricsA);
  var chartA = el("div", "vb-stage"); secA.appendChild(chartA);
  var tableA = el("div", "vb-table"); secA.appendChild(tableA);
  rootEl.appendChild(secA);

  /* B. the valuation */
  var secB = el("div", "vb-sec");
  secB.appendChild(el("h5", null, "B · The valuation: a two-stage discounted cash flow on the rung's starting point"));
  var sl = el("div", "vb-ctls vb-sliders");
  var SL = [
    { k: "r", label: "Discount rate", min: 5, max: 14, step: 0.5, unit: "%" },
    { k: "n", label: "Growth years", min: 0, max: 15, step: 1, unit: "" },
    { k: "g", label: "Growth rate", min: -5, max: 15, step: 0.5, unit: "%" },
    { k: "gt", label: "Terminal growth", min: 0, max: 14, step: 0.5, unit: "%" }
  ];
  var sliderEls = {};
  SL.forEach(function (d) {
    var lab = el("label", "vb-ctl vb-range");
    lab.appendChild(el("span", null, d.label));
    var inp = document.createElement("input");
    inp.type = "range"; inp.min = d.min; inp.max = d.max; inp.step = d.step; inp.value = state[d.k];
    inp.setAttribute("aria-label", d.label);
    var out = el("b", null, state[d.k] + d.unit);
    inp.addEventListener("input", function () { state[d.k] = parseFloat(inp.value); state.broken = false; render(); });
    lab.appendChild(inp); lab.appendChild(out);
    sliderEls[d.k] = { inp: inp, out: out, unit: d.unit };
    sl.appendChild(lab);
  });
  var brk = el("button", "vb-break", "Break it: terminal growth = discount rate");
  brk.type = "button";
  brk.addEventListener("click", function () {
    if (!state.broken) { state.saved = state.gt; state.gt = state.r; state.broken = true; }
    else { state.gt = state.saved == null ? 2.5 : state.saved; state.broken = false; }
    render();
  });
  sl.appendChild(brk);
  secB.appendChild(sl);
  var verdictB = el("p", "vb-verdict"); secB.appendChild(verdictB);
  var metricsB = el("div", "vb-metrics"); secB.appendChild(metricsB);
  rootEl.appendChild(secB);

  /* C. the price you type */
  var secC = el("div", "vb-sec");
  secC.appendChild(el("h5", null, "C · A price you type: margin of safety, and the growth the price assumes"));
  var pRow = el("div", "vb-ctls");
  var pLab = el("label", "vb-ctl", "Price per share you are testing, in dollars ");
  var pInp = document.createElement("input");
  pInp.type = "number"; pInp.min = "0"; pInp.step = "0.01"; pInp.placeholder = "type any price";
  pInp.className = "vb-price";
  pInp.addEventListener("input", function () { state.price = pInp.value; render(); });
  pLab.appendChild(pInp); pRow.appendChild(pLab); secC.appendChild(pRow);
  var verdictC = el("p", "vb-verdict"); secC.appendChild(verdictC);
  var metricsC = el("div", "vb-metrics"); secC.appendChild(metricsC);
  rootEl.appendChild(secC);

  /* ---------- the chart: owner earnings per share, held-out years shaded, rung forecast ---------- */
  function drawChart(c, s, N, rb, fc) {
    var W = 860, H = 250, padL = 56, padR = 16, padT = 22, padB = 40;
    var n = c.fy.length, t = n - 1 - N;
    var vals = s.oe.slice().concat(fc), lo = Math.min(0, Math.min.apply(null, vals)), hi = Math.max.apply(null, vals);
    hi = hi * 1.08; if (hi <= lo) hi = lo + 1;
    var bw = (W - padL - padR) / n;
    function X(i) { return padL + i * bw; }
    function Y(v) { return padT + (hi - v) / (hi - lo) * (H - padT - padB); }
    var NS = "http://www.w3.org/2000/svg", svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", "0 0 " + W + " " + H);
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", c.name + ": owner earnings per share by fiscal year, " + c.fy[0] + " to " + c.fy[n - 1] + ", last " + N + " years held out, with the selected rung's forecast for them.");
    function add(tag, attrs, text) { var e = document.createElementNS(NS, tag); for (var k in attrs) e.setAttribute(k, attrs[k]); if (text != null) e.textContent = text; svg.appendChild(e); return e; }
    add("rect", { x: X(t + 1) - 2, y: padT - 6, width: (n - t - 1) * bw + 2, height: H - padT - padB + 6, fill: "#F8F0DC", stroke: "none" });
    add("text", { x: X(t + 1) + 4, y: padT + 6, "class": "vb-lab vb-labb" }, "held out");
    var y0 = Y(0);
    add("line", { x1: padL, x2: W - padR, y1: y0, y2: y0, stroke: "#4F5F55", "stroke-width": 1 });
    for (var i = 0; i < n; i++) {
      var v = s.oe[i], yv = Y(v);
      add("rect", { x: X(i) + bw * 0.18, y: Math.min(yv, y0), width: bw * 0.64, height: Math.max(1, Math.abs(y0 - yv)), rx: 2,
        fill: i > t ? "#93701C" : "#2D5240" });
      if (i % 2 === (n - 1) % 2) add("text", { x: X(i) + bw / 2, y: H - padB + 16, "text-anchor": "middle", "class": "vb-lab" }, String(c.fy[i]));
    }
    var d = "";
    for (var k = 0; k < fc.length; k++) d += (k ? " L" : "M") + (X(t + 1 + k) + bw / 2).toFixed(1) + " " + Y(fc[k]).toFixed(1);
    if (fc.length) {
      d = "M" + (X(t) + bw / 2).toFixed(1) + " " + Y(rb.base).toFixed(1) + " L" + d.slice(1);
      add("path", { d: d, fill: "none", stroke: "#1C3628", "stroke-width": 2.6, "stroke-dasharray": "6 4" });
    }
    add("text", { x: 8, y: Y(hi / 1.08) + 4, "class": "vb-lab" }, usd(hi / 1.08));
    add("text", { x: 8, y: y0 + 4, "class": "vb-lab" }, "$0");
    add("text", { x: padL, y: H - 6, "class": "vb-lab" }, "bars: owner earnings per share, dollars · dashed: the rung's forecast for the held-out years");
    chartA.textContent = ""; chartA.appendChild(svg);
  }

  function render() {
    var c = S.companies[state.co], s = V.series(c), n = c.fy.length, N = state.N, t = n - 1 - N;
    Array.prototype.forEach.call(coRow.children, function (b, i) { b.classList.toggle("is-on", i === state.co); });
    Array.prototype.forEach.call(presets.children, function (b) { b.classList.toggle("is-on", b.dataset.rung === state.rung); });

    /* A */
    var bt = V.backtest(S, N), here = bt[state.rung], mine = here.per[state.co];
    var rb = V.rungBase(s, t, state.rung), fc = V.forecast(rb, N);
    var best = null;
    V.RUNGS.forEach(function (r) { if (best === null || bt[r].mae < bt[best].mae) best = r; });
    var R = RUNGS.filter(function (x) { return x.id === state.rung; })[0];
    verdictA.className = "vb-verdict " + (R.anti ? "is-bad" : (state.rung === best ? "is-good" : "is-ok"));
    verdictA.textContent = (R.anti
      ? "Anti-lever: mean miss " + pc0(here.mae) + " across the four filers, against " + pc0(bt[best].mae) + " for the best rung. The best single year is the least typical year."
      : "Mean miss " + pc0(here.mae) + " across the four filers, forecasting " + (c.fy[t] + 1) + " onward from what was known in " + c.fy[t] + "." +
        (state.rung === best ? " The lowest miss on this hold-out." : ""));
    metricsA.textContent = "";
    metricsA.appendChild(metric(c.name + ": forecast, mean per year", usd(mine.forecast), "owner earnings per share", "modelled"));
    metricsA.appendChild(metric(c.name + ": what the filings showed", usd(mine.actual), "mean over the held-out years", "computed"));
    metricsA.appendChild(metric(c.name + ": miss", pct(mine.err), "forecast vs filings", "computed"));
    metricsA.appendChild(metric("Growth this rung assumed", rb.best !== undefined ? pct(rb.best) : (rb.fade ? pct(rb.g0) + " fading" : "none"), "per year", "computed"));
    metricsA.appendChild(metric("Mean miss, four filers", pc0(here.mae), "absolute, forecast vs filings", "computed"));
    drawChart(c, s, N, rb, fc);
    tableA.textContent = "";
    var tb = el("table", "clean vb-tbl"), hr = el("tr");
    ["Rung", "Mean miss", "Median miss", "Average direction"].forEach(function (h) { hr.appendChild(el("th", null, h)); });
    tb.appendChild(hr);
    RUNGS.forEach(function (Rr) {
      var tr = el("tr", Rr.id === state.rung ? "is-on" : null), b = bt[Rr.id];
      tr.appendChild(el("td", null, Rr.name));
      tr.appendChild(el("td", null, pc0(b.mae)));
      tr.appendChild(el("td", null, pc0(b.medae)));
      tr.appendChild(el("td", null, (b.bias >= 0 ? "too high by " : "too low by ") + pc0(Math.abs(b.bias))));
      tb.appendChild(tr);
    });
    tableA.appendChild(tb);

    /* B: value today, from the rung's starting point at the LAST known year */
    var tNow = n - 1, rbNow = V.rungBase(s, tNow, state.rung);
    var g = state.rung === "best" ? rbNow.best : state.g / 100;
    if (state.rung === "best") { sliderEls.g.inp.disabled = true; } else { sliderEls.g.inp.disabled = false; }
    sliderEls.gt.inp.value = state.gt;
    SL.forEach(function (d) { sliderEls[d.k].out.textContent = (d.k === "g" && state.rung === "best") ? pct(g) + " (anti-lever)" : state[d.k] + d.unit; });
    var p = { base: rbNow.base, r: state.r / 100, n: state.n, g: g, gt: state.gt / 100 };
    var v = V.dcf(p), rg = V.range(p);
    metricsB.textContent = "";
    metricsB.appendChild(metric("Starting owner earnings, " + c.fy[tNow], usd(rbNow.base), "per share, from rung " + (R.anti ? "anti" : R.name.charAt(0)), "computed"));
    brk.classList.toggle("is-on", state.broken);
    brk.textContent = state.broken ? "Restore terminal growth" : "Break it: terminal growth = discount rate";
    if (v.undefined) {
      verdictB.className = "vb-verdict is-bad";
      verdictB.textContent = "No value. " + v.why;
      metricsB.appendChild(metric("Intrinsic value per share", "undefined", "the sum does not converge", "modelled"));
    } else {
      verdictB.className = "vb-verdict is-ok";
      verdictB.textContent = c.name + ": about " + usd(v.value) + " a share at these inputs; " + pc0(v.terminalShare) + " of it comes from beyond year " + state.n + ".";
      metricsB.appendChild(metric("Intrinsic value per share", usd(v.value), "at these four inputs", "modelled"));
      if (rg) metricsB.appendChild(metric("Range", usd(rg.low) + " to " + usd(rg.high), "rate +/- 1 point, growth +/- 2", "modelled"));
      metricsB.appendChild(metric("From beyond year " + state.n, pc0(v.terminalShare), "share of the value", "modelled"));
    }

    /* C */
    metricsC.textContent = "";
    var price = parseFloat(state.price);
    if (!(price > 0)) {
      verdictC.className = "vb-verdict is-ok";
      verdictC.textContent = "Type a price to test. Any number: the bench does not know, and will not show, what any market is asking.";
    } else if (v.undefined) {
      verdictC.className = "vb-verdict is-bad";
      verdictC.textContent = "No margin of safety can be measured against an undefined value. Restore terminal growth below the discount rate.";
    } else {
      var m = V.mos(v.value, price), rev = V.reverse({ base: rbNow.base, r: p.r, n: p.n, gt: p.gt, price: price });
      var mLow = rg ? V.mos(rg.low, price) : null;
      verdictC.className = "vb-verdict " + (mLow !== null && mLow > 0 ? "is-good" : (m > 0 ? "is-ok" : "is-bad"));
      verdictC.textContent = m > 0
        ? "At " + usd(price) + " the margin of safety is " + pc0(m) + " against the central value" + (mLow !== null ? ", " + pct(mLow) + " against the low end of the range." : ".")
        : "At " + usd(price) + " there is no margin: the price is " + pc0(-m) + " above the central value.";
      metricsC.appendChild(metric("Margin vs central value", pct(m), "(value - price) / value", "modelled"));
      if (mLow !== null) metricsC.appendChild(metric("Margin vs low end", pct(mLow), "the case you must survive", "modelled"));
      if (rev) metricsC.appendChild(metric("Growth this price implies", (rev.clipped ? (rev.clipped === "low" ? "below " : "above ") : "") + pct(rev.g), "per year for " + state.n + " years, then terminal", "modelled"));
    }
  }

  render();
})();
