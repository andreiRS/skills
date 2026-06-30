#!/usr/bin/env bash
# Print facts about the current Claude Code session as KEY=VALUE lines.
#
# Resolves the session id from the environment, locates its transcript, derives
# the start time (UTC -> local) and a resume command, and asks the Obsidian CLI
# where today's daily note lives (so nothing about the vault is hardcoded — this
# works for anyone who has the Obsidian CLI and a daily-notes setup).
#
# Optional: set OBSIDIAN_VAULT to target a specific vault by name; otherwise the
# active/default vault is used.
set -euo pipefail

vault_arg=()
[ -n "${OBSIDIAN_VAULT:-}" ] && vault_arg=("vault=$OBSIDIAN_VAULT")

# --- session id ---------------------------------------------------------------
sid="${CLAUDE_CODE_SESSION_ID:-}"
if [ -z "$sid" ]; then
  echo "ERROR: CLAUDE_CODE_SESSION_ID is not set — this isn't running inside a Claude Code session." >&2
  exit 1
fi

# --- transcript ---------------------------------------------------------------
# Lives under ~/.claude/projects/<encoded-cwd>/<session-id>.jsonl. Glob by id so
# we never have to reproduce the path-encoding scheme.
transcript="$(ls -t "$HOME"/.claude/projects/*/"$sid".jsonl 2>/dev/null | head -1)"
if [ -z "$transcript" ]; then
  echo "ERROR: no transcript found for session $sid." >&2
  exit 1
fi

# --- project dir + name -------------------------------------------------------
# Use the cwd recorded in the transcript (robust even if you cd'd around).
cwd="$(grep -o '"cwd":"[^"]*"' "$transcript" | head -1 | sed 's/.*:"//; s/"$//')"
proj="${cwd:-$PWD}"
name="$(basename "$proj")"

# --- start time (UTC -> local), cross-platform --------------------------------
# Timestamps are UTC ISO8601 with milliseconds + trailing Z, e.g.
# 2026-06-30T13:59:36.887Z. Strip to whole seconds, then format in local time.
ts="$(grep -o '"timestamp":"[^"]*"' "$transcript" | head -1 | sed 's/.*:"//; s/"$//')"
clean="${ts%.*}"
if start_local="$(date -d "${clean}Z" "+%H:%M" 2>/dev/null)"; then
  : # GNU date
elif epoch="$(date -j -u -f "%Y-%m-%dT%H:%M:%S" "$clean" "+%s" 2>/dev/null)"; then
  start_local="$(date -r "$epoch" "+%H:%M")" # BSD/macOS date
else
  start_local="??:??"
fi

# --- resume command (without the --remote-control name) -----------------------
# The remote-control name should describe the *session*, not the folder, so the
# skill appends --remote-control "<short title>" using the title it generates.
resume_base="cd $proj && claude --resume $sid"

# --- daily note via Obsidian CLI (no hardcoded vault/path) --------------------
if ! command -v obsidian >/dev/null 2>&1; then
  echo "ERROR: the 'obsidian' CLI isn't on PATH. The Obsidian app must be running and its CLI installed." >&2
  exit 1
fi
root="$(obsidian ${vault_arg[@]+"${vault_arg[@]}"} vault info=path 2>/dev/null || true)"
rel="$(obsidian ${vault_arg[@]+"${vault_arg[@]}"} daily:path 2>/dev/null || true)"
if [ -z "$root" ] || [ -z "$rel" ]; then
  echo "ERROR: couldn't resolve the daily note via Obsidian. Is the app running (and the daily-notes plugin enabled)?" >&2
  exit 1
fi
daily="$root/$rel"
# Ensure the note exists so the skill can edit it (Obsidian creates it from the
# configured template on open).
[ -f "$daily" ] || obsidian ${vault_arg[@]+"${vault_arg[@]}"} daily >/dev/null 2>&1 || true

cat <<EOF
SESSION_ID=$sid
PROJECT_DIR=$proj
PROJECT_NAME=$name
START_LOCAL=$start_local
DAILY_NOTE=$daily
RESUME_BASE=$resume_base
EOF
