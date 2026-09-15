# Contributing to Context Transfer

Thanks for helping out. This is a small project; the rules are short on purpose.

## Building locally

- **macOS 14+** and **Xcode 15+** are required.
- Clone, then open in Xcode:

  ```bash
  git clone https://github.com/Shivala-08/context-shifter.git
  cd context-transfer
  open ContextTransfer.xcodeproj
  ```

- Select the `ContextTransfer` scheme and press **Run** (⌘R). Press **⌘⇧E** in any app to test capture.
- For local extraction, install [Ollama](https://ollama.com) and pull a model, e.g. `ollama pull llama3.1:8b`.

## Submitting a PR

- One feature or fix per PR. Keep branches named like `feat/token-rotation` or `fix/offline-copy`.
- Confirm the app builds locally before pushing.
- If your change touches extraction, test against **both** backends (Ollama local and a cloud backend) and say so in the PR description.
- Update the landing page (`/website`) in the same PR if the change affects user-facing behavior.

## Reporting bugs

Open an issue with the bug report template — include macOS version, backend used (Ollama vs cloud), and steps to reproduce.
