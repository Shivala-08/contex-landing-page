# Landing Page Images

Two images are referenced by the landing page. Add them here once the app is built.

## `card-example.png`

A real screenshot of an extracted context card displayed in the app.

**How to create it:**
1. Run the app and extract a real conversation
2. Take a screenshot of the resulting card (not the whole window — just the card area)
3. Crop to the card with a small margin
4. Optimize with `pngquant` or Squoosh (< 200 KB target)
5. Add descriptive alt text in `index.html` when replacing the `<!-- IMAGE SLOT -->` comment

**Suggested alt text:**
`"Screenshot of a Context Transfer card showing extracted fields: Goal, Key Decisions, Constraints, Current State, Resources, and Open Questions"`

## `capture-demo.gif`

A screen recording of the Phase 2 floating-panel capture flow (select text → press shortcut → card appears).

**How to create it:**
1. Build and run the app with the floating panel (Phase 2)
2. Use Kap, LICEcap, or `screencapture` to record the capture flow
3. Keep it under 5 seconds, 600px wide
4. Optimize with `gifsicle -O3 --lossy=80` (< 1 MB target)
5. Add descriptive alt text in `index.html` when replacing the `<!-- IMAGE SLOT -->` comment

**Suggested alt text:**
`"Animated demo showing text selected in a chat window, a capture shortcut pressed, and a structured Context Card appearing instantly"`
