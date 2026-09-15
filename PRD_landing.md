# PRD — Context Transfer Landing Page

## 1. Purpose
A single landing page that explains what Context Transfer does, why it exists, and gets a visitor to either download/build it or star the GitHub repo. This is a project page, not a company site — no accounts, no pricing, no funnel.

## 2. Audience
Developers and students who work across multiple AI tools/apps day to day (ChatGPT, Claude, local models) and feel the pain of re-explaining context every time they switch. Technical enough to read "runs locally via Ollama" and immediately understand why that matters — don't over-explain basics to this audience.

## 3. Core message
"Your context shouldn't live and die inside one chat window." Two things need to land in the first 5 seconds of scrolling: (1) it turns a messy conversation into a portable, structured card, and (2) it can run fully local/offline if you want — this isn't just another wrapper around someone's API.

## 4. Page sections (in order)
1. **Hero** — one-line value prop, a short subtext, two CTAs: "View on GitHub" and "Download for Mac" (or "Read the docs" if no packaged build yet). A terminal-style animated snippet showing a raw paste → structured card transformation works well here as the visual, rather than a generic hero illustration.
2. **The problem** — 2-3 short lines on context getting trapped in one app/session. Keep this brief; the audience already feels this pain, don't oversell it.
3. **How it works** — 3 steps: (1) select text anywhere or paste a conversation, (2) hit the capture shortcut or the Extract button, (3) get a structured card with a Copy button. Visual: the actual floating-panel capture flow (Phase 2) if built, otherwise the paste-in UI (Phase 1).
4. **Local-first, by default** — dedicated section on running via Ollama with no API key, no cloud call, nothing leaving the machine. This is the differentiator for this audience — give it real visual weight, not a footnote.
5. **What gets extracted** — show the actual card format (Captured on / Goal / Key Decisions / Constraints & Preferences / Current State / Resources & Links / Open Questions) as a real example, not an abstract description.
6. **Bring your own model** — mention backend flexibility (Ollama locally, Anthropic or NVIDIA NIM in the cloud if you add it) without turning this into a feature-comparison chart — one line per option is enough.
7. **Install / GitHub CTA** — repo link, star button embed, and either a direct .dmg download (once signed/notarized) or clear "build from source" instructions inline.
8. **Footer** — license badge, your GitHub handle/link, nothing else. No newsletter signup, no social icons grid.

## 5. Explicit non-goals
- No user accounts, no waitlist, no email capture
- No pricing page (it's free/open source)
- No blog or changelog page for v1 — a CHANGELOG.md in the repo is enough for now
- No invasive analytics — see TRD for the privacy-respecting alternative, since tracking visitors heavily on a privacy-focused tool's own landing page would undercut the pitch

## 6. Success signal
Since there's no funnel to measure, the real signal is qualitative: does someone unfamiliar with the project understand what it does and how to try it within one scroll, without needing to read the README first? If a visitor has to open GitHub to understand the pitch, the page hasn't done its job.
