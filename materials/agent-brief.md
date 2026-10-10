# Agent brief - shared by every fan-out page of learn-value-investing-with-phoebe

Internal build document. Not linked from any audience-facing page. Filled from
`~/.claude/skills/course-builder/references/agent-brief.template.md` on 2026-10-09.

You are writing ONE static HTML session page. No servers, no npm. **If your target file already
exists on disk, do not write it; report that and stop.** Write the file, return its path and one
line of coverage. No HTML in your reply.

## Read first, in this order

1. The template page for YOUR track. Copy its structure, classes, SVG grammar and quiz markup
   EXACTLY, including how many options each question has (FOUR):
   - Owner track (a-pages, no code, plain-text worksheets in the build-along):
     `/Users/phoebe.fu/Documents/claude_work/github_repo/learn-value-investing-with-phoebe/courses/a1-you-are-buying-a-business.html`
   - Analyst track (p-pages, Python in the build-along):
     `/Users/phoebe.fu/Documents/claude_work/github_repo/learn-value-investing-with-phoebe/courses/p1-owner-earnings-from-the-filings.html`
2. The source map: every verified number, its evidence tier, per-session coverage, the seams, the
   Halden Tiles table. Use ONLY its numbers; never invent a statistic; if a fact is missing, teach
   the uncertainty. `/Users/phoebe.fu/Documents/claude_work/github_repo/learn-value-investing-with-phoebe/materials/official-course-map.md`
3. The stylesheet `:root` block for the palette tokens:
   `/Users/phoebe.fu/Documents/claude_work/github_repo/learn-value-investing-with-phoebe/assets/style.css`

## Page skeleton (keep every component)

toolbar (crumb EXACTLY "Owner session N of 6" or "Analyst session N of 10", inside
`<span class="crumb"><a href="../index.html">learn-value-investing-with-phoebe</a> / ...</span>`,
#toggle-all, #zoom-toggle) · masthead (eyebrow "Learn Value Investing with Phoebe · Owner session N
of 6" or "... · Analyst session N of 10", h1 with one `<span class="accent">`, .sub, .chip-row with
the level chip `🟢 Owner` on a-pages or `🟡 Analyst` on p-pages, then two `.chip.audience`, then
`.chip.time` "45 min", .agenda a1-a4) · main.wrap · section#intro (Part 0: kicker, .lede, .legend
pills, .callout.win "★ What you walk out with tonight.") · 3 Parts, each `section.section#part-N`
with section-kicker (klabel "Part N · covers ...", h2, `.tag.concept "N min live"`), a `.lede`, ONE
figure, `details.card` accordions (summary: `.mode.live` or `.mode.self`, title, `.mini`,
`.caret ▶`), at least one `.callout.example` with `span.ex-pill` "Real world" on the page ·
section#demo-1 Build-along (kicker `.tag.demo "★ 22 min · everyone works it through"` on a-pages,
"★ 22 min · everyone builds" on p-pages, .lede, ONE figure, `.steps > .step`, each with a
`.prompt-box.good` carrying a `span.label`; a-pages hold plain-text worksheets, p-pages hold
Python) · section#exercise Homework (ol, 4 items) · section#quiz (3 x `.quiz-q data-answer="0-based"`,
`p.qtext`, FOUR `button.qopt` "A · ...", `p.qwhy`; one `p.quiz-score` after the last; vary which
letter is correct) · section#official, h2 EXACTLY "What this session teaches, and where it came
from", `.covered > .covered-row` (pill solid ✓ / light ◐ + name + note), then the `.mono` line
EXACTLY "Every fact on this page, and its verification tier, is recorded in the course's source
map." · section.cheat#cheatsheet (h3 "Owner session N cheat sheet <span>· pin this</span>" or
"Analyst session N cheat sheet <span>· pin this</span>", .grid-2 of six .cheat-item) ·
`.callout.next` with `.nx-pill` "Next session" · footer.pagefoot ·
`<script src="../assets/app.js?v=1"></script>`.

Head: the template's social meta block with this page's own title/description/url;
`<title>Owner session N · <Title> - learn value investing with phoebe</title>` (or "Analyst
session N · ..."); `<link rel="stylesheet" href="../assets/style.css?v=2">`. Nothing else external.

First `details.card` in the FIRST Part is `open`; no other. Sentence case headings. Warm
practitioner voice, concrete, never dry. Inside prompt-boxes escape `&` `<` `>`. 450 to 650 lines
is guidance about depth, never a target: never collapse whitespace, dissolve a list into a
paragraph, or drop a component to fit.

## Hard rules (a violation is rework)

- NEVER an em dash or en dash, anywhere (prose, code, aria-labels, comments). Hyphen only.
- No meta text: never "this course", "in this course", "the course teaches", "banned here". State
  the professional norm directly with its reason. The two exact estate phrases above are the only
  self-references; "Owner session 3" or "Analyst session 4" cross-references are fine.
- Attribution "by Phoebe Fu". Never "built with" a tool.
- Every number comes from the map or is labelled constructed. For constructed data print "your
  numbers will differ", never invented outputs as if run.
- Contested or missing evidence: teach the disagreement; never resolve what the literature has not.
  Value versus growth factor evidence is contested: never claim value "works" or "is dead".
- Citations in the exact form of the map's appendix; anything marked reported is "reported".
  Graham is never quoted directly (the books were not read at source); paraphrase and name the
  chapter. Buffett may be quoted at most ONE short line (under 15 words) per page, from the map.
- NEVER "lottery" or "lotteries"; say the mechanism. A verbatim quoted title is the only exception.
- Default to the English word. Any Chinese term carries its English in brackets, every occurrence.
- **No market prices, no tickers, no price charts, no "what to buy", no trading, no portfolio
  construction, no technical analysis.** Company names may appear (Analyst track uses four real
  filers' 10-K figures from the map) but never a share price, a ticker symbol or a price history.
  A margin of safety is computed against a price the learner types, or Halden's constructed price.
- Money pages: the masthead .sub or an intro `.callout.tip` must not give advice; a1, p1 and the
  bench carry "Educational, not investment advice." Other pages need not repeat it but must never
  contradict it.
- Titles, widget ids and class names must not collide with siblings. Banned titles: "A system you
  keep", "The one-page marketing plan", "Is it worth the time?", "Where your week actually goes",
  "Games and moats", "Look at 100 mistakes", "Prices are information". Do not invent new widget
  classes; use only classes the template page uses (plus `.tryrow data-fn="wordcount"` if useful).
- Seams: reading the three statements, cash vs profit and working capital belong to
  https://phoebefu6.github.io/learn-finance-with-phoebe/ (link, do not re-teach); moats as economics
  belong to https://phoebefu6.github.io/learn-economics-with-phoebe/courses/a6-games-and-moats.html
  (here a moat is a valuation input: how long excess returns last); interest as the price of time is
  https://phoebefu6.github.io/learn-economics-with-phoebe/courses/a5-money-inflation-and-interest.html .

## Figure grammar (hand-drawn, every figure)

Palette, ONLY these hexes (no invented greys): ink `#17251D` · muted `#4F5F55` · ledger green
`#2D5240` · deep `#1C3628` · mid `#3E6B55` · soft `#CFE0D5` · tint `#EEF5F0` · faint `#C8D6CC` ·
hairline `#E0E9E3` · brass `#93701C` · brass ink `#6B5112` · brass tint `#F8F0DC` · `#FFFFFF` ·
universal reds `#991B1B` `#FEF2F2` `#FCA5A5` only for a wrong-way panel. Brass `#93701C` is a FILL
or STROKE colour; text in brass uses `#6B5112`. White text only on `#2D5240`, `#1C3628`, `#3E6B55`
or `#93701C` fills.

- `<figure class="zoomable">` > `<svg viewBox="0 0 880 H" xmlns="http://www.w3.org/2000/svg"
  role="img" aria-label="the data, not the shape">` > `<defs>` + `<style>` + content, then
  `<figcaption>🔍 Click to zoom - takeaway</figcaption>`. Grow H, never W.
- Prefix unique per figure, used for every class and id: `va<N><letter>` on Owner pages (a2 uses
  va2a, va2b, va2c, va2d), `vp<N><letter>` on Analyst pages (p3 uses vp3a ...).
- `<defs>` holds three things with the figure prefix P: a wobble filter `id="PSk"`
  (`feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed="<int>"` +
  `feDisplacementMap scale="2.4" xChannelSelector="R" yChannelSelector="G"`, `x="-3%" y="-3%"
  width="106%" height="106%"`), a hachure pattern `id="PHc"` (7x7 userSpaceOnUse, rotate(-38), one
  `#2D5240` line, opacity .5), an open arrowhead `id="PAr"` (path `M1 1 L9 5 L1 9`, fill none,
  `#17251D` stroke 1.6). ALL shapes sit inside ONE `<g filter="url(#PSk)" fill="none"
  stroke="#17251D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">`; rects carry
  a tiny rotation (-4 to 4 degrees for hand-placed items, under 1 for panels). Fills: white, tint
  `#EEF5F0`, the hachure for "the pile" or "the data", and brass ONLY for the one thing the figure
  is about. One doodle anchor per figure, simple strokes, never a mascot. Text classes: `.PH` 800
  12px ink heading · `.PL` 600 12px ink label · `.PS` 400 11px muted · `.PB` 800 11px `#6B5112` ·
  `.PV` 800 16-20px `#1C3628` value · `.PW` 800 12px white on a fill · `.PA` 700 11px `#2D5240`
  axis caption · `.PN` 400 12px muted note. Hand-stacked items must not overlap as painted rects.
- ALL `<text>` outside any filtered group, sans stack, never below 10.5px.
- Fit: max chars ≈ (box width - 20) / 7 at 12px, 6.4px/char at 11px; full-width note under 110
  chars; 40px between neighbouring point labels; bottom note 22px below the last row, H clears its
  baseline by at least 11px. No line, arrow or curve may cross a label. Text inside a box stays
  inside it with 6px to spare. When in doubt, shorten.
- Floor: one figure per Part plus one in the build-along. Draw the MECHANISM (the gap between a
  value range and a typed price, the discount shrinking each year, the gate a business fails, the
  partner's quote swinging while the business line stays flat), never a metaphor literally, never
  decoration.

## Voice and honesty

Every Part gets a real-world story from the map (Buffett's letters, the Base Rate Book, Scott
Fetzer) or the constructed Halden case. Constructed cases say "constructed" on the page: Halden
Tiles (every figure invented; use ONLY the Halden numbers in the map's table, or label any new
Halden figure constructed on the page), the cousin, the neighbour's "about a million". Real people
named in the map may be cited with the map's tier. Never Phoebe's own work, employers or clients.

## Cross-links (absolute URLs)

- Finance: https://phoebefu6.github.io/learn-finance-with-phoebe/
- Economics a5 and a6 (URLs above).
- Hub: https://phoebefu6.github.io/learn-with-phoebe/

## Footer chains and session titles

Owner chain (file · exact title):
a1-you-are-buying-a-business.html · You are buying a business
a2-value-is-a-range.html · Value is a range, not a number
a3-the-margin-of-safety.html · The margin of safety
a4-the-edge-of-what-you-know.html · The edge of what you know
a5-mr-market.html · Mr Market quotes, you decide
a6-mistakes-in-your-own-head.html · The mistakes made in your own head

Analyst chain:
p1-owner-earnings-from-the-filings.html · Owner earnings from the filings
p2-normalising-through-a-cycle.html · Normalising through a cycle
p3-return-on-invested-capital.html · Return on invested capital
p4-a-dcf-by-hand.html · A discounted cash flow, by hand
p5-what-the-price-assumes.html · What the price already assumes
p6-which-input-moves-the-answer.html · Which input moves the answer
p7-how-often-growth-lasts.html · How often fast growth lasts
p8-how-long-excess-returns-last.html · How long excess returns last
p9-the-memo.html · A memo that says what would prove it wrong
p10-the-intrinsic-value-bench.html · The intrinsic value bench

Footer left: "Owner session N of 6 · learn-value-investing-with-phoebe · by Phoebe Fu &nbsp;·&nbsp; 📚 <a href="https://phoebefu6.github.io/learn-with-phoebe/">Learn with Phoebe ↗</a>" (Analyst: "Analyst session N of 10 · ...").
Footer right: `<a href="PREV">← Prev: <title></a> &nbsp;·&nbsp; <a href="NEXT">Next: <title> →</a>`;
the first page of a track uses `<a href="../index.html">← Course home</a>` instead of Prev; the
last page of a track (a6, p10) uses Prev and `<a href="../index.html">Course home</a>`.
The h1 carries the exact title with one accent span on its last key words.
