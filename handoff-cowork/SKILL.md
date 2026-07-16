---
name: handoff-cowork
description: Summarise the current Cowork conversation into a handoff document so a fresh Cowork chat can continue the work. Use whenever the user says "hand off", "wrap up this session", "write a handoff", "I'll continue this later/tomorrow", "context is getting long", or wants to pass the work to another chat or teammate.
argument-hint: "What will the next session focus on?"
---

Write a handoff document for this Cowork conversation, save it to the temporary outputs folder (the scratchpad — not a file the user has to keep), and present it so the user can open it. The point is that a fresh chat, opened with no memory of this one, can pick up exactly where you left off.

Include:

**Context** — what the session was about and where things stand, with a short log of *why* the key decisions were made (not just what). A new agent can follow instructions; what it can't recover is the reasoning that ruled out the other options.
**Open threads** — what's unfinished, blocked, or waiting on the user, so the next chat knows where to start rather than re-deriving it.
**Suggested skills & connectors** — skills the next chat should invoke and connectors (Slack, Jira, Confluence, Bitbucket, StarRocks, filesystem, etc.) it will need. Naming these up front saves the next chat from rediscovering the setup.

## Rules

- Reference existing artifacts (files you created, plans, specs, PRs, diffs, Confluence pages, Jira tickets) by path or URL instead of duplicating their content — the new chat can open them, and copies drift out of date.
- Redact API keys, passwords, tokens, and PII. A handoff doc is easy to paste around, so treat it as shareable.
- If the user passed arguments, treat them as the next session's focus and tailor the doc to it — drop sections that don't serve that focus.
- Keep it to what the next chat actually needs to act. This is a runway, not a transcript.

## After saving

Present the handoff file to the user (via `present_files`), then print a short message with:

1. A one-sentence prompt they can paste into a new Cowork chat to orient it. Put it on its own line inside a fenced code block (```) so it renders as a copy-paste block rather than inline prose — the whole point is that they can copy it in one click. For example:

   ```
   Continue from the attached handoff — next focus: X
   ```

   Since scratchpad files aren't visible to a brand-new chat, briefly note (outside the code block) that they should re-upload the doc or paste its contents into the new chat.
2. If the work naturally continues on a schedule (a daily check, a weekly recap), offer in one line to set up a scheduled task so the handoff runs itself.
