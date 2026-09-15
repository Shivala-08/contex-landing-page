# TRD — Context Transfer Landing Page

## 1. Stack
- Plain static site: HTML + CSS + a small amount of vanilla JS, or a minimal Astro build if you want component reuse without shipping a framework runtime. Avoid a full Next.js app for this — it's one page with no routing or state, and a heavier framework buys nothing here.
- Tailwind (via CDN or a lightweight build step) is fine for velocity, consistent with tooling you've already used on the portfolio.
- No backend, no database, no forms.

## 2. Visual direction
- Dark background, monospace/terminal-styled headings for section labels (consistent with your GitHub profile README's neon magenta/cyan/purple, terminal-hacker aesthetic) — carry that palette over here rather than inventing a new brand, since this is technically the same "you build dev tools" identity.
- The hero's "raw paste → structured card" demo should be a real animated terminal-style snippet (typed-text effect via CSS/JS), not a static screenshot — it's the single most important visual on the page since it explains the product without requiring the visitor to read anything.
- Avoid stock illustration entirely; code snippets, terminal windows, and the actual card output are the only imagery this page needs.

## 3. File structure
```
/website
  index.html
  /assets
    style.css
    terminal-demo.js       // typed-text animation for the hero
  /images
    card-example.png       // real screenshot of an extracted card
    capture-demo.gif        // Phase 2 floating-panel capture, once built
```
Keep this in a `/website` folder inside the same repo (see open-source guide) rather than a separate repo — simpler to keep in sync with the app's actual feature set as it evolves.

## 4. Hosting & deployment
- **GitHub Pages**, deployed from the `/website` folder (or a `gh-pages` branch via a small GitHub Action) — free, and it keeps the whole project (app + landing page) under one roof, which reads well for an open-source project. Vercel is an equally fine alternative if you'd rather reuse your existing Vercel setup from the portfolio site.
- Custom domain optional — a `username.github.io/context-transfer` URL is completely fine for a project at this stage; don't spend time on a domain purchase before the tool has real users.

## 5. Analytics
- If you want visit data at all, use a privacy-respecting, cookie-less option (Plausible, or GitHub's own repo traffic tab under Insights, which needs zero extra code). Do not add Google Analytics or anything cookie-based — putting invasive tracking on the landing page for a tool whose whole pitch is "your data doesn't have to leave your machine" undercuts the message the moment someone checks the page source or network tab.
- Simplest option: skip analytics for v1 entirely and rely on GitHub star/clone counts as your only signal. Add analytics later only if you actually need the data for a decision, not by default.

## 6. Performance & accessibility baseline
- Single page, no framework runtime → should load near-instantly regardless of host; no specific optimization work needed beyond compressing the demo GIF/screenshot.
- Real alt text on the card-example screenshot and capture-demo GIF (describe what's shown, not just "screenshot").
- Respect `prefers-reduced-motion` for the typed-text hero animation — show the finished text immediately for users who've set that preference, rather than forcing the animation on everyone.

## 7. Build/CI
- A single GitHub Action that deploys `/website` to Pages on push to `main` is enough — no test suite needed for a static page. Don't over-engineer CI for a project this size.
