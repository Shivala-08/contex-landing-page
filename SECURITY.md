# Security Policy

## Reporting a vulnerability

Please report vulnerabilities privately: email **security@context-transfer.dev** (or use GitHub's "Report a vulnerability" under the Security tab if the email isn't monitored). Do not open a public issue for anything you believe is exploitable.

You'll get a response within 7 days, and a fix timeline within 14 days for anything confirmed.

## What this app does and doesn't do

- **By default, nothing leaves your machine.** Extraction runs locally via Ollama. The app makes no network requests on the extraction path and includes no telemetry.
- **Cloud backends are opt-in only.** If you explicitly configure Anthropic or NVIDIA NIM, the conversation text you capture is sent to that provider under their terms. It is never sent anywhere else.
- Captured cards live in your clipboard and your local storage. There are no accounts and no sync.
