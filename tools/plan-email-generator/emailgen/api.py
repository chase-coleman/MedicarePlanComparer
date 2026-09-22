"""Read every plan row out of the live API.

Two endpoints are all that exist:

    GET /{county}              -> companies serving that county
    GET /{county}/{company}    -> plan rows, every plan year

There is no "all plans" endpoint, so the full picture is assembled by walking
each county and then each company within it. The same plan row comes back once
per county it serves, which is how county membership is recovered: rows are
keyed by id and their counties unioned.

`benefits_published` is deliberately ignored here. That flag drives the
frontend's N/A rendering; the API sends the real column values either way, so
the generator never needs it flipped in production to read 2027 figures.
Readiness is judged from the values themselves -- see compare.is_ready.
"""
import json
import urllib.error
import urllib.request

DEFAULT_BASE = "https://medicareplancomparisonsite.onrender.com"

# The counties the site offers. Mirrors ALL_COUNTIES in
# frontend/src/data/constants.js; the API itself is keyed by name.
COUNTIES = ["Linn", "Tillamook", "Lincoln", "Clatsop", "Lane", "Yamhill"]


def _get(base, path, timeout):
    url = "%s/%s" % (base.rstrip("/"), path.lstrip("/"))
    try:
        with urllib.request.urlopen(url, timeout=timeout) as response:
            return json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        raise RuntimeError("%s -> HTTP %d" % (url, exc.code)) from exc
    except urllib.error.URLError as exc:
        raise RuntimeError("%s -> %s" % (url, exc.reason)) from exc


def companies(base, county, timeout=60):
    return [row["companyName"] for row in _get(base, county, timeout)]


def fetch_rows(base=DEFAULT_BASE, counties=None, timeout=60, log=None):
    """Every plan row, deduplicated by id, each carrying its county set.

    Returns a list of dicts: the API row plus `counties` (sorted list) and
    `company` (the company the row was fetched under).
    """
    counties = counties or COUNTIES
    by_id = {}

    for county in counties:
        for company in companies(base, county, timeout):
            if log:
                log("  %s / %s" % (county, company))
            for row in _get(base, "%s/%s" % (county, company), timeout):
                existing = by_id.get(row["id"])
                if existing is None:
                    row = dict(row)
                    row["company"] = company
                    row["counties"] = {county}
                    by_id[row["id"]] = row
                else:
                    existing["counties"].add(county)

    rows = []
    for row in by_id.values():
        row["counties"] = sorted(row["counties"])
        rows.append(row)
    return sorted(rows, key=lambda r: (r["company"], r["planName"], r["planYear"]))


def load_cache(path):
    with open(path) as handle:
        return json.load(handle)


def save_cache(path, rows):
    with open(path, "w") as handle:
        json.dump(rows, handle, indent=2)
