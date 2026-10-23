import { PRODUCTS, TRADING_ZONES_API } from "./constants.js";
import type { DecisionPackage, Product } from "./types.js";

export interface TradingZonesClientOptions {
  baseUrl?: string;
  fetch?: typeof globalThis.fetch;
}

export class TradingZonesError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly body?: unknown,
  ) {
    super(message);
    this.name = "TradingZonesError";
  }
}

export class TradingZonesClient {
  private readonly baseUrl: string;
  private readonly fetchImpl: typeof globalThis.fetch;

  constructor(options: TradingZonesClientOptions = {}) {
    this.baseUrl = (options.baseUrl ?? TRADING_ZONES_API).replace(/\/$/, "");
    this.fetchImpl = options.fetch ?? globalThis.fetch;
  }

  endpoint(product: Product): string {
    assertProduct(product);
    return `${this.baseUrl}/v1/signals/${product}/4h`;
  }

  async getSetup(product: Product): Promise<DecisionPackage> {
    const response = await this.fetchImpl(this.endpoint(product), {
      method: "GET",
      headers: { accept: "application/json" },
    });

    const body = await parseBody(response);
    if (!response.ok) {
      const hint = response.status === 402
        ? "Use an x402-enabled fetch implementation."
        : "Trading Zones request failed.";
      throw new TradingZonesError(`${hint} HTTP ${response.status}.`, response.status, body);
    }

    assertDecisionPackage(body);
    return body;
  }
}

export function assertProduct(value: string): asserts value is Product {
  if (!(PRODUCTS as readonly string[]).includes(value)) {
    throw new TypeError(`Unknown product: ${value}. Choose ${PRODUCTS.join(", ")}.`);
  }
}

function assertDecisionPackage(value: unknown): asserts value is DecisionPackage {
  if (!value || typeof value !== "object") {
    throw new TypeError("Trading Zones returned a non-object response.");
  }
  const candidate = value as Partial<DecisionPackage>;
  for (const key of ["package_id", "symbol", "decision", "valid_until", "levels", "indicators"] as const) {
    if (candidate[key] === undefined || candidate[key] === null) {
      throw new TypeError(`Trading Zones response is missing ${key}.`);
    }
  }
}

async function parseBody(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}
