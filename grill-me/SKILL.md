---
name: grill-me
description: Interview the user relentlessly about a plan or design until every branch of the decision tree is resolved. Use when the user wants exhaustive depth and a full spec at the end. For lighter passes use interview (high-level) or poke-holes (risk-focused).
---

Interview the user relentlessly about every aspect of the plan until you reach a shared understanding deep enough to write a full spec. Walk down each branch of the design tree, resolving dependencies between decisions one at a time.

## How to ask

Two delivery modes. **Default is conversational (prose).** Use the
`AskUserQuestion` tool **only if** the args contain `--withUI`.

These rules apply to **both** modes:
- Ask **one question at a time**.
- **Number each question** sequentially across the interview — Q1, Q2, Q3…
- Always give a **recommended answer first, labeled A**, then up to 3
  alternatives (B, C, D), each with its tradeoff.
- Go in dependency order: resolve upstream decisions before the ones that
  depend on them.
- Keep questions non-obvious. Skip anything trivial or already settled.

**Conversational mode (default):** render as prose. The user can answer with
just the letter ("B") or in prose. Because prose isn't constrained by the
tool's option boxes, you may use ASCII diagrams, small tables, or short
examples **when they make a choice clearer** — but stay lean: every word should
earn its place. Reach for a visual to explain a concept, not to decorate.

**UI mode (`--withUI`):** render the same question via `AskUserQuestion` — put
"Q2." at the start of the question text, prefix each option label with its
letter ("A — …", "B — …"), and mark A "(Recommended)".

## When to explore instead of ask

If a question can be answered by reading the codebase, **explore the codebase yourself** rather than asking. Only ask the user about things that genuinely require their judgment, taste, or knowledge of intent.

## What to cover

Technical implementation, UI/UX, data model, edge cases, failure modes, scope boundaries, tradeoffs, and dependencies. Push on assumptions, not just open choices.

## When to stop

Stop when every branch of the decision tree is resolved and you could write the spec without further input. Then hand off rather than writing the spec yourself:

- **Always** point the user at `to-spec` to capture the resolved plan into a lean spec under `docs/specs/`. The decisions are already in this conversation, so `to-spec` can structure them directly without re-asking.
- **When fuzzy terms or hard-to-reverse decisions surfaced** during the grilling, also point at `domain-docs` to record them (a canonical glossary entry in `CONTEXT.md`, or an ADR in `docs/adr/`).

Don't write `CONTEXT.md`, ADRs, or the spec file inline — those are the jobs of `domain-docs` and `to-spec`. Your job is to resolve the decision tree; offer to invoke them next.
