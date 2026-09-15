# Open-Sourcing the Context Transfer Repo

## 1. License — decide this first, everything else assumes it exists
- **MIT** is the simplest, most permissive choice and the standard default for a personal dev tool like this — recommend it unless you specifically want the patent-grant language Apache 2.0 adds (rarely necessary for a project this size).
- Add a `LICENSE` file at repo root (GitHub's "Add file → Create new file → LICENSE" auto-offers standard templates — use that rather than hand-typing one).
- Once added, GitHub shows the license badge on the repo automatically.

## 2. README overhaul
Rewrite the README as the front door, not a dev changelog. Structure:
1. **One-line tagline** right under the repo name (what it does, no marketing fluff)
2. **A GIF or screenshot** of the actual extraction/capture flow, above the fold — this matters more than any paragraph of description
3. **Badges** — license, and if you set up CI, a build-status badge (skip stars/downloads badges until there's real traffic, they look empty otherwise)
4. **Features** — short bullet list, not prose
5. **Quickstart** — the fastest path from clone to running: clone → open in Xcode → run, or a signed .dmg download link once you have one
6. **How it works** — the same 3-step explanation as the landing page, kept short; link out to the landing page or a `/docs` folder for anything longer
7. **Backends** — note that both local (Ollama) and cloud (Anthropic/NIM) are supported, local by default
8. **Contributing** — one line pointing to `CONTRIBUTING.md`
9. **License** — one line, name only, since the badge already shows it

## 3. Contribution infrastructure
- **`CONTRIBUTING.md`**: how to build the project locally (Xcode version, macOS version needed), coding conventions if any, and how to submit a PR (branch naming, expecting one feature/fix per PR).
- **`.github/ISSUE_TEMPLATE/bug_report.md`** and **`.github/ISSUE_TEMPLATE/feature_request.md`** — GitHub has default templates you can generate from repo Settings → Features → Issues → Set up templates, then edit them down to what's actually relevant (macOS version, Ollama vs cloud backend, steps to reproduce).
- **`.github/PULL_REQUEST_TEMPLATE.md`** — a short checklist (builds locally, tested against both backends if the change touches extraction).
- **`CODE_OF_CONDUCT.md`** — adopt the Contributor Covenant template as-is; standard practice, low effort, signals the repo is meant for outside contributors.

## 4. Security hygiene — do this before making the repo public, not after
- **Audit git history for committed secrets.** Search past commits for anything resembling an API key (`grep -r "sk-ant-\|nvapi-" .git` won't catch history directly — use `git log -p | grep -i "api.*key"` or a tool like `gitleaks` or `trufflehog` to scan the full history). If you ever hardcoded a key during testing and committed it, it's in history forever unless you rewrite it — treat any exposed key as compromised and rotate it, don't just delete the line in a new commit.
- **`SECURITY.md`** — a short file: how to report a vulnerability privately (an email, not a public issue), and confirmation that the app doesn't transmit data anywhere unless the user explicitly configures a cloud backend.
- **`.gitignore`** — confirm it excludes `*.xcuserstate`, `DerivedData/`, `.DS_Store`, and any local config/env file you use during development that might hold a real key or host path.

## 5. Repo structure and discoverability
- Suggested top-level layout:
  ```
  /ContextTransfer        (Xcode project / Swift source)
  /website                (landing page, see TRD_landing.md)
  /docs                   (longer-form docs if needed later)
  CONTRIBUTING.md
  CODE_OF_CONDUCT.md
  SECURITY.md
  LICENSE
  README.md
  ```
- Set the repo **description** and **topics** in GitHub settings (e.g. `macos`, `swiftui`, `llm`, `ollama`, `privacy`, `productivity`) — topics are how people actually discover small open-source tools via GitHub search, don't skip this.
- Consider renaming the repo itself if it's currently named something generic/internal — the repo name is effectively the project's identity once public.

## 6. Releases
- Once you have a signed + notarized `.dmg` (see TRD.md's signing/notarization steps), attach it to a GitHub **Release** rather than making people build from source as the only option — most users of an open-source Mac utility expect a downloadable build, not a required Xcode step.
- Tag releases with semantic versioning (`v0.1.0` for the first public cut) and write a short release note per version — this doubles as your changelog, so a separate CHANGELOG.md isn't necessary yet.

## 7. Order of operations
1. Fix the security audit (Step 4) — non-negotiable before flipping to public
2. Add LICENSE
3. Rewrite README
4. Add CONTRIBUTING / issue templates / SECURITY.md
5. Set repo description + topics
6. Flip repo visibility to public
7. Cut a first tagged release once you have a working signed build
