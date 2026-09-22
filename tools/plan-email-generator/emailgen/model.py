"""Fold plan rows into the unit an email is actually written about.

That unit is the **plan group**, not the plan name. A carrier can sell the
same-named plan in two counties with different benefits, and the schema
represents that by giving each county-variant its own `plan` row with its own
`planGroupId`, linked only to the counties where those values apply. Devoted
sells "Core" as three separate groups:

    group 5   Clatsop, Lincoln, Linn
    group 2   Tillamook          (different hospital cost share and dental)
    group 26  Lane

Grouping by plan name would merge those into one email and put the wrong
copays in front of two thirds of the county list. `planGroupId` is also what
pairs a plan across years, so it is the only correct key for a comparison.
"""
from . import compare


class PlanGroup:
    def __init__(self, group_id, company, plan_name):
        self.ids = [group_id]
        self.company = company
        self.plan_name = plan_name
        self.by_year = {}        # int year -> row
        self.counties = {}       # int year -> sorted list

    @property
    def key(self):
        return "-".join(str(i) for i in sorted(self.ids))

    @property
    def merged(self):
        return len(self.ids) > 1

    def row(self, year):
        return self.by_year.get(year)

    def counties_for(self, year):
        return self.counties.get(year, [])

    def new_counties(self, before, after):
        """Counties served in the later year but not the earlier one."""
        return sorted(set(self.counties_for(after)) - set(self.counties_for(before)))

    def dropped_counties(self, before, after):
        return sorted(set(self.counties_for(before)) - set(self.counties_for(after)))

    def name_for(self, year):
        """The plan's marketing name in that year. Carriers rename plans
        between years -- UnitedHealthcare's "Essentials OR-4" became
        "Essentials OR-7" for 2027 -- and a client only recognises the name
        that was on last year's card, so both have to survive."""
        row = self.by_year.get(year)
        return row["planName"] if row else self.plan_name

    def renamed(self, before, after):
        old, new = self.name_for(before), self.name_for(after)
        return (old, new) if old != new else None

    def label(self):
        return "%s %s" % (self.company, self.plan_name)

    def __repr__(self):
        return "<PlanGroup %s %s>" % (self.key, self.label())


def build_groups(rows):
    groups = {}
    for row in rows:
        gid = row.get("planGroupId") or row["id"]
        group = groups.get(gid)
        if group is None:
            group = groups[gid] = PlanGroup(gid, row["company"], row["planName"])
        year = int(row["planYear"])
        group.by_year[year] = row
        # A row appears once per county it serves; api.fetch_rows already
        # unioned those, so this is the complete list for the year.
        group.counties[year] = sorted(set(group.counties.get(year, [])) | set(row["counties"]))
    return [groups[k] for k in sorted(groups)]


def _signature(row):
    """Everything a member would notice, for deciding whether two groups are
    genuinely the same offer. cms_plan_id is excluded on purpose: its trailing
    segment number differs between service areas by design, so including it
    would block every merge."""
    if row is None:
        return None
    return tuple(formatter(row) for _, formatter, _, _, _ in compare.FIELDS)


def merge_identical(groups, years, force=False):
    """Collapse groups that are the same offer under a different group id.

    Two groups merge only when they share a company and plan name **and their
    benefits match in every year being compared**. Matching in one year is not
    enough: Devoted's Lane variants were byte-identical to the Linn ones in
    2026 and diverge in 2027, so a merge decided on 2026 alone would have
    reported Lane's hospital cost share wrongly.

    `force` merges on the earliest year alone, which is the looser rule. It
    exists for the case where the divergence is known to be a data-entry
    error rather than a real segment difference -- it is not safe by default.
    """
    compared = [years[0]] if force else list(years)
    buckets = {}
    for group in groups:
        signature = (group.company, group.plan_name) + tuple(
            _signature(group.row(year)) for year in compared)
        buckets.setdefault(signature, []).append(group)

    merged = []
    for bucket in buckets.values():
        head = bucket[0]
        for other in bucket[1:]:
            head.ids.extend(other.ids)
            for year, counties in other.counties.items():
                head.counties[year] = sorted(set(head.counties.get(year, [])) | set(counties))
        merged.append(head)
    return sorted(merged, key=lambda g: (g.company, g.plan_name, g.key))


def comparable(groups, before, after):
    """Groups that can honestly carry a before/after email."""
    out = []
    for group in groups:
        old, new = group.row(before), group.row(after)
        if old is None or new is None:
            continue
        if not (compare.is_ready(old) and compare.is_ready(new)):
            continue
        out.append(group)
    return out


def classify(groups, before, after):
    """Every group sorted into why it will or will not produce an email."""
    buckets = {"ready": [], "new": [], "dropped": [], "pending": [], "stale": []}
    for group in groups:
        old, new = group.row(before), group.row(after)
        if old is None and new is not None:
            buckets["new"].append(group)
        elif new is None and old is not None:
            buckets["dropped"].append(group)
        elif old is None and new is None:
            continue
        elif not compare.is_ready(new):
            buckets["pending"].append(group)
        elif not compare.is_ready(old):
            buckets["stale"].append(group)
        else:
            buckets["ready"].append(group)
    return buckets
