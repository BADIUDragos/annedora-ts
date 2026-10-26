---
name: verify-annedora
description: "Drive the Annedora shop (Vite web UI and Django API) the way a shopper or staff user does, and capture proof. Use when launching the app from an empty database, signing in as the seeded admin, or verifying the admin user list, product catalog, or orders."
---

# Verify Annedora

Annedora is a Vite + React shop talking to a Django API. This skill launches a disposable copy, signs in through the real login form, and checks the screen a user sees. The admin user list is the scripted proof. The feature map under `features/` is the source for later runs.

The dev-only admin is created by the launch script. Do not reuse a production password or a real person's account.

- Email and login username: `verify-admin@example.test`
- Password: `DevOnly-Verify-1842`
- Visible name: `Verify Admin`

Two verification launches must not share one checkout. They would race on generated migration files. Ports, the SQLite file, and the browser profile are already per run. If a lock is present and its process is alive, launch refuses.

## Launch

The host needs `python3` (3.12 matches CI), `python3-venv`, `node` 18 or newer, and `npm`. This VM needed `apt install python3.12-venv` before `python3 -m venv` would run. Playwright's Chromium install also needs the usual shared libraries (`libnss3`, `libatk`, `libgbm`); launch downloads the browser on first use.

From the repo that contains this skill:

```bash
.cursor/skills/verify-annedora/scripts/launch.sh
export VERIFY_STATE_FILE="<path printed by launch>"
```

To drive a different checkout (for example a worktree of another branch), set `VERIFY_APP_ROOT` to that checkout before launching. The evidence directory still defaults to this skill's repo, under `artifacts/verify-annedora/<run-id>/`.

Optional overrides: `VERIFY_RUN_ID`, `VERIFY_STATE_DIR`, `VERIFY_EVIDENCE_DIR`.

Launch does all of the following in a new state directory under `/tmp`:

1. Writes a process-local env file. `SECRET_KEY` and `SIGNING_KEY` are the fixed dev values `verify-annedora-dev-secret` and `verify-annedora-dev-signing-key`. `TIME_ZONE=UTC`. `DATABASE_URL` points at a new SQLite file in the state directory.
2. Creates a virtualenv in the state directory and installs `backend/requirements.txt`, skipping `psycopg2-binary`. Verification uses SQLite, and the dev pin of that driver has no Python 3.12 wheel.
3. If `backend/base` has no numbered migrations, runs `manage.py makemigrations base --name verify_scaffold` and marks those files as verification scaffold.
4. Runs `manage.py migrate`.
5. Seeds 27 users, two products, and one unshipped order. See the seed contract below.
6. Starts `manage.py runserver --noreload` on a free localhost port. `--noreload` keeps the recorded pid as the process that owns the port.
7. Installs frontend dependencies with `npm ci` when `frontend/node_modules/.bin/vite` is missing, and installs Playwright Chromium for this skill when it is missing.
8. Starts Vite with `VITE_BACKEND_API=http://127.0.0.1:<backend-port>/api`.

Ready means both of these, not merely an open socket:

- `POST /api/auth/login` with the seeded admin returns JSON containing `access`. The backend log also contains `Starting development server at http://127.0.0.1:<port>/`.
- `GET /` on the Vite port returns HTML containing `Annedora - Honey House`.

Launch prints `VERIFY_STATE_FILE=...` when that is true. The state file records ports, pids, the app git SHA, the evidence directory, and the dev credentials.

### Seed contract

Dates are fixed instants at 12:00 UTC so the Created column does not depend on the clock. The browser drive sets its timezone to UTC. Display uses moment's `MMMM Do, YYYY`.

| Account | Email | Password | Created | Staff |
| --- | --- | --- | --- | --- |
| Verify Admin | verify-admin@example.test | DevOnly-Verify-1842 | January 1st, 2024 | yes |
| Seeded User 01 … Seeded User 26 | seeded-user-01@example.test … seeded-user-26@example.test | seeded-user-dev-only | October 1st, 2026 … October 26th, 2026 | no |

Seeded User 26 is the newest account. The admin is the oldest. Default page size is 25, so the list is two pages: users 26 down through 02, then Seeded User 01 and Verify Admin.

Products, when the product tables exist: `Clover Honey` (category honey, price 12.00) and `Beeswax Candle` (category candles, price 8.50).

Orders, when the order tables exist: one paid, unshipped shipping order for Seeded User 01, total 27.00, one line for Clover Honey, address `1 Verification Lane`, Montreal, `H0H 0H0`, Canada. Paid on 20 October 2026.

The login username stored on each account is the email. The sign-in form's accessible name is `Email`; its DOM id is `username`.

## Doctor

Run this before driving, and again whenever the page looks wrong. It does not click through the UI and it does not change a user row. It checks the password with Django's hasher instead of posting a second login.

```bash
.cursor/skills/verify-annedora/scripts/doctor.sh
```

Doctor fails unless all of the following are true:

- The backend and frontend pids from the state file are alive, and their command lines are our `runserver` and `vite` on the recorded ports.
- Those ports are owned by those pids, or by a child of them. Doctor asks `ss` when it is installed, and otherwise reads `/proc/net/tcp` and `/proc/<pid>/fd`.
- `git rev-parse HEAD` in the app checkout still equals the SHA recorded at launch.
- The SQLite file exists.
- The shop HTML contains `Annedora - Honey House`.
- The admin row is staff, named `Verify Admin`, and the dev password checks out.
- There are 27 users.
- `GET /api/auth/login` returns 405, 401, or 400, which shows the Django process is the one on that port.

## Drive

Drive in headless Chromium with a 1280×900 viewport, locale `en-US`, timezone `UTC`, and `localStorage.i18nextLng=en` before the first page load. Prefer accessible names over CSS. The admin list also exposes `aria-sort` on each column header and `data-testid="sort-asc"` / `sort-desc` on the active caret (the icon itself is `aria-hidden`).

The scripted admin-list journey is:

```bash
node .cursor/skills/verify-annedora/scripts/drive-admin-users.mjs
```

It runs doctor, then does the following against `frontend_url` from the state file. Selectors below are the ones the script uses.

1. Open `/login`. Fill the textbox named `Email` with the admin email and the textbox named `Password` with the dev password. The button is named `Sign In`.
2. After submit, the URL is the site root, the document title is `Annedora - Honey House`, the account menu `#username` reads `Verify Admin`, and `#adminmenu` reads `Admin`.
3. Open `#adminmenu` and choose the link named `Users`. The heading is `Users List`.
4. The combobox named `Users per page` offers `10`, `25`, `50`, and `100`, and starts at `25`. The summary reads `Showing 1-25 of 27`. The first row is Seeded User 26, `seeded-user-26@example.test`, created `October 26th, 2026`. The last row on that page is Seeded User 02, created `October 2nd, 2026`. The Created header's `aria-sort` is `descending`.
5. In the list named `User list pages`, choose the page text `2` (it is not a link). The summary reads `Showing 26-27 of 27`. The rows are Seeded User 01 (`October 1st, 2026`) and Verify Admin (`January 1st, 2024`).
6. Choose `10` in `Users per page`. The summary reads `Showing 1-10 of 27`, the first row is still Seeded User 26, and page `3` is offered. Then choose `50` and `100`; each shows `Showing 1-27 of 27` and does not offer page `2`.
7. Return to `10` per page and choose the button named `Created`. That toggles the active column from descending to ascending: `aria-sort` becomes `ascending`, the up caret is present, and the first row is Verify Admin, `January 1st, 2024`, followed by Seeded User 01. Choose `Created` again to toggle back to newest first. Choose the button named `Name` to sort by first name ascending; the first row is Seeded User 01 and the Created header's `aria-sort` is `none`.

The list request is `GET /api/base/users/` with `page`, `page_size`, `sort`, and `direction`. The script waits for those responses. It does not call a test-only endpoint and it does not write the list through an internal setter.

Login, products, and orders are driven with the same browser settings. Their steps are in `features/`. A journey whose seed flag is false (`products_seeded` or `orders_seeded` in `seed-manifest.json`) fails and reports that precondition. Do not point the browser at a mocked API to make it pass.

## Evidence

The drive writes proof to the `evidence_dir` in the state file, by default:

`artifacts/verify-annedora/<run-id>/`

That directory is gitignored. Cleanup must not delete it.

For the admin list, a passing run leaves:

- `login-form.png` — filled sign-in form, before submit
- `login-home.png` — shop home after sign-in, with the admin's name
- `list-loaded.png` — first page, default sort
- `created-date-column.png` — the table, including the Created header and dates
- `page-change.png` — page 2
- `per-page.png` — 10 users per page
- `sort-toggle.png` — Created sorted ascending, with the up caret
- `admin-user-list.webm` — the same journey in one recording
- `list-loaded.aria.txt`, `sort-toggle.aria.txt` — table snapshots
- `list-loaded.response.json`, `page-change.response.json`, `sort-toggle.response.json` — the API bodies the screen rendered
- `seed-manifest.json`, `observations.txt`, `results.json` — seed contract, check log, and pass/fail per behavior

Capture the action and the resulting state. `results.json` is the pass/fail record. The response JSON is the side-effect check that the table came from the API, and the row text is the user-visible result. Doctor's user count is a second, read-only view of the same rows.

SQLite is the disposable database. PostgreSQL-only behavior is not what this skill drives. Cloudinary uploads are not part of launch; product images may 404. Assert names and prices, not image bytes.

## Cleanup

Stop only the pids in the state file, delete the scaffold migrations this run created, delete the state directory (virtualenv, SQLite, logs), and remove the checkout lock when it points at this state file.

```bash
.cursor/skills/verify-annedora/scripts/cleanup.sh
```

Do not kill processes by name. After cleanup, `evidence_dir` must still exist. A cleanup that deletes the proof failed.

If launch fails halfway, its exit trap runs this same cleanup.

## Helpers

All of these live in `.cursor/skills/verify-annedora/scripts/`. Run them from the skill's repo. They are executable.

| Helper | Invocation |
| --- | --- |
| `launch.sh` | `.cursor/skills/verify-annedora/scripts/launch.sh` |
| `doctor.sh` | `.cursor/skills/verify-annedora/scripts/doctor.sh` |
| `drive-admin-users.mjs` | `node .cursor/skills/verify-annedora/scripts/drive-admin-users.mjs` |
| `cleanup.sh` | `.cursor/skills/verify-annedora/scripts/cleanup.sh` |
| `seed_verify_data.py` | Called by launch, with the state env file sourced and the working directory `backend/`: `"$STATE_DIR/venv/bin/python" .cursor/skills/verify-annedora/scripts/seed_verify_data.py` |
| `lib.sh` | Sourced by the shell helpers. Do not execute it. |

`package.json` in that directory is the Playwright install for the harness. Launch runs `npm install` and `npx playwright install chromium` there when Chromium is missing. Cleanup does not remove it.

## Maintenance

When the shop's routes, labels, or seed needs change, update the feature file in the same change as the behavior. Use `/maintain-verification-skill` to keep this map lined up with the app.
