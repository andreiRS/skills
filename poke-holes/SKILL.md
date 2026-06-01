---
name: poke-holes
description: Focused review of a plan that hunts for weak spots — the 2-3 decisions most likely to bite, hidden assumptions, and missing failure modes. Use when the user wants to pressure-test a plan without exhaustively walking every branch. Lighter than grill-me, deeper than interview.
---

Find the weak spots in the plan. You are not mapping the whole decision tree — you are hunting for the parts that are **most likely to fail, surprise, or have been glossed over**.

## How to start

Before asking anything, silently identify:
1. The 2-3 riskiest parts of the plan (ambiguity, untested assumptions, integration points, irreversible choices).
2. Anything that "sounds fine" but rests on an unstated assumption.
3. Failure modes the plan doesn't address.

Then probe **only those areas**. Skip the safe/obvious parts.

## How to ask

Two delivery modes. **Default is conversational (prose).** Use the
`AskUserQuestion` tool **only if** the args contain `--withUI`.

These rules apply to **both** modes:
- Ask **one question at a time**.
- **Number each question** sequentially across the review — Q1, Q2, Q3…
- Always give a **recommended answer first, labeled A**, then up to 3
  alternatives (B, C, D), each with its tradeoff.
- Frame questions adversarially when useful: "What happens if X fails?", "Why
  this and not Y?", "What's the assumption behind this?"
- If a question can be answered by reading the codebase, **explore the codebase
  instead** of asking.

**Conversational mode (default):** render as prose. The user can answer with
just the letter ("B") or in prose. Because prose isn't constrained by the
tool's option boxes, you may use ASCII diagrams, small tables, or short
examples **when they make a weak spot clearer** — but stay lean: every word
should earn its place. Reach for a visual to explain a concept, not to decorate.

**UI mode (`--withUI`):** render the same question via `AskUserQuestion` — put
"Q2." at the start of the question text, prefix each option label with its
letter ("A — …", "B — …"), and mark A "(Recommended)".

## What to cover

- Hidden assumptions
- Failure modes and edge cases for the risky parts only
- Reversibility / blast radius of the key choices
- Dependencies the plan glosses over
- "What would change your mind?" type questions

Do **not** exhaustively walk every decision — that's `grill-me`.

## When to stop

Stop after ~6-12 questions, once the weak spots are either resolved or explicitly accepted as known risks. Then write a short "risks and resolutions" summary listing what was probed, what got resolved, and what remains accepted-as-risk.
