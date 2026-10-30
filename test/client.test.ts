import assert from "node:assert/strict";
import test from "node:test";
import { TradingZonesClient, TradingZonesError } from "../src/client.js";

const fixture = {
  schema_version: "1.2",
  package_id: "pkg-1",
  symbol: "BTC",
  decision: "LONG",
  valid_until: new Date(Date.now() + 600_000).toISOString(),
  action: "TRADE",
  tradable: true,
  levels: { stop_loss: 90, take_profit: 110 },
  indicators: {},
  entry: {},
};

test("builds the canonical product URL and returns JSON", async () => {
  let requested = "";
  const client = new TradingZonesClient({
    fetch: async (input) => {
      requested = String(input);
      return new Response(JSON.stringify(fixture), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    },
  });

  const result = await client.getSetup("BTC");
  assert.equal(requested, "https://api.tradingzones.app/v1/signals/BTC/4h");
  assert.equal(result.package_id, "pkg-1");
});

test("accepts a paid completed selector NO_TRADE with null execution fields", async () => {
  const client = new TradingZonesClient({fetch: async () => new Response(JSON.stringify({
    ...fixture, symbol: "TZ-SELECT", decision: "NEUTRAL", direction: "NEUTRAL",
    action: "NO_TRADE", tradable: false, levels: null, indicators: null, entry: null,
  }), {status: 200})});
  const result = await client.getSetup("TZ-SELECT");
  assert.equal(result.action, "NO_TRADE");
  assert.equal(result.levels, null);
});

test("rejects expired and inconsistent responses after HTTP 200", async () => {
  for (const invalid of [
    {...fixture, valid_until: "2000-01-01T00:00:00Z"},
    {...fixture, valid_until: "invalid"},
    {...fixture, action: "NO_TRADE", tradable: true},
    {...fixture, levels: null},
    {...fixture, levels: {stop_loss: null, take_profit: 110}},
    {...fixture, schema_version: "1.1"},
  ]) {
    const client = new TradingZonesClient({fetch: async () => new Response(JSON.stringify(invalid), {status: 200})});
    await assert.rejects(() => client.getSetup("BTC"), TypeError);
  }
});

test("explains that a plain fetch cannot satisfy HTTP 402", async () => {
  const client = new TradingZonesClient({
    fetch: async () => new Response(JSON.stringify({ error: "payment_required" }), { status: 402 }),
  });

  await assert.rejects(
    () => client.getSetup("ETH"),
    (error: unknown) => error instanceof TradingZonesError
      && error.status === 402
      && error.message.includes("x402-enabled"),
  );
});

