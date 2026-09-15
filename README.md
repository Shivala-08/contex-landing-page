# Context Transfer

> Capture AI conversations from anywhere. Extract them into a structured, portable card. Runs fully local.

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

See the [landing page](https://shivala-08.github.io/context-shifter/) for the full walkthrough.

## Backends

| Backend | Runs | Notes |
| --- | --- | --- |
| Ollama (default) | locally, 100% on your hardware | works offline, no key |
| Anthropic / NVIDIA NIM | cloud | opt-in per run, never a silent default |

The card format is identical regardless of backend.

## Contributing

PRs welcome — see [CONTRIBUTING.md](CONTRIBUTING.md) for build requirements and conventions.

## License

[MIT](LICENSE)
