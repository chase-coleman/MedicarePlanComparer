"""Compare generated records against hand-verified rows."""
import json

from .mapping import UNKNOWN

# fixture column -> generated column, where the fixture uses MySQL types
BOOL_COLUMNS = ("surgery_copay_type", "rx_coverage")
MONEY_COLUMNS = ("monthly_premium", "giveback_amount")


def load_fixture(path):
    with open(path) as fh:
        rows = json.load(fh)
    return {r["cms_plan_id"]: r for r in rows if r.get("cms_plan_id")}


def _comparable(column, value):
    if value is UNKNOWN or value is None:
        return None
    if column in BOOL_COLUMNS:
        return bool(value) if not isinstance(value, str) else value == "1"
    if column in MONEY_COLUMNS:
        return round(float(value), 2)
    if isinstance(value, str):
        return value.strip()
    return value


def compare(generated, fixture, columns):
    """[(cms_plan_id, column, expected, actual)] for every disagreement."""
    findings = []
    for key, expected in sorted(fixture.items()):
        actual = generated.get(key)
        if actual is None:
            findings.append((key, "*", "present", "NOT FOUND in CMS data"))
            continue
        for column in columns:
            if column not in expected:
                continue
            want = _comparable(column, expected[column])
            got = _comparable(column, actual.get(column))
            if want != got:
                shown = "UNKNOWN" if actual.get(column) is UNKNOWN else got
                findings.append((key, column, want, shown))
    return findings


def summarise(findings, fixture, columns):
    checks = len(fixture) * len(columns)
    return {
        "plans": len(fixture),
        "columns": len(columns),
        "checks": checks,
        "mismatches": len(findings),
        "accuracy": 0.0 if not checks else round(100.0 * (checks - len(findings)) / checks, 1),
    }
