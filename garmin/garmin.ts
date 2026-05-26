#!/usr/bin/env bun
import { chromium, type BrowserContext, type Page } from "playwright";
import { existsSync, mkdirSync } from "node:fs";
import { homedir } from "node:os";
import { join, resolve } from "node:path";

type Activity = {
  id: string;
  date: string;
  name: string;
  type: string;
};

type Result = Activity & {
  path?: string;
  ok: boolean;
  err?: string;
};

const SCRIPT_DIR = new URL(".", import.meta.url).pathname;
const PROFILE_DIR = join(SCRIPT_DIR, "profile");
const ACTIVITIES_URL = "https://connect.garmin.com/modern/activities";
const ACTIVITY_URL = (id: string) =>
  `https://connect.garmin.com/modern/activity/${id}`;

function parseArgs(argv: string[]) {
  const args = {
    days: 7,
    ids: [] as string[],
    out: "",
    headed: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--days") args.days = parseInt(argv[++i], 10);
    else if (a === "--ids") args.ids = argv[++i].split(",").map((s) => s.trim()).filter(Boolean);
    else if (a === "--out") args.out = argv[++i];
    else if (a === "--headed") args.headed = true;
  }
  if (!args.out) {
    const today = new Date().toISOString().slice(0, 10);
    args.out = join(homedir(), "Downloads", `garmin-${today}`);
  }
  args.out = resolve(args.out.replace(/^~/, homedir()));
  return args;
}

async function ensureSignedIn(page: Page) {
  await page.goto(ACTIVITIES_URL, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2500);
  const url = page.url();
  if (url.includes("sso.garmin.com") || url.includes("/sign-in")) {
    process.stderr.write(
      "profile expired or sign-in required — re-run with --headed and sign in\n",
    );
    process.exit(2);
  }
  // Wait for at least one activity row to appear
  await page.waitForSelector('a[href^="/app/activity/"]', { timeout: 20000 });
}

async function listActivities(page: Page): Promise<Activity[]> {
  return await page.$$eval('a[href^="/app/activity/"]', (anchors) => {
    const seen = new Set<string>();
    const out: Activity[] = [];
    for (const a of anchors) {
      const href = (a as HTMLAnchorElement).getAttribute("href") || "";
      const m = href.match(/\/app\/activity\/(\d+)/);
      if (!m) continue;
      const id = m[1];
      if (seen.has(id)) continue;
      seen.add(id);
      const name = (a.textContent || "").trim();
      // Walk up until we find the smallest ancestor that contains exactly this one activity link.
      // That's the row container; one level above starts containing siblings.
      let row: HTMLElement = a as HTMLElement;
      for (let i = 0; i < 8; i++) {
        const parent = row.parentElement;
        if (!parent) break;
        const linkCount = parent.querySelectorAll('a[href^="/app/activity/"]').length;
        if (linkCount > 1) break;
        row = parent;
      }
      const text = row.innerText || "";
      const dateMatch = text.match(
        /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{1,2})\s*\n?\s*(\d{4})/,
      );
      const date = dateMatch ? `${dateMatch[3]}-${dateMatch[1]}-${dateMatch[2].padStart(2, "0")}` : "";
      // Type button: in the activity list rows, the dropdown button next to the
      // activity name carries the type as its aria-label (e.g. "Running", "Virtual Cycling").
      let typeText = "";
      for (const btn of Array.from(row.querySelectorAll("button"))) {
        const label = (btn.getAttribute("aria-label") || "").trim();
        const t = (btn.textContent || "").trim();
        const candidate = label || t.replace(/▼/g, "").trim();
        if (!candidate) continue;
        if (/^(Event|Course|Edit|Like|Favorite|Toggle|Privacy|More)/i.test(candidate)) continue;
        if (candidate.length > 40) continue;
        typeText = candidate;
        break;
      }
      out.push({ id, date, name, type: typeText });
    }
    return out;
  });
}

function monthIdx(mon: string): number {
  return ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].indexOf(mon);
}

function activityDateObj(a: Activity): Date | null {
  // a.date is "YYYY-Mon-DD" e.g. "2026-May-16"
  const m = a.date.match(/^(\d{4})-([A-Za-z]{3})-(\d{2})$/);
  if (!m) return null;
  const mi = monthIdx(m[2]);
  if (mi < 0) return null;
  return new Date(parseInt(m[1], 10), mi, parseInt(m[3], 10));
}

async function downloadOne(page: Page, id: string, outDir: string): Promise<string> {
  await page.goto(ACTIVITY_URL(id), { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(3000);
  await page.getByTitle("More...").getByLabel("Toggle Menu").click({ timeout: 15000 });
  await page.waitForTimeout(400);
  const dlPromise = page.waitForEvent("download", { timeout: 15000 });
  await page.getByText("Export Splits to CSV").click();
  const dl = await dlPromise;
  const path = join(outDir, `activity-${id}.csv`);
  await dl.saveAs(path);
  return path;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!existsSync(PROFILE_DIR)) mkdirSync(PROFILE_DIR, { recursive: true });
  if (!existsSync(args.out)) mkdirSync(args.out, { recursive: true });

  const context: BrowserContext = await chromium.launchPersistentContext(PROFILE_DIR, {
    headless: !args.headed,
    channel: "chrome",
    acceptDownloads: true,
    viewport: { width: 1400, height: 900 },
  });
  const page = context.pages()[0] || (await context.newPage());

  try {
    await ensureSignedIn(page);
    const all = await listActivities(page);

    let targets: Activity[];
    if (args.ids.length > 0) {
      const byId = new Map(all.map((a) => [a.id, a]));
      targets = args.ids.map(
        (id) => byId.get(id) ?? { id, date: "", name: "", type: "" },
      );
    } else {
      const cutoff = new Date();
      cutoff.setHours(0, 0, 0, 0);
      cutoff.setDate(cutoff.getDate() - (args.days - 1));
      targets = all.filter((a) => {
        const d = activityDateObj(a);
        return d !== null && d >= cutoff;
      });
    }

    const results: Result[] = [];
    for (const a of targets) {
      try {
        const path = await downloadOne(page, a.id, args.out);
        results.push({ ...a, path, ok: true });
      } catch (e) {
        results.push({ ...a, ok: false, err: String(e).slice(0, 300) });
      }
    }

    console.log(JSON.stringify(results, null, 2));
    await context.close();
    process.exit(results.every((r) => r.ok) ? 0 : 1);
  } catch (e) {
    process.stderr.write(`fatal: ${String(e)}\n`);
    await context.close();
    process.exit(1);
  }
}

main();
