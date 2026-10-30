import type { PRODUCTS } from "./constants.js";

export type Product = (typeof PRODUCTS)[number];

export interface SetupLevels {
  entry_reference: number;
  stop_loss: number | null;
  take_profit: number | null;
  stop_loss_liquidity_guard: number | null;
  take_profit_liquidity_guard: number | null;
  stop_loss_liquidity_pct: number | null;
  take_profit_liquidity_pct: number | null;
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
  current_win_rate_pct: number | null;
  sample_size: number | null;
  wins: number | null;
  losses: number | null;
  updated_at: string | null;
  [key: string]: unknown;
}

interface DecisionPackageBase {
  schema_version: "1.2";
  package_id: string;
  symbol: Product;
  interval: "4h";
  direction: "LONG" | "SHORT" | "NEUTRAL";
  reason_code: string;
  reason: string;
  risk_reward_status: "ELIGIBLE" | "REJECTED" | "NOT_APPLICABLE";
  signal_id: string | null;
  revision: number | string | null;
  confidence_score: number | null;
  confidence_band: string | null;
  trade_probability_pct: number | null;
  candle_closed_at: string;
  generated_at: string;
  valid_until: string;
  source_analysis_candle_time: string;
  performance_evidence: PerformanceEvidence | null;
  tz_select: Record<string, unknown> | null;
  [key: string]: unknown;
}

export interface EntryReference {
  policy: string;
  venue: string;
  symbol: string;
  public_endpoint: string;
  b2b_reference_price: number;
  note: string;
}

export interface TradeDecisionPackage extends DecisionPackageBase {
  action: "TRADE";
  tradable: true;
  decision: "LONG" | "SHORT";
  symbol: Exclude<Product, "TZ-SELECT">;
  levels: SetupLevels & { stop_loss: number; take_profit: number };
  indicators: Record<string, IndicatorValue>;
  entry: EntryReference;
}

export interface NoTradeDecisionPackage extends DecisionPackageBase {
  action: "NO_TRADE";
  tradable: false;
  decision: "NEUTRAL";
  levels: SetupLevels | null;
  indicators: Record<string, IndicatorValue> | null;
  entry: EntryReference | null;
}

export type DecisionPackage = TradeDecisionPackage | NoTradeDecisionPackage;

