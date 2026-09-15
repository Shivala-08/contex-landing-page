# Context Transfer

> Capture AI conversations from **ChatGPT, Claude, or any app** — extract them into a structured, portable **context card**. Runs **100% locally** via Ollama. No API key. No telemetry. Free & open source.

[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![Platform](https://img.shields.io/badge/platform-macOS%2014%2B-black)](https://context-transfer.vercel.app)
[![Backend](https://img.shields.io/badge/extraction-Ollama%20%7C%20local-ff3d9a)](https://context-transfer.vercel.app)
[![Live Demo](https://img.shields.io/badge/live%20demo-context--transfer.vercel.app-black?logo=vercel)](https://context-transfer.vercel.app)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)](CONTRIBUTING.md)

**[🌐 Try it live → context-transfer.vercel.app](https://context-transfer.vercel.app)**

Your context shouldn't live and die inside one chat window. Context Transfer is a macOS utility that turns a messy conversation — from ChatGPT, Claude, a local model, anywhere you can select text — into a structured card you can paste into any other tool:

- **Goal**
- **Key Decisions**
- **Constraints & Preferences**
- **Current State**
- **Resources & Links**
- **Open Questions**

<!-- TODO: replace with a real GIF/screenshot of the extraction flow, above the fold
![Capture flow: select text, press ⌘⇧E, get a structured context card](docs/images/capture-demo.gif)
-->

## Works with

ChatGPT · Claude · Gemini · local Llama / Mistral / DeepSeek via Ollama · Cursor · Warp · Notes · Mail — **any app where you can select text.** The card you get back pastes into any AI tool, IDE, or doc.

## Features

- **Capture anywhere** — select text in any app or paste a raw transcript, hit ⌘⇧E
- **Structured extraction** — one card format regardless of model
- **Local by default** — extraction runs on your machine via Ollama, no API key
- **Bring your own model** — Ollama locally; Anthropic or NVIDIA NIM in the cloud if you point it there
- **No telemetry** — no network calls on the local path, no accounts, no cloud

## Quickstart

### Build from source

```bash
git clone https://github.com/Shivala-08/context-shifter.git
cd context-transfer
open ContextTransfer.xcodeproj
```

Requires **macOS 14+** and **Xcode 15+**. Run the app, press **⌘⇧E** in any app to capture.

### Local extraction via Ollama

Install [Ollama](https://ollama.com), then pull a model:

```bash
ollama pull llama3.1:8b
```

That's it — no API key. A prebuilt, signed `.dmg` will land with the first tagged release (see [Releases](https://github.com/Shivala-08/context-shifter/releases)).

## How it works

1. **Select text anywhere** — highlight a conversation in any app, or paste a transcript into the panel
2. **Hit extract** — one shortcut; a local model reads the mess and pulls out what matters
3. **Copy the card** — one Copy button and your context travels with you

See the [landing page](https://context-transfer.vercel.app) for the full walkthrough.

## Backends

| Backend | Runs | Notes |
| --- | --- | --- |
| Ollama (default) | locally, 100% on your hardware | works offline, no key |
| Anthropic / NVIDIA NIM | cloud | opt-in per run, never a silent default |

The card format is identical regardless of backend.

## FAQ

<details>
<summary><b>Does it work with ChatGPT and Claude?</b></summary>

Yes — with any app that has selectable text. Context Transfer reads what you highlight and turns it into one structured card, so your prompt context moves between tools with you.
</details>

<details>
<summary><b>Is my conversation data sent anywhere?</b></summary>

No. With the default Ollama backend, extraction runs entirely on your machine — zero network calls on the local path, no API key, no telemetry.
</details>

<details>
<summary><b>Why not just copy-paste the whole chat?</b></summary>

A raw transcript is noisy: introductions, wrong turns, tangents. The card distills a 4,000-token conversation into its goal, decisions, constraints, and open questions — smaller, faster to re-ingest, and consistent across models.
</details>

<details>
<summary><b>What does it cost?</b></summary>

Nothing. MIT-licensed open source, and local extraction is free forever through Ollama.
</details>

## Contributing

PRs welcome — see [CONTRIBUTING.md](CONTRIBUTING.md) for build requirements and conventions.

## License

[MIT](LICENSE)
