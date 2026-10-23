export const TRADING_ZONES_API = "https://api.tradingzones.app";
export const TRADING_ZONES_MCP = `${TRADING_ZONES_API}/mcp`;

export const BASE_MAINNET = "eip155:8453";
export const BASE_USDC = "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913";
export const TRADING_ZONES_PAYEE = "0x449352D4B7A7928dBE64eec73B2427B7b3C98e81";
export const PRICE_ATOMIC = 30_000n;
export const DEFAULT_DAILY_CAP_ATOMIC = 300_000n;

export const PRODUCTS = ["BTC", "ETH", "XRP", "ONDO", "TZ-SELECT"] as const;

export const MCP_TOOLS = {
  BTC: "get_btc_4h_setup",
  ETH: "get_eth_4h_setup",
  XRP: "get_xrp_4h_setup",
  ONDO: "get_ondo_4h_setup",
  "TZ-SELECT": "get_tz_select_4h_setup",
} as const;
