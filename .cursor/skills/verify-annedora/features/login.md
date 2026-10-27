# Sign in

Sign in lets a customer or a staff user enter an email and password, land on the shop home when the password is accepted, and stay on the form with an error when it is not. A staff user then sees an Admin menu.

## Sub-features

- `login-open` opens the sign-in form from the header.
- `login-submit` signs in the seeded admin and shows that account's name on the home page.
- `login-staff-menu` shows the Admin menu only after a staff sign-in.
- `login-reject` keeps the user on the form when the password is wrong.

## How to get to it (user POV)

- Choose `Login` in the header.
- Visit `/login`.

## Driving it with Playwright

Preconditions:

- Doctor reports the seeded admin and 27 users.
- The browser context has no `tokens` entry in `localStorage`.
- Language is English, so the visible labels are `Email`, `Password`, and `Sign In`.

The admin-list script performs `login-open`, `login-submit`, and `login-staff-menu` before it opens the user list. To drive sign-in on its own, use the same browser settings as the skill and these actions:

- **Open the form.** Choose the link named `Login`, or open `/login`. Run `page.goto(frontendUrl + "/login")` and `page.getByRole("heading", { name: "Sign In" }).waitFor()`. The heading reads `Sign In`, and the textboxes are named `Email` and `Password`.
- **Submit the admin.** Fill those textboxes with `verify-admin@example.test` and `DevOnly-Verify-1842`, then choose the button named `Sign In`. Run `page.getByLabel("Email").fill("verify-admin@example.test")`, `page.getByLabel("Password").fill("DevOnly-Verify-1842")`, and `page.getByRole("button", { name: "Sign In" }).click()`. The URL becomes the site root, the document title is `Annedora - Honey House`, `#username` reads `Verify Admin`, and `#adminmenu` is visible.
- **Wrong password.** Open a fresh profile, fill `Email` with `verify-admin@example.test` and `Password` with `not-the-dev-password`, and choose `Sign In`. Run the same fill and click with that password. The URL stays on `/login`, the heading still reads `Sign In`, and a danger alert is visible.
- **Proof.** Screenshot the filled form before submit and the home page after a successful submit. The home screenshot shows `Verify Admin` and `Admin`.

## Gotchas

- The email field's DOM id is `username`. Its accessible name is `Email`. Type the email address. The account's login name is that same email.
- A successful sign-in always navigates to `/`. Open the admin list after that. Do not expect the login page to remember a previous path.
- Tokens are stored in `localStorage` under `tokens`. A reused browser profile skips the form and is not a proof of signing in.
- The header link is named `Login` before sign-in. After sign-in that link is gone and the account menu shows the first name.
- `login-reject` needs a fresh profile. Running it after `login-submit` in the same profile does not show the form.
