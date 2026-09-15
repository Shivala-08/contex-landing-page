# Landing Page Images

Static image assets for the landing page.

## `og-image.png` (in use)

The social share card referenced by the Open Graph and Twitter meta tags in
`website/index.html`. Keep it at 1200×630. If the branding or palette changes,
regenerate it here under the same filename so the meta tags need no edit.

## Optional future assets (not currently referenced)

Neither file below is referenced by the landing page today — the animated hero
terminal and the interactive card demo already cover both visuals. Only add
them if the real app output looks meaningfully different from those demos.

### `card-example.png` — real screenshot of an extracted card

1. Run the app and extract a real conversation
2. Screenshot just the card area (not the whole window), crop with a small margin
3. Optimize with `pngquant` or Squoosh (< 200 KB target)
4. Reference it from `index.html` with descriptive alt text, e.g.
   `"Screenshot of a Context Transfer card showing extracted fields: Goal, Key Decisions, Constraints, Current State, Resources, and Open Questions"`

### `capture-demo.gif` — floating-panel capture flow (Phase 2)

1. Build and run the app with the floating panel
2. Record the capture flow with Kap, LICEcap, or `screencapture` — keep it under 5 seconds, 600px wide
3. Optimize with `gifsicle -O3 --lossy=80` (< 1 MB target)
4. Reference it from `index.html` with descriptive alt text, e.g.
   `"Animated demo showing text selected in a chat window, a capture shortcut pressed, and a structured Context Card appearing instantly"`
