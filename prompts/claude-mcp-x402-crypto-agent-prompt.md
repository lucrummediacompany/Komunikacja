# Claude MCP x402 crypto analysis agent prompt

This Claude MCP prompt requests a paid Trading Zones 4H crypto market-analysis package using native x402 over a Streamable HTTP MCP server.

## Requirements

- MCP server URL: `https://api.tradingzones.app/mcp`
- Wallet-enabled MCP client or compatible x402 payment capability
- Native Circle USDC on Base Mainnet
- Maximum payment: `0.03 USDC`

## Prompt for Claude

```text
Connect to the Trading Zones Streamable HTTP MCP server:
https://api.tradingzones.app/mcp

Inspect the available tools first. Call discover_4h_setups, then call get_tz_select_4h_setup to purchase one current TZ SELECT / 4H package.

Complete the native x402 flow with a strict maximum of 0.03 USDC in native Circle USDC on Base Mainnet (eip155:8453). Reject a different network, asset, recipient or higher amount. If the setup is refreshing or HTTP 503 is returned, retry only after the server's Retry-After value and do not authorize payment during refresh.

Validate schema_version, package_id and valid_until. Reuse the package until it expires and never pay twice for a still-valid package.

Present the symbol, decision, confidence, entry policy/reference, SL, TP, liquidity guards, R:R and nine indicator states in a compact table. Include the evidence URLs and preserve the distinction between Selector evidence and the independently purchasable BTC, ETH, XRP and ONDO packages.

Do not execute a trade. This is market-analysis data, not investment advice.

If the MCP connection or payment capability is unavailable, state the limitation and stop. Do not fabricate a purchase, transaction or setup.
```

For a standard market package, use `get_btc_4h_setup`, `get_eth_4h_setup`, `get_xrp_4h_setup` or `get_ondo_4h_setup`.

[All AI agent prompts](README.md) · [Buyer SDK](../README.md) · [Disclaimer](../DISCLAIMER.md)
