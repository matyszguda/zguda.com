# Experience metrics

Source: user-provided KISS group prospect (2).pdf. Read charts visually; they are raster images and missing from text extraction. Full prospect is not published with the website.

- Page 7: KISS digital 2020 income USD 1,092,910.50; shown as 1.09 million. 2021 forecast, not actual: 1,254,609.42.
- Page 8: Human 2020 income USD 367,631.32; shown as 367.6 thousand. 2021 is a forecast.
- Page 9: group 2020 reported income USD 1,462,958.55; shown as 1.46 million. 2021 forecast USD 1,590,026.97; shown as 1.59 million and explicitly labeled forecast. Group figures preserved as reported, not recomputed from charts with different exchange-rate dates.
- Page 11: KISS digital Poland 60.8% of income, foreign share 39.2% by complement. Date/period not specified. Not client counts.
- Page 12: Human Poland 92.5%, USA 7.5% of income. Date/period not specified. Not client counts.
- Page 13: group personnel total 45, not 45 at each company. Date/period not explicitly specified.

Map places are supplied by Mateusz, not inferred from the financial charts. Coarse city/district coordinates, not client addresses. Dayton means Dayton in New Jersey. Manhattan and Brooklyn remain distinct. Names normalized: Salzburg, Tallinn, Mediolan.

Geography: Natural Earth ne_110m_admin_0_countries.geojson, public domain, retrieved from nvkelso/natural-earth-vector on GitHub. Locally simplified projected SVG paths in src/map-land.json. No map tile/API service, tracking or credentials.

## Later development, supplied by Mateusz after the prospect

Group turnover subsequently reached PLN 6.7 million (USD 1.71 million equivalent supplied by Mateusz). Peak team size: 60 people. No calendar year was specified; do not assign these to 2020 or the prospect's forecast. Replace dominant historical group figures with this later scale; individual-company figures and revenue mix remain explicitly historical.

## Public presentation revised to growth only

Currency figures removed from the rendered site. Group growth compares actual 2020 with actual 2019 (same chart, page 9), not the 2021 forecast:
- Revenue growth = (1,462,958.55 / 1,075,669.96 - 1) * 100 = 36.0044%, shown +36%.
- Profit growth = (182,298.80 / 98,960.81 - 1) * 100 = 84.2131%, shown +84%.
- Peak 60-person team retained as supplied by Mateusz; not assigned to 2020.
- Mateusz clarified he founded both businesses together with his business partner. Sale to TenderHut in 2022 comes from his account in this conversation.

## Indexed bar charts requested with prospect screenshot

Both series are presented as indices with their own 2017 value = 100%, not as growth rates, margins or revenue shares. Separate axes/panels are used for readability because profit changes much more than revenue. Chart values:
- Revenue source series: 750836.21, 798876.28, 1075669.96, 1462958.55, 1590026.97.
- Profit source series: 10176.70, 4933.06, 98960.81, 182298.80, -50848.32.
- Years: 2017–2021. 2021 remains explicitly marked as the prospect's forecast and styled differently, not silently presented as actual results.
- Each displayed percentage is source_year / source_2017 * 100, rounded to one decimal.

Added map places per Mateusz: Washington DC, Calgary, Dubai (displayed Dubaj).

## Team chart (replaces profit chart)

Mateusz supplied endpoints: 23 people in 2017 and 60 in 2022, and requested that intermediate growth be proportional to financial development. Interior bars are explicitly illustrative estimates, not recorded annual headcounts.

Model: interpolate between the two headcount endpoints using relative change in known revenue values, with the previously supplied later revenue level (USD 1.71 million equivalent) as the normalization anchor. This does not assert an independently verified 2022 revenue figure.

headcount_estimate(year) = round(23 + (60 - 23) * (revenue(year) - 750836.21) / (1710000 - 750836.21)).

Result: 2017 = 23 (supplied), 2018 = 25*, 2019 = 36*, 2020 = 50*, 2021 = 55*, 2022 = 60 (supplied). Asterisk means illustrative estimate. The 2021 revenue input is itself the prospect's forecast. Source values and model documented here for review; page and accessible table mark every intermediate year as estimated. No actual staff figures are inferred from this model.

Removed the large TenderHut sale panel; retained the original 2022 sale sentence in the main narrative. Full Zero Camps and Ciepło stories were retained throughout; venture cards now also include expanded descriptions, open by default, with internal padding restored.

## Symbolic founding and sale markers

At Mateusz's request, the team chart now ends its headcount bars at 2021. The 2022 headcount bar and row are removed. Existing illustrative 2018–2021 estimates are unchanged and retain their explicit estimate labels.

2012 is represented only as a founding milestone; no headcounts or years 2013–2016 are invented/displayed as data. An axis break indicates the compressed early period. 2022 is a sale milestone, described per Mateusz as sale to the GPW-listed TenderHut group, with no staff count encoded in that marker. The chart description and table distinguish events from headcount measurements.

## Latest revenue chart (user-provided image, supersedes the prospect chart)

The public revenue chart now uses the exact annotated combined totals from the user's new image titled "Łączne obroty firm KISS Digital i KISS Communications (2012–2022)":

| Year | Combined revenue, million PLN |
| --- | --- |
| 2012 | 0.05 |
| 2013 | 0.35 |
| 2014 | 0.82 |
| 2015 | 1.45 |
| 2016 | 2.20 |
| 2017 | 3.10 |
| 2018 | 4.00 |
| 2019 | 4.75 |
| 2020 | 5.65 |
| 2021 | 6.58 |
| 2022 | 8.41 |

The new explicit request to display exactly these values supersedes the earlier percentage-only representation for this chart. Values are in million PLN; 2021 is no longer displayed as the old prospect forecast. The image labels totals exactly, but does not annotate the separate company segments numerically. Therefore the site displays exact combined totals as single bars without inventing component figures. This update does not recalculate the separate, explicitly illustrative team chart or rewrite the historical geographic revenue mix.
