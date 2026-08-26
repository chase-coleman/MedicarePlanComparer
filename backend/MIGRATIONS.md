# Database migrations

Applied by hand — `spring.jpa.hibernate.ddl-auto=none`, so Hibernate never
alters the schema. Run these in order against PlanetScale.

| File | Type | How to run |
|------|------|------------|
| `v1_init.sql` | schema | fresh databases only; already-live databases skip it |
| `v2_add_plan_year.sql` | schema | deploy request |
| `v3_drop_plan_name_unique.sql` | schema | **skip on PlanetScale** — see note |
| `v4_add_plan_grouping.sql` | schema | deploy request |
| `v4b_backfill_plan_group_id.sql` | **DML** | run in the console / `pscale shell` |
| `v4c_add_plan_group_year_unique.sql` | schema | deploy request, only after v4b |
| `v5_add_benefits_published.sql` | schema | deploy request |

## Two PlanetScale rules these follow

**Deploy requests carry schema only.** `UPDATE`/`INSERT` statements in a
deploy request are not applied. Anything that changes rows (v4b) runs
directly against the database instead.

**A new column takes its DEFAULT during the shadow-table copy.** PlanetScale
applies schema changes by copying existing rows into a new table. A column
added in that same change holds its DEFAULT for every copied row, so a
UNIQUE index over it collides on the second row:

    Duplicate entry '0-2026' for key 'uk_plan_group_year'

That is why v4 is split three ways: add the column, backfill it, then add
the unique index once the values are real.

## v3

`v3_drop_plan_name_unique.sql` uses `PREPARE`/`EXECUTE` to drop an index only
if present. That is procedural SQL, which a deploy request will not accept.
Production never had `uk_plan_plan_name`, so there is nothing to drop — the
file exists to fix databases built from the old `v1_init.sql`.
