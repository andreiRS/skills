---
name: save-session
description: Bookmark the current Claude Code session into the user's Obsidian daily note so they can jump back into it later from any terminal (or their phone). Use whenever the user says "save this session", "bookmark this session", "/save-session", "link this to my journal", or otherwise wants a resume-able pointer to the current conversation. Writes a titled entry with the start time, a one-line summary, and a copy-paste `claude --resume … --remote-control` command into today's daily note. The journal vault is hardcoded in the helper script — see setup below.
argument-hint: "[optional title for the entry]"
---

Bookmark the current session into today's daily note so it can be resumed later. The point is a durable, copy-paste pointer back into *this* conversation: a title to recognize it by, when it started, what it was about, and the exact command to reopen it (remote-control enabled so it's reachable from a phone).

## Setup (first-time / per-user)

The helper writes to **one fixed journal vault, hardcoded at the top of `scripts/session-info.sh`** in a `CONFIGURE ME` block. Before using this skill, edit those three lines to match your setup:

- `JOURNAL_VAULT` — absolute path to the vault holding your journal (e.g. `$HOME/Brain`)
- `JOURNAL_FOLDER` — the daily-notes folder inside it (`""` for the vault root)
- `JOURNAL_DATE_FMT` — `strftime` format of the note filename, no `.md` (e.g. `%Y-%m-%d`)

A fixed path is deliberate: the old version asked the running Obsidian app where the daily note lived, which resolved against whatever vault was *active* and could yank focus to the wrong vault (the "forge" bug). The daily-notes plugin still creates the note from your template when Obsidian is open; the script only falls back to a plain empty file if the note doesn't exist yet.

## Steps

1. **Gather the facts.** Run the helper. It reads the live session id from the environment, finds the transcript, derives the start time, and points at today's note in the configured vault:

   ```bash
   ~/.claude/skills/save-session/scripts/session-info.sh [session-id]
   ```

   Omit the argument for the current session. Pass a session id to gather facts about a *different* session instead (the `session-recap` skill uses this to bookmark a past session it just summarized).

   It prints `SESSION_ID`, `PROJECT_DIR`, `PROJECT_NAME`, `START_LOCAL` (HH:MM, already converted from UTC to local), `DAILY_NOTE` (absolute path to today's note, created if missing), and `RESUME_BASE` (the resume command *without* the `--remote-control` name — you add that in step 3).

   If it errors that the journal vault wasn't found, the `CONFIGURE ME` block hasn't been set for this machine — surface the message and point the user at the Setup section above.

2. **Write the title and summary yourself.** These are the parts only you can judge from the conversation:
   - **Title** — a short 2-3 word phrase naming what the session is about (e.g. "Otterly Insane mandate", "save-session skill", "N26 import fix"). If the user passed an argument, use it as the title. This same title doubles as the remote-control name, so it shows up on the phone — keep it recognizable.
   - **Summary** — one line on where things stand, so the user later knows whether it's worth reopening. Concrete, not "worked on stuff".

3. **Append the entry to `DAILY_NOTE`** with Read + Edit (direct file edit gives clean placement under a heading, which the CLI's blind append can't). Read the note first. Add the entry under a `## Claude Code Sessions` heading: if that heading already exists, append a new `###` block beneath the existing entries; if not, add the heading at the end of the note first. Shape:

   ```markdown
   ### HH:MM — Title
   One-line summary.

   ```bash
   <RESUME_BASE> --remote-control "Title"
   ```
   ```

   Build the code-block command from `RESUME_BASE` plus `--remote-control "<Title>"`, reusing the *same* 2-3 word title from the heading so the journal entry and the phone session match. If the user explicitly says they don't want remote control, use `RESUME_BASE` alone.

4. **Confirm.** Tell the user it's saved and echo the resume command so they can copy it straight from the chat too.

## Notes

- **Portability**: the journal vault, folder, and date format are hardcoded in the `CONFIGURE ME` block at the top of `scripts/session-info.sh`. Anyone reusing this skill must edit those three lines for their own machine (see Setup).
- The note always lives in the configured journal vault, even when the session runs in a different project — that's deliberate, so sessions across all projects collect in one journal.
- Multiple sessions per day stack as separate `###` entries under the single `## Claude Code Sessions` heading, ordered by start time.
