---
name: brand-guidelines
description: Applies Andrei's personal brand colors, typography, and visual style to any visual artifact — HTML pages, React components, dashboards, slides, charts, or any rendered output. Use when producing something visual and no other style is specified, or when the user asks for brand colors, design standards, or "make it look right".
---

# Personal Brand Styling

Andrei's visual identity. Apply it to anything rendered for him unless a project already defines its own design system, or he asks for a different look. Dark mode is the default; light mode is always available alongside it.

## Tokens

Drop these into the artifact and reference the variables — never hard-code the hex values inline.

```css
:root {
  /* Dark mode (default) */
  --bg:        #1e1e1e;
  --surface:   #252525;  /* cards, panels */
  --border:    #333333;
  --text:      #ffffff;

  /* Semantic — same role in both modes */
  --success:   #4caf7d;  /* green  — done / confirm */
  --info:      #6b9bd2;  /* blue   — link / neutral action */
  --danger:    #e05c4b;  /* red    — error / warning / destructive */
  --highlight: #c9970a;  /* gold   — callout / accent */
}

@media (prefers-color-scheme: light) {
  :root {
    --bg:      #f5f0e8;
    --surface: #ede8df;
    --border:  #ccc6bb;
    --text:    #1a1a1a;
    /* Semantic colors darken ~20% in light mode */
    --success:   #3a8c63;
    --info:      #4f7cb0;
    --danger:    #c0432f;
    --highlight: #a87c08;
  }
}
```

For a manual toggle, mirror the light values under a `[data-theme="light"]` selector instead of (or alongside) the media query.

## Typography

- Headings: **Inter** 600–700
- Body: **Inter** 400, line-height 1.6
- Code: **JetBrains Mono**

Load from a CDN (e.g. Google Fonts / `fonts.bunny.net`) with a system-font fallback stack so the artifact still reads correctly offline.

## Rules

- **Dark mode first.** Always include light mode, via `prefers-color-scheme` or a manual toggle.
- **Headings use body text color** (white / near-black), never decorative colors.
- **Semantic colors communicate meaning only** — never decoration. Green = success/done, blue = info/neutral action, red = error/warning/delete, gold = callout/highlight.
- **Buttons:** primary action in blue, destructive in red, success confirmation in green.
- **Generous whitespace. No gradients. Minimal UI.**
- **Always responsive.** Mobile breakpoint at 640px.

## Don't

- Don't override a project's existing design system — these are personal defaults, not a mandate.
- Don't use color purely to decorate; if a color appears, it should signal meaning.
- Don't introduce extra accent hues, gradients, or shadows for flair.
