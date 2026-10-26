# Product catalog

The catalog lets anyone browse the shop's products, narrow them by category, and open one product. The seeded catalog has Clover Honey and a Beeswax Candle. This journey is manual: no script drives it, and a passing admin user list does not pass these steps.

## Sub-features

- `products-open` shows both seeded products under the Products heading.
- `products-category` keeps Clover Honey and hides the candle when Honey is selected, and does the opposite for Candles.
- `products-open-detail` opens Clover Honey and shows its name, price, and Add to cart.

## How to get to it (user POV)

- Visit `/products`.
- From a product, choose `Go to products`.
- After signing in, open `Admin` and choose `Products` to reach the staff product table at `/admin/products`. That table is a different screen from the public catalog.

## Driving it with Playwright

Preconditions:

- Doctor has passed.
- `seed-manifest.json` has `products_seeded` true and `product_names` containing `Clover Honey` and `Beeswax Candle`. If `products_seeded` is false, stop and report that the product tables were not seeded.

Manual, not scripted. There is no command that runs the bullets below. Use the skill's browser settings if you drive it by hand. Do not report this feature as passed from `drive-admin-users.mjs`.

- **Open the catalog.** Open `/products`. Run `page.goto(frontendUrl + "/products")` and `page.getByRole("heading", { name: "Products" }).waitFor()`. Both `Clover Honey` and `Beeswax Candle` are visible. The category control's button reads `All Products`.
- **Filter to honey.** Open that button and choose `Honey`. Run `page.getByRole("button", { name: "All Products" }).click()` and then activate the menu item named `Honey`. The URL contains `category=honey`. `Clover Honey` is visible and `Beeswax Candle` is not.
- **Filter to candles.** Choose `Candles` the same way. `Beeswax Candle` is visible and `Clover Honey` is not.
- **Open a product.** Choose the link named `Clover Honey`. Run `page.getByRole("link", { name: "Clover Honey" }).first().click()`. The page shows a heading `Clover Honey`, the text `Price: $12.00`, and a button named `Add to cart`.
- **Proof.** Screenshot the unfiltered catalog and the honey-only catalog. Both screenshots show the Annedora header. Do not treat a broken product image as a failed filter.

## Gotchas

- The public catalog does not require sign-in. The staff table at `/admin/products` does, and it is not this feature.
- Category labels on the menu are `Honey` and `Candles`. After a choice, the address bar uses the lowercase value `honey` or `candles`. Wait for that URL before asserting which cards remain.
- Product pictures are stored through Cloudinary. Verification does not upload files, so the image request may 404. Assert the product name.
- This journey needs both seeded products. One product cannot show that a category hides the other. If either name is missing, the journey fails.
- Adding to the cart is not part of these sub-features. Choosing `Add to cart` changes client state and is a different proof.
