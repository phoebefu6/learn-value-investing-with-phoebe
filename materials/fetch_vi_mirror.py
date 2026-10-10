"""Fetch the four filers' XBRL facts from a public mirror of SEC EDGAR companyfacts and write
them as CIK##########.json files in the SEC companyfacts shape, for build_vi_sample.py.

Why a mirror: data.sec.gov returned HTTP 403 (Akamai "undeclared automated tool" block on this
build machine's IP) from 2026-10-09 09:58 onward. The mirror is the Hugging Face dataset
DenyTranDFW/edgar_xbrl_companyfacts (GPL, last modified 2026-10-04), a flattened copy of the
same SEC companyfacts JSON. Values are spot-checked against the 10-K text in the course map.

Run:  python3 materials/fetch_vi_mirror.py <out dir> [local copy of Facts_UsGaap.parquet]
(A remote scan of the 1.5 GB file took over 30 minutes; downloading it first is faster.)
"""
import json
import os
import sys

import duckdb

from build_vi_sample import COMPANIES, FIELDS

URL = ("https://huggingface.co/datasets/DenyTranDFW/edgar_xbrl_companyfacts/"
       "resolve/main/Facts_UsGaap.parquet")


def main(out, src=None):
    os.makedirs(out, exist_ok=True)
    con = duckdb.connect()
    if src is None:
        con.sql("INSTALL httpfs; LOAD httpfs;")
    src = src or URL
    concepts = sorted({c for cs in FIELDS.values() for c in cs})
    ciks = [c[0] for c in COMPANIES]
    like = " OR ".join(f"source_folder LIKE 'CIK{c}%'" for c in ciks)
    inlist = ",".join(f"'{c}'" for c in concepts)
    rows = con.sql(
        f"SELECT source_folder, item, unit_type, form, fp, fy, start, \"end\", filed, accn, frame, val_dec "
        f"FROM read_parquet('{src}') WHERE ({like}) AND item IN ({inlist})"
    ).fetchall()
    by = {}
    for sf, item, unit, form, fp, fy, start, end, filed, accn, frame, val in rows:
        cik = sf[3:13]
        f = {"form": form, "fp": fp, "fy": int(fy) if fy and fy.isdigit() else fy,
             "end": end, "filed": filed, "accn": accn, "val": int(val) if val == int(val) else float(val)}
        if start:
            f["start"] = start
        if frame:
            f["frame"] = frame
        by.setdefault(cik, {}).setdefault(item, {}).setdefault(unit, []).append(f)
    for cik, name, _ in COMPANIES:
        facts = {"cik": int(cik), "entityName": name, "source": URL,
                 "facts": {"us-gaap": {k: {"units": v} for k, v in by.get(cik, {}).items()}}}
        with open(os.path.join(out, f"CIK{cik}.json"), "w") as fh:
            json.dump(facts, fh)
        n = sum(len(u) for v in by.get(cik, {}).values() for u in v.values())
        print(cik, name, "concepts", len(by.get(cik, {})), "facts", n)


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2] if len(sys.argv) > 2 else None)
