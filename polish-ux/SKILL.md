---
name: polish-ux
description: Review-and-fix pass over an HTML artifact — verify it actually renders, then fix the recurring UX and consistency defects (broken layout, missing interaction states, mismatched type, accessibility gaps). Use after generating or editing an HTML page (from to-html, show-it, explain-diff, explain-topic, or any hand-written HTML) to make it look intentional and work correctly. Fixes in place; pairs with brand-it, which owns the visual identity.
---

# polish-ux

A craft pass for rendered HTML. `brand-it` decides what a page should *look* like (colors, fonts, semantic meaning); this skill checks that the page is actually *built well* — it renders, the components work, and nothing looks accidental. Run it on any HTML output before handing it off.

Fix defects in place, then re-verify. This is quality only — it does not add features or change content.

## Start by proving it renders

Never review from the source alone. A typo in the JS or a stray duplicate `id` can leave a blank or broken page that reads fine in the file. So first:

1. Serve the file over a throwaway local server (the browser blocks `file://`) and open it — e.g. `python3 -m http.server <port>` in its directory.
2. **Screenshot it** and inspect the real render (the `agent-browser` skill: `open` then `screenshot --full`). For anything interactive, drive the key interaction and screenshot the result state, not just the initial view.
3. Sanity-check the console and the DOM: no uncaught JS errors, elements land where the markup implies. Watch for duplicate `id`s, `getElementById` hitting the wrong node, and libraries that failed to load.

If it doesn't render correctly, that's the first fix. Everything below assumes a page that loads.

## The checklist

Walk these in order. Fix what's broken; leave what's already right.

- **Layout** — alignment holds (numbers/markers centered and on the text baseline), consistent spacing rhythm, no horizontal page scroll. Wide content (tables, diagrams, code, charts) scrolls inside its own container, not the body.
- **Responsive** — reflows cleanly at the 640px mobile breakpoint; no overlap, no clipped text, multi-column grids collapse to one.
- **Interaction states** — every interactive element has visible `hover`, `:focus-visible`, `disabled`, and selected/active styling. Feedback appears only *after* the user acts, never leaked before (styling, DOM order, `title`, or a11y labels).
- **Consistency** — one type scale, one numbering style, one border-radius family. Adornments (section numbers, markers, badges) use the body/heading typeface, not mono, unless they're code or labels. Semantic color signals meaning only, never decoration.
- **Accessibility** — sufficient contrast, real focus rings, no meaning conveyed by color alone, labels describe the element (not its correctness), meaningful alt/captions on diagrams and charts.
- **Polish** — generous whitespace, no gratuitous gradients or shadows, no default-template feel. The page should look deliberate.

## After fixing

Re-serve and re-screenshot to confirm each fix landed and nothing regressed. Report what was broken, what you changed, and show the before/after state of anything visual. Don't claim a fix you haven't seen render.

Defer to `brand-it` for the actual tokens, fonts, and color meanings — this skill enforces that they're applied cleanly, not what they are.
