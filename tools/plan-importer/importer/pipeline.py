"""Turn a CMS archive into plan records keyed by CMS plan id."""
import collections

from . import mapping
from .source import Archive, plan_key

PLAN_AREA = "PlanArea.txt"


def service_areas(archive, state=None, counties=None, individual_only=True):
    """{cms_plan_id: {county name}} from the plan service-area file.

    individual_only drops the two categories the site never shows, which
    otherwise dominate the result -- a single Oregon county lists 694 plans
    without them and 30-odd with:

      * employer/union group plans (eghp_flag 1), which nobody can enrol in
        off the street and which blanket every county in the country
      * standalone Part D drug plans, which carry no medical benefits at all
        (pbp_a_ben_cov is blank for them and "1" for Medicare Advantage)
    """
    wanted = set(counties) if counties else None
    out = collections.defaultdict(set)
    for row in archive.rows(PLAN_AREA):
        if state and row.get("stcd") != state:
            continue
        county = row.get("county")
        if wanted is not None and county not in wanted:
            continue
        if not row.get("contract_id"):
            continue
        if individual_only:
            if row.get("eghp_flag") == "1":
                continue
            if row.get("pbp_a_ben_cov") != "1":
                continue
            if row.get("pending_flag") == "1":
                continue
        key = plan_key(row["contract_id"], row["plan_id"], row.get("segment_id") or 0)
        out[key].add(county)
    return out


def plans_in(archive, state, counties):
    """Every CMS plan id offered in any of the named counties."""
    return set(service_areas(archive, state, counties))


def identity(archive, keys):
    """{cms_plan_id: {'plan_name', 'org'}} straight from Section A."""
    index = archive.by_plan(mapping.SECTIONS["A"])
    out = {}
    for key in keys:
        row = index.get(key)
        if row:
            out[key] = {
                "plan_name": row.get("pbp_a_plan_name", ""),
                "org": row.get("pbp_a_org_marketing_name", ""),
            }
    return out


def build(archive, keys):
    """Apply every rule to every requested plan.

    Returns {cms_plan_id: {column: value}} where a value may be mapping.UNKNOWN.
    """
    # Index each section once; a section file can be 5 MB and there are ten.
    indexes = {name: archive.by_plan(member)
               for name, member in mapping.SECTIONS.items()}

    records = {}
    for key in sorted(keys):
        sections = {name: indexes[name].get(key) for name in mapping.SECTIONS}
        if sections["A"] is None:
            continue  # not an MA plan in this archive
        record = {"cms_plan_id": key}
        for column, rule in mapping.RULES:
            try:
                record[column] = rule(sections)
            except Exception:
                # A malformed row must not abort the run; it becomes an
                # UNKNOWN the report will show.
                record[column] = mapping.UNKNOWN
        records[key] = record
    return records


def open_archive(path):
    return Archive(path)
