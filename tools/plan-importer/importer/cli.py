"""Command line entry point. Run with: python3 -m importer <command>"""
import argparse, json, os, sys

from . import diff, mapping, pipeline
from .source import archive_path, download

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(HERE, "data")
OUT = os.path.join(HERE, "out")
FIXTURES = os.path.join(HERE, "fixtures")

# Columns the fixture can actually adjudicate. plan_name and company are
# marketing strings the site rewrites by hand, so they are not compared.
CHECKED = [c for c, _ in mapping.RULES]


def _archive(year, allow_download=True):
    path = archive_path(DATA, year)
    if not os.path.exists(path):
        if not allow_download:
            sys.exit("no archive for %d -- run: python3 -m importer download --year %d"
                     % (year, year))
        print("downloading CMS PBP benefits for %d ..." % year)
        path = download(DATA, year)
    return pipeline.open_archive(path)


def cmd_download(args):
    path = download(DATA, args.year, force=args.force)
    print("%s (%.1f MB)" % (path, os.path.getsize(path) / 1e6))


def cmd_counties(args):
    archive = _archive(args.year)
    counties = [c.strip() for c in args.counties.split(",")]
    areas = pipeline.service_areas(archive, args.state, counties)
    ident = pipeline.identity(archive, set(areas))
    by_county = {}
    for key, names in areas.items():
        for name in names:
            by_county.setdefault(name, []).append(key)
    for name in counties:
        keys = sorted(by_county.get(name, []))
        print("\n%s County -- %d plans" % (name, len(keys)))
        for key in keys:
            info = ident.get(key, {})
            print("   %-15s %-45s %s" % (key, info.get("plan_name", "")[:45],
                                         info.get("org", "")[:28]))
    archive.close()


def cmd_validate(args):
    archive = _archive(args.year)
    fixture = diff.load_fixture(os.path.join(FIXTURES, args.fixture))
    records = pipeline.build(archive, set(fixture))
    findings = diff.compare(records, fixture, CHECKED)
    stats = diff.summarise(findings, fixture, CHECKED)

    by_column = {}
    for _, column, _, _ in findings:
        by_column[column] = by_column.get(column, 0) + 1

    print("\nvalidating %d plans x %d columns = %d checks"
          % (stats["plans"], stats["columns"], stats["checks"]))
    print("%d mismatches -- %.1f%% agreement\n" % (stats["mismatches"], stats["accuracy"]))

    print("mismatches by column:")
    for column, count in sorted(by_column.items(), key=lambda kv: -kv[1]):
        print("   %-24s %d/%d" % (column, count, stats["plans"]))

    if args.verbose:
        print("\nevery mismatch:")
        for key, column, want, got in findings:
            print("   %-15s %-24s data.sql=%-12s cms=%s" % (key, column, want, got))

    with open(os.path.join(OUT, "validation-%d.json" % args.year), "w") as fh:
        json.dump({"summary": stats,
                   "by_column": by_column,
                   "findings": [{"cms_plan_id": k, "column": c,
                                 "data_sql": w, "cms": str(g)}
                                for k, c, w, g in findings]}, fh, indent=2)
    print("\nfull report: out/validation-%d.json" % args.year)
    archive.close()


def cmd_build(args):
    from . import emit
    archive = _archive(args.year)
    counties = [c.strip() for c in args.counties.split(",")]
    areas = pipeline.service_areas(archive, args.state, counties)
    records = pipeline.build(archive, set(areas))
    ident = pipeline.identity(archive, set(areas))
    written = emit.write_all(OUT, args.year, records, areas, ident, counties)
    for path in written:
        print("wrote %s" % path)
    archive.close()


def main(argv=None):
    parser = argparse.ArgumentParser(prog="importer",
                                     description="Build Medicare plan rows from CMS PBP data")
    sub = parser.add_subparsers(dest="command", required=True)

    p = sub.add_parser("download", help="fetch the CMS archive for a plan year")
    p.add_argument("--year", type=int, required=True)
    p.add_argument("--force", action="store_true")
    p.set_defaults(func=cmd_download)

    p = sub.add_parser("counties", help="list plans offered in given counties")
    p.add_argument("--year", type=int, required=True)
    p.add_argument("--state", default="OR")
    p.add_argument("--counties", required=True, help="comma separated")
    p.set_defaults(func=cmd_counties)

    p = sub.add_parser("validate", help="diff generated values against a fixture")
    p.add_argument("--year", type=int, default=2026)
    p.add_argument("--fixture", default="2026-expected.json")
    p.add_argument("--verbose", action="store_true")
    p.set_defaults(func=cmd_validate)

    p = sub.add_parser("build", help="generate data.sql rows and PlanetScale UPDATEs")
    p.add_argument("--year", type=int, required=True)
    p.add_argument("--state", default="OR")
    p.add_argument("--counties", required=True)
    p.set_defaults(func=cmd_build)

    args = parser.parse_args(argv)
    os.makedirs(OUT, exist_ok=True)
    args.func(args)


if __name__ == "__main__":
    main()
