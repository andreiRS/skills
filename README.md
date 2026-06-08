<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://i.ibb.co/S70hpx4q/skills-header-dark.png">
  <img alt="Skills — from idea to shipped code" src="https://i.ibb.co/pvk4mZKx/skills-header-light.png">
</picture>

# Skills

A personal collection of reusable skills for Claude Code and other LLM tools. The source for the banner above lives in [`assets/skills-map.html`](assets/skills-map.html).

## Skills

| Skill | Description |
|---|---|
| [`interview`](interview/SKILL.md) | High-level interview to align on the shape of a plan (~3-6 questions) |
| [`poke-holes`](poke-holes/SKILL.md) | Focused review that hunts for weak spots and hidden assumptions (~6-12 questions) |
| [`grill-me`](grill-me/SKILL.md) | Exhaustive walk of every branch of the decision tree, hands off to `to-spec` |
| [`to-spec`](to-spec/SKILL.md) | Capture the why and what into a lean six-section spec under `docs/specs/` (capture-first) |
| [`domain-docs`](domain-docs/SKILL.md) | Maintain the `GLOSSARY.md` glossary and `docs/adr/` decision records |
| [`improve-architecture`](improve-architecture/SKILL.md) | Find deepening opportunities (shallow→deep modules) and present them as a visual HTML report |
| [`to-html`](to-html/SKILL.md) | Render what's been discussed as a single self-contained HTML page — explainer, matrix, dashboard, cheat-sheet |
| [`to-issues`](to-issues/SKILL.md) | Break a plan or spec into independently-grabbable issues as thin vertical slices |
| [`implement-tdd`](implement-tdd/SKILL.md) | Build an existing plan test-first, one behavior at a time, red-green-refactor |
| [`orchestrate-tdd`](orchestrate-tdd/SKILL.md) | Drive a list of issues to completion by spawning one TDD agent per slice, sizing the model, verifying and reviewing each result |
| [`prove-it`](prove-it/SKILL.md) | Drive the running app like a human to confirm the changed flows work end to end (pass/fail verdict) |
| [`break-it`](break-it/SKILL.md) | Adversarial exploratory testing — drive the running app to find the bugs a human QA would catch |
| [`handoff`](handoff/SKILL.md) | Summarise the current conversation into a handoff doc for the next session |
| [`to-atomic-commits`](to-atomic-commits/SKILL.md) | Split uncommitted changes into logical atomic commits, respecting detected commit conventions |
| [`garmin`](garmin/SKILL.md) | Download Garmin Connect activity splits and summarize workouts |
| [`brand-guidelines`](brand-guidelines/SKILL.md) | Apply Andrei's personal brand colors, typography, and visual style to any rendered artifact |

### Size at a glance

Each skill's `SKILL.md` — the instruction prose only — measured to keep us honest about conciseness. Tokens are estimated as `bytes ÷ 4`. Regenerate after any change with `bun scripts/skill-sizes.ts --write`.

<!-- skill-sizes:start -->
| Skill | Lines | Words | ~Tokens |
|---|--:|--:|--:|
| `orchestrate-tdd` | 146 | 1,782 | 2,729 |
| `implement-tdd` | 150 | 1,344 | 1,965 |
| `visual-companion` | 60 | 998 | 1,515 |
| `to-html` | 62 | 961 | 1,483 |
| `improve-architecture` | 69 | 889 | 1,428 |
| `domain-docs` | 105 | 872 | 1,409 |
| `to-spec` | 105 | 878 | 1,401 |
| `to-issues` | 102 | 728 | 1,132 |
| `garmin` | 75 | 556 | 949 |
| `to-atomic-commits` | 81 | 591 | 937 |
| `brand-guidelines` | 67 | 396 | 679 |
| `break-it` | 37 | 386 | 619 |
| `grill-me` | 31 | 359 | 567 |
| `poke-holes` | 37 | 321 | 503 |
| `prove-it` | 29 | 328 | 493 |
| `interview` | 27 | 228 | 367 |
| `handoff` | 24 | 173 | 257 |
| **Total** | **1,207** | **11,790** | **18,433** |
<!-- skill-sizes:end -->

### From idea to shipped code

The plan-and-build skills chain together. Pick the review depth that fits, turn the result into work, then implement it:

1. **Shape the plan** — three depth tiers for stress-testing a plan, pick based on how deep you want to go:
   - **interview** → quick alignment, big-picture only
   - **poke-holes** → probe the 2-3 riskiest parts
   - **grill-me** → exhaustive, then hands off to `to-spec`
2. **Capture it** — `to-spec` structures the resolved plan into a lean six-section spec under `docs/specs/`. Capture-first: it records what's been decided, asking only for missing required pieces.
3. **Break it down** — `to-issues` slices the spec into independently-grabbable issues.
4. **Build it** — `implement-tdd` consumes the spec or issues and builds them test-first.
5. **Check it in the real app** — once it's built and the suite is green, drive the running app like a human: **prove-it** confirms the changed flows work end to end; **break-it** throws nasty inputs and edge cases at them to find what a human QA would catch. Distinct from the test suite (`implement-tdd`/`orchestrate-tdd`) — this is the manual, browser-driven pass.

For a batch of issues you'd rather not build by hand, **orchestrate-tdd** sits one level above `implement-tdd`: instead of coding, it spawns one agent per slice (running `implement-tdd` on that slice), sizes each to the cheapest model that fits, then independently re-runs the tests and reviews the diff before advancing. Reviews are tier-gated (skip trivial, `simplify` for simple, `code-review` for complex, plus a final cross-slice pass), failures retry then escalate to the most-capable model, and it writes status back to the tracker as each slice lands. Use it to drive a whole `to-issues` backlog to a reviewed branch autonomously.

**domain-docs** runs alongside this flow as the keeper of durable domain knowledge: the `GLOSSARY.md` glossary and `docs/adr/` decision records. `grill-me` and `to-spec` flag fuzzy terms and hard-to-reverse decisions and point here to record them; it also works standalone.

**improve-architecture** feeds the front of this flow for existing codebases: it surveys the code, surfaces the strongest deepening opportunities as a visual HTML report, and stops. Take a chosen candidate into `grill-me` to design it, or `to-issues` to slice it.

**handoff** supports this flow across sessions: when work spans multiple sessions or collaborators, write a handoff doc so a fresh session can pick up where the last one left off.

### Other

- **garmin** → pull recent Garmin Connect activity data and summarize it.

## Inspiration

This collection draws on the ideas, structure, and conventions of:

- **Anthropic** — the official skills repo: [anthropics/skills](https://github.com/anthropics/skills)
- **Matt Pocock** — [mattpocock/skills](https://github.com/mattpocock/skills)
