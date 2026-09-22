"""Command line entry point. Run with: python3 -m emailgen <command>"""
import argparse
import json
import os
import re
import sys

from . import api, compare, model, render

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(HERE, "out")
CACHE = os.path.join(OUT, "plans.json")


def _load(args, log=print):
    """Plan rows, from the cache when it exists unless --refresh is given."""
    if os.path.exists(CACHE) and not args.refresh:
        rows = api.load_cache(CACHE)
        log("read %d rows from %s (use --refresh to re-fetch)"
            % (len(rows), os.path.relpath(CACHE, HERE)))
        return rows
    log("fetching from %s ..." % args.base)
    rows = api.fetch_rows(args.base, timeout=args.timeout,
                          log=(log if args.verbose else None))
    os.makedirs(OUT, exist_ok=True)
    api.save_cache(CACHE, rows)
    log("fetched %d rows -> %s" % (len(rows), os.path.relpath(CACHE, HERE)))
    return rows


def _groups(args, log=print):
    rows = _load(args, log)
    groups = model.build_groups(rows)
    years = (args.from_year, args.to_year)
    merged = model.merge_identical(groups, years, force=args.force_merge)
    collapsed = len(groups) - len(merged)
    if collapsed:
        log("merged %d group(s) that are identical in both %d and %d"
            % (collapsed, args.from_year, args.to_year))
    return merged


def _slug(text):
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


def _filename(group, after):
    return "%s-%s-%s-%d.txt" % (
        _slug(group.company), _slug(group.plan_name),
        _slug("-".join(group.counties_for(after) or group.counties_for(0))),
        after)


def cmd_status(args):
    groups = _groups(args)
    buckets = model.classify(groups, args.from_year, args.to_year)
    print("\n%d -> %d readiness\n" % (args.from_year, args.to_year))

    def show(title, key, note):
        items = buckets[key]
        print("%-34s %d" % (title, len(items)))
        if items and args.verbose:
            for group in items:
                counties = group.counties_for(args.to_year) or group.counties_for(args.from_year)
                detail = ""
                if key == "pending":
                    missing = compare.missing_sentinels(group.row(args.to_year))
                    state = compare.readiness(group.row(args.to_year))
                    detail = "  [%s: %s]" % (state, ", ".join(missing))
                print("     g%-6s %-18s %-28s %s%s"
                      % (group.key, group.company, group.plan_name,
                         ", ".join(counties), detail))
            print()
        elif items:
            print("     %s" % note)
    show("emails ready to generate", "ready", "run with --verbose to list")
    show("waiting on %d data" % args.to_year, "pending", "run with --verbose to list")
    show("new for %d (no comparison)" % args.to_year, "new", "run with --verbose to list")
    show("not offered in %d" % args.to_year, "dropped", "run with --verbose to list")
    show("missing %d data" % args.from_year, "stale", "run with --verbose to list")
    print()
    return buckets


def _render_one(group, args):
    old, new = group.row(args.from_year), group.row(args.to_year)
    diff = compare.diff_rows(old, new)
    summary = compare.summarise(diff)
    return diff, summary


def cmd_build(args):
    groups = _groups(args)
    ready = model.classify(groups, args.from_year, args.to_year)["ready"]
    if args.county:
        wanted = {c.strip().lower() for c in args.county.split(",")}
        ready = [g for g in ready
                 if wanted & {c.lower() for c in g.counties_for(args.to_year)}]
    if args.company:
        wanted = {c.strip().lower() for c in args.company.split(",")}
        ready = [g for g in ready if g.company.lower() in wanted]

    if not ready:
        print("nothing to generate -- run `status --verbose` to see why")
        return

    os.makedirs(OUT, exist_ok=True)
    index = []
    for group in ready:
        diff, summary = _render_one(group, args)
        text = render.render_text(group, args.from_year, args.to_year, diff,
                                  summary, as_of=args.as_of)
        name = _filename(group, args.to_year)
        with open(os.path.join(OUT, name), "w") as handle:
            handle.write(text)
        index.append({
            "file": name,
            "plan_group_ids": sorted(group.ids),
            "company": group.company,
            "plan_name": group.plan_name,
            "counties": group.counties_for(args.to_year),
            "new_counties": group.new_counties(args.from_year, args.to_year),
            "subject": render.subject(group, args.from_year, args.to_year, summary),
            "changed": len(summary["changed"]),
            "better": len(summary["better"]),
            "worse": len(summary["worse"]),
        })
        print("  %-52s %2d changed  %s"
              % (name, len(summary["changed"]),
                 ", ".join(group.counties_for(args.to_year))))

    with open(os.path.join(OUT, "index.json"), "w") as handle:
        json.dump(index, handle, indent=2)
    print("\n%d email(s) -> %s" % (len(index), os.path.relpath(OUT, HERE)))
    print("index: %s" % os.path.relpath(os.path.join(OUT, "index.json"), HERE))


def cmd_preview(args):
    groups = _groups(args, log=lambda *a: None)
    ready = model.classify(groups, args.from_year, args.to_year)["ready"]
    match = [g for g in ready if args.group in g.ids or
             args.group in (int(i) for i in g.key.split("-"))]
    if not match:
        sys.exit("plan group %d is not in the ready set -- try `status --verbose`"
                 % args.group)
    group = match[0]
    diff, summary = _render_one(group, args)
    print(render.render_text(group, args.from_year, args.to_year, diff, summary,
                             as_of=args.as_of))


def main(argv=None):
    # Shared flags live on a parent parser so they are accepted both before and
    # after the subcommand -- `emailgen -v status` and `emailgen status -v` are
    # equally natural to type, and argparse only allows the first by default.
    common = argparse.ArgumentParser(add_help=False)
    common.add_argument("--base", default=api.DEFAULT_BASE, help="API base URL")
    common.add_argument("--from-year", type=int, default=2026)
    common.add_argument("--to-year", type=int, default=2027)
    common.add_argument("--refresh", action="store_true",
                        help="re-fetch from the API instead of using out/plans.json")
    common.add_argument("--timeout", type=int, default=60)
    common.add_argument("--force-merge", action="store_true",
                        help="merge same-named groups that match in the earlier "
                             "year only. Unsafe when the later year diverges -- "
                             "see model.merge_identical")
    common.add_argument("--as-of", default=None,
                        help="date for the 'current as of' notice, e.g. 09/2026")
    common.add_argument("-v", "--verbose", action="store_true")

    parser = argparse.ArgumentParser(
        prog="emailgen", parents=[common],
        description="Build per-plan, per-county client update emails from the "
                    "Plan Comparer API")
    sub = parser.add_subparsers(dest="command", required=True)

    p = sub.add_parser("status", parents=[common],
                       help="what can and cannot be generated yet")
    p.set_defaults(func=cmd_status)

    p = sub.add_parser("build", parents=[common], help="write the emails to out/")
    p.add_argument("--county", help="comma separated, limit to these counties")
    p.add_argument("--company", help="comma separated, limit to these carriers")
    p.set_defaults(func=cmd_build)

    p = sub.add_parser("preview", parents=[common], help="print one email as text")
    p.add_argument("--group", type=int, required=True, help="planGroupId")
    p.set_defaults(func=cmd_preview)

    args = parser.parse_args(argv)
    os.makedirs(OUT, exist_ok=True)
    args.func(args)


if __name__ == "__main__":
    main()
