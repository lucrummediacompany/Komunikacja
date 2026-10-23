# DeepSeek x402 crypto trading agent prompt

This DeepSeek x402 prompt retrieves one paid Trading Zones 4H crypto market-analysis package using an attached MCP client or HTTP x402 tool.

## Requirements

- Trading Zones MCP: `https://api.tradingzones.app/mcp`
- Paid HTTP endpoint: `https://api.tradingzones.app/v1/signals/TZ-SELECT/4h`
- Wallet/payment capability with native Circle USDC on Base
- Maximum payment: `0.03 USDC`

## Prompt for DeepSeek

```text
Retrieve the current Trading Zones TZ SELECT / 4H market-analysis package using a connected MCP or HTTP x402 tool.

MCP URL: https://api.tradingzones.app/mcp
HTTP URL: https://api.tradingzones.app/v1/signals/TZ-SELECT/4h
Maximum payment: 0.03 USDC
Required network: Base Mainnet, eip155:8453
Required asset: native Circle USDC

Discover tools first. Do not pay when the service reports 503 or REFRESHING. Verify the payment amount, network, asset and recipient from the x402 challenge. Authorize no more than the maximum, retry the identical request and validate schema_version, package_id and valid_until. Never buy the same still-valid package twice.

Return a structured summary of symbol, decision, confidence, entry policy/reference, SL, TP, liquidity guards, R:R, nine indicator states, validity and evidence scope. Do not apply the Selector win rate to every non-selected standard package.

Do not place an exchange order. This is market-analysis data, not investment advice.

If wallet, MCP or x402 payment capability is absent, say so and stop without inventing a transaction or setup.
```

To retrieve a specific package, use the matching `get_btc_4h_setup`, `get_eth_4h_setup`, `get_xrp_4h_setup` or `get_ondo_4h_setup` MCP tool.

[All AI agent prompts](README.md) · [Buyer SDK](../README.md) · [Disclaimer](../DISCLAIMER.md)
