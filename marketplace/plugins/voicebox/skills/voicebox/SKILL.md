---
name: voicebox
description: Controls how Claude uses the Voicebox MCP tools (voicebox_speak / voicebox_transcribe / voicebox_list_profiles / voicebox_list_captures) for spoken replies. Use when the user wants Claude to talk back, toggles voice mode (all / auto / mute), says "say it" / "read that" / "just text" / "no voice", asks about voice replies or dictation, or wants an audio file transcribed. Invoke /voicebox to manage voice mode.
---

# Voicebox voice replies

Local voice I/O via the Voicebox app (HTTP MCP at `127.0.0.1:17493/mcp`); the desktop app must be running for `speak`/`transcribe`. Tools: `voicebox_speak`, `voicebox_transcribe`, `voicebox_list_profiles`, `voicebox_list_captures`. This file defines **when** to speak and **how**; the same default rule is in `~/.claude/CLAUDE.md` so it applies every turn, and this powers the `/voicebox` toggle.

## Modes

Default **auto**, tracked from the conversation. On **every** toggle, also mirror the mode to the flag file so the Stop hook can see it: `echo <mode> > /tmp/voicebox-mode` (`all` | `auto` | `mute`).

- **`/voicebox all`** (`on`, "voice mode on", "hands-free") → speak a 1-2 sentence summary of **every** reply, full text still on screen. Acknowledge with a short spoken confirmation. Write `all` to the flag file.
- **`/voicebox auto`** (`off`, "voice mode off") → the default rule below. Write `auto` to the flag file.
- **`/voicebox mute`** ("text only", "quiet session") → no `speak` calls at all; per-message "say it" / `🔊` still honored. Acknowledge in text. Write `mute` to the flag file.
- **`/voicebox status`** (or bare `/voicebox`) → say + show the current mode.

**Enforcement (the `all` guarantee):** a `Stop` hook (`vbstop.py`, bundled with this plugin and registered via its `hooks/hooks.json`) checks the transcript after each turn. When the flag file says `all` and the turn ended with no `voicebox_speak` call, it blocks and re-prompts so the reply gets spoken. This is why the flag file must be kept in sync on every toggle, the hook can't read the conversation, only the file. It's deliberately easy to escape so a broken Voicebox never traps the session: it nudges **once** per turn (the `stop_hook_active` guard), counts a speak **attempt** even one that errored (so a silent/closed app still passes), short-circuits to allow when the MCP port is **unreachable**, and fails open on any error. So "disable enforcement" is just `/voicebox auto` (or `mute`), which rewrites the flag file.

If Andrei says "always" / "make it permanent" about a mode, write a memory file (`type: feedback`) under `~/.claude/projects/-Users-razvan-surdu-Brain/memory/` and add it to `MEMORY.md`.

## Two channels, one answer

Voice and text are **two renderings of one answer**, not a long and short version of the same words:

- **Voice = the human layer** — the verdict, the reaction, the "so what," what you'd do. Spoken the way a person talks: contractions, short sentences, natural rhythm.
- **Text = the precise / visual layer** — code, paths, diffs, tables, diagrams, steps, the full reasoning. What's worth *seeing*.

When both fire, **voice owns the gist and the text stays lean** — the text doesn't restate the spoken gist in prose, it shows the part worth seeing. But text must always be complete enough to act on with the sound off (you can't rely on the audio having been heard, and you can't hear it yourself).

## When to speak (auto mode)

Decide per reply by asking *"is there a human gist — something a person would say out loud?"*

- **There's a human gist** (a question answered, a reaction, a recommendation, "done, and here's the catch") → **speak the gist**, let the text carry the detail. This holds even when the detail is technical: say the headline ("that's fixed, the diff's on screen"; "two of these will break, see above") and never read the code aloud.
- **No human gist — pure mechanical output** (dumping a path, a command, a file, a bare list with nothing to react to) → text only.

When in doubt, a short spoken headline that points at the screen beats both silence and a robotic full read.

## Per-message overrides (this turn only)

- **Force voice** (`say it`, `read that`, `out loud`, `🔊`) → speak a ≤ 2 sentence summary even if long/technical, even in **mute**.
- **Suppress voice** (`just text`, `no voice`, `quiet`, `🔇`) → no `speak` this turn.

## How to speak — every `speak` call

- **Just call `voicebox_speak(text=...)`.** The `claude-code` MCP binding (set 2026-06-19) already speaks as Liam Neeson on Chatterbox Turbo. **Never pass `profile` / `engine` / `personality`** unless deliberately overriding for one call. If a reply comes back as the wrong profile, the binding was reset — re-set via `PUT /mcp/bindings` (`client_id: claude-code`, `profile_id: Liam Neeson`, `default_engine: chatterbox_turbo`) or pass them explicitly and tell Andrei.
- **Talk like a person, not a narrator.** Say the gist the way you'd say it out loud, with the rhythm of real speech. For anything visual, point at the screen instead of reading it: "the command's in the terminal", "the path's on screen", "three items, listed above". Never speak code, paths, URLs, long IDs, or markdown.
- **Length:** ≈ 2 sentences / 40 words max; a genuinely short reply can be spoken in full. Expect ~3-5 s before a short clip starts, so keep it short.
- **Fire and forget:** `speak` returns a `generation_id`; don't poll for a single reply. Poll (with `vbpoll.py`) only to (a) avoid talking over a prior clip in the same turn, or (b) confirm a clip rendered when you suspect silence.
- The spoken text can be a looser paraphrase of what's on screen.

## Paralinguistic tags

Drop a tag straight into the `text` and Chatterbox Turbo performs it in Liam's voice. Rendering is **probabilistic** — a supported tag may not land on a given generation (regenerate if it matters); don't depend on one firing. **Tested Jun 2026 on this Voicebox build:**

- **Work:** `[laugh]`, `[sigh]`, `[cough]`, `[gasp]`
- **Don't render here:** `[whisper]`, `[breath]` — Resemble's docs list them as supported, but this build never produced them (0/4 tries each). Avoid.

Use sparingly — one tag in a short reply lands better than several. E.g. `"[sigh] yeah, that one's a pain."` or `"[laugh] no, definitely not."`

## When it breaks

The desktop app (`/Applications/Voicebox.app`) does playback; the MCP endpoint is a separate process that can stay reachable with the app closed, so `speak` can return an id with **no sound**. **Don't relaunch a running app** — that can drop its MCP server mid-session.

- **First `speak` of the session** (and on entering `/voicebox all`): if `pgrep -x voicebox` is empty, `open -a Voicebox` + `sleep 2`; if running, do nothing. Silent unless it fails.
- **Spoke but silent / wrong voice:** run `vbpoll.py` (next to this SKILL.md): `python3 vbpoll.py <id> --json` — `failed` = real error; a different `profile_id` = binding reset (re-set it, retry).
- **`speak` errors ("not connected" / endpoint down):** if not running, `open -a Voicebox` + `sleep 2` and retry once; if it was already running, don't relaunch — a dropped MCP connection needs the harness to reconnect (new session). After one failed retry, fall back to text and say once: *"Voicebox isn't reachable, replying in text."*

## Transcription

`voicebox_transcribe` with `audio_path` (absolute) **or** `audio_base64` (exactly one). `model`: `base | small | medium | large | turbo` (default `turbo`), 200 MB max. Returns `{ text, duration, language, model }`.

## Discovery & helpers

- `voicebox_list_profiles` → voices; `voicebox_list_captures` → recent captures/transcripts (confirm a clip landed).
- `vbpoll.py <id> [--json]` (sequence/diagnose a generation) and `vbbench.py --profile <n> --engine <e> -- "text"...` (re-benchmark engine speed) live next to this file; full usage in their docstrings. HTTP API reference: `http://127.0.0.1:17493/openapi.json`.
