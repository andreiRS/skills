---
name: garmin
description: Download Garmin Connect splits CSV for recent activities via a persistent authenticated Chrome session, then summarize them. Use when Andrei asks for his recent workouts, weekly training summary, or wants Garmin data pulled into his journal or Ironman 2026 vault.
allowed-tools: Bash(bun:*), Bash(bunx:*), Bash(mkdir:*), Bash(ls:*), Bash(test:*), Read
---

# Garmin

Pulls splits CSV for recent Garmin Connect activities via a Playwright-driven persistent Chrome profile, prints a JSON manifest, and lets Claude read + summarize the files.

## When to use

- "What did I train this week?" / "summarize my last N days of workouts"
- "Pull my Garmin activities"
- Feeding workout data into `10-journal/YYYY-MM-DD.md` or the Ironman 2026 vault

Don't use during the sabbatical window (2026-04-15 → 2026-06-14) for *work* topics — but Garmin training is personal, so it's fine.

## One-time setup

The skill directory is `~/.claude/skills/garmin/`. Before the first run, install deps if missing:

```bash
test -d ~/.claude/skills/garmin/node_modules/playwright || (cd ~/.claude/skills/garmin && bun install)
test -d ~/Library/Caches/ms-playwright || bunx playwright install chrome
```

The persistent Chrome profile lives at `~/.claude/skills/garmin/profile/` and is already authenticated. If it gets wiped or expires, the very first real run must use `--headed` so Andrei can sign in + complete 2FA in the visible browser window.

## Usage

```bash
bun ~/.claude/skills/garmin/garmin.ts [--days N] [--ids id,id,...] [--out DIR] [--headed]
```

Defaults: `--days 7`, `--out ~/Downloads/garmin-<YYYY-MM-DD>/`, headless.

`--ids` overrides date filtering — download specific activities by id (taken from the `/app/activity/{id}` URL on Garmin Connect).

Stdout is a JSON array, one entry per activity:

```json
[
  { "id": "22902156969", "date": "2026-May-16", "name": "Brick Run",
    "type": "Running", "path": "/Users/.../activity-22902156969.csv", "ok": true },
  { "id": "22901823541", "date": "2026-May-16", "name": "ROUVY - Long Z2 Endurance",
    "type": "Virtual Cycling", "path": "/Users/.../activity-22901823541.csv", "ok": true }
]
```

Exit codes: `0` all good · `1` one or more downloads failed · `2` profile expired / sign-in required.

## Handling auth errors

On exit code `2` (or stderr message `profile expired or sign-in required`):

1. Tell Andrei: "Your Garmin session expired — opening a browser for you to sign in."
2. Re-run the command with `--headed` added. A Chrome window will appear at the Garmin sign-in page.
3. Wait for Andrei to confirm he's signed in (and completed 2FA), then re-run the original command headless.

## What to do after the script returns

1. Parse the stdout JSON.
2. For each entry with `ok: true`, `Read` the CSV at `path`.
3. The last row of each CSV is the `"Summary"` row — pull distance, time, pace/speed, avg HR, max HR, avg power (cycling only), total ascent.
4. Build a table grouped by date, then a short performance read (Z2 vs threshold work, bricks, long runs, weekly volume). Andrei is training for an Ironman, so frame it in those terms.
5. Report files location: `~/Downloads/garmin-<date>/`.

If any entry has `ok: false`, note which activities failed and the truncated error.

## Notes

- Only one process can hold the Chrome profile lock. If Andrei has the `playwright-cli -s=garmin` session open, close it first: `playwright-cli -s=garmin close`.
- The skill clicks "Export Splits to CSV" via the **More…** menu. Direct API calls to `/gc-api/activity-service/.../typedsplits` return 403 without extra auth headers — don't try to shortcut.
- Future hooks (not yet implemented): auto-append a workout block to `10-journal/YYYY-MM-DD.md`, push rows into the Ironman 2026 training log.
