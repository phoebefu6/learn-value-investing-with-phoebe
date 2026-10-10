"""Build assets/vi-sample.js from SEC EDGAR XBRL companyfacts JSON files.

Run:  python3 materials/build_vi_sample.py <dir with CIK##########.json files>

Fetching (done once, not by this script): https://data.sec.gov/api/xbrl/companyfacts/CIK##########.json
with a descriptive User-Agent carrying a contact, under 10 requests per second (SEC fair-access policy).

What it does, per company:
  * keeps annual facts only: form 10-K or 10-K/A, fp FY, a duration of 330 to 380 days;
  * keys each fact by its period END date; when several filings report the same period, the
    LATEST filed value wins (as restated) and the earliest is kept to count restatements;
  * per field, takes the first concept in a fixed preference list that has the year; which concept
    fed which year is written into the sample so the course map can cite it;
  * diluted weighted-average shares are split-adjusted: a split shows up as one period reported
    with two share counts in an integer-like ratio; every period whose latest report predates the
    restating filing is multiplied by that ratio;
  * stores millions of dollars rounded to 1 decimal (values * 10 as integers) and millions of
    shares to 2 decimals (values * 100 as integers), serialised with json.dumps.
"""
import json
import os
import sys
from datetime import date

COMPANIES = [
    # cik, short name, industry
    ("0000018230", "Caterpillar", "machinery, cyclical"),
    ("0000034088", "Exxon Mobil", "oil and gas, capital heavy"),
    ("0000200406", "Johnson & Johnson", "health care"),
    ("0000080424", "Procter & Gamble", "household goods"),
]

FIELDS = {
    "ni": ["NetIncomeLoss", "NetIncomeLossAvailableToCommonStockholdersBasic"],
    "da": ["DepreciationDepletionAndAmortization", "DepreciationAndAmortization",
           "DepreciationAmortizationAndAccretionNet"],
    "capex": ["PaymentsToAcquirePropertyPlantAndEquipment", "PaymentsToAcquireProductiveAssets"],
    "ocf": ["NetCashProvidedByUsedInOperatingActivities",
            "NetCashProvidedByUsedInOperatingActivitiesContinuingOperations"],
    "sh": ["WeightedAverageNumberOfDilutedSharesOutstanding", "WeightedAverageNumberOfSharesOutstandingBasic"],
}


def d(s):
    y, m, dd = s.split("-")
    return date(int(y), int(m), int(dd))


def fy_label(end):
    """Fiscal year label. A 52/53-week year that ends in the first ten days of January (J&J's
    FY2009 ended 2010-01-03) belongs to the previous calendar year."""
    e = d(end)
    return e.year - 1 if (e.month == 1 and e.day <= 10) else e.year


def annual(facts, concept):
    """{end_date: {"latest": (filed, val), "earliest": (filed, val), "n": count}}"""
    node = facts.get("us-gaap", {}).get(concept)
    if not node:
        return {}
    unit = "shares" if concept.startswith("WeightedAverage") else "USD"
    out = {}
    for f in node.get("units", {}).get(unit, []):
        if f.get("form") not in ("10-K", "10-K/A") or f.get("fp") != "FY":
            continue
        if "start" not in f:
            continue
        days = (d(f["end"]) - d(f["start"])).days
        if days < 330 or days > 380:
            continue
        e = f["end"]
        rec = out.setdefault(e, {"latest": None, "earliest": None, "vals": set()})
        item = (f["filed"], f["val"])
        rec["vals"].add(f["val"])
        if rec["latest"] is None or item[0] > rec["latest"][0]:
            rec["latest"] = item
        if rec["earliest"] is None or item[0] < rec["earliest"][0]:
            rec["earliest"] = item
    return out


def split_adjust(rec):
    """rec: end -> {latest, earliest}. Returns {end: adjusted shares} and the splits found."""
    splits = []
    for e, r in rec.items():
        lo, hi = r["earliest"][1], r["latest"][1]
        if lo > 0:
            ratio = hi / lo
            for k in (1.5, 2.0, 3.0, 4.0):
                if abs(ratio - k) / k < 0.03:
                    splits.append((r["latest"][0], k, e))
    # one factor per restating filing date (several periods restate in the same filing)
    by_filed = {}
    for filed, k, e in splits:
        by_filed.setdefault(filed, k)
    out = {}
    for e, r in rec.items():
        v = r["latest"][1]
        for filed, k in by_filed.items():
            if r["latest"][0] < filed:
                v *= k
        out[e] = v
    return out, sorted(by_filed.items())


def build(src_dir):
    data = {
        "source": "SEC EDGAR XBRL companyfacts API, data.sec.gov/api/xbrl/companyfacts",
        "units": "millions of USD (x10 integers), diluted weighted-average shares in millions (x100 integers)",
        "rule": "annual 10-K facts, latest filed value per fiscal period end",
        "companies": [],
    }
    log = []
    for cik, name, ind in COMPANIES:
        js = json.load(open(os.path.join(src_dir, f"CIK{cik}.json")))
        facts = js["facts"]
        per = {}
        used = {}
        restated = {}
        splits_found = []
        for key, concepts in FIELDS.items():
            got = {}
            src = {}
            for c in concepts:
                rec = annual(facts, c)
                if key == "sh" and rec:
                    adj, splits = split_adjust(rec)
                    splits_found += [(c, s) for s in splits]
                    vals = adj
                else:
                    vals = {e: r["latest"][1] for e, r in rec.items()}
                for e, v in vals.items():
                    if e not in got:
                        got[e] = v
                        src[e] = c
                        r = rec[e]
                        if r["earliest"][1] != r["latest"][1] and key != "sh":
                            restated.setdefault(key, []).append(
                                [e, r["earliest"][1], r["latest"][1]])
            per[key] = got
            used[key] = src
        # fiscal years where every field exists, consecutive run ending at the latest
        ends = sorted(set.intersection(*[set(v) for v in per.values()]))
        # collapse to one end per fiscal year label (year of the end date)
        byyear = {}
        for e in ends:
            byyear[fy_label(e)] = e
        years = sorted(byyear)
        # keep the longest consecutive run that ends at the last year
        run = [years[-1]]
        for y in reversed(years[:-1]):
            if y == run[0] - 1:
                run.insert(0, y)
            else:
                break
        rows = {k: [] for k in FIELDS}
        concept_used = {k: {} for k in FIELDS}
        for y in run:
            e = byyear[y]
            for k in FIELDS:
                v = per[k][e]
                rows[k].append(int(round(v / 1e6 * (100 if k == "sh" else 10))))
                concept_used[k].setdefault(used[k][e], []).append(y)
        data["companies"].append({
            "name": name, "cik": cik, "industry": ind, "entity": js.get("entityName"),
            "fy": run, "fyEnd": [byyear[y] for y in run],
            "ni": rows["ni"], "da": rows["da"], "capex": rows["capex"], "ocf": rows["ocf"],
            "sh": rows["sh"],
            "concepts": {k: {c: [ys[0], ys[-1], len(ys)] for c, ys in v.items()}
                         for k, v in concept_used.items()},
        })
        log.append({"name": name, "years": [run[0], run[-1]], "gaps_before_run": [y for y in years if y < run[0]],
                    "splits": splits_found,
                    "restated": {k: [r for r in v if int(r[0][:4]) in run] for k, v in restated.items()}})
    return data, log


if __name__ == "__main__":
    src = sys.argv[1]
    here = os.path.dirname(os.path.abspath(__file__))
    data, log = build(src)
    out = os.path.join(here, "..", "assets", "vi-sample.js")
    head = ("/* vi-sample.js - real annual figures from SEC EDGAR XBRL companyfacts (10-K filings).\n"
            " * Generated by materials/build_vi_sample.py with json.dumps; do not edit by hand.\n"
            " * Millions of USD x10 as integers; diluted weighted-average shares, millions x100. */\n")
    with open(out, "w") as fh:
        fh.write(head + "window.VI_SAMPLE = " + json.dumps(data, separators=(",", ":")) + ";\n")
        fh.write("if (typeof module !== 'undefined') module.exports = window.VI_SAMPLE;\n")
    json.dump(log, open(os.path.join(here, "vi-build-log.json"), "w"), indent=1)
    print(json.dumps(log, indent=1)[:4000])
    print("wrote", out, os.path.getsize(out), "bytes")
