# Orders

Orders lets a signed-in customer see their own orders, and lets a staff user see every order, search by the customer's first name, and open one order. The seed places one paid, unshipped order for Seeded User 01.

## Sub-features

- `orders-mine` shows the seeded order on the customer's own order page.
- `orders-admin-open` shows that order on the staff list under New Orders.
- `orders-admin-search` filters the staff list by the customer's first name.
- `orders-admin-detail` opens the order and shows the customer, the line, and the total.

## How to get to it (user POV)

- A signed-in customer opens the account menu and chooses `My Orders`, which goes to `/orders`.
- A staff user opens `Admin` and chooses `Orders`, which goes to `/admin/orders`.
- From a row, choose `DETAILS`.

## Driving it with Playwright

Preconditions:

- Doctor has passed.
- `seed-manifest.json` has `orders_seeded` true and `order_customer` equal to `Seeded User 01`. If `orders_seeded` is false, stop and report that the order was not seeded.
- The browser timezone is UTC.

No one-shot script is shipped for this feature. Customer and staff sessions need separate browser profiles, because the customer sub-feature must not be signed in as the admin.

- **Staff list.** Sign in as `verify-admin@example.test` the same way as the admin user list. Open `#adminmenu` and choose the link named `Orders`. Run `page.locator("#adminmenu").click()` and `page.getByRole("link", { name: "Orders", exact: true }).click()`. The heading reads `Orders`. The tab named `New Orders` is selected. A row shows `Seeded User 01`.
- **Search.** Fill the textbox whose placeholder is `Search by User` with `Seeded User 01`. Run `page.getByPlaceholder("Search by User").fill("Seeded User 01")`. The row remains. Replace the text with `Verify Admin`. The Seeded User 01 row is gone.
- **Open the order.** Clear the search, choose the tab named `New Orders` if it is not selected, and choose the button named `DETAILS`. Run `page.getByRole("button", { name: "DETAILS" }).click()`. The heading starts with `Order:`. The page shows `Seeded User 01`, `seeded-user-01@example.test`, `Clover Honey`, and a total that contains `27`.
- **Customer list.** In a second, empty browser profile, open `/login` and sign in as `seeded-user-01@example.test` with password `seeded-user-dev-only`. Run `page.getByLabel("Email").fill("seeded-user-01@example.test")`, `page.getByLabel("Password").fill("seeded-user-dev-only")`, and `page.getByRole("button", { name: "Sign In" }).click()`. Open `#username` and choose the link named `My Orders`. Run `page.locator("#username").click()` and `page.getByRole("link", { name: "My Orders" }).click()`. The heading reads `My Orders` and a row shows that customer's order. `#adminmenu` is absent. Do not mark this passed just because the staff list showed the same order.
- **Proof.** Screenshot the staff list with the New Orders row visible, and the detail page with the customer name visible.

## Gotchas

- `/orders` is the signed-in customer's list. `/admin/orders` is the staff list. The Admin menu item is the staff list.
- The staff search compares the customer's first name. `Seeded User 01` matches. The admin's name does not match that order.
- The customer column header is the literal `user`. The translation file has no entry for that word.
- The detail address can show a blank postal code. The page reads `postalCode` and the API sends `postal_code`. A missing postal code on that line is not a missing seed. The seeded postal code is `H0H 0H0`.
- The seeded order is paid and not shipped, so it belongs on `New Orders`, not on `Shipped` or `Fulfilled`.
- `orders-mine` is listed because it is a real entry point. The seed does not currently sign in as that customer. Report it as not run, not as passed.
