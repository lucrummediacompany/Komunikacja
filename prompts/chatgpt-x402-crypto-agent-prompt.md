# ChatGPT x402 crypto trading analysis agent prompt

This copy-paste prompt helps a tool-enabled ChatGPT or Codex agent purchase a Trading Zones BTC, ETH, XRP, ONDO or TZ SELECT 4H analysis package through native MCP x402 payments on Base.

## Requirements

- Trading Zones MCP server: `https://api.tradingzones.app/mcp`
- A connected wallet or x402-capable payment tool
- Native Circle USDC on Base Mainnet
- Maximum payment: `0.03 USDC` per request

## Prompt for ChatGPT / Codex

```text
Use the connected Trading Zones MCP server at https://api.tradingzones.app/mcp.

Call discover_4h_setups first. Then purchase TZ SELECT / 4H with get_tz_select_4h_setup. Authorize at most 0.03 USDC in native Circle USDC on Base Mainnet (eip155:8453). Verify the amount, network, asset and recipient from the x402 challenge before authorization.

If PaymentRequired is returned, use the connected wallet/payment capability and retry the same MCP tool call with the required x402 payment metadata. If the service reports 503 or REFRESHING, follow Retry-After and do not authorize payment.

Accept only a successful response containing schema_version, package_id and valid_until. Do not repurchase the package before valid_until.

Summarize the returned symbol, LONG/SHORT/NEUTRAL decision, confidence, entry reference and policy, stop loss, take profit, liquidity guards, R:R, all nine indicator states and validity. Include the evidence URL and preserve its stated scope: Selector performance evidence does not describe every non-selected standard package.

Do not place an exchange order. Label the result as market-analysis data, not investment advice.

If MCP or a wallet is not connected, stop and tell me what capability must be connected. Never simulate a successful payment, invent a transaction or fabricate a Trading Zones setup.
```

For a specific market, replace the paid tool with `get_btc_4h_setup`, `get_eth_4h_setup`, `get_xrp_4h_setup` or `get_ondo_4h_setup`.

[All AI agent prompts](README.md) · [Buyer SDK](../README.md) · [Disclaimer](../DISCLAIMER.md)
