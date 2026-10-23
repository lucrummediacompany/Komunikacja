# Security

Do not open a public issue containing wallet secrets, API keys, payment headers, signatures, or private keys.

Report vulnerabilities privately to `lucrum.media.company@gmail.com` with the subject `Trading Zones SDK security`.

This repository must never contain populated `.env` files. Examples use Coinbase CDP-managed wallets and enforce a per-payment cap of 30,000 atomic USDC ($0.03), a Base Mainnet allowlist, and a configurable rolling 24-hour cap.
