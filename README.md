# Skills

A personal collection of reusable skills for Claude Code and other LLM tools.

## Skills

| Skill | Description |
|---|---|
| [`interview`](interview/SKILL.md) | High-level interview to align on the shape of a plan (~3-6 questions) |
| [`poke-holes`](poke-holes/SKILL.md) | Focused review that hunts for weak spots and hidden assumptions (~6-12 questions) |
| [`grill-me`](grill-me/SKILL.md) | Exhaustive walk of every branch of the decision tree, hands off to `to-spec` |
| [`to-spec`](to-spec/SKILL.md) | Capture the why and what into a lean six-section spec under `docs/specs/` (capture-first) |
| [`domain-docs`](domain-docs/SKILL.md) | Maintain the `CONTEXT.md` glossary and `docs/adr/` decision records |
| [`improve-architecture`](improve-architecture/SKILL.md) | Find deepening opportunities (shallow→deep modules) and present them as a visual HTML report |
| [`to-issues`](to-issues/SKILL.md) | Break a plan or spec into independently-grabbable issues as thin vertical slices |
| [`implement-tdd`](implement-tdd/SKILL.md) | Build an existing plan test-first, one behavior at a time, red-green-refactor |
| [`handoff`](handoff/SKILL.md) | Summarise the current conversation into a handoff doc for the next session |
| [`to-atomic-commits`](to-atomic-commits/SKILL.md) | Split uncommitted changes into logical atomic commits, respecting detected commit conventions |
| [`garmin`](garmin/SKILL.md) | Download Garmin Connect activity splits and summarize workouts |

### Size at a glance

Each skill's `SKILL.md` — the instruction prose only — measured to keep us honest about conciseness. Tokens are estimated as `bytes ÷ 4`. Regenerate after any change with `bun scripts/skill-sizes.ts --write`.

<!-- skill-sizes:start -->
| Skill | Lines | Words | ~Tokens |
|---|--:|--:|--:|
| `implement-tdd` | 150 | 1,344 | 1,964 |
| `improve-architecture` | 69 | 889 | 1,428 |
| `to-spec` | 105 | 878 | 1,400 |
| `domain-docs` | 103 | 770 | 1,259 |
| `garmin` | 75 | 556 | 949 |
| `to-atomic-commits` | 81 | 591 | 937 |
| `to-issues` | 85 | 575 | 905 |
| `grill-me` | 30 | 338 | 535 |
| `poke-holes` | 36 | 300 | 472 |
| `interview` | 26 | 207 | 335 |
| `handoff` | 24 | 173 | 257 |
| **Total** | **784** | **6,621** | **10,441** |
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

**domain-docs** runs alongside this flow as the keeper of durable domain knowledge: the `CONTEXT.md` glossary and `docs/adr/` decision records. `grill-me` and `to-spec` flag fuzzy terms and hard-to-reverse decisions and point here to record them; it also works standalone.

**improve-architecture** feeds the front of this flow for existing codebases: it surveys the code, surfaces the strongest deepening opportunities as a visual HTML report, and stops. Take a chosen candidate into `grill-me` to design it, or `to-issues` to slice it.

**handoff** supports this flow across sessions: when work spans multiple sessions or collaborators, write a handoff doc so a fresh session can pick up where the last one left off.

### Other

- **garmin** → pull recent Garmin Connect activity data and summarize it.
