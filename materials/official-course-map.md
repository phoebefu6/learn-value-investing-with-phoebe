# Official course map - learn-value-investing-with-phoebe

Internal build document. Not linked from any audience-facing page. Every number quoted on any
page comes from here, with its verification tier. If a fact is not here, the page teaches the
uncertainty instead of inventing a number.

Built 2026-10-09. Scope approved by Phoebe 2026-10-09 (biz batch): **Value Investing, the
Graham/Buffett approach as a reasoning discipline, not stock picking.** Bucket `biz`, d3, audience
everyone. Two tracks: Owner (a1-a6, no code) and Analyst (p1-p10, p10 = the bench). The skeleton
Phoebe saw said "6 + 8"; the build uses 6 + 10 to match the biz sibling shape and the gate count
(recorded as a correction in the lead's report).

**Educational, not investment advice** appears on the landing blurb, index.html, a1, p1 and on the
bench widget itself. No market prices, tickers or price charts on any page; margin of safety is
always shown against a price the learner types, or against a constructed price for Halden.

## Verification tiers

| Tier | Meaning |
|------|---------|
| **computed** | Recomputed in this build from SEC EDGAR XBRL filings by `materials/build_vi_sample.py` + `assets/vi-live.js`, agreeing with `materials/vi_reference.py` |
| **modelled** | Arithmetic on a computed number under a stated assumption (a discount rate, a growth path); the page says which assumption |
| **read at source** | Opened and read in the primary source during this build (2026-10-09) |
| **reported** | Widely cited; not read at source in this build; the page says "reported" |
| **constructed** | Invented for teaching; the page says "constructed" |
| **not claimed** | Circulates without a source; the page teaches the uncertainty or omits it |

---

## Sources, with tiers

### Berkshire Hathaway shareholder letters (berkshirehathaway.com/letters), read at source

- **1977 letter**, "Insurance Investments": Berkshire selects marketable equity securities much as
  it would evaluate a business for acquisition in its entirety; it wants a business (1) one that we
  can understand, (2) with favorable long-term prospects, (3) operated by honest and competent
  people, and (4) available at a very attractive price. **read at source**.
- **1986 letter**, appendix "Purchase-Price Accounting Adjustments and the 'Cash Flow' Fallacy":
  owner earnings = (a) reported earnings plus (b) depreciation, depletion, amortization, and
  certain other non-cash charges, less (c) the average annual amount of capitalized expenditures
  for plant and equipment, etc. that the business requires to fully maintain its long-term
  competitive position and its unit volume. Owner earnings "do not yield the deceptively precise
  figures provided by GAAP, since (c) must be a guess", and (c) is "sometimes very difficult" to
  make. "I would rather be vaguely right than precisely wrong." When (c) exceeds (b), GAAP earnings
  overstate owner earnings; the oil industry is his example. He criticises "cash flow" figures
  that add (a) and (b) and omit (c). Scott Fetzer: 1986 earnings 40.2 million before purchase
  accounting (Company O) vs 28.6 million after (Company N), the 11.6 million gap being non-cash
  charges from purchase-price write-ups; his estimate of Scott Fetzer's (c) was about 8.3 million.
  **read at source**. Quote at most one short line per page.
- **1987 letter**: Mr. Market, credited to Ben Graham, "my friend and teacher"; an obliging
  partner who quotes a price every day at which he will buy your interest or sell you his; his
  quotes swing with his moods, elated or gloomy; he does not mind being ignored and will be back
  tomorrow; "Mr. Market is there to serve you, not to guide you"; play only if you understand and
  can value the business better than he does. The letter does not name a Graham book or chapter.
  **read at source**.
- **1989 letter**, "Mistakes of the First Twenty-five Years": buying a cheap textile business
  (Berkshire itself); "cigar butt" investing in poor businesses at bargain prices; Hochschild Kohn,
  a department store bought below book that returned little ("Time is the friend of the wonderful
  business"); good managers cannot fix bad economics; avoid problems rather than solve them; the
  "institutional imperative" (inertia, empire-building, imitation of peers); never a good deal
  with a bad person; mistakes of omission, passing on things clearly within competence; overly
  conservative financing. **read at source**.
- **1996 letter**: an investor needs to evaluate businesses within a circle of competence; the
  size of the circle is not very important, knowing its boundaries is vital. Most investors will
  likely do best owning a low-fee index fund. **read at source**.

### Buffett, "The Superinvestors of Graham-and-Doddsville" (Hermes, Columbia Business School, Fall 1984)

Edited transcript of the May 1984 Columbia talk, read in a hosted PDF reprint (appendix pages of a
revised Intelligent Investor edition). Margin of safety: "you do not cut it close"; do not buy a
business worth 83 million for 80 million; leave an enormous margin; build a bridge to carry 30,000
pounds but drive only 10,000-pound trucks across it. **read at source (reprint)**.

### Graham, "The Intelligent Investor" and Graham and Dodd, "Security Analysis"

Chapter 8 (Mr. Market) and chapter 20 ("Margin of Safety as the Central Concept of Investment") of
The Intelligent Investor; Security Analysis (1934). **reported**: the books were not read at source
in this build. Pages name the chapters and paraphrase; Graham is never quoted directly. The
Mr. Market allegory is taught from Buffett's 1987 telling (read at source) and credited to Graham.

### Damodaran (pages.stern.nyu.edu/~adamodar), read at source

Valuation class slides, session 12 (Spring 2023 undergraduate), "terminal value": with perpetual
growth, obey the growth cap; **the stable growth rate cannot exceed the growth rate of the economy
but it can be lower**; the riskfree rate is a simple proxy for nominal economic growth; reinvestment
in stable growth = stable growth rate / stable-period return on capital (g / ROC). **read at
source** (PDF `podcasts/valUGspr23/session12slides.pdf`, read 2026-10-09). Standard two-stage DCF and
Gordon growth mechanics are taught as standard finance.

### Mauboussin, Callahan and Majd, "The Base Rate Book" (Credit Suisse, 26 September 2016)

Read at source in a hosted copy of the Credit Suisse PDF (152 pages). **read at source (hosted copy)**.

- Sample: top 1,000 global companies by market capitalisation since 1950, all sectors, about 60
  percent of global market cap, includes "dead" companies; figures inflation-adjusted to 2015
  dollars. About one-half of all public companies cease to exist within ten years of listing.
- Sales growth, 3-year CAGR, 1950-2015: mean 8.1 percent, median 5.4 percent, standard deviation
  18.7 percent. 23 percent of companies had negative real sales growth over 3 years; 20 percent
  shrank over 5 years. Growth rates and their spread decline with size. Median sales growth vs US
  GDP growth correlation 0.66. Correlation of sales growth with total shareholder return: 0.20
  (1 year), 0.25 (3 years), 0.28 (5 years).
- Earnings: "earnings growth rates are not very persistent". Analyst forecasts of 3-year net income
  growth have a standard deviation of 19.2 percent against 34.6 percent for actual past growth:
  forecasts are "too optimistic and too narrow". Sales growth is more persistent than earnings
  growth. 33 percent of companies had negative real net income growth year over year; 31 percent
  had lower net income over 3 years, 29 percent over 5 years, 24 percent over 10 years.
- CFROI (returns): companies sorted into quintiles by CFROI minus the universe median; the spread
  from top to bottom quintile shrinks from 18 to 9 percentage points over 10 years: modest
  regression toward the mean. Regression toward the mean does not require competition as its cause.
- **Not used:** the "18.1 percent of small companies grew over 20 percent for ten years" figure
  circulates in summaries; the table in the PDF could not be cleanly read, so it is **not claimed**.

### Mauboussin and Rappaport, "Expectations Investing" (2001; revised 2021)

Reverse DCF: start from the price and solve for the expectations it implies. **reported** (book not
read at source). Pages say "reported" and teach the mechanic, which is standard arithmetic.

### Value versus growth evidence (CONTESTED - teach the disagreement)

- Fama and French, "The Value Premium" (2020 working paper; Review of Asset Pricing Studies, 2021):
  value premiums were much lower in 1991-2019 than in 1963-1991, but monthly volatility is high
  enough that the authors cannot reject equal expected premiums in both halves; the declines
  "seem large, but statistically they are indistinguishable from zero". Chicago Booth Review's
  summary: big-stock value premium 4.3 percent a year (1963-1991) vs 0.6 percent (1991-2019);
  small-stock 7 percent vs 4 percent. **reported** (SSRN abstract returned 403; figures from the
  Chicago Booth Review summary, read 2026-10-09).
- Arnott, Harvey, Kalesnik and Linnainmaa, "Reports of Value's Death May Be Greatly Exaggerated"
  (Financial Analysts Journal, 2021): argue much of value's underperformance came from value stocks
  getting cheaper relative to growth, and that intangibles distort book value. **reported**.
- Page rule: never claim value "works" or "is dead". The Owner and Analyst tracks teach a reasoning
  discipline about a business; factor returns of cheap-versus-dear portfolios are a different
  question, and the evidence on it is genuinely disputed.

### Behavioural sources for Owner session 6

- Anchoring: Tversky and Kahneman, "Judgment under Uncertainty: Heuristics and Biases", Science,
  1974. **reported**.
- Loss aversion: Kahneman and Tversky, "Prospect Theory", Econometrica, 1979. **reported**. No
  specific coefficient is quoted on any page.
- Overconfidence in forecasts: the Base Rate Book figure (19.2 vs 34.6 percent spread) is the only
  number used. **read at source**.

---

## Owner track running case: Halden Tiles (CONSTRUCTED, every figure invented)

Halden Tiles is a constructed family firm selling floor and wall tiles, bought from four importers,
to small local builders from three showrooms. A cousin runs it and offers you 10 percent. A
neighbour paid "about a million" for a similar stake last year (a price for a different business).

| Item | Constructed value | Where |
|---|---|---|
| Reported profit | 1.10 million a year | a1 |
| Depreciation and amortisation | 0.40 million | a1 |
| Spend to stand still (showroom refits 0.25, vans 0.15, display range 0.10) | 0.50 million | a1 |
| Owner earnings | **1.00 million a year** | a1 onwards |
| Weak points | two builders now order direct online; books only the cousin understands | a1, a4 |

Value of the WHOLE business, two-stage model, owner earnings 1.00 million, 10-year first stage
(modelled with `vi-live.js` dcf; numbers checked 2026-10-09):

| View | Path | at 8% | at 10% | at 12% |
|---|---|---|---|---|
| Bear | -3% a year for 10 years, then 0% | 10.08 | **8.18** | 6.91 |
| Base | 2% a year throughout | 17.00 | **12.75** | 10.20 |
| Bull | 5% a year for 10 years, then 2% | 21.42 | **15.82** | 12.48 |

- Default discount rate for Halden: 10 percent (constructed: a judgment for a small private firm).
- **Range at 10 percent: 8.2 to 15.8 million for the whole; a 10 percent stake 0.82 to 1.58 million.**
- Across 8 to 12 percent and all three views: 6.9 to 21.4 million. The width is the lesson.
- Share of base value from beyond year 10 (terminal share) at 10 percent: 47 percent (base),
  35 percent (bear), 51 percent (bull).
- Base value split at 10 percent: 6.76 million from years 1 to 10, 5.99 million from beyond year 10.
- Year-10 owner earnings: bear about 0.74 million (0.97^10), bull about 1.63 million (1.05^10).
- Cousin's asking price for 10 percent: **1.00 million** (constructed), implying 10.0 million for the
  whole. Reverse DCF at 10 percent, 2 percent terminal: the price implies owner earnings shrinking
  about **1.4 percent a year** for 10 years.
- Margin of safety at 1.00 million for 10 percent: vs base 12.75: **21.6 percent**; vs bull 15.82:
  36.8 percent; vs bear 8.18: **-22.2 percent** (the price is above the bear value).
- A buyer who insists on a one-third margin against the base value would pay at most 8.50 million
  for the whole, 0.85 million for 10 percent.
- Mr Market (a5): the cousin's daily offers to buy or sell 10 percent over two weeks are
  constructed by the a5 page and labelled so; none may be presented as data.

---

## Analyst track running data: SEC EDGAR XBRL companyfacts, via a mirror (computed)

**Provenance.** data.sec.gov and www.sec.gov returned HTTP 403 to this build machine from
2026-10-09 09:58 (Akamai "undeclared automated tool" block on the IP; the descriptive User-Agent
`learn-with-phoebe course build contact@phoebefu6.github.io` did not help). The main thread pulled the
same SEC companyfacts records from a public mirror, the Hugging Face dataset
`DenyTranDFW/edgar_xbrl_companyfacts` (GPL, file `Facts_UsGaap.parquet`, modified 2026-10-04), with
`materials/fetch_vi_mirror.py`, written in the companyfacts shape to `materials/edgar-mirror/`.
`materials/build_vi_sample.py` then wrote `assets/vi-sample.js` (6,400 bytes, json.dumps).
**Tier: computed from an SEC mirror.**

**Spot-check against SEC's own API (read 2026-10-10 through WebFetch, which reaches data.sec.gov
from a different network; the 10-K HTML itself was not opened):** every value below matched the
mirror exactly, in every 10-K that reported it.
- Exxon Mobil NetIncomeLoss FY2020 -22,440 million; FY2022 55,740 million.
- Caterpillar NetIncomeLossAvailableToCommonStockholdersBasic FY2016 -67 million; FY2024 10,792 million.
- Procter & Gamble PaymentsToAcquirePropertyPlantAndEquipment FY2019 3,347 million; FY2026 4,409 million.
- Johnson & Johnson NetIncomeLoss FY2017 1,300 million; FY2023 35,153 million.
- Johnson & Johnson diluted shares FY2024 and FY2025 both 2,429.4 million: identical in SEC's own
  API, so the figure is faithful to the filing data, though the coincidence is unusual. Not corrected.

**Rules in the builder:** annual facts only (form 10-K or 10-K/A, fp FY, 330 to 380 day duration);
keyed by period end; the latest filed value wins (as restated); first concept in a preference list
that has the year; fiscal-year label = year of the period end, except a 52/53-week year ending in
the first ten days of January belongs to the previous year (J&J FY2009, FY2015, FY2020 end on
3 January); stored as millions x10 and shares millions x100 integers. Split detection found none.

| Filer (CIK) | Years | Concepts that fed each field |
|---|---|---|
| Caterpillar (0000018230) | FY2007-FY2025, 19 | NI: NetIncomeLoss 2007-2010, NetIncomeLossAvailableToCommonStockholdersBasic 2011-2025 (the NetIncomeLoss tag stops after 2010) · D&A: DepreciationDepletionAndAmortization · capex: PaymentsToAcquireProductiveAssets 2007-2017, PaymentsToAcquirePropertyPlantAndEquipment 2018-2025 (equal in the 2018-2019 overlap) · OCF: NetCashProvidedByUsedInOperatingActivities, ContinuingOperations for 2011-2016 · shares: diluted |
| Exxon Mobil (0000034088) | FY2011-FY2025, 15 | NI: NetIncomeLoss · D&A: DepreciationDepletionAndAmortization · capex: PaymentsToAcquirePropertyPlantAndEquipment · OCF: as CAT (ContinuingOperations 2013-2014) · shares: diluted 2011-2013, WeightedAverageNumberOfSharesOutstandingBasic 2014-2025 (no diluted tag after 2013; Exxon reports basic and diluted as the same). Earlier years lack a share count, so the run starts 2011 |
| Johnson & Johnson (0000200406) | FY2010-FY2025, 16 | NetIncomeLoss · DepreciationDepletionAndAmortization · PaymentsToAcquirePropertyPlantAndEquipment · NetCashProvidedByUsedInOperatingActivities · diluted shares |
| Procter & Gamble (0000080424) | FY2008-FY2026 (June year-ends), 19 | NetIncomeLoss · D&A: DepreciationAndAmortization 2008, DepreciationDepletionAndAmortization 2009-2026 · PaymentsToAcquirePropertyPlantAndEquipment · OCF · diluted shares |

**Restatements handled (latest filed value used):** Caterpillar net income FY2014 3,695 to 2,452
million and FY2015 2,102 to 2,512 million (restated in later 10-Ks); Caterpillar capex FY2008 and
FY2009 and operating cash flow in six years restated by small amounts; J&J operating cash flow
FY2014 and FY2015; P&G operating cash flow FY2010 and FY2011. Exxon: none.

**Known approximations, labelled on every page that uses them:**
- Owner earnings = net income + D&A - ALL capital expenditure, per diluted share. Filings do not
  split maintenance from growth capex, so this understates Buffett's figure for a growing business.
- Caterpillar's capex concept excludes equipment leased to others (Cat Financial), while its D&A
  includes depreciation on that equipment, so CAT owner earnings are overstated by the leasing
  spend. Taught as the gap in p1.
- One-offs left in on purpose: Exxon 2020 (net loss -22,440 million; D&A 46,009 million including
  impairments), J&J 2017 (net income 1,300 million) and 2023 (35,153 million), P&G 2019 (3,897
  million). They are why normalising exists.

**Owner earnings per share (computed, dollars), selected years:** Caterpillar 2016 3.18, 2019 13.42,
2024 22.39, 2025 17.63 · Exxon 2015 1.84, 2020 1.47, 2022 14.60, 2025 6.15 · J&J 2017 1.33, 2023
14.88, 2025 12.13 · P&G 2019 1.33, 2026 6.11. Net income per share last year: CAT 18.81, XOM 6.70,
J&J 11.03, P&G 6.62.

### The ladder: hold out the last N fiscal years and forecast them (computed; node = python, 562 values, 0 disagreements)

Forecast = mean per-year owner earnings per share over the held-out years, from what was known at
the start; error = (forecast - actual) / |actual|; mean absolute error across the four filers.
Rungs: 1 last year's net income per share, flat · 2 five-year mean owner earnings, flat · 3 ten-year
mean, flat · 4 ten-year mean growing at half its own past growth (CAGR between the two five-year
halves), capped at 8 percent, floored at -5, fading linearly to 2.5 percent over five years ·
anti-lever: last year's owner earnings compounded at the best single year-on-year growth of the
past ten.

| Hold-out | 1 last year | 2 five-year | 3 ten-year | 4 fade | anti-lever |
|---|---|---|---|---|---|
| 3 years | 39.7% | **28.4%** | 41.8% | 36.5% | 4,135.2% |
| 4 years | **26.8%** | 42.1% | 47.9% | 44.7% | 10,436.3% |
| 5 years (default) | 70.4% | **47.4%** | 50.2% | 47.7% | 19,614.8% |

What the data shows, stated as found: the five-year normalised rung wins at the 3- and 5-year
hold-outs; last year's earnings win at 4 years (it starts from 2021, a strong year); the ten-year
rung is never best. **Every honest rung undershoots** (bias equals minus the mean miss at N=5): owner
earnings for all four rose sharply after 2020. The anti-lever is worse by two orders of magnitude
because the best year is usually a rebound from a trough (at N=5: J&J 2018 over 2017, +409.7
percent; Caterpillar 2018 over 2017, +179.4 percent; P&G 2020 over 2019, +271.7 percent; Exxon
2016 over 2015, +82.3 percent).

N=5 per company (start year, forecast, actual, miss): CAT from 2020: last 5.46 vs 17.94 (-69.5%),
five-year 8.40 (-53.2%), ten-year 7.71 (-57.0%), fade 8.20 (-54.3%) · XOM from 2020: last -5.25 vs
8.87 (-159.3%), five-year 3.46 (-61.0%), ten-year 3.77 (-57.5%), fade 3.74 (-57.8%) · J&J from 2020:
last 5.51 vs 10.21 (-46.0%), five-year 5.63 (-44.8%), ten-year 5.22 (-48.9%), fade 5.53 (-45.9%) ·
P&G from 2021: last 5.50 vs 5.90 (-6.8%), five-year 4.09 (-30.6%), ten-year 3.70 (-37.3%), fade
3.96 (-32.9%). Anti-lever best-year growth used: CAT +179.4%, XOM +82.3%, J&J +409.7%, P&G +271.7%.

### Valuation today (modelled on computed bases): defaults r 9%, 10 growth years, g 5%, terminal 2.5%

Range = discount rate +/- 1 point x growth +/- 2 points (nine cases). Terminal share at these
defaults is 57.0 percent for every base (it does not depend on the base).

| Filer, last FY | Rung 1 base / value | Rung 2 base / value (range) | Rung 3 base / value (range) |
|---|---|---|---|
| Caterpillar FY2025 | 18.81 / 358.12 | 17.94 / 341.59 (254.27 to 475.21) | 13.17 / 250.78 (186.67 to 348.88) |
| Exxon Mobil FY2025 | 6.70 / 127.56 | 8.87 / 168.83 (125.67 to 234.86) | 6.16 / 117.34 (87.34 to 163.24) |
| Johnson & Johnson FY2025 | 11.03 / 210.06 | 10.21 / 194.40 (144.70 to 270.44) | 7.92 / 150.81 (112.26 to 209.80) |
| Procter & Gamble FY2026 | 6.62 / 126.11 | 5.90 / 112.38 (83.65 to 156.34) | 5.00 / 95.16 (70.84 to 132.39) |

Rung 4 shares rung 3's starting point, so its value at the same sliders equals rung 3's.
Anti-lever valuations run to millions of dollars per share (CAT 3,756,447.17; terminal share
above 90 percent): the arithmetic of compounding a rebound for ten years.

**Reverse DCF (computed, scale-free):** on any rung-3 base at the defaults, a typed price equal to
**twice** the central value implies **14.17 percent** a year growth for 10 years; **half** the value
implies **-4.31 percent**. Example: P&G rung 3, value 95.16; a test price of 190.33 implies 14.17 percent and one of 47.58 implies -4.31
percent. Pages present these as test prices the learner types, never as market prices.

**Extra canon for p2 to p9 (computed with the same `vi-live.js` functions the compare verified; node, 2026-10-10):**
- P&G rung 3 (ten-year owner earnings 4.998525 a share, displayed 5.00; code must use the exact base or it prints 95.19, not 95.16) at r 9%, 10 years of 5% then 2.5%: year-by-year
  owner earnings and present values: y1 5.25 / 4.82, y2 5.51 / 4.64, y3 5.79 / 4.47, y4 6.08 / 4.30,
  y5 6.38 / 4.15, y6 6.70 / 3.99, y7 7.03 / 3.85, y8 7.39 / 3.71, y9 7.75 / 3.57, y10 8.14 / 3.44.
  Stage-one present value 40.93; terminal value at year 10 128.39, present value 54.24; total 95.16
  (the two parts add to 95.17 because each is rounded).
- P&G sensitivity grid (value per share, terminal 2.5%, 10 years): r 8%: g 3% 96.86, 5% 113.24,
  7% 132.39 · r 9%: 81.84, 95.16, 110.71 · r 10%: 70.84, 81.95, 94.88. One input at a time from the
  default: terminal 1.5% 87.47, 3.5% 105.65; growth years 5 gives 87.76, 15 gives 101.31.
- Ten-year capex / D&A ratio (last ten fiscal years): Caterpillar 0.57 (its capex tag omits leased
  equipment), Exxon Mobil 0.82, J&J 0.57, P&G 1.19. Ten-year totals, net income vs owner earnings:
  CAT 59.1 vs 69.8 billion; XOM 217.6 vs 260.4; J&J 177.8 vs 206.6; P&G 132.6 vs 127.2.
- Owner earnings per share, mean of first five vs last five years of each run, and the implied
  compound growth: CAT 5.21 to 17.94 (9.2% a year over 14 years); XOM 4.08 to 8.87 (8.1% over 10);
  J&J 4.69 to 10.21 (7.3% over 11); P&G 3.84 to 5.90 (3.1% over 14). These are nominal and include
  inflation; the Base Rate Book's figures are inflation-adjusted, so the two must not be compared
  directly.
- Return on invested capital: invested capital is NOT in the sample. Analyst session 3 teaches ROIC
  on a constructed case and uses Damodaran's g = reinvestment rate x return on capital (read at
  source); the only real figures it may quote are the capex / D&A ratios above.

**p2 additions (engine-computed by the p2 agent, re-run by the lead 2026-10-10):** ten-year medians of
owner earnings per share at the last fiscal year: Caterpillar 13.77, Exxon 5.92, J&J 6.98, P&G 5.57.
J&J ten-year mean without FY2017 and FY2023: 7.87 (7.92 with them). P&G ten-year mean without
FY2019: 5.41 (5.00 with it). The causes of P&G's FY2019 and J&J's FY2017 lows are not read at
source and the page does not state them.
**p3 constructed case (Brightwell Pumps):** ROIC 15.0% with goodwill, 20.0% without; at a 9% cost of
capital and 3% growth, values 160.0 (ROIC 15%), 133.3 (9%, equal to no growth), 100.0 (6%).

**p8 additions (modelled, engine-checked by the lead):** on P&G's rung-3 base, going from 5 to 10
growth years adds 7.41 a share and from 10 to 15 adds 6.15 (unrounded differences; the rounded
values 87.76, 95.16, 101.31 subtract to 7.40 and 6.15).

**Break button (computed):** terminal growth equal to the discount rate returns no value and prints
why: the perpetuity does not converge.

## Per-session coverage

### Owner track (no code)

| Session | Title | Covers | Key sources |
|---|---|---|---|
| a1 | You are buying a business | share as a slice; owners' cash vs profit; value as future cash shrunk to today; four gates (1977) | 1977, 1986 letters |
| a2 | Value is a range, not a number | three views of Halden; inputs that move the answer; terminal share; precision as a warning sign; "vaguely right" | 1986 letter; Halden table |
| a3 | The margin of safety | the gap between value and price; the bridge (1984); asking price vs range; how big a margin; margin is not a discount to a price | Superinvestors 1984; Graham ch. 20 (reported) |
| a4 | The edge of what you know | circle of competence (1996); the too-hard tray; testing the edge; index fund as the honest default (1996) | 1996 letter |
| a5 | Mr Market quotes, you decide | the allegory (1987); price volatility vs business change; using quotes, not obeying them; why a quote is not information about value | 1987 letter; Graham ch. 8 (reported) |
| a6 | The mistakes made in your own head | anchoring, overconfidence (Base Rate Book 19.2 vs 34.6), loss aversion (reported), confirmation; Buffett's 1989 mistakes; cigar butts; institutional imperative | 1989 letter; Base Rate Book; Kahneman and Tversky (reported) |

### Analyst track (browser and Python, real filings)

| Session | Title | Covers |
|---|---|---|
| p1 | Owner earnings from the filings | XBRL concepts; NI + D&A - capex; the all-capex approximation; four real companies |
| p2 | Normalising through a cycle | 5- and 10-year averages; cyclical vs one-off; Exxon and Caterpillar; J&J one-offs |
| p3 | Return on invested capital | ROIC vs cost of capital; reinvestment and growth (g = reinvestment rate x ROC, Damodaran) |
| p4 | A discounted cash flow, by hand | two-stage DCF mechanics; the discount rate as a choice; terminal value; terminal share |
| p5 | What the price already assumes | reverse DCF on a learner-typed price; implied growth; Expectations Investing (reported) |
| p6 | Which input moves the answer | sensitivity grid; range of +/- 1 point on r and +/- 2 on g |
| p7 | How often fast growth lasts | Base Rate Book base rates; analysts too narrow; growth fades |
| p8 | How long excess returns last | a moat as a valuation input; CFROI quintile spread 18 to 9 points in 10 years; fade |
| p9 | A memo that says what would prove it wrong | memo structure; kill criteria; pre-commitment; contested value evidence |
| p10 | The intrinsic value bench | the ladder, the anti-lever, the break button, the sentence |

## Seams (absolute links)

- `learn-finance-with-phoebe` owns reading the three statements, cash vs profit, working capital:
  https://phoebefu6.github.io/learn-finance-with-phoebe/ . Statements here are inputs; link back.
- `learn-economics-with-phoebe` Foundations session 6 owns moats as economics:
  https://phoebefu6.github.io/learn-economics-with-phoebe/courses/a6-games-and-moats.html .
  Here a moat is a valuation input: how long excess returns last.
- Economics Foundations session 5 owns interest as the price of time and discounting intuition:
  https://phoebefu6.github.io/learn-economics-with-phoebe/courses/a5-money-inflation-and-interest.html
- No trading, no portfolio construction, no technical analysis, no "what to buy", no market
  prices, tickers or price charts.

## Not covered (honest list)

- Portfolio construction, position sizing, diversification, trading, technical analysis.
- Any recommendation to buy or sell anything; any market price or ticker.
- Financial-company valuation (banks and insurers need different models).
- Tax, accounting standards in depth, the cost-of-capital derivation (CAPM, betas) beyond naming it.
- Whether value investing "works" as a factor strategy: contested, taught as a disagreement only.
- Graham's own text: the books were not read at source; paraphrase only.

## Citation appendix (the exact forms pages use)

- Buffett, W., Berkshire Hathaway shareholder letter, 1977 (read at source).
- Buffett, W., Berkshire Hathaway shareholder letter, 1986, appendix (read at source).
- Buffett, W., Berkshire Hathaway shareholder letter, 1987 (read at source).
- Buffett, W., Berkshire Hathaway shareholder letter, 1989 (read at source).
- Buffett, W., Berkshire Hathaway shareholder letter, 1996 (read at source).
- Buffett, W., "The Superinvestors of Graham-and-Doddsville", Hermes, Fall 1984 (read at source, reprint).
- Graham, B., "The Intelligent Investor", chapters 8 and 20 (reported).
- Graham, B. and Dodd, D., "Security Analysis", 1934 (reported).
- Damodaran, A., valuation class slides, terminal value session, NYU Stern, 2023 (read at source).
- Mauboussin, M., Callahan, D. and Majd, D., "The Base Rate Book", Credit Suisse, 2016 (read at source, hosted copy).
- Mauboussin, M. and Rappaport, A., "Expectations Investing" (reported).
- Fama, E. and French, K., "The Value Premium", 2020 (reported, via Chicago Booth Review).
- Arnott, R., Harvey, C., Kalesnik, V. and Linnainmaa, J., "Reports of Value's Death May Be Greatly Exaggerated", Financial Analysts Journal, 2021 (reported).
- Tversky, A. and Kahneman, D., "Judgment under Uncertainty: Heuristics and Biases", Science, 1974 (reported).
- Kahneman, D. and Tversky, A., "Prospect Theory", Econometrica, 1979 (reported).
