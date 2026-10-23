# Copy-paste prompts for AI agents

These prompts help tool-enabled or wallet-enabled agents discover Trading Zones, purchase one current 4H package for no more than **0.03 USDC on Base**, and explain the result.

The agent must have access to either:

- the Trading Zones MCP server: `https://api.tradingzones.app/mcp`, or
- an HTTP x402 payment tool or the buyer SDK in this repository.

A normal chat session without an attached wallet or payment-capable tool cannot complete the purchase. It should say so clearly instead of pretending that payment succeeded.

Never paste private keys, seed phrases, wallet secrets, exchange secrets or CDP credentials into a prompt.

## Universal wallet-enabled agent

```text
Use Trading Zones to obtain one current 4H market-analysis package.

Product: TZ SELECT / 4H.
Trading Zones MCP: https://api.tradingzones.app/mcp
HTTP fallback: https://api.tradingzones.app/v1/signals/TZ-SELECT/4h

Rules:
1. Discover the available Trading Zones tools before purchasing.
2. Pay no more than 0.03 USDC, using native Circle USDC on Base Mainnet only.
3. Verify the network, asset, amount and recipient from the x402 challenge before authorization.
4. If the service returns HTTP 503 or REFRESHING, wait for Retry-After and do not authorize payment.
5. After payment, accept only a successful response containing schema_version, package_id and valid_until.
6. Reuse the package until valid_until; do not buy it again while it remains valid.
7. Return: symbol, decision, confidence, entry policy/reference, stop loss, take profit, liquidity guards, R:R, indicator states and valid_until.
8. Keep Selector performance evidence separate from the performance of non-selected standard packages.
9. Do not place an exchange order. Explain that the package is market-analysis data, not investment advice.

If no wallet-enabled MCP or HTTP x402 tool is available, do not claim that a purchase occurred. Tell me exactly which capability is missing.
```

Replace `TZ-SELECT` with `BTC`, `ETH`, `XRP` or `ONDO` in the HTTP URL when you want one specific standard setup.

## ChatGPT / Codex

Dedicated page: [ChatGPT x402 crypto agent prompt](prompts/chatgpt-x402-crypto-agent-prompt.md)

```text
Use the connected Trading Zones MCP server at https://api.tradingzones.app/mcp.

Call discover_4h_setups first, then purchase TZ SELECT / 4H with get_tz_select_4h_setup. Authorize at most 0.03 USDC in native USDC on Base Mainnet. If PaymentRequired is returned, use the connected wallet/payment capability and retry the same MCP tool call with the required x402 payment metadata.

Do not repurchase a package before valid_until. Summarize the returned symbol, LONG/SHORT/NEUTRAL decision, confidence, entry reference, SL, TP, liquidity guards, R:R and all indicator states. Include the evidence URL and its stated scope. Do not place a trade and do not describe the result as investment advice.

If MCP or a wallet is not connected, stop and tell me what must be connected. Never simulate a successful payment or invent a setup.
```

## Claude

Dedicated page: [Claude MCP x402 crypto agent prompt](prompts/claude-mcp-x402-crypto-agent-prompt.md)

```text
Connect to the Trading Zones Streamable HTTP MCP server:
https://api.tradingzones.app/mcp

First inspect the available tools. Then call get_tz_select_4h_setup and complete its native x402 flow, with a strict maximum of 0.03 USDC on Base Mainnet. Reject any different network, asset, recipient or higher amount. If the setup is refreshing, retry only after the server's Retry-After value and do not pay during refresh.

Validate schema_version, package_id and valid_until. Reuse the package until it expires. Present the complete analysis in a compact table and preserve the distinction between Selector evidence and the four independently purchasable BTC, ETH, XRP and ONDO packages. Do not execute a trade.

If payment tools are unavailable, state that limitation explicitly and provide the MCP connection URL. Do not fabricate tool results.
```

## Gemini

Dedicated page: [Gemini x402 crypto analysis prompt](prompts/gemini-x402-crypto-analysis-prompt.md)

```text
Act as a tool-using market-analysis agent. Use Trading Zones through MCP at https://api.tradingzones.app/mcp or, if MCP is unavailable, call https://api.tradingzones.app/v1/signals/TZ-SELECT/4h through an x402-capable HTTP tool.

Maximum authorized payment: 0.03 USDC. Network: Base Mainnet (eip155:8453). Asset: native Circle USDC. Follow the returned x402 challenge exactly, retry the same request after authorization and accept only HTTP 200 or a successful paid MCP result.

Cache the package until valid_until. Report the chosen symbol, decision, confidence, entry reference, SL, TP, liquidity guards, R:R, nine indicator states, validity and evidence links. Do not open a position. Clearly label the output as market-analysis data, not investment advice.

If this session has no wallet or x402 tool, do not pretend to pay. Explain the missing capability.
```

## DeepSeek

Dedicated page: [DeepSeek x402 trading agent prompt](prompts/deepseek-x402-trading-agent-prompt.md)

```text
Retrieve the current Trading Zones TZ SELECT / 4H package using a connected MCP or HTTP x402 tool.

MCP URL: https://api.tradingzones.app/mcp
HTTP URL: https://api.tradingzones.app/v1/signals/TZ-SELECT/4h
Maximum payment: 0.03 USDC
Required network: Base Mainnet, eip155:8453
Required asset: native Circle USDC

Discover tools first. Do not pay when the service reports 503/REFRESHING. Verify the x402 challenge, authorize no more than the maximum, retry the identical request and validate schema_version, package_id and valid_until. Never buy the same still-valid package twice.

Return a structured summary of decision, confidence, entry, SL, TP, liquidity guards, R:R, indicators and evidence scope. Do not place an order and do not present the package as investment advice. If wallet/payment capability is absent, say so and stop without inventing a result.
```

## Specific-market template

Use this when the user wants BTC, ETH, XRP or ONDO rather than TZ SELECT:

```text
Buy the current Trading Zones [BTC|ETH|XRP|ONDO] / 4H package.

Use the matching get_[symbol]_4h_setup tool at https://api.tradingzones.app/mcp, or the HTTP endpoint https://api.tradingzones.app/v1/signals/[SYMBOL]/4h. Pay no more than 0.03 USDC in native USDC on Base Mainnet. Validate the response and reuse it until valid_until.

Return the complete setup and evidence scope. Do not execute a trade. This is market-analysis data, not investment advice. If no payment-capable tool is connected, state that clearly and do not fabricate a purchase.
```

## Important boundary

These prompts request and summarize a paid analysis package. They do not convert an AI chat into an exchange execution system. Any separate trading integration requires its own credentials, authorization, position limits and risk controls. Read [DISCLAIMER.md](DISCLAIMER.md).
