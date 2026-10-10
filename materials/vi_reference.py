"""Independent Python reference for assets/vi-live.js.

Reads assets/vi-sample.js (the JSON after "window.VI_SAMPLE = "), recomputes every canon number
the pages quote, and prints them. A page may quote a number only if this script and the node run
of vi-live.js agree on it to the cent per share (and to 0.01 percentage points on errors).

Run:  python3 materials/vi_reference.py            # prints canon JSON
      python3 materials/vi_reference.py --compare  # also runs node and diffs the two
"""
import json
import math
import os
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
SAMPLE = os.path.join(HERE, "..", "assets", "vi-sample.js")

FADE_TO, FADE_YEARS, G0_CAP, G0_FLOOR = 0.025, 5, 0.08, -0.05
DEFAULTS = {"r": 0.09, "n": 10, "g": 0.05, "gt": 0.025, "holdout": 5}
RUNGS = ["last", "norm5", "norm10", "fade", "best"]


def load():
    txt = open(SAMPLE).read()
    start = txt.index("window.VI_SAMPLE = ") + len("window.VI_SAMPLE = ")
    end = txt.index(";\n", start)
    return json.loads(txt[start:end])


def mean(a):
    return sum(a) / len(a)


def median(a):
    b = sorted(a)
    n = len(b)
    return b[(n - 1) // 2] if n % 2 else (b[n // 2 - 1] + b[n // 2]) / 2


def series(c):
    ni, oe, ocf = [], [], []
    for i in range(len(c["fy"])):
        sh = c["sh"][i] / 100
        ni.append((c["ni"][i] / 10) / sh)
        oe.append(((c["ni"][i] + c["da"][i] - c["capex"][i]) / 10) / sh)
        ocf.append((c["ocf"][i] / 10) / sh)
    return {"ni": ni, "oe": oe, "ocf": ocf}


def rung_base(s, t, rid):
    if rid == "last":
        return {"base": s["ni"][t], "g": 0.0}
    if rid == "norm5":
        return {"base": mean(s["oe"][t - 4:t + 1]), "g": 0.0}
    if rid == "norm10":
        return {"base": mean(s["oe"][t - 9:t + 1]), "g": 0.0}
    if rid == "fade":
        a, b = mean(s["oe"][t - 9:t - 4]), mean(s["oe"][t - 4:t + 1])
        g0 = ((b / a) ** (1 / 5) - 1) / 2 if (a > 0 and b > 0) else 0.0
        g0 = max(G0_FLOOR, min(G0_CAP, g0))
        return {"base": mean(s["oe"][t - 9:t + 1]), "g0": g0, "fade": True}
    if rid == "best":
        best = -math.inf
        for i in range(t - 8, t + 1):
            if s["oe"][i - 1] > 0:
                best = max(best, s["oe"][i] / s["oe"][i - 1] - 1)
        return {"base": s["oe"][t], "g": best, "best": best}
    raise ValueError(rid)


def growth_at(rb, k):
    if rb.get("fade"):
        w = min(k - 1, FADE_YEARS - 1) / (FADE_YEARS - 1)
        return rb["g0"] + (FADE_TO - rb["g0"]) * w
    return rb["g"]


def forecast(rb, years):
    out, v = [], rb["base"]
    for k in range(1, years + 1):
        v = v * (1 + growth_at(rb, k))
        out.append(v)
    return out


def backtest(S, N):
    res = {r: {"per": []} for r in RUNGS}
    for c in S["companies"]:
        s, n = series(c), len(c["fy"])
        t = n - 1 - N
        actual = mean(s["oe"][t + 1:n])
        for r in RUNGS:
            rb = rung_base(s, t, r)
            f = mean(forecast(rb, N))
            g = rb["best"] if "best" in rb else (rb["g0"] if rb.get("fade") else 0.0)
            res[r]["per"].append([c["name"], c["fy"][t], f, actual, (f - actual) / abs(actual), g])
    for r in RUNGS:
        errs = [p[4] for p in res[r]["per"]]
        res[r]["mae"] = mean([abs(e) for e in errs])
        res[r]["medae"] = median([abs(e) for e in errs])
        res[r]["bias"] = mean(errs)
    return res


def dcf(base, r, n, g, gt):
    if not r > gt or not base > 0:
        return None
    pv1, cf = 0.0, base
    for k in range(1, n + 1):
        cf = cf * (1 + g)
        pv1 += cf / (1 + r) ** k
    tv = cf * (1 + gt) / (r - gt)
    pvt = tv / (1 + r) ** n
    return {"value": pv1 + pvt, "terminalShare": pvt / (pv1 + pvt)}


def rng(base, r, n, g, gt):
    vals = []
    for dr in (-0.01, 0.0, 0.01):
        for dg in (-0.02, 0.0, 0.02):
            v = dcf(base, r + dr, n, g + dg, gt)
            if v:
                vals.append(v["value"])
    return (min(vals), max(vals)) if vals else (None, None)


def reverse(base, r, n, gt, price):
    lo, hi = -0.5, 1.0
    f = lambda g: dcf(base, r, n, g, gt)["value"] - price
    if f(lo) > 0:
        return lo
    if f(hi) < 0:
        return hi
    for _ in range(200):
        m = (lo + hi) / 2
        if f(m) > 0:
            hi = m
        else:
            lo = m
    return (lo + hi) / 2


def canon(S):
    out = {"defaults": DEFAULTS, "backtest": {}, "now": []}
    for N in (3, 4, 5):
        b = backtest(S, N)
        out["backtest"][f"N{N}"] = {
            r: {"mae": round(b[r]["mae"], 4), "medae": round(b[r]["medae"], 4), "bias": round(b[r]["bias"], 4),
                "per": [[p[0], p[1], round(p[2], 2), round(p[3], 2), round(p[4], 4), round(p[5], 4)] for p in b[r]["per"]]}
            for r in RUNGS}
    d = DEFAULTS
    for c in S["companies"]:
        s, t = series(c), len(c["fy"]) - 1
        row = {"name": c["name"], "fy": c["fy"][t], "bases": {}}
        for r in RUNGS:
            rb = rung_base(s, t, r)
            g = rb["best"] if r == "best" else d["g"]
            v = dcf(rb["base"], d["r"], d["n"], g, d["gt"])
            lo, hi = rng(rb["base"], d["r"], d["n"], g, d["gt"])
            row["bases"][r] = {"base": round(rb["base"], 2), "g": round(g, 4),
                               "value": round(v["value"], 2) if v else None,
                               "low": round(lo, 2) if lo is not None else None,
                               "high": round(hi, 2) if hi is not None else None,
                               "terminalShare": round(v["terminalShare"], 4) if v else None}
        b10 = rung_base(s, t, "norm10")
        v10 = dcf(b10["base"], d["r"], d["n"], d["g"], d["gt"])["value"]
        row["reverse"] = [[k, round(k * v10, 2), round(reverse(b10["base"], d["r"], d["n"], d["gt"], k * v10), 4)] for k in (0.5, 2)]
        out["now"].append(row)
    return out


def flatten(o, p=""):
    if isinstance(o, dict):
        for k, v in o.items():
            yield from flatten(v, f"{p}.{k}")
    elif isinstance(o, list):
        for i, v in enumerate(o):
            yield from flatten(v, f"{p}[{i}]")
    else:
        yield p, o


if __name__ == "__main__":
    S = load()
    py = canon(S)
    print(json.dumps(py, indent=1))
    if "--compare" in sys.argv:
        js = subprocess.run(["node", "-e",
            'global.window={};require(process.argv[1]);const V=require(process.argv[2]);'
            'const c=V.canon(window.VI_SAMPLE);delete c.broken;console.log(JSON.stringify(c))',
            SAMPLE, os.path.join(HERE, "..", "assets", "vi-live.js")], capture_output=True, text=True, check=True)
        nd = json.loads(js.stdout)
        a, b = dict(flatten(py)), dict(flatten(nd))
        bad = []
        for k in sorted(set(a) | set(b)):
            x, y = a.get(k), b.get(k)
            if isinstance(x, (int, float)) and isinstance(y, (int, float)):
                if abs(x - y) > 0.0101:
                    bad.append((k, x, y))
            elif x != y:
                bad.append((k, x, y))
        print(f"COMPARE: {len(a)} values, {len(bad)} disagreements")
        for k in bad[:20]:
            print("  ", k)
        sys.exit(1 if bad else 0)
