---
name: visual-companion
description: Show options, mockups, and diagrams in a live browser instead of describing them in text. Opens a local page that auto-refreshes as you write HTML and sends the user's clicks back. Use mid-brainstorm or interview when a choice is visual (which layout, compare two designs) and seeing beats reading. Pairs with interview, grill-me, and to-spec.
---

# visual-companion

A browser-based visual aid for brainstorming. Some questions are easier to answer by looking than by reading: which layout, which color direction, how two designs compare side by side. This skill opens a local web page, lets you push HTML mockups to it, and reads back what the user clicks. It is a tool, not a process. Reach for it from any brainstorming or interview flow when a question is visual, then return to the terminal for everything else.

## Browser or terminal?

Whoever calls this skill already expects to need a lot of visual help, so the browser is the default medium and full HTML is what you push to it. HTML is the richest and most flexible option: real layouts, color, side-by-side comparisons, clickable choices. Do not reach for a weaker middle ground like Mermaid. When something is visual, show it as HTML in the browser.

The only fallback is the terminal. Use a quick ASCII sketch there when the thing is trivial to show (a two-box flow, a rough tree) and spinning up the browser would be overkill. And keep words in the terminal: requirements, scope, picking between approaches described in text, pros and cons, any normal clarifying question.

Decide per question, not per session. The test: **would a picture settle this faster than a sentence?** If yes, push HTML. If it is trivial, an ASCII sketch in the terminal is fine. If the answer is words, stay in the terminal. A question that is *about* a UI is not automatically visual: "What kind of dashboard do you want?" is words; "Which of these two dashboard layouts feels right?" is HTML.

## Always show options and a recommendation

Carry over the rule from `interview` and `grill-me`: never show a bare picture and ask "what do you think?" Every screen presents **2 to 4 options with one marked as recommended**, the same way a terminal question would. The browser is just a richer way to render the choice, not a reason to drop the structure.

Each option needs a clear label (A, B, C or a short name) so the human and you point at the same thing. When you refer back to a choice in the terminal, use that label. Give a one-line reason for the recommendation. The user can pick by clicking an option or by naming it in their reply; either way you know which one they mean.

## Setup

Needs `bun` and an internet connection (the page pulls Tailwind, Chart.js, and fonts from a CDN).

Pick a screen directory (a scratch dir is fine, e.g. `/tmp/vc-<something>`) and start the server **in the background** so it survives across turns:

```bash
SCREEN_DIR=/tmp/vc-demo PORT=52777 bun <skill-dir>/scripts/server.ts
```

It prints `visual-companion at http://localhost:52777`. Give the user that URL **once**; the tab never changes address after that. Omit `PORT` to let it pick a free port (read the printed line for the number). Stop it when the visual work is done by killing the process (`lsof -ti tcp:52777 | xargs kill`).

The server reads `scripts/frame.html` at startup and serves it at `/`. The frame owns the page shell, the brand styling, and the poll loop. If you edit `frame.html`, restart the server and the user reloads once. You never write the frame during a session, only screen fragments.

## The loop

1. **Start once.** Launch the server (above), give the user the URL.
2. **Write a screen.** Write the fragment to `$SCREEN_DIR/screen.html`: the question, then 2 to 4 options with one recommended. Always the same file. `Write` for a new screen, `Edit` for a tweak to the current one (cheaper, sends only the diff). The browser polls and swaps it in within a second, no refresh.
3. **Hand off.** End your turn with a one-line summary ("3 price points up, B recommended, pick a letter or say what to change") and ask the user to look and reply in the terminal.
4. **Read the reply.** Next turn, take the user's terminal message as the answer. Confirm which option by its label before acting.
5. **Iterate or advance.** If they want changes, `Edit` the current screen. Once the question is settled, `Write` the next screen.
6. **Clear on exit.** When the next step is a terminal-only question, write a short "continuing in terminal..." screen so the user is not left staring at a resolved choice.
7. **Stop** the server when done.

## What you can put in a fragment

A fragment is plain HTML, no `<head>` or `<script src>` for libraries. The frame already provides:

- **Option styles** — `.options` wrapping `.option` blocks, each with a `.letter`, an `h3`, a `p`, and `data-choice="a"`. Add `class="selected"` to pre-mark the recommended one and a `.recommended` label inside it. Clicks highlight automatically.
- **Panels** — `.card` with an optional `.card-title` for charts, mockups, or any extra content.
- **Tailwind v4 utility classes** — for any layout the base classes do not cover.
- **Chart.js** — drop a `<canvas>` and a `<script>` that calls `new Chart(...)`. The frame re-runs injected scripts, so the chart renders.
- **Brand tokens** as CSS variables (`--info`, `--success`, `--danger`, `--highlight`, `--muted`, `--surface`, `--border`). Read them in chart scripts with `getComputedStyle(document.documentElement).getPropertyValue("--info")` so charts match the theme in both light and dark mode.

Keep fragments small and on-brand: no gradients, no decorative shadows, color only to signal meaning.

**Stay responsive.** The user may be on a phone. For any multi-column layout use `grid-cols-1 sm:grid-cols-2`, never a bare `grid-cols-2`, so columns stack on narrow screens instead of cramping. For charts in a mixed-height grid, set `options.maintainAspectRatio = false` so they fill the card instead of leaving dead space.
