import type { PRODUCTS } from "./constants.js";

export type Product = (typeof PRODUCTS)[number];

export interface SetupLevels {
  entry_reference: number;
  stop_loss: number;
  take_profit: number;
  stop_loss_liquidity_guard: number;
  take_profit_liquidity_guard: number;
  stop_loss_liquidity_pct: number;
  take_profit_liquidity_pct: number;
  rr_filter: number;
  rr_execution: number;
}

export interface IndicatorValue {
  state: "up" | "down" | "neutral" | string;
  value: unknown;
  details: Record<string, unknown>;
}

export interface PerformanceEvidence {
  url: string;
  history_url: string;
  methodology: string;
  performance_scope: string;
  current_win_rate_pct: number;
  sample_size: number;
  wins: number;
  losses: number;
  updated_at: string;
  [key: string]: unknown;
}

export interface DecisionPackage {
  schema_version: string;
  package_id: string;
  symbol: "BTC" | "ETH" | "XRP" | "ONDO";
  interval: "4h";
  decision: "LONG" | "SHORT" | "WAIT" | string;
  direction: string;
  signal_id: string;
  revision: number;
  confidence_score: number;
  confidence_band: string;
  trade_probability_pct: number;
  candle_closed_at: string;
  generated_at: string;
  valid_until: string;
  levels: SetupLevels;
  indicators: Record<string, IndicatorValue>;
  entry: {
    policy: string;
    venue: string;
    symbol: string;
    public_endpoint: string;
    b2b_reference_price: number;
    note: string;
  };
  performance_evidence: PerformanceEvidence;
  tz_select: Record<string, unknown> | null;
  [key: string]: unknown;
}
