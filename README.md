# Trading Zones x402 SDK

Open TypeScript SDK and ready-to-run buyer bots for paid Trading Zones 4H decision packages.

Buy exactly one current package for **0.03 USDC on Base** through HTTP x402 or native x402 over MCP. No Trading Zones account or buyer API key is required.

## Products

| Product | HTTP path | MCP tool |
|---|---|---|
| BTC 4H | `/v1/signals/BTC/4h` | `get_btc_4h_setup` |
| ETH 4H | `/v1/signals/ETH/4h` | `get_eth_4h_setup` |
| XRP 4H | `/v1/signals/XRP/4h` | `get_xrp_4h_setup` |
| ONDO 4H | `/v1/signals/ONDO/4h` | `get_ondo_4h_setup` |
| TZ SELECT / 4H | `/v1/signals/TZ-SELECT/4h` | `get_tz_select_4h_setup` |

Each paid response contains the direction, entry reference, stop loss, take profit, liquidity guards, indicators, validity window and independently fetchable performance evidence. TZ SELECT chooses at most one setup from the four standard markets per 4H cycle; the four standard packages remain separately purchasable.

## Safety defaults

- maximum per payment: 30,000 atomic USDC = 0.03 USDC;
- network allowlist: Base Mainnet only (`eip155:8453`);
- asset: native Circle USDC on Base;
- payee allowlist: the published Trading Zones receiving address only;
- default rolling 24-hour cap: 300,000 atomic USDC = 0.30 USDC;
- `.env` and generated data never enter git;
- the 4H bot caches `valid_until` and will not repurchase a still-valid package.

Coinbase CDP currently ships `CdpX402Client` without default spend controls. This repository enables explicit limits for autonomous use.

## Quick start

Requirements: Node.js 20.19 or newer, a Coinbase Developer Platform account, and native USDC on Base.

```bash
git clone https://github.com/lucrummediacompany/Komunikacja.git
cd Komunikacja
npm install
cp .env.example .env
```

Set these values in `.env`:

```dotenv
CDP_API_KEY_ID=...
CDP_API_KEY_SECRET=...
CDP_WALLET_SECRET=...
```

The examples print the CDP-managed EVM wallet address. Fund that address with native USDC on Base before the first paid call.

### Buy once over HTTP x402

```bash
npm run buy:http -- BTC
npm run buy:http -- ETH
npm run buy:http -- XRP
npm run buy:http -- ONDO
npm run buy:http -- TZ-SELECT
```

### Buy once over native MCP x402

```bash
npm run buy:mcp -- TZ-SELECT
```

MCP server URL: `https://api.tradingzones.app/mcp`

### Run as a 4H buyer

Run this from cron or your agent scheduler:

```bash
npm run bot:4h -- BTC
```

It writes the latest package and a tiny validity cache under `./data`. A second invocation exits without payment while that package remains valid.

Example cron entry (five minutes after each UTC 4H boundary):

```cron
5 */4 * * * cd /opt/trading-zones-x402-sdk && /usr/bin/npm run bot:4h -- TZ-SELECT >> /var/log/tz-select.log 2>&1
```

## Use as a library

```ts
import { createCdpPaidFetch, TradingZonesClient } from "trading-zones-x402-sdk";

const { paidFetch } = createCdpPaidFetch({ dailyCapAtomic: 300_000n });
const tradingZones = new TradingZonesClient({ fetch: paidFetch });
const setup = await tradingZones.getSetup("BTC");

console.log(setup.decision, setup.levels.entry_reference, setup.levels.stop_loss, setup.levels.take_profit);
```

## Connect it to an agent

Give the agent either:

1. the HTTP client as a tool named `get_trading_zones_setup(product)`, or
2. the public MCP server and an x402-capable MCP client.

Suggested tool policy:

```text
Use Trading Zones only when a fresh 4H BTC, ETH, XRP, ONDO or TZ SELECT setup is required.
Never pay more than 0.03 USDC per call. Reuse a response until valid_until.
Treat entry_reference as a reference and read the live venue price immediately before execution.
Do not imply that Selector performance evidence applies to every standard symbol package.
```

## What remains private

This repository contains only buyer-side integration code. It does **not** contain the Trading Zones analysis engine, selection mechanics, server credentials, Coinbase credentials, wallet secrets, payment headers, exchange keys or Master Bot automation. Making this repository public does not grant access to any other LUCRUM MEDIA COMPANY repository.

## Scope and risk

The SDK retrieves analysis packages; it does not place exchange orders. Consumers are responsible for wallet funding, trading execution, leverage, risk controls and regulatory obligations. Historical or simulated performance is not a guarantee of future results.

Polska instrukcja: [docs/README.pl.md](docs/README.pl.md)

## Links

- API: https://api.tradingzones.app
- MCP: https://api.tradingzones.app/mcp
- Agent catalog: https://api.tradingzones.app/catalog.json
- Performance: https://api.tradingzones.app/v1/performance/summary
- Website: https://tradingzones.app

## License

MIT. The SDK code is open; access to Trading Zones decision packages remains metered by the public x402 endpoints.
