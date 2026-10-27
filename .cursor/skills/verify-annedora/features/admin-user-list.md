# Admin user list

The admin user list lets a staff user page through accounts, change how many rows are on the page, and sort by clicking a column header. The Created column shows when the account was created. The list opens already sorted by that date, newest first.

## Sub-features

- `users-open` opens the list from the Admin menu after signing in.
- `users-default-sort` opens on created date, newest first, with a descending indicator on Created.
- `users-created` shows a Created column whose dates use `MMMM Do, YYYY`.
- `users-page` moves to another page and shows which rows are on it.
- `users-page-size` changes the page size among 10, 25, 50, and 100 and returns to the first page.
- `users-sort` toggles the active column between ascending and descending and moves the caret to the header that was clicked.

## How to get to it (user POV)

- Sign in as a staff user, open the `Admin` menu, and choose `Users`.
- Visit `/admin/users` while already signed in as a staff user.

## Driving it with Playwright

Preconditions:

- `doctor.sh` prints `doctor: ok` and `users=27`.
- The dev admin can sign in. Seeded User 26 was created `October 26th, 2026`. Verify Admin was created `January 1st, 2024`.
- The browser timezone is UTC and the language is English.
- The shop on screen is the paginated list: a `Users per page` combobox, a `Created` column, and a pager named `User list pages`. If those controls are absent, this journey fails.

The command that runs every bullet below, records screenshots, and writes `results.json` is:

`node .cursor/skills/verify-annedora/scripts/drive-admin-users.mjs`

- **Sign in and open the list.** Fill the textbox named `Email` and the textbox named `Password`, then choose the button named `Sign In`. Open `#adminmenu` and choose the link named `Users`. The heading reads `Users List`.
- **Default page.** Read the combobox named `Users per page` and the text `Showing 1-25 of 27`. The first row is `Seeded User 26`, `seeded-user-26@example.test`, `October 26th, 2026`. The 25th row is `Bob Mixed`, `October 2nd, 2026`. The column header named `Created` has `aria-sort` `descending`. Screenshot `list-loaded.png`.
- **Created column.** On that same page, screenshot the table as `created-date-column.png`. The header reads `Created` and the first and last dates are the ones above.
- **Next page.** In the list named `User list pages`, choose the page whose text is `2`. The summary reads `Showing 26-27 of 27`. The rows are `aaron lower` / `October 1st, 2026` and `Verify Admin` / `January 1st, 2024`. Screenshot `page-change.png`.
- **Page size.** Choose `10` in the combobox named `Users per page`. The summary reads `Showing 1-10 of 27`, the first row is still `Seeded User 26`, and the pager offers `3`. Screenshot `per-page.png`. Choose `50`, then `100`. Each summary reads `Showing 1-27 of 27` and the pager does not offer `2`. Choose `10` again.
- **Sort toggle.** Choose the button named `Created`. The Created header's `aria-sort` becomes `ascending`, the descending caret is gone, and the first row is `Verify Admin`, `January 1st, 2024`, followed by `aaron lower`. Screenshot `sort-toggle.png`. Choose `Created` again. `aria-sort` returns to `descending` and the first row is `Seeded User 26`.
- **Name header.** Choose the button named `Name`. That header's `aria-sort` is `ascending`, Created's `aria-sort` is `none`, the first row is `aaron lower`, and the second is `Bob Mixed`. A binary sort would put `Bob Mixed` first. Screenshot is not required beyond the row text; the script records the check in `results.json`.
- **Email header.** Choose the button named `Email`. `aria-sort` is `ascending`. The first address is `aaron.lower@example.test` and the second is `Bob.Mixed@example.test`. Screenshot `sort-email.png`.
- **Admin header.** Choose the button named `Admin` in the table header, not the Admin menu. Ascending puts non-staff rows first, so row 1 is `aaron lower` and the API `isStaff` values on that page are false. Choose `Admin` again. `aria-sort` is `descending`, the down caret is present, and row 1 is `Verify Admin` with `isStaff` true. Screenshot `sort-admin.png`.
- **Proof.** `results.json` records each check. The saved `GET /api/base/users/` bodies match the rows on screen. The request carries `sort=created_at` and `direction=desc` on the first load.

## Gotchas

- The default page size is 25. Fewer than 26 users makes the pager look like a single page. Report that as a failed precondition. Do not shrink the expected count.
- Choosing a new page size returns to page 1. A page-2 screenshot has to be taken before that change.
- Clicking the header that is already active toggles direction. Clicking a different header sorts that column ascending and does not continue the previous direction.
- Created shows the calendar date only. Accounts created on the same UTC day look identical. The seed spreads them across days at 12:00 UTC. A browser timezone other than UTC can move a date across midnight.
- The caret icon is hidden from assistive tech. The accessible indicator is `aria-sort`. The mounted caret also has `data-testid` `sort-asc` or `sort-desc`.
- Page numbers are anchors without an `href`, so they are not links. Choose them as text inside the list named `User list pages`. The current page's accessible name also includes `(current)`.
- The account menu shows the first name. Compare it case-insensitively; the header can render it in capitals.
- The id is not a column. Edit and delete are the buttons named `Edit <first name>` and `Delete <first name>`. Do not delete seeded users during this journey. Delete asks `window.confirm` before it removes the row.
- Email and Admin use the same header button as Name and Created. The scripted journey clicks both. The Admin menu is also named Admin, so the header click has to be inside the table.
- `aaron lower` and `Bob Mixed` exist so a case-sensitive name or email sort fails this journey. Do not rename them to title case.
- A shop build whose table is only Id, Name, Email, and Admin, with no pager, fails this journey.
