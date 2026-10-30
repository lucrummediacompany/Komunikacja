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
  const candidate = value as Record<string, unknown>;
  for (const key of ["package_id", "symbol", "decision", "valid_until"] as const) {
    if (typeof candidate[key] !== "string" || candidate[key] === "") {
      throw new TypeError(`Trading Zones response is missing ${key}.`);
    }
  }
  if (candidate.schema_version !== "1.2") {
    throw new TypeError("Unsupported Trading Zones response schema; expected 1.2.");
  }
  assertProduct(candidate.symbol as string);
  const expiresAt = Date.parse(candidate.valid_until as string);
  if (!Number.isFinite(expiresAt) || expiresAt <= Date.now()) {
    throw new TypeError("Trading Zones response is expired or has invalid valid_until.");
  }
  for (const key of ["levels", "indicators", "entry"] as const) {
    if (candidate[key] === undefined || (candidate[key] !== null &&
        (typeof candidate[key] !== "object" || Array.isArray(candidate[key])))) {
      throw new TypeError(`Trading Zones response has invalid ${key}.`);
    }
  }
  if (candidate.action === "NO_TRADE" && candidate.tradable === false && candidate.decision === "NEUTRAL") {
    return;
  }
  const levels = candidate.levels as Record<string, unknown> | null;
  if (candidate.action !== "TRADE" || candidate.tradable !== true ||
      !["LONG", "SHORT"].includes(candidate.decision as string) || candidate.symbol === "TZ-SELECT" ||
      !levels || !candidate.indicators || !candidate.entry ||
      typeof levels.stop_loss !== "number" || !Number.isFinite(levels.stop_loss) ||
      typeof levels.take_profit !== "number" || !Number.isFinite(levels.take_profit)) {
    throw new TypeError("Trading Zones response has an inconsistent execution decision.");
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

