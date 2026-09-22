"""Benefit field definitions, readiness tests, and the year-over-year diff.

The whole correctness burden of this tool sits in two ideas here.

**A zero is not always a number.** Some columns are legitimately $0 on a real
plan -- a $0 premium and a $0 primary care copay are ordinary, and a $0
giveback just means the plan has no giveback. Other columns cannot be zero on
any real Medicare Advantage plan: every plan has a maximum out-of-pocket, an
ER copay, and an inpatient hospital cost share. A zero in one of those is not
a benefit, it is a row nobody has filled in yet. SENTINELS lists them, and
`is_ready` uses them to decide whether a plan year can be written about at all.
This mirrors the "unknowns are never zeros" rule in plan-importer.

**Better and worse are not the same direction for every field.** A premium
going down is good news; a dental allowance going down is bad news. Each field
declares `higher_is_better` so the email can say which way a change cuts
instead of just reporting that it changed.
"""

# Columns that cannot be zero on a real plan. All-zero across these means the
# plan year is an unfilled placeholder; the row is skipped rather than
# described. Partially zero means somebody entered some of it -- also not
# safe to send, and reported separately so it can be finished.
SENTINELS = ("moop", "erVisit", "hospitalStay", "hospitalStayLength",
             "surgeryMin", "surgeryMax")


def _money(value):
    value = float(value or 0)
    if value == int(value):
        return "$%s" % format(int(value), ",")
    return "$%s" % format(value, ",.2f")


def _plain_money(row, field):
    return _money(row.get(field))


def f_premium(row):
    return _money(row.get("monthlyPremium"))


def f_moop(row):
    return _money(row.get("moop"))


def f_rx(row):
    return "Included" if row.get("rxCoverage") else "Not included"


def f_plan_type(row):
    return row.get("planType") or ""


def f_dr(row):
    return _money(row.get("drVisit"))


def f_er(row):
    return _money(row.get("erVisit"))


def f_hospital(row):
    days = row.get("hospitalStayLength") or 0
    per_day = _money(row.get("hospitalStay"))
    if not days:
        return per_day
    return "%s per day, days 1-%d" % (per_day, days)


def f_surgery(row):
    # surgeryCopayType false means the plan prices surgery as coinsurance.
    # PlanComponent.jsx renders a flat 20% in that case; mirror it exactly so
    # the email and the site never disagree.
    if not row.get("surgeryCopayType"):
        return "20%"
    low, high = row.get("surgeryMin") or 0, row.get("surgeryMax") or 0
    if low == high:
        return _money(low)
    return "%s - %s" % (_money(low), _money(high))


def f_radiology(row):
    coinsurance = row.get("radiologyCoinsurance") or 0
    if coinsurance > 0:
        return "%d%%" % coinsurance
    low, high = row.get("radiologyCopayMin") or 0, row.get("radiologyCopayMax") or 0
    if low == high:
        return _money(low)
    return "%s - %s" % (_money(low), _money(high))


def unknown_radiology(row):
    """A real plan quotes radiology either as a coinsurance percentage or as a
    copay. All three columns at zero is not a free X-ray -- it is a benefit
    nobody has entered. Every Devoted 2027 row is in this state, so without
    this check their emails announce radiology dropping to $0, which is both
    false and the most attractive-sounding thing in the table."""
    return not (row.get("radiologyCoinsurance") or row.get("radiologyCopayMin")
                or row.get("radiologyCopayMax"))


def f_dental(row):
    return _money(row.get("dentalBenefit"))


def f_otc(row):
    credit = row.get("otcCredit") or 0
    renewal = (row.get("otcRenewal") or "None").strip()
    if not credit:
        return "Not included"
    if renewal.lower() in ("", "none"):
        return _money(credit)
    return "%s %s" % (_money(credit), renewal.lower())


def f_giveback(row):
    amount = float(row.get("givebackAmount") or 0)
    return _money(amount) + " per month" if amount else "Not included"


def _column(name):
    """Lead a field on a single numeric column."""
    def lead(before, after):
        return float(before.get(name) or 0), float(after.get(name) or 0)
    return lead


def lead_surgery(before, after):
    # A plan priced as coinsurance one year and as a copay the next is not
    # comparable as a number -- 20% and "$500" have no ordering. Say nothing
    # rather than guess a direction.
    if bool(before.get("surgeryCopayType")) != bool(after.get("surgeryCopayType")):
        return None
    if not before.get("surgeryCopayType"):
        return None
    return float(before.get("surgeryMin") or 0), float(after.get("surgeryMin") or 0)


def lead_radiology(before, after):
    # Radiology is quoted either as a coinsurance percentage or as a copay
    # range, and the columns for the unused form sit at zero. Compare whichever
    # form both years actually use; mixed forms are not comparable.
    old_co, new_co = before.get("radiologyCoinsurance") or 0, after.get("radiologyCoinsurance") or 0
    if old_co and new_co:
        return float(old_co), float(new_co)
    if old_co or new_co:
        return None
    return (float(before.get("radiologyCopayMin") or 0),
            float(after.get("radiologyCopayMin") or 0))


# Shown in place of a value the data does not actually carry, so a blank
# column never reads as a $0 benefit.
UNSPECIFIED = "Not specified"

# label, formatter, lead (None = not a quantity), higher_is_better, unknown
FIELDS = [
    ("Monthly premium",         f_premium,   _column("monthlyPremium"),  False, None),
    ("Maximum out-of-pocket",   f_moop,      _column("moop"),            False, None),
    ("Drug coverage",           f_rx,        None,                       None,  None),
    ("Plan type",               f_plan_type, None,                       None,  None),
    ("Primary care visit",      f_dr,        _column("drVisit"),         False, None),
    ("Emergency room",          f_er,        _column("erVisit"),         False, None),
    ("Hospital stay",           f_hospital,  _column("hospitalStay"),    False, None),
    ("Outpatient surgery",      f_surgery,   lead_surgery,               False, None),
    ("Radiology",               f_radiology, lead_radiology,             False, unknown_radiology),
    ("Dental allowance",        f_dental,    _column("dentalBenefit"),   True,  None),
    ("Over-the-counter credit", f_otc,       _column("otcCredit"),       True,  None),
    ("Part B giveback",         f_giveback,  _column("givebackAmount"),  True,  None),
]


def missing_sentinels(row):
    """Sentinel columns that are zero -- i.e. never filled in."""
    return [name for name in SENTINELS if not row.get(name)]


def readiness(row):
    """'ready', 'partial' or 'empty' for one plan-year row."""
    if row is None:
        return "absent"
    missing = missing_sentinels(row)
    if not missing:
        return "ready"
    return "empty" if len(missing) == len(SENTINELS) else "partial"


def is_ready(row):
    return readiness(row) == "ready"


def _numeric_delta(before, after, lead, higher_is_better):
    """'better' / 'worse' / None for a change, via the field's lead reading."""
    if lead is None or higher_is_better is None:
        return None
    try:
        reading = lead(before, after)
    except (TypeError, ValueError):
        return None
    if reading is None:
        return None
    old, new = reading
    if old == new:
        return None
    improved = new > old if higher_is_better else new < old
    return "better" if improved else "worse"


def phrase(direction, higher_is_better):
    """How a change should be described. A cost going up and an allowance
    going down are both bad news, but calling a shrunken dental allowance
    'costs more' is simply wrong -- the member is not paying more, they are
    getting less."""
    if direction == "better":
        return "increased" if higher_is_better else "costs less"
    if direction == "worse":
        return "reduced" if higher_is_better else "costs more"
    return "changed"


def diff_rows(before, after):
    """[(label, before_text, after_text, direction, changed, phrase)] per field.

    `direction` is 'better', 'worse' or None. Rows are returned for unchanged
    fields too, so the email can show a complete benefit table rather than only
    the deltas.
    """
    out = []
    for label, formatter, lead, higher_is_better, unknown in FIELDS:
        missing_before = bool(unknown and unknown(before))
        missing_after = bool(unknown and unknown(after))
        before_text = UNSPECIFIED if missing_before else formatter(before)
        after_text = UNSPECIFIED if missing_after else formatter(after)
        # A field the data does not carry in one of the two years cannot be
        # compared. Report the values and say nothing about direction --
        # calling an unentered benefit a change is how a gap becomes a
        # promise.
        if missing_before or missing_after:
            out.append((label, before_text, after_text, None, False, ""))
            continue
        changed = before_text != after_text
        direction = _numeric_delta(before, after, lead, higher_is_better) if changed else None
        out.append((label, before_text, after_text, direction, changed,
                    phrase(direction, higher_is_better) if changed else ""))
    return out


def summarise(diff):
    """Headline changes, worst news first, for the top of the email."""
    changed = [d for d in diff if d[4]]
    worse = [d for d in changed if d[3] == "worse"]
    better = [d for d in changed if d[3] == "better"]
    neutral = [d for d in changed if d[3] is None]
    return {"changed": changed, "worse": worse, "better": better,
            "neutral": neutral, "unchanged": len(diff) - len(changed)}
