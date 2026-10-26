# Annedora verification map

This directory is the maintained source for verifying the user-facing behavior of the Annedora shop. Read the index before driving the app, then use the matching feature file as the recipe.

## Baseline preconditions

- Launch with `.cursor/skills/verify-annedora/scripts/launch.sh` and export the `VERIFY_STATE_FILE` it prints.
- The state directory holds a new SQLite database unless `VERIFY_DATABASE_URL` selects a throwaway local Postgres database. The dev-only admin is `verify-admin@example.test`. Seeded User 26 is the newest. Verify Admin is the oldest. `aaron lower` and `Bob Mixed` are the case-insensitive sort fixtures.
- Set `VERIFY_APP_ROOT` only when the checkout to drive is not the repo that contains this skill. Do not point two live runs at the same checkout.
- Run `.cursor/skills/verify-annedora/scripts/doctor.sh` and require `doctor: ok` plus the launched app SHA.
- Never drive an instance that was not started by this verification run.

## Driving conventions

- Start every recipe from the baseline state unless its preconditions say otherwise.
- Use headless Chromium at 1280×900, locale `en-US`, timezone `UTC`, and `localStorage.i18nextLng=en` before the first load.
- Prefer ARIA roles and accessible names. The admin user list also uses `aria-sort` and the caret test ids `sort-asc` and `sort-desc`.
- Treat every command as literal. Keep quoted names unchanged.
- The scripted admin-list proof is `node .cursor/skills/verify-annedora/scripts/drive-admin-users.mjs`.
- Products and orders are manual. Their feature files describe the journey, and no script runs it. Do not mark them passed because the admin list passed.
- Restore nothing by deleting proof files. Cleanup removes the instance and leaves `artifacts/verify-annedora/<run-id>/` in place.

## Proof and skip reporting

- Capture the user action and the resulting state, not only the final screen.
- UI proof includes a screenshot with the Annedora header visible, plus the table text or an ARIA snapshot for the admin list.
- API proof for the admin list is the `GET /api/base/users/` body saved next to the screenshot.
- Record the feature id and the entry point with every artifact. The admin drive writes `results.json`.
- Report an unreachable path with the command that was attempted and the unmet precondition.
- Do not report a skipped entry point as verified through a different path.
- If `seed-manifest.json` has `products_seeded` or `orders_seeded` set to false, the product or order journey fails. Do not replace the shop with a mock.

## Feature entry contract

Each feature file starts with an H1 title and one paragraph describing the user-visible behavior. It then uses exactly four H2 sections in this order.

1. `Sub-features` lists short IDs with one line for each behavior.
2. `How to get to it (user POV)` lists every user entry point.
3. `Driving it with Playwright` starts with `Preconditions:` and uses labeled bullets that pair each user action with an exact command and observable result.
4. `Gotchas` lists traps that can waste or invalidate a verification run.

Keep implementation details out of the map. Name only user paths, stable handles, required state, commands, and observable proof.

## Features

- [Sign in](./login.md) covers the login form, a successful staff sign-in, and a rejected password.
- [Admin user list](./admin-user-list.md) covers paging, the 10/25/50/100 page-size control, header sorting, the Created column, and the default newest-first sort.
- [Product catalog](./products.md) is manual. It covers the public catalog, category filtering, and opening a product.
- [Orders](./orders.md) is manual. It covers a customer's own orders and the staff order list.
