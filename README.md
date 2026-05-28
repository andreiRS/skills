# Skills

A personal collection of reusable skills for Claude Code and other LLM tools.

## Skills

| Skill | Description |
|---|---|
| [`interview`](interview/SKILL.md) | High-level interview to align on the shape of a plan (~3-6 questions) |
| [`poke-holes`](poke-holes/SKILL.md) | Focused review that hunts for weak spots and hidden assumptions (~6-12 questions) |
| [`grill-me`](grill-me/SKILL.md) | Exhaustive walk of every branch of the decision tree, ends with a full spec |
| [`to-issues`](to-issues/SKILL.md) | Break a plan, spec, or PRD into independently-grabbable issues as thin vertical slices |
| [`implement-tdd`](implement-tdd/SKILL.md) | Build an existing plan test-first, one behavior at a time, red-green-refactor |
| [`handoff`](handoff/SKILL.md) | Summarise the current conversation into a handoff doc for the next session |
| [`garmin`](garmin/SKILL.md) | Download Garmin Connect activity splits and summarize workouts |

### From idea to shipped code

The plan-and-build skills chain together. Pick the review depth that fits, turn the result into work, then implement it:

1. **Shape the plan** — three depth tiers for stress-testing a plan, pick based on how deep you want to go:
   - **interview** → quick alignment, big-picture only
   - **poke-holes** → probe the 2-3 riskiest parts
   - **grill-me** → exhaustive, ends with `SPEC.md`
2. **Break it down** — `to-issues` slices the plan into independently-grabbable issues.
3. **Build it** — `implement-tdd` consumes the plan or issues and builds them test-first.

**handoff** supports this flow across sessions: when work spans multiple sessions or collaborators, write a handoff doc so a fresh session can pick up where the last one left off.

### Other

- **garmin** → pull recent Garmin Connect activity data and summarize it.
