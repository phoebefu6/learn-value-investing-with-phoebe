<!-- learn-with-phoebe hub banner -->
> ### 📚 Part of [**Learn with Phoebe**](https://phoebefu6.github.io/learn-with-phoebe/)
> The shelf of 156 free, hands-on courses on AI, data, and the craft around them. **[Browse every course ↗](https://phoebefu6.github.io/learn-with-phoebe/)**
<!-- /learn-with-phoebe hub banner -->

# Learn Value Investing with Phoebe

Value investing in the Graham and Buffett sense, taught as a reasoning discipline rather than
stock picking. Two tracks: a six-session **Owner** track with no code (what a share is, value as a
range, the margin of safety, the edge of what you know, Mr Market, the mistakes made in your own
head), run on a constructed family business, and a ten-session **Analyst** track on four large US
companies' real 10-K filings (owner earnings, normalising, return on capital, a discounted cash
flow by hand and in reverse, sensitivity, base rates, how long excess returns last, the memo, and a
bench).

Educational, not investment advice. No market prices, tickers or price charts appear anywhere; a
margin of safety is always measured against a price the learner types.

The Analyst figures are SEC EDGAR XBRL company facts for Caterpillar, Exxon Mobil, Johnson &
Johnson and Procter & Gamble. The bench in the last session recomputes every number in the
browser: five forecasting rules checked against what the filings later showed, an anti-lever, and a
break button.

Live: https://phoebefu6.github.io/learn-value-investing-with-phoebe/

Static HTML, CSS and JS. No build step. `materials/build_vi_sample.py` rebuilds the bench data from
company-facts files, and `materials/vi_reference.py --compare` checks the Python reference against
the browser engine.

by Phoebe Fu
