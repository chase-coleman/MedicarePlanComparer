"""PBP columns -> the 25 columns of the `plan` table.

Every rule lives in RULES below so the mapping can be read, reviewed and
corrected in one place. A rule returns UNKNOWN when CMS does not supply the
figure; it must never invent a zero, because a zero renders as a real "$0"
benefit on the site.

CMS names columns inconsistently between subsections of the same file
(pbp_b7b_copay_mc_amt_min vs pbp_b7d_copay_amt_mc_min), so lookups here match
on a prefix plus required substrings rather than on exact names.
"""

# Distinct from 0. Carried through to the emitter, which refuses to publish a
# plan whose benefits are still UNKNOWN.
class _Unknown:
    def __repr__(self):
        return "UNKNOWN"
    def __bool__(self):
        return False

UNKNOWN = _Unknown()

SECTIONS = {
    "A":    "pbp_Section_A.txt",
    "D":    "pbp_Section_D.txt",
    "b1a":  "pbp_b1a_inpat_hosp.txt",
    "b4":   "pbp_b4_emerg_urgent.txt",
    "b7":   "pbp_b7_health_prof.txt",
    "b8":   "pbp_b8_clin_diag_ther.txt",
    "b9":   "pbp_b9_outpat_hosp.txt",
    "b13":  "pbp_b13_other_services.txt",
    "b16":  "pbp_b16_dental.txt",
    "mrx":  "pbp_mrx.txt",
}

# pbp_b13b_otc_maxplan_per / similar period codes.
OTC_PERIODS = {"1": "Monthly", "2": "Monthly", "3": "Quarterly",
               "4": "Semi-Annually", "5": "Quarterly", "6": "Annually",
               "7": "Annually"}


def _num(value):
    try:
        return float(value)
    except (TypeError, ValueError):
        return None


def find(row, prefix, *must_contain, **kw):
    """First numeric value whose column starts with prefix and contains all
    of must_contain. exclude= drops columns containing any of those strings."""
    exclude = kw.get("exclude", ())
    for key, value in (row or {}).items():
        low = key.lower()
        if not low.startswith(prefix):
            continue
        if any(s not in low for s in must_contain):
            continue
        if any(s in low for s in exclude):
            continue
        n = _num(value)
        if n is not None:
            return n
    return None


def collect(row, prefix, *must_contain):
    """Every numeric value matching the pattern -- used where a benefit is
    spread across settings (outpatient hospital vs ambulatory surgical)."""
    out = []
    for key, value in (row or {}).items():
        low = key.lower()
        if low.startswith(prefix) and all(s in low for s in must_contain):
            n = _num(value)
            if n is not None:
                out.append(n)
    return out


def _yes(row, column):
    """PBP encodes yes/no as 1/2."""
    return (row or {}).get(column) == "1"


# --------------------------------------------------------------------------
# Rules. Each takes the per-section rows for one plan and returns a value,
# or UNKNOWN.
# --------------------------------------------------------------------------

def plan_type(s):
    """Prefer the parenthesised type in the marketing name -- it carries the
    C-SNP distinction the numeric code flattens away."""
    name = (s["A"] or {}).get("pbp_a_plan_name", "")
    if "(" in name and ")" in name:
        inner = name[name.rindex("(") + 1:name.rindex(")")].strip().upper()
        if "C-SNP" in inner:
            return "C-SNP"
        for candidate in ("HMO-POS", "HMOPOS", "HMO", "PPO", "PFFS", "MSA"):
            if candidate in inner:
                return "HMO-POS" if candidate in ("HMO-POS", "HMOPOS") else candidate
    return UNKNOWN


def monthly_premium(s):
    """Part C premium only.

    KNOWN GAP: the member-facing premium is Part C + Part D, and the Part D
    portion is NOT in the PBP benefits archive -- searching every file for
    Devoted Premium's missing 10.50 finds nothing. It comes from the separate
    CMS premium/landscape file. Until that source is wired in, this value is
    low by the Part D amount for any plan with drug coverage, which is why
    validate reports monthly_premium mismatches for exactly those plans."""
    part_c = _num((s["D"] or {}).get("pbp_d_mplusc_premium"))
    return round(part_c, 2) if part_c is not None else UNKNOWN


def moop(s):
    value = _num((s["D"] or {}).get("pbp_d_out_pocket_amt"))
    return int(value) if value is not None else UNKNOWN


def giveback(s):
    d = s["D"] or {}
    if not _yes(d, "pbp_d_mco_pay_reduct_yn"):
        return 0.0
    value = _num(d.get("pbp_d_mco_pay_reduct_amt"))
    return round(value, 2) if value is not None else UNKNOWN


def dr_visit(s):
    """Primary care is PBP subsection b7a. copay_yn == 2 means the plan
    charges no copay, which is a real $0 rather than an unknown."""
    b7 = s["b7"] or {}
    if b7.get("pbp_b7a_copay_yn") == "2":
        return 0
    value = find(b7, "pbp_b7a_", "copay", "min")
    if value is None:
        value = find(b7, "pbp_b7a_", "copay", "amt", exclude=("max", "ehc"))
    return int(value) if value is not None else UNKNOWN


def er_visit(s):
    value = find(s["b4"], "pbp_b4a_", "copay", "max")
    return int(value) if value is not None else UNKNOWN


def hospital_stay(s):
    value = find(s["b1a"], "pbp_b1a_", "copay", "int1", "t1", exclude=("endd", "begd"))
    return int(value) if value is not None else UNKNOWN


def hospital_stay_length(s):
    value = find(s["b1a"], "pbp_b1a_", "endd", "int1", "t1")
    return int(value) if value is not None else UNKNOWN


def _surgery_amounts(s):
    """Outpatient surgery spans hospital (ohs) and ambulatory surgical (obs)
    settings (b9a). Zeros mean 'no charge configured for
    this setting' rather than a $0 copay, so they are dropped before the range
    is taken -- keeping them would report every plan's floor as $0."""
    amounts = collect(s["b9"], "pbp_b9a_", "copay", "amt")
    return sorted(a for a in amounts if a > 0)


def surgery_min(s):
    amounts = _surgery_amounts(s)
    return int(amounts[0]) if amounts else UNKNOWN


def surgery_max(s):
    amounts = _surgery_amounts(s)
    return int(amounts[-1]) if amounts else UNKNOWN


def surgery_copay_type(s):
    """True when the plan states a copay; False when it states coinsurance."""
    b9 = s["b9"] or {}
    if _yes(b9, "pbp_b9a_copay_yn"):
        return True
    if _yes(b9, "pbp_b9a_coins_yn"):
        return False
    return UNKNOWN


def radiology_copay_min(s):
    """LOW CONFIDENCE: PBP reports 0.00 as the diagnostic-radiology floor for
    nearly every plan, where data.sql records a real floor taken from the
    carrier Summary of Benefits. Smallest non-zero copay is the closest
    approximation available here; expect this column to need human review."""
    amounts = [a for a in collect(s["b8"], "pbp_b8b_", "copay", "amt") if a > 0]
    return int(min(amounts)) if amounts else UNKNOWN


def radiology_copay_max(s):
    value = find(s["b8"], "pbp_b8b_", "copay", "drs", "max")
    return int(value) if value is not None else UNKNOWN


def radiology_coinsurance(s):
    """CONVENTION DIFFERENCE: plans commonly state both a coinsurance option
    and a copay range. data.sql records 0 here because the site shows the copay
    range instead. CMS reports the real percentage, so validate flags these --
    the CMS value is the accurate one and data.sql is the under-specified one."""
    b8 = s["b8"] or {}
    if not _yes(b8, "pbp_b8b_coins_yn"):
        return 0
    value = find(b8, "pbp_b8b_", "coins", "pct", exclude=("max",))
    return int(value) if value is not None else UNKNOWN


def dental_benefit(s):
    """Comprehensive dental where the plan offers it, otherwise the preventive
    allowance. Wellcare states only a comprehensive maximum (b16c); Devoted
    states only a preventive one (b16b)."""
    b16 = s["b16"] or {}
    value = find(b16, "pbp_b16c_", "maxplan", "cmp", "amt")
    if value is None:
        value = find(b16, "pbp_b16b_", "maxplan", "pv", "amt")
    if value is None:
        value = _num((s["D"] or {}).get("pbp_d_combo_max_plan_ben_amt_2"))
    return int(value) if value is not None else UNKNOWN


def otc_credit(s):
    b13 = s["b13"] or {}
    if not _yes(b13, "pbp_b13b_bendesc_otc"):
        return 0
    value = find(b13, "pbp_b13b_", "maxplan", "amt")
    return int(value) if value is not None else UNKNOWN


def otc_renewal(s):
    b13 = s["b13"] or {}
    if not _yes(b13, "pbp_b13b_bendesc_otc"):
        return "None"
    period = b13.get("pbp_b13b_otc_maxplan_per")
    return OTC_PERIODS.get(period, UNKNOWN)


def rx_coverage(s):
    return (s["A"] or {}).get("pbp_a_contract_partd_flag") == "1" or bool(s["mrx"])


# Order matches the INSERT column list in data.sql.
RULES = [
    ("plan_type",             plan_type),
    ("monthly_premium",       monthly_premium),
    ("moop",                  moop),
    ("dr_visit",              dr_visit),
    ("er_visit",              er_visit),
    ("hospital_stay",         hospital_stay),
    ("hospital_stay_length",  hospital_stay_length),
    ("surgery_min",           surgery_min),
    ("surgery_max",           surgery_max),
    ("surgery_copay_type",    surgery_copay_type),
    ("radiology_copay_min",   radiology_copay_min),
    ("radiology_copay_max",   radiology_copay_max),
    ("radiology_coinsurance", radiology_coinsurance),
    ("dental_benefit",        dental_benefit),
    ("otc_credit",            otc_credit),
    ("otc_renewal",           otc_renewal),
    ("giveback_amount",       giveback),
    ("rx_coverage",           rx_coverage),
]
