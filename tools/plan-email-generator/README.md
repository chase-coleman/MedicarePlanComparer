# plan-email-generator

Builds one client update email per plan, per county set, comparing a plan's
benefits between two plan years. Output is plain text, one `.txt` per email,
ready to paste into a mail client. Reads the live Plan Comparer API — nothing
here writes to the database or sends anything.

Standard library only — no `pip install` needed. Python 3.9+.

## Commands

```
python3 -m emailgen status  --verbose
python3 -m emailgen preview --group 12
python3 -m emailgen build   --as-of 09/2026
python3 -m emailgen build   --county Linn --company Devoted
```

Everything lands in `out/`, which is gitignored. `build` writes one `.txt`
per email plus `index.json`, which lists each file with its subject line,
counties and change counts — the subject is not in the `.txt` itself, so take
it from there.

The first run fetches from the API and caches to `out/plans.json`; later runs
reuse the cache until `--refresh`.

## The unit of an email is a plan group, not a plan name

A carrier can sell the same-named plan in two counties with different
benefits. The schema represents that by giving each county-variant its own
`plan` row with its own `plan_group_id`, linked only to the counties where
those values apply. Devoted sells "Core" as three separate groups:

| `plan_group_id` | Counties | 2027 hospital stay |
|---|---|---|
| 5 | Clatsop, Lincoln, Linn | $530/day, days 1-5 |
| 2 | Tillamook, Yamhill | $465/day, days 1-5 |
| 26 | Lane | $500/day, days 1-3 |

Grouping by plan name would merge those into one email and put the wrong
hospital copay in front of two thirds of the county list. `plan_group_id` is
also what pairs a plan across years, so it is the only correct key here.

## Merging is conditional, and usually does nothing

Groups that are the same offer under different ids are collapsed into one
email listing all their counties — but only when their benefits match **in
every year being compared**.

Matching in one year is not enough. Devoted's Lane variants (groups 26, 28,
30) were byte-identical to the Clatsop/Lincoln/Linn ones in 2026 and diverge
in 2027:

```
Core     g5  $530/day x 5 days   vs  g26  $500/day x 3 days
Premium  g6  MOOP $6,100         vs  g30  MOOP $5,900
```

Their CMS ids differ in the trailing segment (`H2923-026-002` against
`H2923-026-001`), which is CMS's own mechanism for varying benefits by
service area. They are genuinely different segments, so for 2026 → 2027 no
merges occur. `--force-merge` merges on the earlier year alone; it is unsafe
whenever the later year diverges and exists only for known data-entry
duplicates.

## A zero is not always a number

Some columns are legitimately `$0` on a real plan — a $0 premium, a $0
primary care copay, a $0 giveback. Others cannot be zero on any real Medicare
Advantage plan: every plan has a maximum out-of-pocket, an ER copay, and an
inpatient cost share. `compare.SENTINELS` lists those, and a plan year whose
sentinels are all zero is treated as **not filled in yet** rather than
described. This is the same rule as plan-importer's "unknowns are never
zeros".

`benefits_published` is deliberately ignored. That flag drives the frontend's
N/A rendering; the API returns the real column values either way, so the
generator never needs it flipped in production to read next year's figures.
Readiness is judged from the values themselves.

`status` sorts every group into why it will or will not produce an email:

```
emails ready to generate           13
waiting on 2027 data               14   sentinels still zero
new for 2027 (no comparison)       11   no earlier year to compare against
not offered in 2027                 0
missing 2026 data                   0
```

## What the emails say

The template is fixed: a greeting, `Your plan: <Company> <Plan>`, a headline
count, then **What's changing** (worst news first, so a client who stops
reading early has still seen the increases), **Staying the same**, **Not yet
confirmed** for any figure the data does not carry, the summary caveat, the
auto-renewal reassurance, the broker phone list, and the disclaimers. The
greeting, reassurance and broker list are the `GREETING`, `STAY_PUT` and
`BROKERS` constants at the top of `render.py`.

Two things are called out explicitly because clients ask about them:

**Renames.** UnitedHealthcare's "Essentials OR-4" is "Essentials OR-7" for
2027. Subject lines and headings lead with the name on the client's current
card, and a callout explains the new one.

**County expansion.** Devoted is adding Yamhill for 2027 on Giveback (g1),
Core (g2) and Premium (g3); those emails say so.

Benefit formatting mirrors `PlanComponent.jsx` exactly — the same 20%
coinsurance fallback for surgery, the same copay-versus-coinsurance choice for
radiology — so an email and the site never disagree.

**Changed benefits carry no per-line direction marker.** Every change reads
`before -> after` and nothing more. Direction is still computed — it orders
the list worst-first and feeds the headline count and `index.json` — and
`compare.phrase` still produces the "costs more" / "reduced" wording, which
is what to reinstate in `render_text` if a marker is ever wanted back. Note
that without one, an email mixing improvements and regressions gives the
reader no way to tell which line is which; 3 of the 13 current emails do.

The text is wrapped at 72 columns with hanging indents and does not rely on
column alignment, because mail clients disagree about how they display
`text/plain` — Gmail uses a proportional font, which would break any table.

## Disclaimers

`render.py` carries the disclaimer text from
`frontend/src/data/constants.js` as literals rather than parsing it out of
the JS, so a template edit cannot silently drop a required notice. Every
email carries the affiliation and nondiscrimination notices under a
`NECESSARY DISCLAIMERS:` heading. `--as-of` adds the "current as of" line;
without it that line is omitted rather than guessed.

**The county plan-offering disclaimer is not included.** `constants.js`
carries a "we do not offer every plan available in your area" notice per
county, and the site footer shows it, but the agreed email template leaves it
out. That was a deliberate choice, not an oversight — reinstate it in
`render_text` if compliance wants parity with the site.

**These are marketing communications to Medicare beneficiaries and are CMS
regulated.** Nothing here has been through material review. Confirm the
compliance position before any of this is sent.

## What this found in the plan data

Two things worth acting on, independent of the emails.

**No Devoted 2027 row carries a radiology figure.** Coinsurance, copay floor
and copay ceiling are all zero on every one of them — 30 rows in total across
both years, including all of Wellcare and Humana for 2027. Because a real
plan quotes radiology one way or the other, `unknown_radiology` treats this
as unentered and moves it to the email's "Not yet confirmed" section rather
than printing a figure. Without that check each Devoted email announced
radiology dropping from a real copay range to `$0`, which is false and the
most attractive-looking line in the table. Worth filling in from the
carriers' Summary of Benefits.

**UnitedHealthcare Essentials OR-4 loses its OTC credit in the data.**
`$25 quarterly` in 2026 becomes `0` with renewal `None` for 2027, and the
email reports it as a reduced benefit. Unlike radiology this is plausible on
its face — a plan really can drop an OTC benefit — so it is reported rather
than suppressed. Confirm it against the Summary of Benefits before sending,
since a wrongly zeroed column and a genuinely cancelled benefit look
identical here.

## Layout

```
emailgen/
  api.py       walk the county/company endpoints, dedupe rows, union counties
  model.py     fold rows into plan groups; the conditional merge rule
  compare.py   field definitions, readiness sentinels, the year-over-year diff
  render.py    the plain-text email body
  cli.py       argparse entry point
out/           generated emails, the API cache and index.json, gitignored
```

## Not done yet

* No sending. `MailService` in the backend is a single fixed-recipient
  contact-request notifier, not a bulk mailer; these files are for pasting
  into whatever platform actually sends.
* No client list — an email is per plan, not per person. Matching clients to
  their plan group is still manual.
* The 11 plans that are new for 2027 are skipped. They have no earlier year,
  so they need an introductory template rather than a comparison.
* Three C-SNP groups (24, 25, 27) have dental and OTC figures but no MOOP,
  ER, hospital or surgery values, so they read as unfilled. Worth finishing,
  since plan-importer flagged the same gap on the 2026 C-SNP Plus row.
