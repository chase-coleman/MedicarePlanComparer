"""Render one plan group's year-over-year comparison as a plain-text email.

Laid out for proportional fonts, not monospace. Mail clients disagree about
how they display text/plain -- Gmail uses a proportional font -- so nothing
here relies on column alignment to be readable. Changed benefits are listed
one per line as "before -> after", which survives any font.

The body leads with what changed and keeps the unchanged benefits in a short
list underneath, because that is the order a client reads it in: they want to
know what is different before they want a full benefit summary.
"""
import textwrap

from . import compare

WIDTH = 72

GREETING = ("Hello from your brokers at JMCole Group! We would like to update "
            "you with some changes of how your plan is changing for the "
            "upcoming year!")

STAY_PUT = ("If you'd like to continue to stay on your plan for the coming "
            "year, there is nothing you have to do! You will automatically be "
            "rolled into the new year, with us still as your brokers.")

# Phone numbers match frontend/src/data/brokers.js. Only the three brokers who
# handle these renewals are listed, which is fewer than the site's roster.
BROKERS = [
    ("John", "541-554-8382"),
    ("Garin", "541-510-9685"),
    ("Chase", "541-554-5916"),
]

# Mirrors frontend/src/data/constants.js. Kept as literals rather than parsed
# out of the JS so a template change cannot silently drop a required notice.
AFFILIATION = ("Not connected with or endorsed by the United States government "
               "or the federal Medicare program.")
NONDISCRIMINATION = (
    "JMColegroup complies with applicable Federal civil rights laws and does not "
    "discriminate on the basis of race, color, national origin, age, disability, "
    "or sex. ATTENTION: If you speak a language other than English, language "
    "assistance services, free of charge, are available to you. "
    "Call 1-800-MEDICARE (TTY: 1-877-486-2048).")


def _wrap(text, indent="", width=WIDTH):
    return textwrap.fill(text, width=width, initial_indent=indent,
                         subsequent_indent=indent)


def _item(text):
    """One benefit line, flush left with a hanging indent so a benefit long
    enough to wrap does not put its second line level with the next benefit
    and read as one."""
    return textwrap.fill(text, width=WIDTH, initial_indent="",
                         subsequent_indent="    ")


def _county_phrase(counties):
    counties = ["%s County" % c for c in counties]
    if len(counties) == 1:
        return counties[0]
    if len(counties) == 2:
        return " and ".join(counties)
    return ", ".join(counties[:-1]) + " and " + counties[-1]


def subject(group, before, after, summary):
    # Subject lines lead with the name the client already knows -- the one on
    # the card in their wallet -- not the new one they have never seen.
    known = group.name_for(before)
    if group.renamed(before, after):
        return "Your %s plan is changing name and benefits for %d" % (known, after)
    if not summary["changed"]:
        return "Your %s plan is not changing for %d" % (known, after)
    return "What's changing on your %s plan in %d" % (known, after)


def headline(summary, before, after):
    worse, better = len(summary["worse"]), len(summary["better"])
    if not summary["changed"]:
        return ("Every benefit we track on this plan stays the same in %d as it "
                "was in %d." % (after, before))
    # "Increasing in cost" is wrong for a shrinking allowance, and the worse
    # list mixes both kinds, so the wording stays neutral about which.
    parts = []
    if better:
        parts.append("%d %s improving" % (better, "benefit is" if better == 1 else "benefits are"))
    if worse:
        parts.append("%d %s less favorable" % (worse, "benefit is" if worse == 1 else "benefits are"))
    if summary["neutral"]:
        parts.append("%d other %s" % (len(summary["neutral"]),
                                      "change" if len(summary["neutral"]) == 1 else "changes"))
    body = parts[0] if len(parts) == 1 else ", ".join(parts[:-1]) + " and " + parts[-1]
    return "Going into %d, %s." % (after, body)


def render_text(group, before, after, diff, summary, as_of=None):
    # The plan is named the way a client thinks of it -- carrier first, then
    # the plan -- and using the name that is on their current card, not the
    # one it is being renamed to.
    plan_label = "%s %s" % (group.company, group.name_for(before))
    out = []

    out.append(_wrap(GREETING))
    out.append("")
    out.append("Your plan: %s" % plan_label)
    out.append("=" * WIDTH)
    out.append("")
    out.append(_wrap(headline(summary, before, after)))
    out.append("")

    rename = group.renamed(before, after)
    if rename:
        out.append(_wrap("THIS PLAN IS BEING RENAMED. The plan you know as %s is "
                         "called %s for %d. It is the same plan -- you do not need "
                         "to do anything for the name change itself."
                         % (rename[0], rename[1], after)))
        out.append("")

    new_counties = group.new_counties(before, after)
    if new_counties:
        out.append(_wrap("NEW FOR %d: %s is now offering this plan in %s."
                         % (after, group.company, _county_phrase(new_counties))))
        out.append("")

    changed = [d for d in diff if d[4]]
    if changed:
        out.append("WHAT'S CHANGING")
        out.append("-" * WIDTH)
        # Worst news first: a client who stops reading early should still have
        # seen the increases rather than only the improvements.
        for label, b, a, _direction, _changed, _phrase in (summary["worse"] +
                                                           summary["better"] +
                                                           summary["neutral"]):
            out.append(_item("%s:  %s  ->  %s" % (label, b, a)))
        out.append("")

    # A field the data does not carry is not "staying the same" -- saying so
    # would assert the two years match on a value nobody has entered. It gets
    # its own section that says plainly that the figure is not in hand.
    unknown = [d for d in diff if not d[4] and compare.UNSPECIFIED in (d[1], d[2])]
    unchanged = [d for d in diff if not d[4] and compare.UNSPECIFIED not in (d[1], d[2])]

    if unchanged:
        out.append("STAYING THE SAME" if changed else "YOUR BENEFITS")
        out.append("-" * WIDTH)
        for label, _b, a, _direction, _changed, _phrase in unchanged:
            out.append(_item("%s:  %s" % (label, a)))
        out.append("")

    if unknown:
        out.append("NOT YET CONFIRMED FOR %d" % after)
        out.append("-" * WIDTH)
        for label, _b, _a, _direction, _changed, _phrase in unknown:
            out.append(_item("%s:  we do not have this figure yet" % label))
        out.append("")

    out.append(_wrap("This covers the benefits we hear the most questions about. "
                     "It is a summary, not a complete description -- your plan's "
                     "Annual Notice of Change and Evidence of Coverage are the "
                     "full and governing documents."))
    out.append("")
    out.append(_wrap(STAY_PUT))
    out.append("")
    out.append(_wrap("Questions, or want to look at other options for %d? Reply "
                     "to this email, or call your broker:" % after))
    out.append("")
    for name, phone in BROKERS:
        out.append("%s - %s" % (name, phone))
    out.append("")

    out.append("-" * WIDTH)
    out.append("NECESSARY DISCLAIMERS:")
    if as_of:
        out.append(_wrap("Plan availability, benefits, premiums, and costs may "
                         "change on January 1 of each year. Information provided "
                         "here is current as of %s, but is subject to change."
                         % as_of))
        out.append("")
    out.append(_wrap(AFFILIATION))
    out.append("")
    out.append(_wrap(NONDISCRIMINATION))

    return "\n".join(out) + "\n"
