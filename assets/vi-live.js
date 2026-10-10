/* vi-live.js - the intrinsic value engine, computed in the browser on real 10-K figures.
 *
 * Reads window.VI_SAMPLE (assets/vi-sample.js): annual net income, depreciation and amortisation,
 * capital expenditure, operating cash flow and diluted shares for four US filers, from SEC EDGAR
 * XBRL companyfacts. Nothing here is stored output: every number is computed when asked.
 *
 * Owner earnings (an approximation, labelled on the bench):
 *   net income + depreciation, depletion and amortisation - ALL capital expenditure.
 * Buffett's (c) is the capex needed to stand still; filings do not split maintenance from growth
 * capex, so all of it is subtracted. That understates owner earnings for a growing business.
 *
 * Node check (must agree with materials/vi_reference.py to the cent per share):
 *   node -e 'global.window={};require("./assets/vi-sample.js");const V=require("./assets/vi-live.js");
 *            console.log(JSON.stringify(V.canon(window.VI_SAMPLE),null,1))'
 */
(function (root) {
  "use strict";

  var FADE_TO = 0.025;     /* growth the fade rung lands on */
  var FADE_YEARS = 5;      /* years the fade takes */
  var G0_CAP = 0.08, G0_FLOOR = -0.05;

  function mean(a) { var s = 0; for (var i = 0; i < a.length; i++) s += a[i]; return s / a.length; }
  function median(a) {
    var b = a.slice().sort(function (x, y) { return x - y; }), n = b.length;
    return n % 2 ? b[(n - 1) / 2] : (b[n / 2 - 1] + b[n / 2]) / 2;
  }

  /* per-share series for one company, dollars per share */
  function series(c) {
    var n = c.fy.length, oe = [], ni = [], ocf = [], i;
    for (i = 0; i < n; i++) {
      var sh = c.sh[i] / 100;                       /* millions of shares */
      ni.push((c.ni[i] / 10) / sh);
      oe.push(((c.ni[i] + c.da[i] - c.capex[i]) / 10) / sh);
      ocf.push((c.ocf[i] / 10) / sh);
    }
    return { fy: c.fy, ni: ni, oe: oe, ocf: ocf };
  }

  /* starting points of the five rungs, standing at index t (inclusive) */
  function rungBase(s, t, id) {
    switch (id) {
      case "last": return { base: s.ni[t], g: [0] };
      case "norm5": return { base: mean(s.oe.slice(t - 4, t + 1)), g: [0] };
      case "norm10": return { base: mean(s.oe.slice(t - 9, t + 1)), g: [0] };
      case "fade": {
        var a = mean(s.oe.slice(t - 9, t - 4)), b = mean(s.oe.slice(t - 4, t + 1));
        var g0 = (a > 0 && b > 0) ? (Math.pow(b / a, 1 / 5) - 1) / 2 : 0;
        g0 = Math.max(G0_FLOOR, Math.min(G0_CAP, g0));
        return { base: mean(s.oe.slice(t - 9, t + 1)), g0: g0, fade: true };
      }
      case "best": {
        var best = -Infinity;
        for (var i = t - 8; i <= t; i++) {
          if (s.oe[i - 1] > 0) best = Math.max(best, s.oe[i] / s.oe[i - 1] - 1);
        }
        return { base: s.oe[t], g: [best], best: best };
      }
    }
    throw new Error("unknown rung " + id);
  }

  function growthAt(rb, k) {            /* growth applied in forecast year k = 1, 2, ... */
    if (rb.fade) {
      var w = Math.min(k - 1, FADE_YEARS - 1) / (FADE_YEARS - 1);
      return rb.g0 + (FADE_TO - rb.g0) * w;
    }
    return rb.g[0];
  }

  function forecast(rb, years) {
    var out = [], v = rb.base;
    for (var k = 1; k <= years; k++) { v = v * (1 + growthAt(rb, k)); out.push(v); }
    return out;
  }

  var RUNGS = ["last", "norm5", "norm10", "fade", "best"];

  /* hold out the last N fiscal years; forecast them from what was known before */
  function backtest(S, N) {
    var res = {}, r, ci;
    for (r = 0; r < RUNGS.length; r++) res[RUNGS[r]] = { per: [], mae: 0, bias: 0 };
    for (ci = 0; ci < S.companies.length; ci++) {
      var c = S.companies[ci], s = series(c), n = c.fy.length, t = n - 1 - N;
      if (t - 9 < 0) throw new Error(c.name + ": not enough years for N=" + N);
      var actual = mean(s.oe.slice(t + 1, n));
      for (r = 0; r < RUNGS.length; r++) {
        var rb = rungBase(s, t, RUNGS[r]);
        var f = mean(forecast(rb, N));
        res[RUNGS[r]].per.push({ name: c.name, from: c.fy[t], forecast: f, actual: actual,
          err: (f - actual) / Math.abs(actual), growth: rb.best !== undefined ? rb.best : (rb.fade ? rb.g0 : 0) });
      }
    }
    for (r = 0; r < RUNGS.length; r++) {
      var p = res[RUNGS[r]].per, a = [], b = [];
      for (ci = 0; ci < p.length; ci++) { a.push(Math.abs(p[ci].err)); b.push(p[ci].err); }
      res[RUNGS[r]].mae = mean(a); res[RUNGS[r]].medae = median(a); res[RUNGS[r]].bias = mean(b);
    }
    return res;
  }

  /* two-stage DCF on owner earnings per share.
     p: { base, r, n, g, gt } as decimals; growth g for n years, then gt forever. */
  function dcf(p) {
    if (!(p.r > p.gt)) {
      return { undefined: true,
        why: "Terminal growth " + (p.gt * 100).toFixed(1) + "% is at or above the discount rate " +
             (p.r * 100).toFixed(1) + "%. The perpetuity sum never converges: each later year is worth " +
             "as much or more today than the one before, so the total is infinite. There is no value to print." };
    }
    if (!(p.base > 0)) {
      return { undefined: true, why: "The starting owner earnings are zero or negative, so a growth model has nothing to grow. Normalise first." };
    }
    var pv1 = 0, cf = p.base, k;
    for (k = 1; k <= p.n; k++) { cf = cf * (1 + p.g); pv1 += cf / Math.pow(1 + p.r, k); }
    var tv = cf * (1 + p.gt) / (p.r - p.gt);
    var pvT = tv / Math.pow(1 + p.r, p.n);
    return { value: pv1 + pvT, pvStage: pv1, pvTerminal: pvT, terminalShare: pvT / (pv1 + pvT) };
  }

  /* a range, not a number: discount rate +/- 1 point, growth +/- 2 points */
  function range(p) {
    var vals = [], dr, dg;
    for (dr = -0.01; dr <= 0.0101; dr += 0.01) {
      for (dg = -0.02; dg <= 0.0201; dg += 0.02) {
        var v = dcf({ base: p.base, r: p.r + dr, n: p.n, g: p.g + dg, gt: p.gt });
        if (!v.undefined) vals.push(v.value);
      }
    }
    if (!vals.length) return null;
    return { low: Math.min.apply(null, vals), high: Math.max.apply(null, vals), count: vals.length };
  }

  /* reverse DCF: the stage-one growth a typed price implies */
  function reverse(p) {
    if (!(p.r > p.gt) || !(p.base > 0) || !(p.price > 0)) return null;
    var lo = -0.5, hi = 1.0, i;
    function f(g) { return dcf({ base: p.base, r: p.r, n: p.n, g: g, gt: p.gt }).value - p.price; }
    if (f(lo) > 0) return { g: lo, clipped: "low" };
    if (f(hi) < 0) return { g: hi, clipped: "high" };
    for (i = 0; i < 200; i++) { var m = (lo + hi) / 2; if (f(m) > 0) hi = m; else lo = m; }
    return { g: (lo + hi) / 2 };
  }

  function mos(value, price) { return (value - price) / value; }

  /* the numbers the pages quote, in one object */
  var DEFAULTS = { r: 0.09, n: 10, g: 0.05, gt: 0.025, holdout: 5 };
  function canon(S) {
    var out = { defaults: DEFAULTS, backtest: {}, now: [] };
    [3, 4, 5].forEach(function (N) {
      var b = backtest(S, N), o = {};
      RUNGS.forEach(function (r) { o[r] = { mae: +b[r].mae.toFixed(4), medae: +b[r].medae.toFixed(4), bias: +b[r].bias.toFixed(4),
        per: b[r].per.map(function (x) { return [x.name, x.from, +x.forecast.toFixed(2), +x.actual.toFixed(2), +x.err.toFixed(4), +x.growth.toFixed(4)]; }) }; });
      out.backtest["N" + N] = o;
    });
    S.companies.forEach(function (c) {
      var s = series(c), t = c.fy.length - 1, row = { name: c.name, fy: c.fy[t], bases: {} };
      RUNGS.forEach(function (r) {
        var rb = rungBase(s, t, r);
        var g = r === "best" ? rb.best : DEFAULTS.g;
        var v = dcf({ base: rb.base, r: DEFAULTS.r, n: DEFAULTS.n, g: g, gt: DEFAULTS.gt });
        var rg = range({ base: rb.base, r: DEFAULTS.r, n: DEFAULTS.n, g: g, gt: DEFAULTS.gt });
        row.bases[r] = { base: +rb.base.toFixed(2), g: +g.toFixed(4), value: v.undefined ? null : +v.value.toFixed(2),
          low: rg ? +rg.low.toFixed(2) : null, high: rg ? +rg.high.toFixed(2) : null,
          terminalShare: v.undefined ? null : +v.terminalShare.toFixed(4) };
      });
      var b10 = rungBase(s, t, "norm10"), v10 = dcf({ base: b10.base, r: DEFAULTS.r, n: DEFAULTS.n, g: DEFAULTS.g, gt: DEFAULTS.gt }).value;
      row.reverse = [0.5, 2].map(function (k) { var rv = reverse({ base: b10.base, r: DEFAULTS.r, n: DEFAULTS.n, gt: DEFAULTS.gt, price: k * v10 });
        return [k, +(k * v10).toFixed(2), +rv.g.toFixed(4)]; });
      out.now.push(row);
    });
    out.broken = dcf({ base: 1, r: 0.09, n: 10, g: 0.05, gt: 0.09 });
    return out;
  }

  var API = { series: series, rungBase: rungBase, forecast: forecast, backtest: backtest, dcf: dcf,
              range: range, reverse: reverse, mos: mos, canon: canon, RUNGS: RUNGS, DEFAULTS: DEFAULTS };
  root.VI = API;
  if (typeof module !== "undefined") module.exports = API;
})(typeof window !== "undefined" ? window : this);
