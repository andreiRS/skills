---
name: interview
description: High-level interview to confirm direction and big-picture choices on a plan. Use when the user wants a quick alignment pass before going deeper. For risk-focused probing use poke-holes; for exhaustive depth use grill-me.
---

Run a **short, high-level** interview to confirm the shape of the plan. Goal: shared understanding of scope, intent, and the top-level choices — not implementation detail.

## How to ask

Two delivery modes. **Default is conversational (prose).** Use the
`AskUserQuestion` tool **only if** the args contain `--withUI`.

These rules apply to **both** modes:
- Ask **one question at a time**.
- **Number each question** sequentially across the interview — Q1, Q2, Q3…
- Always give a **recommended answer first, labeled A**, then up to 3
  alternatives (B, C, D), each with its tradeoff.
- Skip anything already settled in the conversation or trivially answerable
  from the codebase (explore the code yourself instead).

**Conversational mode (default):** render as prose. The user can answer with
just the letter ("B") or in prose. Because prose isn't constrained by the
tool's option boxes, you may use ASCII diagrams, small tables, or short
examples **when they make a choice clearer** — but stay lean: every word should
earn its place. Reach for a visual to explain a concept, not to decorate.

**UI mode (`--withUI`):** render the same question via `AskUserQuestion` — put
"Q2." at the start of the question text, prefix each option label with its
letter ("A — …", "B — …"), and mark A "(Recommended)".

## What to cover

Stay at the level of:
- Scope and out-of-scope
- Success criterion / what "done" looks like
- The 2-3 most consequential design choices (not every decision)
- Major constraints or non-negotiables

Do **not** drill into edge cases, failure modes, or implementation branches — that's `poke-holes` and `grill-me` territory.

## When to stop

Stop after ~3-6 questions, once you could summarize the plan back to the user and they'd agree. Then write a brief summary of the aligned direction (no full spec).
