# plan-importer

Builds `plan` rows for `backend/src/main/resources/data.sql` from the CMS
Plan Benefit Package (PBP) public data, so plan years and new counties do not
have to be typed in by hand.

Standard library only — no `pip install` needed. Python 3.9+.

## Commands

```
python3 -m importer download --year 2027
python3 -m importer counties --year 2026 --state OR --counties Benton,Marion
python3 -m importer validate --year 2026 --verbose
python3 -m importer build    --year 2027 --state OR --counties Linn,Lincoln,Tillamook
```

Everything is written to `out/`. **Nothing writes to data.sql or to
PlanetScale** — `build` emits files for you to read and paste.

## Where the data comes from

`https://www.cms.gov/files/zip/pbp-benefits-<YEAR>.zip` — a zip of
tab-delimited files, one per PBP section, keyed by contract / plan id /
segment, which is exactly the `cms_plan_id` already stored in `plan`.

The 2026 archive was posted **28 October 2025**, at the start of AEP for that
plan year. Expect the 2027 archive around late October 2026.

Two traps in the raw files: CRLF line endings (which leave a stray `\r` on the
last column of every row, so a state code compares as `"OR\r"`), and latin-1
bytes. `source.py` handles both.

## Validation

`validate` diffs generated values against `fixtures/2026-expected.json`, the
22 hand-verified 2026 plans exported from data.sql.

Current result: **73.5% agreement across 396 checks (22 plans x 18 columns).**

That number is more useful broken apart:

| Reliability | Columns |
|---|---|
| **Exact** | county assignment (22/22), `moop`, `plan_type`, `hospital_stay_length`, `dr_visit`, `otc_credit`, `dental_benefit` |
| **Close** | `er_visit`, `hospital_stay`, `giveback_amount`, `surgery_max`, `rx_coverage` (1-3 plans differ each) |
| **Needs review** | `radiology_copay_min`, `radiology_coinsurance`, `surgery_min` |
| **Known gap** | `monthly_premium` — Part C only, see below |

### Why the unreliable columns are unreliable

**`monthly_premium` is incomplete by design of the source.** PBP carries the
Part C premium in `pbp_d_mplusc_premium`. The member-facing premium is Part C
plus Part D, and the Part D portion is not anywhere in this archive —
searching every file for Devoted Premium's missing `10.50` returns nothing.
It comes from the separate CMS premium/landscape file, which is not yet wired
in. Plans with drug coverage will read low by their Part D amount.

**`radiology_copay_min` is not really in the data.** PBP reports `0.00` as the
diagnostic-radiology floor for nearly every plan. data.sql records a real
floor taken from carrier Summary of Benefits documents. The rule here takes
the smallest non-zero copay, which is an approximation.

**`radiology_coinsurance` is a convention difference, not an error.** Plans
commonly state both a coinsurance option and a copay range. data.sql records
`0` because the site displays the copay range. CMS reports the real
percentage, usually 20. Here the CMS value is the accurate one.

**`surgery_min` spans settings.** Outpatient surgery is priced separately for
hospital outpatient (`ohs`) and ambulatory surgical centre (`obs`). The rule
takes the range across both, dropping zeros — a zero means "no charge
configured for this setting", not a $0 copay.

## What validation found in data.sql

Two things worth acting on, independent of the importer:

**Devoted C-SNP Plus (`H2923-009-000`, plan_id 24) is a zeroed placeholder
that is marked published.** data.sql records `moop = 0`, `er_visit = 0`,
`hospital_stay = 0` and zero for every copay, with `benefits_published = true`.
CMS reports a `$9,250` MOOP and a `$115` ER copay. The live site is showing a
$0 max-out-of-pocket for this plan.

**`H2406-073-000` (UnitedHealthcare Patriot) disagrees on six columns** — ER
copay, hospital stay, giveback amount, `rx_coverage`, OTC credit and OTC
renewal. One plan disagreeing this widely usually means the hand entry came
from a different plan or a different year. Worth re-checking against the
carrier's Summary of Benefits.

## Layout

```
importer/
  source.py     download + read the archive (CRLF, latin-1, plan-key indexing)
  pipeline.py   service areas, plan identity, applying the rules
  mapping.py    PBP columns -> the 25 plan columns. All judgment lives here.
  diff.py       compare generated values against a fixture
  emit.py       render data.sql rows and PlanetScale statements
  cli.py        argparse entry point
fixtures/       hand-verified ground truth, committed
data/           downloaded CMS archives, gitignored
out/            generated output, gitignored
```

## Unknowns are never zeros

`mapping.UNKNOWN` is distinct from `0`. A rule returns it when CMS does not
supply a figure, and `emit.py` forces `benefits_published = false` on any row
carrying one, so the UI renders N/A rather than a wall of `$0` that reads as a
real and very attractive benefit. `out/unknowns-<year>.json` lists exactly
which columns on which plans still need a human.

## Filtering

`counties` and `build` drop two categories the site never shows. Without the
filter a single Oregon county lists 694 plans; with it, 61.

* employer/union group plans (`eghp_flag = 1`) — not individually enrollable,
  and they blanket every county in the country
* standalone Part D drug plans — no medical benefits at all (`pbp_a_ben_cov`
  is blank for them and `1` for Medicare Advantage)

## Not done yet

* `company_id` is emitted as `0` — mapping CMS organisation names to your
  `company` table needs a decision about which carriers you contract with.
* `plan_name` is the raw CMS marketing name (`DEVOTED GIVEBACK 004 OR (HMO)`),
  not your display name (`Giveback`).
* `plan_group_id` is allocated fresh rather than matched to the prior year's
  row by `cms_plan_id`. That linkage is what makes the year toggle pair plans
  correctly and should be added before any real 2027 run.
* Part D premium, as above.
