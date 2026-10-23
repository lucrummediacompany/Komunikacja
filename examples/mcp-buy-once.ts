import "dotenv/config";
import { CdpX402Client } from "@coinbase/cdp-sdk/x402";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { wrapMCPClientWithPayment } from "@x402/mcp";
import {
  assertProduct,
  BASE_MAINNET,
  BASE_USDC,
  DEFAULT_DAILY_CAP_ATOMIC,
  MCP_TOOLS,
  PRICE_ATOMIC,
  TRADING_ZONES_MCP,
  TRADING_ZONES_PAYEE,
} from "../src/index.js";

const product = (process.argv[2] ?? process.env.TZ_PRODUCT ?? "TZ-SELECT").toUpperCase();
assertProduct(product);
const dailyCapAtomic = BigInt(process.env.TZ_DAILY_CAP_ATOMIC ?? DEFAULT_DAILY_CAP_ATOMIC);

const payment = new CdpX402Client({
  environment: "production",
  builderCode: "trading_zones_sdk",
  spendControls: {
    maxAmountPerPayment: { atomic: PRICE_ATOMIC, asset: BASE_USDC },
    maxCumulativeSpend: { atomic: dailyCapAtomic, asset: BASE_USDC },
    maxCumulativeSpendWindow: "24h",
    allowedNetworks: [BASE_MAINNET],
    allowedAssets: [BASE_USDC],
    allowedPayees: [TRADING_ZONES_PAYEE],
  },
});

const { evmAddress } = await payment.getAddresses();
console.error(`Payer wallet: ${evmAddress}`);

const mcp = wrapMCPClientWithPayment(
  new Client({ name: "trading-zones-buyer", version: "0.1.0" }, { capabilities: {} }),
  payment as unknown as Parameters<typeof wrapMCPClientWithPayment>[1],
  {
    autoPayment: true,
    onPaymentRequested: async ({ toolName, paymentRequired }) => {
      const offer = paymentRequired.accepts[0];
      console.error(`Approving ${offer?.amount ?? "unknown"} atomic units for ${toolName}`);
      return true;
    },
  },
);

try {
  await mcp.connect(new StreamableHTTPClientTransport(new URL(TRADING_ZONES_MCP)));
  const result = await mcp.callTool(MCP_TOOLS[product], {});
  console.log(JSON.stringify(result, null, 2));
} finally {
  await mcp.close();
}
