import "dotenv/config";
import {
  assertProduct,
  createCdpPaidFetch,
  DEFAULT_DAILY_CAP_ATOMIC,
  TradingZonesClient,
} from "../src/index.js";

const product = (process.argv[2] ?? process.env.TZ_PRODUCT ?? "TZ-SELECT").toUpperCase();
assertProduct(product);

const dailyCapAtomic = BigInt(process.env.TZ_DAILY_CAP_ATOMIC ?? DEFAULT_DAILY_CAP_ATOMIC);
const { paymentClient, paidFetch } = createCdpPaidFetch({ dailyCapAtomic });
const { evmAddress } = await paymentClient.getAddresses();
console.error(`Payer wallet: ${evmAddress}`);

const client = new TradingZonesClient({ fetch: paidFetch });
const setup = await client.getSetup(product);
console.log(JSON.stringify(setup, null, 2));
