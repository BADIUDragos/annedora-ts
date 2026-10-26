#!/usr/bin/env node
/**
 * Drive the admin user list the way a staff user does.
 *
 * Requires VERIFY_STATE_FILE from launch.sh. Runs doctor.sh first.
 * Writes screenshots, a video, and results.json into the run's evidence dir.
 */
import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

const statePath = process.env.VERIFY_STATE_FILE;
if (!statePath) {
  console.error("verify-annedora: VERIFY_STATE_FILE is not set");
  process.exit(1);
}

const state = JSON.parse(readFileSync(statePath, "utf8"));
const evidenceDir = state.evidence_dir;
mkdirSync(evidenceDir, { recursive: true });

const doctor = spawnSync(join(scriptDir, "doctor.sh"), {
  stdio: "inherit",
  env: process.env,
});
if (doctor.status !== 0) {
  console.error("verify-annedora: doctor failed; not driving");
  process.exit(doctor.status || 1);
}

let chromium;
try {
  ({ chromium } = require("playwright"));
} catch {
  console.error(
    "verify-annedora: playwright is not installed. From .cursor/skills/verify-annedora/scripts run: npm install && npx playwright install chromium"
  );
  process.exit(1);
}

const manifest = JSON.parse(
  readFileSync(join(state.state_dir, "seed-manifest.json"), "utf8")
);

const contract = {
  count: 27,
  newestName: "Seeded User 26",
  newestEmail: "seeded-user-26@example.test",
  newestCreated: "October 26th, 2026",
  page1LastName: "Bob Mixed",
  page1LastCreated: "October 2nd, 2026",
  page2Names: ["aaron lower", "Verify Admin"],
  page2Emails: ["aaron.lower@example.test", "verify-admin@example.test"],
  page2Created: ["October 1st, 2026", "January 1st, 2024"],
  oldestName: "Verify Admin",
  oldestEmail: "verify-admin@example.test",
  oldestCreated: "January 1st, 2024",
  nameAscFirst: "aaron lower",
  nameAscFirstEmail: "aaron.lower@example.test",
  nameAscSecond: "Bob Mixed",
  emailAscSecond: "Bob.Mixed@example.test",
};

const checks = [];
const notes = [];
let browser;
let context;
let failed = false;

function record(id, pass, detail) {
  checks.push({ id, pass, detail });
  const line = `${pass ? "pass" : "fail"} ${id}: ${detail}`;
  notes.push(line);
  console.log(line);
  if (!pass) failed = true;
}

async function ariaOf(page) {
  const table = page.locator("table");
  try {
    return await table.ariaSnapshot();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return `ariaSnapshot unavailable: ${message}\n${await table.innerText()}`;
  }
}

async function textOf(locator) {
  return (await locator.innerText()).replace(/\s+/g, " ").trim();
}

async function cell(page, rowIndex, cellIndex) {
  const row = page.locator("table tbody tr").nth(rowIndex);
  return textOf(row.locator("td").nth(cellIndex));
}

async function waitForTable(page, expected) {
  await page.waitForFunction(
    (spec) => {
      const summaryText =
        document.querySelector('[data-testid="user-list-summary"]')?.textContent || "";
      const rows = [...document.querySelectorAll("table tbody tr")];
      if (!summaryText.includes(spec.summary) || rows.length !== spec.rowCount) return false;
      const cells = rows[0]
        ? [...rows[0].querySelectorAll("td")].map((item) => item.textContent.trim())
        : [];
      if (spec.firstName && cells[0] !== spec.firstName) return false;
      if (spec.firstEmail && cells[1] !== spec.firstEmail) return false;
      if (spec.ariaSort) {
        const header = [...document.querySelectorAll("th")].find((item) =>
          (item.textContent || "").includes(spec.ariaSort.column)
        );
        if (!header || header.getAttribute("aria-sort") !== spec.ariaSort.value) return false;
      }
      return true;
    },
    expected,
    { timeout: 15000 }
  );
}

function listResponse(params) {
  return (response) => {
    if (response.request().method() !== "GET") return false;
    let url;
    try {
      url = new URL(response.url());
    } catch {
      return false;
    }
    if (!url.pathname.includes("/base/users/")) return false;
    return Object.entries(params).every(
      ([key, value]) => url.searchParams.get(key) === value
    );
  };
}

async function shot(page, name) {
  await page.screenshot({
    path: join(evidenceDir, name),
    fullPage: true,
  });
  notes.push(`screenshot ${name}`);
}

async function main() {
  if (manifest.count !== contract.count) {
    throw new Error(`seed manifest count is ${manifest.count}, expected ${contract.count}`);
  }

  browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });
  context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    locale: "en-US",
    timezoneId: "UTC",
    recordVideo: { dir: evidenceDir, size: { width: 1280, height: 900 } },
  });
  await context.addInitScript(() => {
    localStorage.setItem("i18nextLng", "en");
  });
  const page = await context.newPage();
  const apiErrors = [];
  page.on("response", (response) => {
    if (response.url().includes("/api/") && response.status() >= 400) {
      apiErrors.push(`${response.status()} ${response.url()}`);
    }
  });
  page.on("pageerror", (error) => {
    apiErrors.push(`pageerror ${error.message}`);
  });

  await page.goto(`${state.frontend_url}/login`, { waitUntil: "domcontentloaded" });
  await page.getByRole("heading", { name: "Sign In" }).waitFor();
  await page.getByLabel("Email").fill(state.admin_email);
  await page.getByLabel("Password").fill(state.admin_password);
  await page.getByRole("button", { name: "Sign In" }).waitFor();
  await shot(page, "login-form.png");

  await page.getByRole("button", { name: "Sign In" }).click();
  await page.locator("#username").waitFor();
  await page.locator("#adminmenu").waitFor();
  const title = await page.title();
  const signedInAs = ((await page.locator("#username").textContent()) || "").replace(/\s+/g, " ").trim();
  const loginOk =
    page.url().replace(/\/$/, "") === state.frontend_url.replace(/\/$/, "") &&
    signedInAs.toLowerCase().includes(contract.oldestName.toLowerCase()) &&
    title === "Annedora - Honey House";
  record(
    "login",
    loginOk,
    `url=${page.url()} title=${title} account=${signedInAs}`
  );
  await shot(page, "login-home.png");

  const firstList = page.waitForResponse(
    listResponse({
      page: "1",
      page_size: "25",
      sort: "created_at",
      direction: "desc",
    })
  );
  await page.locator("#adminmenu").click();
  await page.getByRole("link", { name: "Users", exact: true }).click();
  const firstResponse = await firstList;
  const firstBody = await firstResponse.json();
  writeFileSync(
    join(evidenceDir, "list-loaded.response.json"),
    JSON.stringify(firstBody, null, 2)
  );
  await page.getByRole("heading", { name: "Users List" }).waitFor();
  await page.getByText("Showing 1-25 of 27", { exact: true }).waitFor();

  const pageSize = await page.getByRole("combobox", { name: "Users per page" }).inputValue();
  const optionLabels = await page
    .getByRole("combobox", { name: "Users per page" })
    .locator("option")
    .allTextContents();
  const createdHeader = page.getByRole("columnheader", { name: "Created", exact: true });
  const defaultSort = await createdHeader.getAttribute("aria-sort");
  const firstName = await cell(page, 0, 0);
  const firstEmail = await cell(page, 0, 1);
  const firstCreated = await cell(page, 0, 3);
  const lastName = await cell(page, 24, 0);
  const lastCreated = await cell(page, 24, 3);
  const rowCount = await page.locator("table tbody tr").count();
  const descIndicator = await page.getByTestId("sort-desc").count();

  const listOk =
    firstBody.count === 27 &&
    firstBody.page === 1 &&
    firstBody.page_size === 25 &&
    firstBody.results.length === 25 &&
    firstBody.results[0].first_name === contract.newestName &&
    pageSize === "25" &&
    optionLabels.join(",") === "10,25,50,100" &&
    rowCount === 25;
  record(
    "list-loaded",
    listOk,
    `summary pageSize=${pageSize} options=${optionLabels.join("|")} rows=${rowCount} apiCount=${firstBody.count}`
  );
  const defaultSortOk =
    defaultSort === "descending" &&
    descIndicator === 1 &&
    firstName === contract.newestName &&
    firstEmail === contract.newestEmail &&
    firstCreated === contract.newestCreated &&
    lastName === contract.page1LastName &&
    lastCreated === contract.page1LastCreated;
  record(
    "default-sort",
    defaultSortOk,
    `aria-sort=${defaultSort} first=${firstName} ${firstCreated} last=${lastName} ${lastCreated} caret=${descIndicator}`
  );
  const createdOk =
    (await createdHeader.count()) === 1 &&
    firstCreated === contract.newestCreated &&
    lastCreated === contract.page1LastCreated;
  record(
    "created-date",
    createdOk,
    `header=${await createdHeader.count()} first=${firstCreated} last=${lastCreated}`
  );
  await shot(page, "list-loaded.png");
  await page.locator("table").screenshot({
    path: join(evidenceDir, "created-date-column.png"),
  });
  notes.push("screenshot created-date-column.png");
  writeFileSync(join(evidenceDir, "list-loaded.aria.txt"), await ariaOf(page));

  const pager = page.getByRole("list", { name: "User list pages" });
  // Page numbers are anchors without href, so they have no link role.
  const [pageTwoResponse] = await Promise.all([
    page.waitForResponse(
      listResponse({ page: "2", page_size: "25", sort: "created_at", direction: "desc" })
    ),
    pager.getByText("2", { exact: true }).click(),
  ]);
  const pageTwoBody = await pageTwoResponse.json();
  writeFileSync(
    join(evidenceDir, "page-change.response.json"),
    JSON.stringify(pageTwoBody, null, 2)
  );
  await waitForTable(page, {
    summary: "Showing 26-27 of 27",
    rowCount: 2,
    firstName: contract.page2Names[0],
    firstEmail: contract.page2Emails[0],
  });
  const pageTwoCount = await page.locator("table tbody tr").count();
  const pageTwoName0 = await cell(page, 0, 0);
  const pageTwoName1 = await cell(page, 1, 0);
  const pageTwoCreated0 = await cell(page, 0, 3);
  const pageTwoCreated1 = await cell(page, 1, 3);
  const pageOk =
    pageTwoBody.page === 2 &&
    pageTwoBody.results.length === 2 &&
    pageTwoCount === 2 &&
    pageTwoName0 === contract.page2Names[0] &&
    pageTwoName1 === contract.page2Names[1] &&
    pageTwoCreated0 === contract.page2Created[0] &&
    pageTwoCreated1 === contract.page2Created[1];
  record(
    "page-change",
    pageOk,
    `rows=${pageTwoCount} ${pageTwoName0} ${pageTwoCreated0} | ${pageTwoName1} ${pageTwoCreated1}`
  );
  await shot(page, "page-change.png");

  async function choosePageSize(size, summary, rowCount) {
    const pending = page.waitForResponse(
      listResponse({
        page: "1",
        page_size: String(size),
        sort: "created_at",
        direction: "desc",
      })
    );
    await page.getByRole("combobox", { name: "Users per page" }).selectOption(String(size));
    const response = await pending;
    const body = await response.json();
    await waitForTable(page, {
      summary,
      rowCount,
      firstName: contract.newestName,
      firstEmail: contract.newestEmail,
    });
    const selected = await page.getByRole("combobox", { name: "Users per page" }).inputValue();
    const rows = await page.locator("table tbody tr").count();
    return { body, selected, rows };
  }

  const size10 = await choosePageSize(10, "Showing 1-10 of 27", 10);
  const hasPage3 = (await pager.getByText("3", { exact: true }).count()) === 1;
  const size10First = await cell(page, 0, 0);
  const size10Ok =
    size10.selected === "10" &&
    size10.rows === 10 &&
    size10.body.page_size === 10 &&
    size10.body.results.length === 10 &&
    size10First === contract.newestName &&
    hasPage3;
  record(
    "per-page",
    size10Ok,
    `selected=${size10.selected} rows=${size10.rows} first=${size10First} page3=${hasPage3}`
  );
  await shot(page, "per-page.png");

  const size50 = await choosePageSize(50, "Showing 1-27 of 27", 27);
  const size100 = await choosePageSize(100, "Showing 1-27 of 27", 27);
  const singlePage =
    size50.rows === 27 &&
    size50.selected === "50" &&
    size100.rows === 27 &&
    size100.selected === "100" &&
    (await pager.getByText("2", { exact: true }).count()) === 0;
  record(
    "per-page-50-100",
    singlePage,
    `size50=${size50.selected}/${size50.rows} size100=${size100.selected}/${size100.rows}`
  );

  // Page size 10 was already fetched, so RTK Query may not hit the network again.
  await page.getByRole("combobox", { name: "Users per page" }).selectOption("10");
  await page.getByText("Showing 1-10 of 27", { exact: true }).waitFor();
  const backTo10 = await page.getByRole("combobox", { name: "Users per page" }).inputValue();
  if (backTo10 !== "10") {
    record("per-page-reset", false, `expected to return to 10, selected ${backTo10}`);
  }

  const sorted = page.waitForResponse(
    listResponse({
      page: "1",
      page_size: "10",
      sort: "created_at",
      direction: "asc",
    })
  );
  await page.getByRole("button", { name: "Created", exact: true }).click();
  const sortedResponse = await sorted;
  const sortedBody = await sortedResponse.json();
  writeFileSync(
    join(evidenceDir, "sort-toggle.response.json"),
    JSON.stringify(sortedBody, null, 2)
  );
  await waitForTable(page, {
    summary: "Showing 1-10 of 27",
    rowCount: 10,
    firstName: contract.oldestName,
    firstEmail: contract.oldestEmail,
    ariaSort: { column: "Created", value: "ascending" },
  });
  const ariaSort = await createdHeader.getAttribute("aria-sort");
  const ascIndicator = await page.getByTestId("sort-asc").count();
  const descGone = (await page.getByTestId("sort-desc").count()) === 0;
  const oldestName = await cell(page, 0, 0);
  const oldestEmail = await cell(page, 0, 1);
  const oldestCreated = await cell(page, 0, 3);
  const secondName = await cell(page, 1, 0);
  const sortClauses = {
    apiName: sortedBody.results[0].first_name === contract.oldestName,
    apiEmail: sortedBody.results[0].email === contract.oldestEmail,
    aria: ariaSort === "ascending",
    caret: ascIndicator === 1,
    descGone,
    name: oldestName === contract.oldestName,
    email: oldestEmail === contract.oldestEmail,
    created: oldestCreated === contract.oldestCreated,
    second: secondName === contract.page2Names[0],
  };
  const sortOk = Object.values(sortClauses).every(Boolean);
  record(
    "sort-toggle",
    sortOk,
    `clauses=${JSON.stringify(sortClauses)} created=${JSON.stringify(oldestCreated)} second=${JSON.stringify(secondName)} api=${JSON.stringify(sortedBody.results[0].first_name)}`
  );
  await shot(page, "sort-toggle.png");
  writeFileSync(join(evidenceDir, "sort-toggle.aria.txt"), await ariaOf(page));

  // Newest-first at 10 per page was already loaded, so this toggle can be served from cache.
  await page.getByRole("button", { name: "Created", exact: true }).click();
  await waitForTable(page, {
    summary: "Showing 1-10 of 27",
    rowCount: 10,
    firstName: contract.newestName,
    firstEmail: contract.newestEmail,
    ariaSort: { column: "Created", value: "descending" },
  });
  const descAgain = await createdHeader.getAttribute("aria-sort");
  const descCaret = await page.getByTestId("sort-desc").count();
  const newestAgain = await cell(page, 0, 0);
  record(
    "sort-toggle-back",
    descAgain === "descending" && descCaret === 1 && newestAgain === contract.newestName,
    `aria-sort=${descAgain} caret-desc=${descCaret} first=${newestAgain}`
  );

  const byName = page.waitForResponse(
    listResponse({
      page: "1",
      page_size: "10",
      sort: "first_name",
      direction: "asc",
    })
  );
  await page.getByRole("button", { name: "Name", exact: true }).click();
  await byName;
  await waitForTable(page, {
    summary: "Showing 1-10 of 27",
    rowCount: 10,
    firstName: contract.nameAscFirst,
    firstEmail: contract.nameAscFirstEmail,
    ariaSort: { column: "Name", value: "ascending" },
  });
  const nameHeader = page.getByRole("columnheader", { name: "Name", exact: true });
  const nameSort = await nameHeader.getAttribute("aria-sort");
  const createdIdle = await createdHeader.getAttribute("aria-sort");
  const nameFirst = await cell(page, 0, 0);
  const nameSecond = await cell(page, 1, 0);
  const nameBody = await (await byName).json();
  record(
    "sort-name",
    nameSort === "ascending" &&
      createdIdle === "none" &&
      nameFirst === contract.nameAscFirst &&
      nameSecond === contract.nameAscSecond &&
      nameBody.results[0].first_name === contract.nameAscFirst &&
      nameBody.results[1].first_name === contract.nameAscSecond &&
      (await page.getByTestId("sort-asc").count()) === 1,
    `name-aria=${nameSort} created-aria=${createdIdle} first=${nameFirst} second=${nameSecond}`
  );

  const byEmail = page.waitForResponse(
    listResponse({
      page: "1",
      page_size: "10",
      sort: "email",
      direction: "asc",
    })
  );
  await page.getByRole("button", { name: "Email", exact: true }).click();
  const emailResponse = await byEmail;
  const emailBody = await emailResponse.json();
  writeFileSync(join(evidenceDir, "sort-email.response.json"), JSON.stringify(emailBody, null, 2));
  await waitForTable(page, {
    summary: "Showing 1-10 of 27",
    rowCount: 10,
    firstName: contract.nameAscFirst,
    firstEmail: contract.nameAscFirstEmail,
    ariaSort: { column: "Email", value: "ascending" },
  });
  const emailHeader = page.getByRole("columnheader", { name: "Email", exact: true });
  const emailSort = await emailHeader.getAttribute("aria-sort");
  const emailFirst = await cell(page, 0, 1);
  const emailSecond = await cell(page, 1, 1);
  record(
    "sort-email",
    emailSort === "ascending" &&
      emailFirst === contract.nameAscFirstEmail &&
      emailSecond === contract.emailAscSecond &&
      emailBody.results[0].email === contract.nameAscFirstEmail &&
      emailBody.results[1].email === contract.emailAscSecond &&
      (await page.getByTestId("sort-asc").count()) === 1,
    `email-aria=${emailSort} first=${emailFirst} second=${emailSecond}`
  );
  await shot(page, "sort-email.png");

  const byAdmin = page.waitForResponse(
    listResponse({
      page: "1",
      page_size: "10",
      sort: "is_staff",
      direction: "asc",
    })
  );
  await page.locator("thead").getByRole("button", { name: "Admin", exact: true }).click();
  const adminResponse = await byAdmin;
  const adminBody = await adminResponse.json();
  await waitForTable(page, {
    summary: "Showing 1-10 of 27",
    rowCount: 10,
    firstName: contract.nameAscFirst,
    firstEmail: contract.nameAscFirstEmail,
    ariaSort: { column: "Admin", value: "ascending" },
  });
  const adminHeader = page.getByRole("columnheader", { name: "Admin", exact: true });
  const adminAsc = await adminHeader.getAttribute("aria-sort");
  const adminAscFirst = await cell(page, 0, 0);
  const adminAscOk =
    adminAsc === "ascending" &&
    adminAscFirst === contract.nameAscFirst &&
    adminBody.results[0].isStaff === false &&
    adminBody.results.every((user) => user.isStaff === false);
  record(
    "sort-admin-asc",
    adminAscOk,
    `aria-sort=${adminAsc} first=${adminAscFirst} staff=${adminBody.results[0].isStaff}`
  );

  const byAdminDesc = page.waitForResponse(
    listResponse({
      page: "1",
      page_size: "10",
      sort: "is_staff",
      direction: "desc",
    })
  );
  await page.locator("thead").getByRole("button", { name: "Admin", exact: true }).click();
  const adminDescResponse = await byAdminDesc;
  const adminDescBody = await adminDescResponse.json();
  writeFileSync(
    join(evidenceDir, "sort-admin.response.json"),
    JSON.stringify(adminDescBody, null, 2)
  );
  await waitForTable(page, {
    summary: "Showing 1-10 of 27",
    rowCount: 10,
    firstName: contract.oldestName,
    firstEmail: contract.oldestEmail,
    ariaSort: { column: "Admin", value: "descending" },
  });
  const adminDesc = await adminHeader.getAttribute("aria-sort");
  const adminDescFirst = await cell(page, 0, 0);
  record(
    "sort-admin",
    adminDesc === "descending" &&
      adminDescFirst === contract.oldestName &&
      adminDescBody.results[0].isStaff === true &&
      adminDescBody.results[0].first_name === contract.oldestName &&
      (await page.getByTestId("sort-desc").count()) === 1,
    `aria-sort=${adminDesc} first=${adminDescFirst} staff=${adminDescBody.results[0].isStaff}`
  );
  await shot(page, "sort-admin.png");

  if (apiErrors.length) {
    record("api-errors", false, apiErrors.join(" | "));
  } else {
    record("api-errors", true, "no API responses >= 400 and no page errors");
  }
}

try {
  await main();
} catch (error) {
  failed = true;
  record("drive", false, error && error.stack ? error.stack : String(error));
  if (context) {
    const pages = context.pages();
    if (pages[0]) {
      await pages[0].screenshot({
        path: join(evidenceDir, "failure.png"),
        fullPage: true,
      }).catch(() => {});
    }
  }
} finally {
  let videoPath = "";
  if (context) {
    const pages = context.pages();
    const video = pages[0] && pages[0].video() ? pages[0].video() : null;
    await context.close();
    if (video) {
      videoPath = join(evidenceDir, "admin-user-list.webm");
      await video.saveAs(videoPath).catch((error) => {
        notes.push(`video save failed: ${error.message}`);
        videoPath = "";
      });
    }
  }
  if (browser) await browser.close();
  const results = {
    feature: "admin-user-list",
    app_sha: state.app_sha,
    frontend_url: state.frontend_url,
    evidence_dir: evidenceDir,
    video: videoPath,
    pass: !failed && checks.every((check) => check.pass),
    checks,
  };
  writeFileSync(join(evidenceDir, "results.json"), JSON.stringify(results, null, 2) + "\n");
  writeFileSync(join(evidenceDir, "observations.txt"), notes.join("\n") + "\n");
  console.log(`results ${join(evidenceDir, "results.json")}`);
  console.log(`drive: ${results.pass ? "pass" : "fail"}`);
}

process.exit(failed || checks.some((check) => !check.pass) ? 1 : 0);
