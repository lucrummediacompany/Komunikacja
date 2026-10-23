import assert from "node:assert/strict";
import test from "node:test";
import { TradingZonesClient, TradingZonesError } from "../src/client.js";

const fixture = {
  package_id: "pkg-1",
  symbol: "BTC",
  decision: "LONG",
  valid_until: "2026-10-23T15:59:00Z",
  levels: {},
  indicators: {},
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
