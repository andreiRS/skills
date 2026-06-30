---
name: save-session
description: Bookmark the current Claude Code session into the user's Obsidian daily note so they can jump back into it later from any terminal (or their phone). Use whenever the user says "save this session", "bookmark this session", "/save-session", "link this to my journal", or otherwise wants a resume-able pointer to the current conversation. Writes a titled entry with the start time, a one-line summary, and a copy-paste `claude --resume … --remote-control` command into today's daily note. Requires the Obsidian app running (the daily-note location is read from the user's own vault config, nothing is hardcoded).
argument-hint: "[optional title for the entry]"
---

Bookmark the current session into today's daily note so it can be resumed later. The point is a durable, copy-paste pointer back into *this* conversation: a title to recognize it by, when it started, what it was about, and the exact command to reopen it (remote-control enabled so it's reachable from a phone).

## Steps

1. **Gather the facts.** Run the helper. It reads the live session id from the environment, finds the transcript, derives the start time, and — crucially — asks the Obsidian CLI where the daily note lives, so nothing about the vault is hardcoded:

   ```bash
   ~/.claude/skills/save-session/scripts/session-info.sh
   ```

   It prints `SESSION_ID`, `PROJECT_DIR`, `PROJECT_NAME`, `START_LOCAL` (HH:MM, already converted from UTC to local), `DAILY_NOTE` (absolute path to today's note, resolved from the user's vault config and created if missing), and `RESUME_BASE` (the resume command *without* the `--remote-control` name — you add that in step 3).

   If it errors, surface the message and stop. The usual cause is that the **Obsidian app isn't running** (its CLI needs it) — tell the user to open Obsidian and retry. Don't guess a journal path; the whole design avoids hardcoding one.

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

- **Portability**: the daily-note folder and date format come from each user's own Obsidian daily-notes config via `obsidian daily:path` + `obsidian vault info=path` — never assume a path or vault name. Set `OBSIDIAN_VAULT=<name>` before running to target a specific vault if the user keeps their journal in a non-default one.
- The note always lives in the Obsidian vault, even when the session runs in a different project — that's deliberate, so sessions across all projects collect in one journal.
- Multiple sessions per day stack as separate `###` entries under the single `## Claude Code Sessions` heading, ordered by start time.
