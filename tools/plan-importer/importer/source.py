"""Download and read the CMS PBP Benefits archive.

The archive is a zip of tab-delimited text files, one per PBP section, all
keyed by (contract, plan id, segment). The files use CRLF line endings and
latin-1 bytes, both of which silently corrupt a naive reader -- CRLF leaves a
stray \\r on the last column of every row, which is what makes a state code
compare as "OR\\r" instead of "OR".
"""
import csv, io, os, urllib.request, zipfile

ZIP_URL = "https://www.cms.gov/files/zip/pbp-benefits-{year}.zip"
# CMS 403s an unadorned urllib user agent.
UA = ("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/126.0 Safari/537.36")

KEY_COLS = ("pbp_a_hnumber", "pbp_a_plan_identifier", "segment_id")


def archive_path(data_dir, year):
    return os.path.join(data_dir, "pbp-benefits-%d.zip" % year)


def download(data_dir, year, force=False):
    """Fetch the year's archive into data_dir. Returns the local path."""
    dest = archive_path(data_dir, year)
    if os.path.exists(dest) and not force:
        return dest
    os.makedirs(data_dir, exist_ok=True)
    req = urllib.request.Request(ZIP_URL.format(year=year), headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=300) as r, open(dest, "wb") as out:
        while True:
            chunk = r.read(1 << 20)
            if not chunk:
                break
            out.write(chunk)
    return dest


def plan_key(contract, plan_id, segment):
    """Normalise to the form data.sql stores: H2923-004-000."""
    return "%s-%s-%03d" % (contract, str(plan_id).zfill(3), int(segment or 0))


class Archive:
    """Lazily reads one PBP section file at a time, indexed by plan key."""

    def __init__(self, zip_path):
        self.zip = zipfile.ZipFile(zip_path)
        self._cache = {}

    def rows(self, member):
        """Every row of a section file, as dicts with values stripped."""
        if member not in self._cache:
            with self.zip.open(member) as fh:
                text = io.TextIOWrapper(fh, encoding="latin-1", newline="")
                out = []
                for row in csv.DictReader(text, delimiter="\t"):
                    out.append({k: (v or "").strip()
                                for k, v in row.items() if k is not None})
                self._cache[member] = out
        return self._cache[member]

    def by_plan(self, member):
        """{plan_key: row}. Later duplicates lose to the first row seen."""
        index = {}
        for row in self.rows(member):
            if not all(row.get(c) for c in KEY_COLS[:2]):
                continue
            key = plan_key(row["pbp_a_hnumber"],
                           row["pbp_a_plan_identifier"],
                           row.get("segment_id") or 0)
            index.setdefault(key, row)
        return index

    def close(self):
        self.zip.close()
